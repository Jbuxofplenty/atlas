import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import Checkbox from '@material-ui/core/Checkbox';
import classnames from 'classnames';

import OAuthObject from 'oauth2';

import s from './SyncAccount.module.scss';
import { alertActions } from "actions";

function SyncAccount(props) {
  const [accountObject, setAccountObject] = useState(null);
  const [isLoad, setIsLoad] = useState(false);
  const [updated, setUpdated] = useState(new Date(props.account.lastSynced));
  const [allOrders, setAllOrders] = React.useState(false);

  useEffect(() => {
    props.clear();
    setAccountObject(OAuthObject[props.account.displayName])
    // eslint-disable-next-line
  }, []);

  const handleChange = (event) => {
    setAllOrders(event.target.checked);
  };

  const retrieveAccountData = async () => {
    props.clear();
    setIsLoad(true);
    var minimal = !allOrders;
    var success = await accountObject.pullAccountData(minimal);
    if(success) {
      setIsLoad(false);
      setUpdated(new Date());
    }
  }

  return (
    <>
      <footer className={[s.cardFooter, 'text-sm', 'card-footer', 'text-right'].join(' ')}>
        <div className="d-flex flex-column">
          {props.orders &&
            <div className="text-right">
              <span className="fs-mini text-right">Pull orders for all wallets</span>
              <Checkbox
                color="primary"
                inputProps={{ 'aria-label': 'secondary checkbox' }}
                onChange={handleChange}
              />
            </div>
          }
          <div className="text-right">
            <Button
              color="link"
              className={classnames({ disabled: isLoad }, s.btnNotificationsReload, 'btn-sm', 'float-right', 'py-0', 'ml-2')}
              onClick={retrieveAccountData}
              id="load-notifications-btn"
            >
              {isLoad ? <span><i className="la la-refresh la-spin" /> Loading...</span> : <i className="la la-refresh" />}
            </Button>
            {isLoad || props.alertType === 'alert-error'
              ? <span className="fs-mini text-right">{props.alertMessage}</span>
              : <span className="fs-mini text-right">Synced at: {updated.toLocaleString("en-US")}</span>
            }
          </div>
        </div>
      </footer>
    </>
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
    visible: (show) => dispatch(alertActions.visible(show)),
    clear: () => dispatch(alertActions.clear()),
    setComponent: (component) => dispatch(alertActions.component(component)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SyncAccount);
