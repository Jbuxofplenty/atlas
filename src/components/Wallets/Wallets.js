import React, { useEffect }  from 'react'
import { connect } from 'react-redux';

// core components
import MuiTable from "components/MuiTable/MuiTable.js";

import { eThreeActions, alertActions } from "actions";


function Wallets(props) {
  const noItemsMessage = `No wallets are attached to your {props.account.displayName} account!`;

  useEffect(() => {
    props.visible(false);
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
          accessor: 'currency.name',
        },
        {
          Header: 'Current Balance',
          accessor: 'balance.amount',
        Cell: (row) => {return (<div>{row.cell.value} {row.row.original.balance.currency}</div>)},
        },
        {
          Header: 'Last Updated',
          accessor: 'updated_at',
          Cell: ({ cell: { value } }) => (<div>{new Date(value).toLocaleString('en-US')}</div>),
        },
        {
          Header: 'Primary',
          accessor: 'primary',
          Cell: ({ cell: { value } }) => (<>{
            value && (<i className={`successMessage icon-pane fa fa-check`}/>)}
          </>),
        },
      ],
    []
  )

  return (
    <>
      {props.account &&
        <>
          <MuiTable columns={columns} rows={props.account.wallets} noItemsMessage={noItemsMessage} />
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

export default connect(mapStateToProps, mapDispatchToProps)(Wallets);