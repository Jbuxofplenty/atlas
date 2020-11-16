import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  Card,
} from 'react-bootstrap';

import Widget from 'components/Widget/Widget';
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import s from '../Simulator.module.scss';

import { widgetActions, simulatorActions } from 'actions';
import { numberWithCommas } from 'helpers';


function PortfolioWidget(props) {

  useEffect(() => {
    props.updateReturns();
    // eslint-disable-next-line
  }, []);

  return (
    <Widget 
      className="w-100 align-self-center h-100" 
      collapse
      title={'Overview'}
      view={props.view}
      widgetId={props.widgetId}
    >
      <div className={`d-flex justify-content-center w-100`}>
        <GridContainer justify="center" className={`${s.gridContainer}`}>
          <GridItem lg={12} md={12} xs={12}>
            <Card className={`p-4 icon-list-item d-flex flex-row justify-content-center align-items-center my-3`} >
              <span className={`${s.portfolioHeaderText}`}>
                Net Worth: 
              </span>
              <span className={`${s.portfolioHeaderText} ml-3`}>
                ${numberWithCommas(props.simulator.portfolio.netWorth)}
              </span>
            </Card>
          </GridItem>
          <h5 className={`${s.portfolioHeader}`}>Gains/Returns</h5>
          <div className={`${s.rounded}`}></div>
          <GridItem lg={6} md={12} xs={12}>
            <Card className={`p-4 icon-list-item d-flex flex-row justify-content-center align-items-center my-3`} >
              <span className={`${s.portfolioHeaderText}`}>
                Today's Gains: 
              </span>
              <span className={`${s.portfolioHeaderText} ${props.simulator.portfolio.todaysGains < 0 ? 'errorMessage' : 'successMessage'} ml-3`}>
                ${numberWithCommas(props.simulator.portfolio.todaysGains)}
              </span>
            </Card>
          </GridItem>
          <GridItem lg={6} md={12} xs={12}>
            <Card className={`p-4 icon-list-item d-flex flex-row justify-content-center align-items-center my-3`} >
              <span className={`${s.portfolioHeaderText}`}>
                Today's Returns: 
              </span>
              <span className={`${s.portfolioHeaderText} ${props.simulator.portfolio.todaysReturns < 0 ? 'errorMessage' : 'successMessage'} ml-3`}>
                {numberWithCommas(props.simulator.portfolio.todaysReturns)}%
              </span>
            </Card>
          </GridItem>
          <GridItem lg={6} md={12} xs={12}>
            <Card className={`p-4 icon-list-item d-flex flex-row justify-content-center align-items-center my-3`} >
              <span className={`${s.portfolioHeaderText}`}>
                Overall Gains: 
              </span>
              <span className={`${s.portfolioHeaderText} ${props.simulator.portfolio.netWorth - props.simulator.settings.startingBalance < 0 ? 'errorMessage' : 'successMessage'} ml-3`}>
                ${numberWithCommas((props.simulator.portfolio.netWorth - props.simulator.settings.startingBalance))}
              </span>
            </Card>
          </GridItem>
          <GridItem lg={6} md={12} xs={12}>
            <Card className={`p-4 icon-list-item d-flex flex-row justify-content-center align-items-center my-3`} >
              <span className={`${s.portfolioHeaderText}`}>
                Overall Returns: 
              </span>
              <span className={`${s.portfolioHeaderText} ${(props.simulator.portfolio.netWorth - props.simulator.settings.startingBalance) / props.simulator.settings.startingBalance < 0 ? 'errorMessage' : 'successMessage'} ml-3`}>
                {numberWithCommas((props.simulator.portfolio.netWorth - props.simulator.settings.startingBalance) / props.simulator.settings.startingBalance)}%
              </span>
            </Card>
          </GridItem>
          <h5 className={`${s.portfolioHeader}`}>Cash/Buying Power</h5>
          <div className={`${s.rounded}`}></div>
          <GridItem lg={6} md={12} xs={12}>
            <Card className={`p-4 icon-list-item d-flex flex-row justify-content-center align-items-center my-3`} >
              <span className={`${s.portfolioHeaderText}`}>
                Cash Remaining: 
              </span>
              <span className={`${s.portfolioHeaderText} ml-3`}>
                ${numberWithCommas(props.simulator.portfolio.cashRemaining)}
              </span>
            </Card>
          </GridItem>
          <GridItem lg={6} md={12} xs={12}>
            <Card className={`p-4 icon-list-item d-flex flex-row justify-content-center align-items-center my-3`} >
              <span className={`${s.portfolioHeaderText}`}>
                Buying Power: 
              </span>
              <span className={`${s.portfolioHeaderText} ml-3`}>
                ${numberWithCommas(props.simulator.portfolio.buyingPower)}
              </span>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    </Widget>
  );
}

const mapStateToProps = (state) => {
  return {
    simulator: state.simulator,
  };
}

const mapDispatchToProps = (dispatch, history) => {
  return {
    resetWidgets: () => dispatch(widgetActions.resetWidgets()),
    updateReturns: () => dispatch(simulatorActions.updateReturns()),
    updateWidget: (key, widget, view) => dispatch(widgetActions.updateWidget(key, widget, view)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PortfolioWidget));
