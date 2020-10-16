import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Widget from 'components/Widget/Widget';
import MultiSelect from 'components/MultiSelect/MultiSelect';
import Select from 'components/Select/Select';
import EditableHeader from 'components/EditableHeader/EditableHeader';
import TimeScale from 'components/TimeScale/TimeScale';

// Echarts
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/candlestick';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/dataZoom';

import { candlestickOptions, defaultXAxis, defaultSeries, positionFunction } from 'charts';

import { chartTypes, chartTypesMap } from 'components/Select/data';

import { dataActions, alertActions } from 'actions';

import s from '../Dashboard.module.scss';
import { widgetActions } from 'actions';

const initEchartsOptions = {
  renderer: 'canvas',
  height: 'auto'
}

function CandlestickWidget(props) {
  const [options, setOptions] = useState(null);
  const [tickers, setTickers] = useState(null);
  const [defaultValues, setDefaultValues] = useState(null);
  const [timeScale, setTimeScale] = useState(props.widget.timeScale);
  const eChartsRef = React.useRef(null);
  const [more, setMore] = useState(false);
  const [moreHeight, setMoreHeight] = useState(0);

  useEffect(() => {
    props.clear();
    props.setComponent('candlestick-widget')
    // eslint-disable-next-line
  }, []);

  const pullCryptoData = (ticker) => {
    props.retrieveStockData(ticker, "candlestick", timeScale);
  }

  useEffect(() => {
    // props.resetWidgets();
    var tempOptions = JSON.parse(JSON.stringify(candlestickOptions));
    var tempTickers = tickers;
    if(!tickers)  {
      tempTickers = Object.values(JSON.parse(JSON.stringify(props.widget.tickers)));
      setTickers(tempTickers);
      var tempDefaultValues = [];
      tempTickers.forEach(ticker => {
        var tempTicker = {};
        tempTicker.value = ticker[0];
        tempTicker.label = ticker[1];
        tempTicker.color = ticker[2];
        tempDefaultValues.push(tempTicker);
      })
      setDefaultValues(tempDefaultValues);
    }
    tempTickers.forEach(ticker => {
      if(props.stockData 
          && props.stockData[ticker[0]] 
          && props.stockData[ticker[0]]["candlestick"+props.widget.yType] 
          && props.stockData[ticker[0]]["candlestick"+props.widget.yType][timeScale]){
        tempOptions = updateOptions(ticker, tempOptions);
      }
      else {
        pullCryptoData(ticker[0]);
      }
    });
    if(tempTickers.length === 0) {
      setOptions(null)
    }
    // eslint-disable-next-line
  }, [props.stockData, tickers, timeScale, props.widget.yType]);

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
    props.stockData[ticker[0]]["candlestick"+props.widget.yType][timeScale].t.forEach(timeStamp => {
      timeStamps.push(new Date(timeStamp*1000).toLocaleString('en-US'));
    })
    tempOptions.xAxis.push(defaultXAxis);
    var lastItemIndex = tempOptions.xAxis.length-1;
    tempOptions.xAxis[lastItemIndex].data = timeStamps;
    var data = [];
    var candlestickData = props.stockData[ticker[0]]["candlestick"+props.widget.yType][timeScale];
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
    tempOptions.tooltip.position = positionFunction;
    setOptions(tempOptions);
    // delete tempOptions.tooltip.position;
    // var tempWidget = JSON.parse(JSON.stringify(props.widget));
    // tempWidget.chartOptions = tempOptions;
    // props.updateWidget(props.widgetId, tempWidget, props.view);
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
    let tempTickers = {};
    if(selectedValues) {
      selectedValues.forEach((ticker, index) => {
        tempTickers[index] = [ticker.value, ticker.label, ticker.color];
        updatedTickers.push([ticker.value, ticker.label, ticker.color]);
      })
    }
    setTickers(updatedTickers);
    var tempWidget = JSON.parse(JSON.stringify(props.widget));
    tempWidget.tickers = tempTickers;
    props.updateWidget(props.widgetId, tempWidget, props.view);
  }

  const onTimeScaleChange = (name) => {
    var tempWidget = JSON.parse(JSON.stringify(props.widget));
    tempWidget.timeScale = name;
    props.updateWidget(props.widgetId, tempWidget, props.view);
    setTimeScale(name);
  }

  const onTypeSelectChange = (selectedValue) => {
    var tempWidget = JSON.parse(JSON.stringify(props.widget));
    tempWidget.widgetType = selectedValue.label;
    tempWidget.yType = selectedValue.yType;
    props.updateWidget(props.widgetId, tempWidget, props.view);
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
      title={<EditableHeader 
        title={props.widget.name} 
        id={props.widgetId + '-widgetTitle'} 
        widget={props.widget} 
        widgetId={props.widgetId} 
        view={props.view}/>
      }
      view={props.view}
      widgetId={props.widgetId}
    >
      {options && tickers && defaultValues &&
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
      <TimeScale 
        id={props.widgetId + '-timeScale'} 
        widget={props.widget} 
        widgetId={props.widgetId} 
        view={props.view}
        handleChange={onTimeScaleChange}
      />
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
                  defaultValue={chartTypes[chartTypesMap[props.widget.widgetType]]}
                  options={chartTypes}
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
    retrieveStockData: (ticker, dataType, timeScale) => dispatch(dataActions.retrieveStockData(ticker, dataType, timeScale)),
    visible: (show) => dispatch(alertActions.visible(show)),
    clear: () => dispatch(alertActions.clear()),
    setComponent: (component) => dispatch(alertActions.component(component)),
    resetWidgets: () => dispatch(widgetActions.resetWidgets()),
    updateWidget: (key, widget, view) => dispatch(widgetActions.updateWidget(key, widget, view)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CandlestickWidget));