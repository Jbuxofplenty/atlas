import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Widget from 'components/Widget/Widget';

// Echarts
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/candlestick';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';

import { candlestickOptions } from 'atlasEcharts';

import { dataActions, alertActions } from 'actions';

import s from '../Dashboard.module.scss';

const initEchartsOptions = {
  renderer: 'canvas'
}

function CandlestickWidget(props) {
  const [options, setOptions] = useState(null);
  const [ticker, setTicker] = useState("BTC-USD");

  useEffect(() => {
    props.clear();
    props.setComponent('candlestick-widget')
    if(!props.stockData || !props.stockData[ticker] || !props.stockData[ticker]["candlestick"]){
      var now = new Date().getTime();
      var tempDate = new Date();
      tempDate.setMonth(tempDate.getMonth() - 1);
      var oneMonthAgo = tempDate.getTime();
      props.retrieveStockData(ticker, oneMonthAgo, now, "candlestick");
    }
    else {
      updateOptions();
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if(props.stockData && props.stockData[ticker] && props.stockData[ticker]["candlestick"]){
      updateOptions();
    }
    // eslint-disable-next-line
  }, [props.stockData, ticker]);

  const updateOptions = () => {
    var tempOptions = {};
    Object.assign(tempOptions, candlestickOptions);
    tempOptions.legend.data = [ticker];
    var timeStamps = [];
    props.stockData[ticker]["candlestick"].t.forEach(timeStamp => {
      timeStamps.push(new Date(timeStamp*1000).toLocaleString('en-US'));
    })
    tempOptions.xAxis[0].data = timeStamps;
    var data = [];
    var candlestickData = props.stockData[ticker]["candlestick"];
    for(var i=0; i < candlestickData.o.length; i++) {
      var datum = [];
      datum.push(candlestickData.o[i]);
      datum.push(candlestickData.c[i]);
      datum.push(candlestickData.l[i]);
      datum.push(candlestickData.h[i]);
      data.push(datum);
    }
    tempOptions.series[0].data = data;
    tempOptions.series[0].name = ticker;
    tempOptions.series[0].type = 'candlestick';
    setOptions(tempOptions);
  }

  return (
    <Widget 
      className="w-100 align-self-center" 
      close 
      collapse
      title={<h5><span className='fw-semi-bold'>Bitcoin</span> Price Chart</h5>}
    >
      {options &&
        <ReactEchartsCore
          echarts={echarts}
          option={options}
          opts={initEchartsOptions}
          style={{ height: "365px" }}
        />
      }
      {!options && !props.alertVisible && !props.alertType === "alert-error" && 
        <div className="d-flex w-100 justify-content-center align-items-center" style={{ height: "100px" }}>
          <i className={`fas fa-spinner fa-spin`} style={{fontSize: 40}}/>
        </div> 
      }
      <GridContainer justify="center" className={`${s.gridContainer}`}>
        <GridItem xs={12} sm={12} lg={12} className={`${s.instructionContainer}`}>
          { props.alertVisible && props.alertType === "alert-pending" && props.alertComponent === "candlestick-widget" && <i className="fas fa-spinner fa-spin" style={{fontSize: 20}}/> }
          { props.alertVisible && props.alertType === "alert-success" &&  props.alertComponent === "candlestick-widget" && <div className="successMessage">{props.alertMessage}</div> }
          { props.alertVisible && props.alertType === "alert-error" && props.alertComponent === "candlestick-widget" && <div className="errorMessage">{props.alertMessage}</div> }
        </GridItem>
      </GridContainer>
    </Widget>
  );
}

function mapStateToProps(store) {
  return {
    stockData: store.data.stockData,
    alertType: store.alert.type,
    alertMessage: store.alert.message,
    alertVisible: store.alert.visible,
    alertComponent: store.alert.component,
  };
}

const mapDispatchToProps = (dispatch, history) => {
  return {
    retrieveStockData: (ticker, timeStart, timeEnd, dataType) => dispatch(dataActions.retrieveStockData(ticker, timeStart, timeEnd, dataType)),
    visible: (show) => dispatch(alertActions.visible(show)),
    clear: () => dispatch(alertActions.clear()),
    setComponent: (component) => dispatch(alertActions.component(component)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CandlestickWidget));