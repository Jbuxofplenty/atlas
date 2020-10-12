import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Widget from 'components/Widget/Widget';
import MultiSelect from 'components/MultiSelect/MultiSelect';
import Select from 'components/Select/Select';
import { cryptoCurrencies } from 'components/MultiSelect/data';
import EditableHeader from 'components/EditableHeader/EditableHeader';

// Echarts
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/candlestick';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/dataZoom';

import { candlestickOptions, defaultXAxis, defaultSeries } from 'charts';

import { dataActions, alertActions } from 'actions';

import s from '../Dashboard.module.scss';

const initEchartsOptions = {
  renderer: 'canvas',
  height: 'auto'
}

function CandlestickWidget(props) {
  const [options, setOptions] = useState(null);
  const [tickers, setTickers] = useState([['BINANCE:BTCUSDT', 'Bitcoin (BTC)', '#00B8D9']]);
  const defaultValues = [cryptoCurrencies[0]];
  const eChartsRef = React.useRef(null);
  const [more, setMore] = useState(false);
  const [moreHeight, setMoreHeight] = useState(0);

  useEffect(() => {
    props.clear();
    props.setComponent('candlestick-widget')
    tickers.forEach(ticker => {
      if(!props.stockData || !props.stockData[ticker[0]] || !props.stockData[ticker[0]]["candlestick"]){
        pullCryptoData(ticker[0]);
      }
    });
    // eslint-disable-next-line
  }, []);

  const pullCryptoData = (ticker) => {
    var now = new Date().getTime();
    var tempDate = new Date();
    tempDate.setMonth(tempDate.getMonth() - 1);
    var oneMonthAgo = tempDate.getTime();
    props.retrieveStockData(ticker, oneMonthAgo, now, "candlestick");
  }

  useEffect(() => {
    var tempOptions = JSON.parse(JSON.stringify(candlestickOptions));
    tickers.forEach(ticker => {
      if(props.stockData && props.stockData[ticker[0]] && props.stockData[ticker[0]]["candlestick"]){
        tempOptions = updateOptions(ticker, tempOptions);
      }
      else {
        pullCryptoData(ticker[0]);
      }
    });
    if(tickers.length === 0) {
      setOptions(null)
    }
    // eslint-disable-next-line
  }, [props.stockData, tickers]);

  useEffect(() => {
    if (eChartsRef && eChartsRef.current) {
      eChartsRef.current.getEchartsInstance().on('dataZoom', function() {
        var option = eChartsRef.current.getEchartsInstance().getOption();
        zoomCallback(option);
      });
    }
  }, [eChartsRef, options]);

  const updateOptions = (ticker, options) => {
    var tempOptions = JSON.parse(JSON.stringify(candlestickOptions));
    if(options) tempOptions = JSON.parse(JSON.stringify(options));
    tempOptions.legend.data.push(ticker[1]);
    var timeStamps = [];
    props.stockData[ticker[0]]["candlestick"].t.forEach(timeStamp => {
      timeStamps.push(new Date(timeStamp*1000).toLocaleString('en-US'));
    })
    tempOptions.xAxis.push(defaultXAxis);
    var lastItemIndex = tempOptions.xAxis.length-1;
    tempOptions.xAxis[lastItemIndex].data = timeStamps;
    var data = [];
    var candlestickData = props.stockData[ticker[0]]["candlestick"];
    for(var i=0; i < candlestickData.o.length; i++) {
      var datum = [];
      datum.push(candlestickData.o[i]);
      datum.push(candlestickData.c[i]);
      datum.push(candlestickData.l[i]);
      datum.push(candlestickData.h[i]);
      data.push(datum);
    }
    tempOptions.series.push(defaultSeries);
    tempOptions.series[lastItemIndex].itemStyle.color = ticker[2];
    tempOptions.series[lastItemIndex].data = data;
    tempOptions.series[lastItemIndex].name = ticker[1];
    tempOptions.series[lastItemIndex].type = 'candlestick';
    setOptions(tempOptions);
    if (eChartsRef && eChartsRef.current) {
      eChartsRef.current.getEchartsInstance().setOption(tempOptions, true);
    }
    return tempOptions;
  }

  const zoomCallback = (option) => {
    return;
  }

  const onDataSelectChange = (selectedValues) => {
    let updatedTickers = [];
    if(selectedValues) {
      selectedValues.forEach(ticker => {
        updatedTickers.push([ticker.value, ticker.label, ticker.color]);
      })
    }
    setTickers(updatedTickers);
  }

  const onTypeSelectChange = (selectedValue) => {
    console.log(selectedValue)
  }

  const handleMore = async () => {
    await setMore(!more);
    if(!more) {
      var height = document.getElementById('more').clientHeight;
      setMoreHeight(height);
    }
    else{
      setMoreHeight(0);
    }
  }

  return (
    <Widget 
      className="w-100 align-self-center h-100" 
      close 
      collapse
      title={<EditableHeader title={'Crypto Currency Price Chart'} id={props.widgetId + '-widgetTitle'}/>}
      view={props.view}
      widgetId={props.widgetId}
    >
      {options &&
        <ReactEchartsCore
          echarts={echarts}
          option={options}
          style={{'height': props.widget.height-moreHeight}}
          opts={initEchartsOptions}
          ref={eChartsRef}
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
      { more &&
        <GridContainer id="more" justify="center" className={`${s.gridContainer}`}>
          <GridItem xs={12} sm={12} lg={12} className={`mt-5 ${s.instructionContainer}`} >
            <h5 className={`${s.settingsTitle}`}>Settings</h5>
          </GridItem>
          <GridItem xs={12} sm={12} lg={6} >
            <div className="mt-3 d-flex flex-column">
              <p className={`${s.title}`}>Type</p>
              <div className={`${s.inputContainer}`}>
                <Select 
                  onSelectChange={onTypeSelectChange}
                />
              </div>
            </div>
          </GridItem>
          <GridItem xs={12} sm={12} lg={6} >
            <div className="mt-3 d-flex flex-column">
              <p className={`${s.title}`}>Data</p>
              <div className={`${s.inputContainer}`}>
                <MultiSelect 
                  onSelectChange={onDataSelectChange}
                  defaultValues={defaultValues}
                />
              </div>
            </div>
          </GridItem>
        </GridContainer>
      }
      <div className="d-flex flex-column justify-content-center w-100">
        <div className={`halfCircle d-flex flex-column justify-content-center align-items-center`} onClick={handleMore}>
          {more ? <i className={`la la-angle-up mt-1`} style={{ fontSize: "2vw" }}/> : <i className={`la la-angle-down mt-1`} style={{ fontSize: "2em" }} /> } 
        </div>
      </div>
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