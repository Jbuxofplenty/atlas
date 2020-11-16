import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';

// core components
import MuiTable from "components/MuiTable/MuiTable.js";
import { numberWithCommas, capitalizeAll } from 'helpers';

import { eThreeActions, alertActions } from "actions";


function PlaidInvestments(props) {
  const noItemsMessage = `No investments to display!`;
  const [holdings, setHoldings] = useState(null);
  useEffect(() => {
    var newHoldings = [];
    props.account.holdings.forEach(holding => {
      var newHolding = JSON.parse(JSON.stringify(holding));
      var security = null;
      props.account.securities.forEach(tempSecurity => {
        if(tempSecurity.security_id === holding.security_id) security = tempSecurity;
      })
      if(security) newHolding.security = security.name;
      else newHolding.security = 'N/A';
      if(security && security.close_price) newHolding.close_price = security.close_price;
      else newHolding.close_price = 'N/A';
      var account = null;
      props.account.balances.forEach(tempAccount => {
        if(tempAccount.account_id === holding.account_id) account = tempAccount;
      })
      if(account) newHolding.account = account.name;
      else newHolding.account = 'N/A';
      newHoldings.push(newHolding);
    })
    setHoldings(newHoldings);
    // eslint-disable-next-line
  }, []);

  const columns = React.useMemo(
    () => [
        {
          Header: '#',
        Cell: row => {return <div>{row.row.index+1}</div>},
        },
        {
          Header: 'Name',
          accessor: 'security',
        },
        {
          Header: 'Shares',
          accessor: 'quantity',
        Cell: (row) => {return (<div>{numberWithCommas(row.cell.value)}</div>)},
        },
        {
          Header: 'Total Value',
          accessor: 'institution_value',
        Cell: (row) => {return (<div>{row.cell.value ? `$${numberWithCommas(row.cell.value)}` : 'N/A'}</div>)},
        },
        {
          Header: 'Account',
          accessor: 'account',
          Cell: (row) => {return (<div>{capitalizeAll(row.cell.value)}</div>)},
        },
        {
          Header: 'Close Price',
          accessor: 'close_price',
          Cell: (row) => {return (<div>{row.cell.value ? `$${numberWithCommas(row.cell.value)}` : 'N/A'}</div>)},
        },
      ],
    []
  )

  return (
    <>
      {props.account &&
        <MuiTable columns={columns} rows={holdings} noItemsMessage={noItemsMessage} />
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

export default connect(mapStateToProps, mapDispatchToProps)(PlaidInvestments);