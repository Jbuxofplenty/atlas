import React, { useEffect }  from 'react'
import { useTable, useSortBy } from 'react-table'
import matchSorter from 'match-sorter'
import { connect } from 'react-redux';

// material-ui
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

import s from './MuiTable.module.scss';
import { eThreeActions, alertActions } from "actions";

const theme = createMuiTheme({
  overrides: {
    // Style sheet name ⚛️
    MuiTableCell: {
      // Name of the rule
      body: {
        border: 0,
        color: '#888787',
      },
      head: {
        border: 0,
        color: '#888787',
      },
    },
    MuiSelect: {
      root: {
        color: '#888787',
        '&:hover': {
          color: '#ffffff',
       },
      },
      select: {
        color: '#888787',
        '&:hover': {
          color: '#ffffff',
       },
      },
    },
    MuiTablePagination: {
      caption: {
        color: '#888787',
        '&:hover': {
          color: '#ffffff',
       },
      },
    },
    MuiIconButton: {
      label: {
        color: '#888787',
        '&:hover': {
          color: '#ffffff',
       },
      },
    },
    MuiList: {
      root: {
        backgroundColor: '#17193B'
      },
    },
    MuiButtonBase: {
      root: {
        color: '#888787',
        '&:hover': {
          color: '#ffffff',
       },
      },
    },
  },
});

// Define a default UI for filtering
function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length

  return (
    <input
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  )
}

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = val => !val

// Our table component
function ReactTable({ columns, data }) {
  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter(row => {
          const rowValue = row.values[id]
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true
        })
      },
    }),
    []
  )

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
      defaultColumn, // Be sure to pass the defaultColumn option
      filterTypes,
    },
    useSortBy,
  )

  // We don't want to render all of the rows for this example, so cap
  // it for this use case
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const firstPageRows = rows.slice(page*rowsPerPage, (page+1)*rowsPerPage)

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer>
      <Table {...getTableProps()} className="w-100">
        <TableHead>
          {headerGroups.map(headerGroup => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <TableCell {...column.getHeaderProps()} {...column.getHeaderProps(column.getSortByToggleProps())} className={`${s.header} ${column.isSorted && s.isSorted}`}>
                  {column.render('Header')}
                    {column.isSorted
                      ? column.isSortedDesc
                        ? <i className={`icon-pane ml-1 fa fa-sort-down`}/>
                        : <i className={`icon-pane ml-1 fa fa-sort-up`}/>
                      : <i className={`icon-pane ml-1 fa fa-sort`}/>}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {firstPageRows.map((row, i) => {
            prepareRow(row)
            return (
              <TableRow {...row.getRowProps()} className={s.lineItem}>
                {row.cells.map(cell => {
                  return <TableCell {...cell.getCellProps()} className={s.cell}>{cell.render('Cell')}</TableCell>
                })}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
    </TableContainer>
  )
}

// Define a custom filter filter function!
function filterGreaterThan(rows, id, filterValue) {
  return rows.filter(row => {
    const rowValue = row.values[id]
    return rowValue >= filterValue
  })
}

// This is an autoRemove method on the filter function that
// when given the new filter value and returns true, the filter
// will be automatically removed. Normally this is just an undefined
// check, but here, we want to remove the filter if it's not a number
filterGreaterThan.autoRemove = val => typeof val !== 'number'

function MuiTable(props) {
  useEffect(() => {
    props.visible(false);
    // eslint-disable-next-line
  }, []);

  return (
    <ThemeProvider theme={theme}>
      {props.rows && props.rows.length !== 0 ? 
        <div className={s.tableContainer}>
          <ReactTable columns={props.columns} data={props.rows} />
        </div>
        : <div className={s.noAccounts}>{props.noItemsMessage}</div>
      }
    </ThemeProvider>
  )
}

function mapStateToProps(store) {
  return {
    alertType: store.alert.type,
    alertMessage: store.alert.message,
    alertVisible: store.alert.visible,
    alertComponent: store.alert.component,
  };
}

const mapDispatchToProps = (dispatch, history) => {
  return {
    backupKey: (keyPassword, uid) => dispatch(eThreeActions.backupKey(keyPassword, uid)),
    visible: (show) => dispatch(alertActions.visible(show)),
    setComponent: (component) => dispatch(alertActions.component(component)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MuiTable);