import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  Card,
} from 'react-bootstrap';

import Widget from 'components/Widget/Widget';
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import s from './AddWidget.module.scss';

import { widgetActions } from 'actions';
import { initialState, defaultTransactionsWidget, defaultStockAnalyzerWidget, defaultCandleStickWidget } from 'reducers/widget.reducer';
import { generateRandomId } from 'helpers';

import { compoundInterestCalculator } from "components/Calculators/CompoundInterestCalculator"


function AddWidget(props) {
  const [accountSummaryVisible, setAccountSummaryVisible] = useState(null);
  const [simulatorSettingsVisible, setSimulatorSettingsVisible] = useState(null);
  const [watchListVisible, setWatchListVisible] = useState(null);
  const [transactionsVisible, setTransactionsVisible] = useState(null);

  useEffect(() => {
    var accountSummaryIsVisible = false;
    var simulatorSettingsIsVisible = false;
    var watchListIsVisible = false;
    var transactionsIsVisible = false;
    Object.keys(props.widgets[props.view]).forEach(key => {
      if(props.widgets[props.view][key].widgetType === 'accountSummary') {
        accountSummaryIsVisible = true;
      }
      if(props.widgets[props.view][key].widgetType === 'simulatorSettings') {
        simulatorSettingsIsVisible = true;
      }
      if(props.widgets[props.view][key].widgetType === 'watchList') {
        watchListIsVisible = true;
      }
      if(props.widgets[props.view][key].widgetType === 'transactions') {
        transactionsIsVisible = true;
      }
    })
    setAccountSummaryVisible(accountSummaryIsVisible);
    setSimulatorSettingsVisible(simulatorSettingsIsVisible);
    // Temporary until implementation
    watchListIsVisible = true;
    setWatchListVisible(watchListIsVisible);
    setTransactionsVisible(transactionsIsVisible);
    // eslint-disable-next-line
  }, [props.widgets[props.view]]);


  useEffect(() => {
    var customizeWidget = JSON.parse(JSON.stringify(props.widget));
    // Dashboard number of rows visible
    var numVisible = 3;
    if(props.view === 'charts') numVisible = 1;
    if(props.view === 'simulator') numVisible = 2;
    var minH = 3;
    var rowHeight = 1.7;
    if(!accountSummaryVisible && props.view === 'dashboard') numVisible += 1;
    if(!simulatorSettingsVisible && props.view === 'simulator') numVisible += 1;
    if(!transactionsVisible && props.view === 'simulator') numVisible += 1;
    if(!watchListVisible && props.view !== 'charts') numVisible += 1;
    if(customizeWidget.collapsed) {
      customizeWidget.dataGrid.savedH = minH + Math.round(numVisible * rowHeight);
      customizeWidget.dataGrid.savedMinH = minH + Math.round(numVisible * rowHeight);
    }
    else {
      customizeWidget.dataGrid.h = minH + Math.round(numVisible * rowHeight);
      customizeWidget.dataGrid.minH = minH + Math.round(numVisible * rowHeight);
    }
    props.updateWidget(props.widgetId, customizeWidget, props.view);
    // eslint-disable-next-line
  }, [accountSummaryVisible, simulatorSettingsVisible, transactionsVisible, watchListVisible]);

  const addChart = async () => {
    let xy = widgetActions.getOpenSlot(defaultCandleStickWidget.dataGrid.w, defaultCandleStickWidget.dataGrid.h, props.view);
    var key = generateRandomId();
    var newChart = JSON.parse(JSON.stringify(defaultCandleStickWidget));
    newChart.dataGrid.x = xy.x;
    newChart.dataGrid.y = xy.y;
    newChart.dataGrid.i = key;
    widgetActions.updateChartWidget(key, newChart, props.view);
  }

  const addCalculator = async () => {
    let xy = widgetActions.getOpenSlot(compoundInterestCalculator.dataGrid.w, compoundInterestCalculator.dataGrid.h, props.view);
    var key = generateRandomId();
    var newCalculator = JSON.parse(JSON.stringify(compoundInterestCalculator));
    newCalculator.dataGrid.x = xy.x;
    newCalculator.dataGrid.y = xy.y;
    newCalculator.dataGrid.i = key;
    props.updateWidget(key, newCalculator, props.view);
  }

  const addAccountWidget = async () => {
    let xy = widgetActions.getOpenSlot(initialState['dashboard']['1'].dataGrid.w, initialState['dashboard']['1'].dataGrid.h, props.view);
    var key = generateRandomId();
    var accountSummaryWidget = {
      widgetType: 'accountSummary',
      dataGrid: {x: xy.x, y: xy.y, w: 6, h: 6, minW: 5, minH: 6, i: key},
      collapsed: false,
    }
    props.updateWidget(key, accountSummaryWidget, props.view);
  }

  const addSimulatorSettingsWidget = async () => {
    let xy = widgetActions.getOpenSlot(initialState['simulator']['2'].dataGrid.w, initialState['simulator']['2'].dataGrid.h, props.view);
    var key = generateRandomId();
    var simulatorSettingsWidget = JSON.parse(JSON.stringify(initialState['simulator']['2']));
    simulatorSettingsWidget.dataGrid.x = xy.x;
    simulatorSettingsWidget.dataGrid.y = xy.y;
    simulatorSettingsWidget.dataGrid.i = key;
    props.updateWidget(key, simulatorSettingsWidget, props.view);
  }

  const addWatchListWidget = async () => {

  }

  const addTransactionsWidget = async () => {
    let xy = widgetActions.getOpenSlot(defaultTransactionsWidget.dataGrid.w, defaultTransactionsWidget.dataGrid.h, props.view);
    var key = generateRandomId();
    var transactionsWidget = JSON.parse(JSON.stringify(defaultTransactionsWidget));
    transactionsWidget.dataGrid.x = xy.x;
    transactionsWidget.dataGrid.y = xy.y;
    transactionsWidget.dataGrid.i = key;
    props.updateWidget(key, transactionsWidget, props.view);
  }

  const addStockAnalyzerWidget = async () => {
    let xy = widgetActions.getOpenSlot(defaultStockAnalyzerWidget.dataGrid.w, defaultStockAnalyzerWidget.dataGrid.h, props.view);
    var key = generateRandomId();
    var stockAnalyzerWidget = JSON.parse(JSON.stringify(defaultStockAnalyzerWidget));
    stockAnalyzerWidget.dataGrid.x = xy.x;
    stockAnalyzerWidget.dataGrid.y = xy.y;
    stockAnalyzerWidget.dataGrid.i = key;
    props.updateWidget(key, stockAnalyzerWidget, props.view);
  }

  const handleOnMouseDown = async (e) => {
    e.stopPropagation();
  }

  return (
    <Widget 
      className="w-100 align-self-center h-100" 
      collapse
      title={'Customize'}
      view={props.view}
      widgetId={props.widgetId}
    >
      <div className={`d-flex justify-content-center w-100`}>
        <GridContainer justify="center" className={`${s.gridContainer}`}>
          {props.view === 'simulator' && !simulatorSettingsVisible &&
            <GridItem xs={12} sm={12} lg={12}>      
              <Card
                key={1}
                className="my-2 bg-atlas-input text-white clickable"
                onClick={addSimulatorSettingsWidget}
                onMouseDown={handleOnMouseDown}
              >
                <Card.Body>
                  <Card.Text className="d-flex flex-row align-items-center justify-content-center">
                    <i className={`${s.addWidgetIcon} text-white fas fa-cogs`}/>
                    <span className={`${s.addText} text-white`}>Show Simulator Settings</span>
                  </Card.Text>
                </Card.Body>
              </Card>
            </GridItem>
          }
          {(props.view === 'simulator' || props.view === 'dashboard') && 
            <GridItem xs={12} sm={12} lg={12} >          
              <Card
                key={2}
                className="my-2 bg-atlas-input text-white clickable"
                onClick={addStockAnalyzerWidget}
                onMouseDown={handleOnMouseDown}
              >
                <Card.Body>
                  <Card.Text className="d-flex flex-row align-items-center justify-content-center">
                    <i className={`${s.addWidgetIcon} text-white fas fa-vial`}/>
                    <span className={`${s.addText} text-white`}>Add Stock Analyzer</span>
                  </Card.Text>
                </Card.Body>
              </Card>
            </GridItem>
          }
          <GridItem xs={12} sm={12} lg={12}>      
            <Card
              key={1}
              className="my-2 bg-atlas-input text-white clickable"
              onClick={addChart}
              onMouseDown={handleOnMouseDown}
            >
              <Card.Body>
                <Card.Text className="d-flex flex-row align-items-center justify-content-center">
                  <i className={`${s.addWidgetIcon} text-white fa fa-chart-bar`}/>
                  <span className={`${s.addText} text-white`}>Add Chart</span>
                </Card.Text>
              </Card.Body>
            </Card>
          </GridItem>
          {props.view !== 'charts' && !watchListVisible &&
            <GridItem xs={12} sm={12} lg={12} >          
              <Card
                key={2}
                className="my-2 bg-atlas-input text-white clickable"
                onClick={addWatchListWidget}
                onMouseDown={handleOnMouseDown}
              >
                <Card.Body>
                  <Card.Text className="d-flex flex-row align-items-center justify-content-center">
                    <i className={`${s.addWidgetIcon} text-white fas fa-list`}/>
                    <span className={`${s.addText} text-white`}>Add Watch List</span>
                  </Card.Text>
                </Card.Body>
              </Card>
            </GridItem>
          }
          {props.view === 'simulator' && !transactionsVisible &&
            <GridItem xs={12} sm={12} lg={12} >          
              <Card
                key={2}
                className="my-2 bg-atlas-input text-white clickable"
                onClick={addTransactionsWidget}
                onMouseDown={handleOnMouseDown}
              >
                <Card.Body>
                  <Card.Text className="d-flex flex-row align-items-center justify-content-center">
                    <i className={`${s.addWidgetIcon} text-white fas fa-credit-card`}/>
                    <span className={`${s.addText} text-white`}>Show Transactions</span>
                  </Card.Text>
                </Card.Body>
              </Card>
            </GridItem>
          }
          {props.view === 'dashboard' &&
            <GridItem xs={12} sm={12} lg={12}>      
              <Card
                key={1}
                className="my-2 bg-atlas-input text-white clickable"
                onClick={addCalculator}
                onMouseDown={handleOnMouseDown}
              >
                <Card.Body>
                  <Card.Text className="d-flex flex-row align-items-center justify-content-center">
                    <i className={`${s.addWidgetIcon} text-white fa fa-calculator`}/>
                    <span className={`${s.addText} text-white`}>Add Calculator</span>
                  </Card.Text>
                </Card.Body>
              </Card>
            </GridItem>
          }
          {props.view === 'dashboard' && !accountSummaryVisible &&
            <GridItem xs={12} sm={12} lg={12} >          
              <Card
                key={2}
                className="my-2 bg-atlas-input text-white clickable"
                onClick={addAccountWidget}
                onMouseDown={handleOnMouseDown}
              >
                <Card.Body>
                  <Card.Text className="d-flex flex-row align-items-center justify-content-center">
                    <i className={`${s.addWidgetIcon} text-white fa fa-plus`}/>
                    <span className={`${s.addText} text-white`}>Add Account Summary</span>
                  </Card.Text>
                </Card.Body>
              </Card>
            </GridItem>
          }
        </GridContainer>
      </div>
    </Widget>
  );
}

const mapStateToProps = (state) => {
  return {
    widgets: state.widget,
  };
}

const mapDispatchToProps = (dispatch, history) => {
  return {
    resetWidgets: () => dispatch(widgetActions.resetWidgets()),
    updateWidget: (key, widget, view) => dispatch(widgetActions.updateWidget(key, widget, view)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddWidget));
