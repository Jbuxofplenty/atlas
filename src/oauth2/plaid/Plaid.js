import React, { useEffect } from "react";
import { connect } from 'react-redux';
import {
  Col,
} from 'reactstrap';
import { Card } from '@material-ui/core';

// core components
// import GridContainer from "components/Grid/GridContainer.js";
// import GridItem from "components/Grid/GridItem.js";
import PlaidAccounts from "components/PlaidAccounts/PlaidAccounts.js";
import PlaidInvestments from "components/PlaidInvestments/PlaidInvestments.js";

import { eThreeActions, alertActions } from "actions";
import { numberWithCommas } from 'helpers';
import OAuthObject from 'oauth2';

import s from './Plaid.module.scss'

function Plaid(props) {
  useEffect(() => {
    props.visible(false);
    // Guard for when linking an account and pulling in the data
    if(props.account.totalBalance !== undefined 
        && props.account.orders !== undefined ) {
      var accountObject = OAuthObject['Plaid'];
      accountObject.getPercentDifference();
    }
    // eslint-disable-next-line
  }, []);
  
  return (
    <>
      {props.account.totalBalance !== undefined && 
        <div className="w-100 d-flex flex-column justify-content-center">
          <div className="w-100 d-flex flex-row justify-content-center">
            <Col lg={6} md={12} xs={12}>
              <Card className={`p-5 icon-list-item d-flex justify-content-center align-items-center my-3`} raised>
                <span className={`${s.headerText}`}>
                  Net Worth: 
                </span>
                <span className={`${s.headerText} ${props.account.totalBalance < 0 ? 'errorMessage' : 'successMessage'} ml-3`}>
                  ${numberWithCommas(props.account.totalBalance)}
                </span>
              </Card>
            </Col>
            <Col lg={6} md={12} xs={12}>
              <Card className={`p-5 icon-list-item d-flex justify-content-center align-items-center my-3`} raised>
                <span className={`${s.headerText}`}>
                Total Buying Power: 
                </span>
                <span className={`${s.headerText} ${props.account.totalAvailableBalance < 0 ? 'errorMessage' : 'successMessage'} ml-3`}>
                  ${numberWithCommas(props.account.totalAvailableBalance)}
                </span>
              </Card>
            </Col>
          </div>
          {props.account.balances && props.account.balances.length &&
            <>
              <h5 className={`${s.walletsTitle}`}>Accounts</h5>
              <div className="d-flex flex-column justify-content-center w-100">
                <div className={`${s.rounded}`}></div>
                <PlaidAccounts account={props.account} />
              </div>
            </>
          }
          {props.account.investments && props.account.investments.length &&
            <>
              <h5 className={`${s.walletsTitle}`}>Investments</h5>
              <div className="d-flex flex-column justify-content-center w-100">
                <div className={`${s.rounded}`}></div>
                <PlaidInvestments account={props.account} />
              </div>
            </>
          }
        </div>
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
    backupKey: (keyPassword, uid) => dispatch(eThreeActions.backupKey(keyPassword, uid)),
    visible: (show) => dispatch(alertActions.visible(show)),
    setComponent: (component) => dispatch(alertActions.component(component)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Plaid);
