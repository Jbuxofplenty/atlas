import React, { useState, useEffect }  from 'react'
import { connect } from 'react-redux';

// core components
import SyncAccount from "components/SyncAccount/SyncAccount.js";
import MuiTable from "components/MuiTable/MuiTable.js";

import { eThreeActions, alertActions } from "actions";


function OrdersTable(props) {
  const [orders, setOrders] = useState([]);

  const noItemsMessage = props.account ? `No orders are attached to your ${props.account.displayName} account!`
      : `No orders to display!`;

  useEffect(() => {
    props.visible(false);
    var tempOrders = [];
    if(props.account) {
      if(props.account.orders && props.account.orders.buys && props.account.orders.sells)
        tempOrders = props.account.orders.buys.concat(props.account.orders.sells);
    }
    else if(props.accounts) {
      tempOrders = [];
      props.accounts.forEach(account => {
        if(account.orders && account.orders.buys && account.orders.sells)
          tempOrders = tempOrders.concat(account.orders.buys).concat(account.orders.sells);
      })
    }
    tempOrders.sort(function(a,b){
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(b.created_at) - new Date(a.created_at);
    });
    setOrders(tempOrders);
    // eslint-disable-next-line
  }, [props.account]);

  const columns = React.useMemo(
    () => [
        {
          Header: 'Date',
          accessor: 'created_at',
          Cell: ({ cell: { value } }) => (<div>{new Date(value).toLocaleString('en-US')}</div>),
        },
        {
          Header: 'Security',
          accessor: 'amount.currency',
        },
        {
          Header: 'Transaction Type',
          accessor: 'resource',
          Cell: ({ cell: { value } }) => (<>{
            value === "buy" ? 
            (<div><i className={`successMessage icon-pane mr-1 fa fa-angle-double-up`}/>Buy</div>) 
            : value === "sell" ? 
            (<div><i className={`errorMessage icon-pane mr-1 fa fa-angle-double-down`}/>Sell</div>)
            : value === "fee" ? 
            (<div><i className={`errorMessage icon-pane mr-1 fa fa-angle-double-down`}/>Fee</div>) :
            (<div><i className={`successMessage icon-pane mr-1 fa fa-angle-double-up`}/>Dividend</div>)}
          </>),
        },
        {
          Header: 'Total (USD)',
          accessor: 'total.amount',
          Cell: ({ cell: { value } }) => (<div>${value}</div>),
        },
        {
          Header: 'Security Price',
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
        {
          Header: 'Account',
          accessor: 'account',
          Cell: ({ cell: { value } }) => (<div>{value}</div>),
        },
      ],
    []
  )

  return (
    <>
      {(props.account || props.accounts) &&
        <>
          <MuiTable columns={columns} rows={orders} noItemsMessage={noItemsMessage} />
          {props.account &&
            <SyncAccount account={props.account} orders />
          }
        </>
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

export default connect(mapStateToProps, mapDispatchToProps)(OrdersTable);