import React, { useState, useEffect }  from 'react'
import { useTable, useGlobalFilter, useAsyncDebounce, useSortBy } from 'react-table'
import matchSorter from 'match-sorter'
import { connect } from 'react-redux';
import { 
  Button,
  InputGroup, 
  InputGroupAddon, 
  Input,
  InputGroupText,
} from 'reactstrap';

// material-ui
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import classnames from 'classnames';

import OAuthObject from 'oauth2';

import s from '../Orders.module.scss';
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
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length
  const [value, setValue] = useState(globalFilter)
  const [focused, setFocused] = useState(false)
  const onChange = useAsyncDebounce(value => {
    setGlobalFilter(value || undefined)
  }, 200)

  return (
    <InputGroup className={`align-self-center w-100 my-2 ${s.navbarForm} ${focused ? s.navbarFormFocused : ''}`}>
      <InputGroupAddon addonType="prepend" className={s.inputAddon}><InputGroupText><i className="fa fa-search" /></InputGroupText></InputGroupAddon>
      <Input
        placeholder={`${count} orders...`}
        className="input-transparent"
        value={value || ""}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={e => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
      />
    </InputGroup>
  )
}

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
    state,
    visibleColumns,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      defaultColumn, // Be sure to pass the defaultColumn option
      filterTypes,
    },
    useGlobalFilter, // useGlobalFilter!
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
          <TableRow>
            <TableCell
              colSpan={visibleColumns.length}
              style={{
                textAlign: 'center',
              }}
            >
              <GlobalFilter
                preGlobalFilteredRows={preGlobalFilteredRows}
                globalFilter={state.globalFilter}
                setGlobalFilter={setGlobalFilter}
              />
            </TableCell>
          </TableRow>
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
          rowsPerPageOptions={[5, 10, 25]}
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

function OrdersTable(props) {
  const [accountObject, setAccountObject] = useState(null);
  const [isLoad, setIsLoad] = useState(false);
  const [updated, setUpdated] = useState(props.account && new Date(props.account.lastSynced));
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    props.visible(false);
    var tempOrders;
    if(props.account) {
      setAccountObject(OAuthObject[props.account.displayName]);
      tempOrders = props.account.orders.buys.concat(props.account.orders.sells);
    }
    else if(props.accounts) {
      tempOrders = [];
      props.accounts.forEach(account => {
        tempOrders = tempOrders.concat(account.orders.buys).concat(account.orders.sells);
      })
    }
    setOrders(tempOrders);
    // eslint-disable-next-line
  }, []);

  const retrieveAccountData = async () => {
    setIsLoad(true);
    var success = await accountObject.pullAccountData();
    if(success) {
      setIsLoad(false);
      setUpdated(new Date());
    }
  }

  const columns = React.useMemo(
    () => [
        {
          Header: 'Date',
          accessor: 'created_at',
          Cell: ({ cell: { value } }) => (<div>{new Date(value).toLocaleString('en-US')}</div>),
        },
        {
          Header: 'Buy/Sell',
          accessor: 'resource',
          Cell: ({ cell: { value } }) => (<>{
            value === "buy" ? 
            (<div><i className={`successMessage icon-pane mr-1 fa fa-angle-double-up`}/>Buy</div>) : 
            (<div><i className={`errorMessage icon-pane mr-1 fa fa-angle-double-down`}/>Sell</div>)}
          </>),
        },
        {
          Header: 'Total (USD)',
          accessor: 'total.amount',
          Cell: ({ cell: { value } }) => (<div>${value}</div>),
        },
        {
          Header: 'Currency',
          accessor: 'amount.currency',
        },
        {
          Header: 'Currency Price',
          accessor: 'unit_price.amount',
          Cell: ({ cell: { value } }) => (<div>${value}</div>),
        },
        {
          Header: 'Status',
          accessor: 'status',
          Cell: ({ cell: { value } }) => (<>{
            value === "completed" ? 
            (<i className={`successMessage icon-pane fa fa-check`}/>) : 
            (<i className={`errorMessage icon-pane fa fa-times`}/>)}
          </>),
        },
        {
          Header: 'Fee (USD)',
          accessor: 'fee.amount',
          Cell: ({ cell: { value } }) => (<div>${value}</div>),
        },
      ],
    []
  )

  return (
    <ThemeProvider theme={theme}>
      {orders.length === 0 ? <div className={s.noAccounts}>No orders are available!</div> :
        <div className={s.tableContainer}>
          <ReactTable columns={columns} data={orders} />
        </div>
      }
      {props.account &&
        <footer className={[s.cardFooter, 'text-sm', 'card-footer', 'text-right'].join(' ')}>
          <Button
            color="link"
            className={classnames({ disabled: isLoad }, s.btnNotificationsReload, 'btn-sm', 'float-right', 'py-0', 'ml-2')}
            onClick={retrieveAccountData}
            id="load-notifications-btn"
          >
            {isLoad ? <span><i className="la la-refresh la-spin" /> Loading...</span> : <i className="la la-refresh" />}
          </Button>
          <span className="fs-mini text-right">Synced at: {updated.toLocaleString("en-US")}</span>
        </footer>
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

export default connect(mapStateToProps, mapDispatchToProps)(OrdersTable);