import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import classnames from 'classnames';

import OAuthObject from 'oauth2';

import s from './SyncAccount.module.scss';
import { alertActions } from "actions";

function SyncAccount(props) {
  const [accountObject, setAccountObject] = useState(null);
  const [isLoad, setIsLoad] = useState(false);
  const [updated, setUpdated] = useState(new Date(props.account.lastSynced));

  useEffect(() => {
    props.clear();
    setAccountObject(OAuthObject[props.account.displayName])
    // eslint-disable-next-line
  }, []);

  const retrieveAccountData = async () => {
    props.clear();
    setIsLoad(true);
    var success = await accountObject.pullAccountData();
    if(success) {
      setIsLoad(false);
      setUpdated(new Date());
    }
  }

  return (
    <>
      <footer className={[s.cardFooter, 'text-sm', 'card-footer', 'text-right'].join(' ')}>
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
