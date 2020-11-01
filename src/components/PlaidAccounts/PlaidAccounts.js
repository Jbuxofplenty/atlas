import React from 'react'
import { connect } from 'react-redux';

// core components
import MuiTable from "components/MuiTable/MuiTable.js";
import { numberWithCommas, capitalizeAll } from 'helpers';

import { eThreeActions, alertActions } from "actions";


function PlaidAccounts(props) {
  const noItemsMessage = `No accounts to display!`;

  const columns = React.useMemo(
    () => [
        {
          Header: '#',
        Cell: row => {return <div>{row.row.index+1}</div>},
        },
        {
          Header: 'Name',
          accessor: 'name',
        },
        {
          Header: 'Total Balance',
          accessor: 'balances.current',
        Cell: (row) => {return (<div>${numberWithCommas(row.cell.value)}</div>)},
        },
        {
          Header: 'Available Balance',
          accessor: 'balances.available',
        Cell: (row) => {return (<div>{row.cell.value ? `$${numberWithCommas(row.cell.value)}` : 'N/A'}</div>)},
        },
        {
          Header: 'Type',
          accessor: 'type',
          Cell: (row) => {return (<div>{capitalizeAll(row.cell.value)}</div>)},
        },
        {
          Header: 'Sub-Type',
          accessor: 'subtype',
          Cell: (row) => {return (<div>{capitalizeAll(row.cell.value)}</div>)},
        },
      ],
    []
  )

  return (
    <>
      {props.account &&
        <MuiTable columns={columns} rows={props.account.balances} noItemsMessage={noItemsMessage} />
      }
    </>
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

export default connect(mapStateToProps, mapDispatchToProps)(PlaidAccounts);