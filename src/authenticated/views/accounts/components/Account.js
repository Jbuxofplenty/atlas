import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import { TabPane } from 'reactstrap';

// core components
import GridContainer from "components/Grid/GridContainer.js";
import SyncAccount from "components/SyncAccount/SyncAccount.js";
import DeleteAccount from "./DeleteAccount.js";

import OAuthObject from 'oauth2';

import s from '../Accounts.module.scss';
import { eThreeActions, alertActions } from "actions";

function Account(props) {
  const [accountObject, setAccountObject] = useState(null);
  const [more, setMore] = useState(false);

  useEffect(() => {
    props.visible(false);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if(props.account.plaid) {
      setAccountObject(OAuthObject['Plaid'])
    }
    else {
      setAccountObject(OAuthObject[props.account.displayName])
    }
    // eslint-disable-next-line
  }, [props.account.displayName]);

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
      <SyncAccount account={props.account} />
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
