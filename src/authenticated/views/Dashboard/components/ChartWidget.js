import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Widget from 'components/Widget/Widget';
import ChartTickers from 'components/ChartTickers/ChartTickers';
import ChartTypes from 'components/ChartTypes/ChartTypes';
import EditableHeader from 'components/EditableHeader/EditableHeader';
import TimeScale from 'components/TimeScale/TimeScale';

// Echarts
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/candlestick';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/dataZoom';

import { positionFunction } from 'charts';

import { alertActions, widgetActions, dataActions } from 'actions';

import s from '../Dashboard.module.scss';

const initEchartsOptions = {
  renderer: 'canvas',
  height: 'auto'
}

function ChartWidget(props) {
  const [options, setOptions] = useState(null);
  const [tickers, setTickers] = useState(null);
  const eChartsRef = React.useRef(null);
  const [more, setMore] = useState(false);
  const [moreHeight, setMoreHeight] = useState(0);

  useEffect(() => {
    updateOptions(props.widget.chartOptions);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    updateOptions(props.widget.chartOptions);
    setTickers(props.widget.tickers);
  }, [props.widget]);

  useEffect(() => {
    if (eChartsRef && eChartsRef.current) {
      eChartsRef.current.getEchartsInstance().on('dataZoom', function() {
        var option = eChartsRef.current.getEchartsInstance().getOption();
        zoomCallback(option);
      });
    }
  }, [eChartsRef, options]);

  const updateOptions = (tempOptions) => {
    if(tempOptions && tempOptions.series && tempOptions.series.length !== 0) {
      if(tempOptions.tooltip) tempOptions.tooltip.position = positionFunction;
      var newOptions = JSON.parse(JSON.stringify(tempOptions))
      setOptions(newOptions);
      if (eChartsRef && eChartsRef.current) {
        eChartsRef.current.getEchartsInstance().setOption(newOptions, true);
      }
    }
    else {
      setOptions(null);
    }
  }

  const zoomCallback = (option) => {
    return;
  }

  const onTimeScaleChange = (name) => {
    var tempWidget = JSON.parse(JSON.stringify(props.widget));
    tempWidget.timeScale = name;
    if(tickers) {
      let timeScales = Object.keys(tickers).map(_ => {
        return name;
      })
      let tickersArray = Object.keys(tickers).map(tickerKey => {
        return tickers[tickerKey];
      })
      props.retrieveBatchStockData(tickersArray, 'candleStick', timeScales)
    }
    widgetActions.updateChartWidget(props.widgetId, tempWidget, props.view);
  }

  const handleMore = async () => {
    await setMore(!more);
    if(!more && document.getElementById('more')) {
      var height = document.getElementById('more').clientHeight;
      setMoreHeight(height);
    }
    else{
      setMoreHeight(0);
    }
  }

  const handleOnMouseDown = async (e) => {
    e.stopPropagation();
  }

  return (
    <Widget 
      className="w-100 align-self-center h-100" 
      close 
      collapse
      fullscreen
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
      {options && tickers ?
        <div onMouseDown={handleOnMouseDown}>
          <ReactEchartsCore
            echarts={echarts}
            option={options}
            style={{'height': props.widget.height-moreHeight < 0 ? 0 : props.widget.height-moreHeight}}
            opts={initEchartsOptions}
            ref={eChartsRef}
            id={props.widgetId}
            onMouseDown={handleOnMouseDown}
          />
        </div>
        :
        <div style={{'height': props.widget.height-moreHeight}} className="d-flex justify-content-center align-items-center">
          <div>No Data to Display!</div>
        </div>
      }
      {!options && !props.alertVisible && !props.alertType === "alert-error" && 
        <div className="d-flex w-100 justify-content-center align-items-center" style={{ height: "100px" }}>
          <i className={`fas fa-spinner fa-spin`} style={{fontSize: 40}}/>
        </div> 
      }
      {props.widget.widgetType !== 'accountsPie' &&
        <TimeScale 
          id={props.widgetId + '-timeScale'} 
          widget={props.widget} 
          widgetId={props.widgetId} 
          view={props.view}
          handleChange={onTimeScaleChange}
        />
      }
      <div className="w-100 d-flex justify-content-center">
        <GridContainer justify="center" className={`${s.gridContainer}`}>
          <GridItem xs={12} sm={12} lg={12} className={`${s.instructionContainer}`}>
            { props.alertVisible && props.alertType === "alert-pending" && props.alertComponent === "candleStick-widget" && <i className="fas fa-spinner fa-spin" style={{fontSize: 20}}/> }
            { props.alertVisible && props.alertType === "alert-success" &&  props.alertComponent === "candleStick-widget" && <div className="successMessage">{props.alertMessage}</div> }
            { props.alertVisible && props.alertType === "alert-error" && props.alertComponent === "candleStick-widget" && <div className="errorMessage">{props.alertMessage}</div> }
          </GridItem>
        </GridContainer>
      </div>
      { more &&
        <div className="w-100 d-flex justify-content-center">
          <GridContainer id="more" justify="center" className={`${s.gridContainer}`}>
            <GridItem xs={12} sm={12} lg={12} className={`mt-5 ${s.instructionContainer}`} >
              <h5 className={`${s.settingsTitle}`}>Settings</h5>
            </GridItem>
            <ChartTypes
              widget={props.widget} 
              setTickers={setTickers}
              widgetId={props.widgetId}
              view={props.view}
            />
            <ChartTickers 
              widget={props.widget} 
              setTickers={setTickers}
              widgetId={props.widgetId}
              view={props.view}
            />
          </GridContainer>
        </div>
      }
      <div className="d-flex flex-column justify-content-center w-100 sticky-bottom">
        <div className={`halfCircle d-flex flex-column justify-content-center align-items-center`} onClick={handleMore} onMouseDown={handleOnMouseDown}>
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
    visible: (show) => dispatch(alertActions.visible(show)),
    pending: (show) => dispatch(alertActions.pending(show)),
    success: (message) => dispatch(alertActions.success(message)),
    clear: () => dispatch(alertActions.clear()),
    setComponent: (component) => dispatch(alertActions.component(component)),
    resetWidgets: () => dispatch(widgetActions.resetWidgets()),
    retrieveBatchStockData: (tickers, dataType, timeScales) => dispatch(dataActions.retrieveBatchStockData(tickers, dataType, timeScales)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ChartWidget));