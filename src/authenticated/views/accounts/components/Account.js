import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import { TabPane, Button } from 'reactstrap';
import classnames from 'classnames';

// core components
import GridContainer from "components/Grid/GridContainer.js";
import DeleteAccount from "./DeleteAccount.js";

import OAuthObject from 'oauth2';

import s from '../Accounts.module.scss';
import { eThreeActions, alertActions } from "actions";

function Account(props) {
  const [accountObject, setAccountObject] = useState(null);
  const [isLoad, setIsLoad] = useState(false);
  const [more, setMore] = useState(false);
  const [updated, setUpdated] = useState(new Date(props.account.lastSynced));

  useEffect(() => {
    props.visible(false);
    setAccountObject(OAuthObject[props.account.displayName])
    console.log(props.account)
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

  const handleMore = async () => {
    setMore(!more);
  }

  return (
    <TabPane tabId={props.tabId} className="py-5">
      <div>
        <h3 className={`${s.header} mb-3`}>{props.account.displayName}</h3>
        <div className="d-flex flex-column justify-content-center w-100">
          <div className={`${s.rounded}`}></div>
          <GridContainer justify="center" className={`${s.gridContainer}`}>
            {accountObject && <accountObject.accountComponent account={props.account}/>}
          </GridContainer>
        </div>
        { more && <DeleteAccount account={props.account} />}
      </div>
      <div className="d-flex flex-column justify-content-center w-100">
        <div className={`${s.halfCircle} d-flex flex-column justify-content-center align-items-center`} onClick={handleMore}>
          {more ? <i className={`la la-angle-up mt-1`} style={{ fontSize: "2vw" }}/> : <i className={`la la-angle-down mt-1`} style={{ fontSize: "2em" }} /> } 
        </div>
      </div>
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
    </TabPane>
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

export default connect(mapStateToProps, mapDispatchToProps)(Account);
