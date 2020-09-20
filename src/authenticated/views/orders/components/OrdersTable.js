import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import { Button, Table } from 'reactstrap';
import classnames from 'classnames';

// core components
import GridContainer from "components/Grid/GridContainer.js";

import OAuthObject from 'oauth2';

import s from '../Orders.module.scss';
import { eThreeActions, alertActions } from "actions";

function OrdersTable(props) {
  const [accountObject, setAccountObject] = useState(null);
  const [isLoad, setIsLoad] = useState(false);
  const [updated, setUpdated] = useState(props.account && new Date(props.account.lastSynced));
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    props.visible(false);
    if(props.account) setAccountObject(OAuthObject[props.account.displayName]);
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

  return (
    <div>
      <div className="table-responsive align-self-center">
        {orders.length === 0 ? <div className={s.noAccounts}>No orders are available!</div> :
          <Table className="table-hover align-self-center">
            <thead>
              <tr>
                <th>#</th>
                <th>Account</th>
                <th>Total Balance</th>
                <th>Synced</th>
              </tr>
            </thead>
            {/* eslint-disable */}
            <tbody>
              <tr className={s.lineItem}>
                <td>1</td>
                <td>Mark</td>
                <td>Otto</td>
                <td><a href="#">ottoto@example.com</a></td>
              </tr>
            </tbody>
            {/* eslint-enable */}
          </Table>
        }
      </div>
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
    </div>
  );
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
