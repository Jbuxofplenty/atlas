import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import Checkbox from '@material-ui/core/Checkbox';
import classnames from 'classnames';

import OAuthObject from 'oauth2';

import s from './SyncAccount.module.scss';
import { alertActions } from "actions";

import { asyncForEach } from 'helpers';

function SyncAccount(props) {
  const [accountObject, setAccountObject] = useState(null);
  const [isLoad, setIsLoad] = useState(false);
  const [updated, setUpdated] = useState(null);
  const [allOrders, setAllOrders] = React.useState(false);

  useEffect(() => {
    props.clear();
    if(props.account) {
      if(props.account.plaid) {
        setAccountObject(OAuthObject['Plaid'])
      }
      else {
        setAccountObject(OAuthObject[props.account.displayName])
      }
      setUpdated(new Date(props.account.lastSynced));
    }
    else {
      var latest = new Date();
      props.accounts.forEach(account => {
        var tempDate = new Date(account.lastSynced);
        if(tempDate < latest) {
          latest = tempDate;
        }
      })
      setUpdated(latest);
    }
    // eslint-disable-next-line
  }, []);

  const handleChange = (event) => {
    setAllOrders(event.target.checked);
  };

  const retrieveAccountData = async () => {
    props.clear();
    setIsLoad(true);
    var minimal = !allOrders;
    var success = true;
    if(!accountObject && props.accounts) {
      await asyncForEach(props.accounts, async account => {
        var tempAccountObject = OAuthObject['Plaid'];
        if(!account.plaid) {
          tempAccountObject = OAuthObject[account.displayName];
        }
        var pullConfig = JSON.parse(JSON.stringify(tempAccountObject.pullConfig));
        pullConfig.minimal = minimal;
        pullConfig.name = account.displayName;
        var tempSuccess = await tempAccountObject.pullAccountData(pullConfig);
        if(!tempSuccess) success = false;
      })
    }
    else {
      var pullConfig = JSON.parse(JSON.stringify(accountObject.pullConfig));
      pullConfig.minimal = minimal;
      pullConfig.name = props.account.displayName;
      success = await accountObject.pullAccountData(pullConfig);
    }
    if(success) {
      setIsLoad(false);
      setUpdated(new Date());
    }
    else {
      setIsLoad(false);
    }
  }

  const handleOnMouseDown = async (e) => {
    e.stopPropagation();
  }

  return (
    <>
      {updated &&
        <footer className={[s.cardFooter, 'text-sm', 'text-right'].join(' ')}>
          <div className="d-flex flex-column">
            {props.orders && !props.account.plaid &&
              <div className="text-right">
                <span className="fs-mini text-right">Pull orders for all wallets</span>
                <Checkbox
                  color="primary"
                  inputProps={{ 'aria-label': 'secondary checkbox' }}
                  onChange={handleChange}
                  onMouseDown={handleOnMouseDown}
                />
              </div>
            }
            <div className="text-right">
              <Button
                color="link"
                className={classnames({ disabled: isLoad }, s.btnNotificationsReload, 'btn-sm', 'float-right', 'py-0', 'ml-2')}
                onClick={retrieveAccountData}
                id="load-notifications-btn"
                onMouseDown={handleOnMouseDown}
              >
                {isLoad ? <span><i className="la la-refresh la-spin" /> Loading...</span> : <i className="la la-refresh" />}
              </Button>
              {isLoad || props.alertType === 'alert-error'
                ? <span className="fs-mini">{props.alertMessage}</span>
                : <span className="fs-mini text-right">Synced at: {updated.toLocaleString("en-US")}</span>
              }
            </div>
          </div>
        </footer>
      }
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
