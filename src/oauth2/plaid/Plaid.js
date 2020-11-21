import React, { useEffect } from "react";
import { connect } from 'react-redux';
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
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
      var pullConfig = JSON.parse(JSON.stringify(accountObject.pullConfig));
      pullConfig.minimal = true;
      pullConfig.name = props.account.displayName;
      accountObject.pullAccountData(pullConfig);
    }
    // eslint-disable-next-line
  }, []);
  
  return (
    <>
      {props.account.totalBalance !== undefined && 
        <div className="w-100 d-flex flex-column justify-content-center">
          <div className="w-100 d-flex flex-row justify-content-center">
            <GridContainer justify="center" className={`${s.gridContainer}`}>
              <GridItem lg={6} md={12} xs={12}>
                <Card className={`p-5 icon-list-item d-flex justify-content-center align-items-center my-3`} raised>
                  <span className={`${s.headerText}`}>
                    Net Worth: 
                  </span>
                  <span className={`${s.headerText} ${props.account.totalBalance < 0 ? 'errorMessage' : 'successMessage'} ml-3`}>
                    ${numberWithCommas(props.account.totalBalance)}
                  </span>
                </Card>
              </GridItem>
              <GridItem lg={6} md={12} xs={12}>
                <Card className={`p-5 icon-list-item d-flex justify-content-center align-items-center my-3`} raised>
                  <span className={`${s.headerText}`}>
                  Total Buying Power: 
                  </span>
                  <span className={`${s.headerText} ${props.account.totalAvailableBalance < 0 ? 'errorMessage' : 'successMessage'} ml-3`}>
                    ${numberWithCommas(props.account.totalAvailableBalance)}
                  </span>
                </Card>
              </GridItem>
            </GridContainer>
          </div>
          {props.account.balances && props.account.balances.length &&
            <>
              <h5 className={`${s.walletsTitle}`}>Accounts</h5>
              <div className="d-flex flex-column justify-content-center w-100">
                <div className={`${s.rounded}`}></div>
                <PlaidAccounts account={props.account} />
                <div className={`${s.rounded}`}></div>
              </div>
            </>
          }
          {(props.account.percentDifference || props.account.percentDifference === 0) &&
            <div className="w-100 d-flex flex-row justify-content-center">
              <GridContainer justify="center" className={`${s.gridContainer}`}>
                <GridItem lg={6} md={12} xs={12}>
                  <Card className={`p-5 icon-list-item d-flex justify-content-center align-items-center my-3`} raised>
                    <span className={`${s.headerText}`}>
                    Yesterday Percent Change: 
                    </span>
                    <span className={`${s.headerText} ${props.account.percentDifference < 0 ? 'errorMessage' : 'successMessage'} ml-3`}>
                      {numberWithCommas(props.account.percentDifference)}%
                    </span>
                  </Card>
                </GridItem>
              </GridContainer>
            </div>
          }
          {props.account.holdings && props.account.holdings.length ?
            <>
              <h5 className={`${s.walletsTitle}`}>Holdings</h5>
              <div className="d-flex flex-column justify-content-center w-100">
                <div className={`${s.rounded}`}></div>
                <PlaidInvestments account={props.account} />
              </div>
            </> : null
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
