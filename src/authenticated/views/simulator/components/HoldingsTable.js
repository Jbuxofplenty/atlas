import React from 'react'
import { connect } from 'react-redux';

// core components
import MuiTable from "components/MuiTable/MuiTable.js";
import { numberWithCommas } from 'helpers';

import { eThreeActions, alertActions } from "actions";


function HoldingsTable(props) {
  const noItemsMessage = `No holdings to display!`;

  const columns = React.useMemo(
    () => [
        {
          Header: 'Symbol',
          accessor: 'symbol',
        },
        {
          Header: 'Shares',
          accessor: 'quantity',
        Cell: (row) => {return (<div>{numberWithCommas(row.cell.value)}</div>)},
        },
        {
          Header: 'Price',
          accessor: 'price',
          Cell: (row) => {return (<div>{row.cell.value ? `$${numberWithCommas(row.cell.value)}` : 'N/A'}</div>)},
        },
        {
          Header: 'Total Value',
          accessor: 'value',
        Cell: (row) => {return (<div>{row.cell.value ? `$${numberWithCommas(row.cell.value)}` : 'N/A'}</div>)},
        },
        {
          Header: 'Daily Change/%',
          accessor: 'dailyChange',
          Cell: (row) => {return (
            <div className={'d-flex flex-row justify-content-start'}>
              <div className={`${row.cell.value.value < 0 && 'errorMessage'} ${row.cell.value.value > 0 && 'successMessage'}`}>
                {row.cell.value ? `$${numberWithCommas(row.cell.value.value)}` : 'N/A'}
              </div>
              <div className="mx-1">/</div>
              <div className={`${row.cell.value.percent < 0 && 'errorMessage'} ${row.cell.value.percent > 0 && 'successMessage'}`}>
                {row.cell.value ? `${numberWithCommas(row.cell.value.percent)}%` : 'N/A'}
              </div>
            </div>
          )},
        },
      ],
    []
  )

  return (
    <div className="w-100 h-100">
      {props.holdings &&
        <MuiTable columns={columns} rows={props.holdings} noItemsMessage={noItemsMessage} />
      }
    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(HoldingsTable);