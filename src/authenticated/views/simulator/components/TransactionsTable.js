import React from 'react'
import { connect } from 'react-redux';

// core components
import MuiTable from "components/MuiTable/MuiTable.js";
import { numberWithCommas } from 'helpers';

import s from '../Simulator.module.scss';

import { eThreeActions, alertActions } from "actions";


function TransactionsTable(props) {
  const noItemsMessage = `No transactions to display!`;
  const noPendingItemsMessage = `No pending transactions to display!`;

  const columns = React.useMemo(
    () => [
        {
          Header: 'Date',
          accessor: 'date',
          Cell: ({ cell: { value } }) => (<div>{new Date(value).toLocaleString('en-US')}</div>),
        },
        {
          Header: 'Security',
          accessor: 'ticker.value',
        },
        {
          Header: 'Transaction Type',
          accessor: 'transactionType',
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
          accessor: 'total',
          Cell: ({ cell: { value } }) => (<div>${numberWithCommas(value)}</div>),
        },
        {
          Header: 'Security Price',
          accessor: 'price',
          Cell: ({ cell: { value } }) => (<div>${numberWithCommas(value)}</div>),
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
          accessor: 'commission',
          Cell: ({ cell: { value } }) => (<div>${value}</div>),
        },
      ],
    []
  )

  return (
    <div className="w-100">
      {props.transactions.completed &&
        <MuiTable columns={columns} rows={props.transactions.completed} noItemsMessage={noItemsMessage} />
      }
      {props.transactions.pending && props.transactions.pending.length !== 0 &&
        <>
          <h5 className={`${s.transactionTableHeader}`}>Pending Transactions</h5>
          <div className={`${s.rounded}`}></div>
          <MuiTable columns={columns} rows={props.transactions.pending} noItemsMessage={noPendingItemsMessage} />
        </>
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

export default connect(mapStateToProps, mapDispatchToProps)(TransactionsTable);