import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';

import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import TimeScaleToggle from "components/TimeScaleToggle/TimeScaleToggle";

import s from './SymbolFinData.module.scss';

import { dataActions, widgetActions } from 'actions';
import { numberWithCommas, formattedDate } from 'helpers';
import { keys } from './keys';

const conditionallyRenderedTimeScales = ['Annual', 'TTM', 'Fiscal Year', '5 Year'];

function SymbolFinData(props) {
  const profile = props.symbolData[props.ticker.value].profile;
  const financialMetrics = props.symbolData[props.ticker.value].financialMetrics;
  const [timeScales, setTimeScales] = useState(props.widget.timeScales);
  const [renderedFields1, setRenderedFields1] = React.useState({});
  const [renderedFields2, setRenderedFields2] = React.useState({});

  useEffect(() => {
    var newRenderedFields1 = {};
    var newRenderedFields2 = {};
    var addedKeys = [];
    for(var key in financialMetrics) {
      var dataArray = keys[key];
      if(dataArray && financialMetrics[key] !== null) {
        if(!conditionallyRenderedTimeScales.includes(dataArray[1])) addedKeys.push(key);
        if(conditionallyRenderedTimeScales.includes(dataArray[1]) && timeScales.includes(dataArray[1])) {
          addedKeys.push(key);
        }
      }
    }
    var halfLength = addedKeys.length / 2;
    for(var i in addedKeys) {
      var addedKey = addedKeys[i];
      if(i > halfLength) {
        if(!newRenderedFields1[keys[addedKey][0]]) newRenderedFields1[keys[addedKey][0]] = [];
        newRenderedFields1[keys[addedKey][0]].push([keys[addedKey][1], financialMetrics[addedKey], keys[addedKey][2]]);
      }
      else {
        if(!newRenderedFields2[keys[addedKey][0]]) newRenderedFields2[keys[addedKey][0]] = [];
        newRenderedFields2[keys[addedKey][0]].push([keys[addedKey][1], financialMetrics[addedKey], keys[addedKey][2]]);
      }
    }
    setRenderedFields1(newRenderedFields1);
    setRenderedFields2(newRenderedFields2);
    //eslint-disable-next-line
  }, [timeScales]);

  const handleTimeScaleToggle = (newTimeScales) => {
    var tempWidget = JSON.parse(JSON.stringify(props.widget));
    tempWidget.timeScales = newTimeScales;
    props.updateWidget(props.widgetId, tempWidget, props.view);
    setTimeScales(newTimeScales);
  }

  const formatValue = (value, type) => {
    if(type === '$M') {
      return '$' + numberWithCommas(value) + 'M'
    }
    else if(type === '$') {
      return '$' + numberWithCommas(value)
    }
    else if(type === '') {
      return value;
    }
    else if(type === '%') {
      return numberWithCommas(value) + '%'
    }
    else if(type === '$/shares') {
      return '$' + numberWithCommas(value)
    }
    else if(type === 'shares') {
      return numberWithCommas(value) + 'M'
    }
    else{
      return numberWithCommas(value)
    }
  }

  return (
    <GridContainer justify="center" className={`w-100`}>
      {_.isEmpty(profile) || _.isEmpty(financialMetrics) ?

        <GridItem lg={12} md={12} xs={12} className={`d-flex justify-content-center`}>
          <div className={s.title}>No financial data available!</div>
        </GridItem>
        :
        <>
          <GridItem lg={12} md={12} xs={12} className={`d-flex justify-content-center`}>
            <div className={s.title}>Financial Data</div>
          </GridItem>
          <div className="mt-2 mb-4">
            <TimeScaleToggle timeScales={timeScales} handleTimeScaleToggle={handleTimeScaleToggle} />
          </div>
          <GridContainer justify="center" className={`w-100 ${s.finContainer}`}>
            <GridItem lg={6} md={6} xs={12} className={`d-flex flex-column justify-content-start`}>
              <div className='d-flex align-self-center mt-3 w-100'>
                <div className={s.sectionTitle}>General</div>
              </div>
              <div className={`d-flex justify-content-between mt-3 ${s.valueContainer}`}>
                <div>Industry: </div>
                <div className={s.value}>
                  {profile.finnhubIndustry ? profile.finnhubIndustry : 'N/A'}
                </div>
              </div>
              <div className={`d-flex justify-content-between mt-3 ${s.valueContainer}`}>
                <div>IPO Date: </div>
                <div className={s.value}>
                  {profile.ipo ? formattedDate(new Date(profile.ipo)) : 'N/A'}
                </div>
              </div>
              <div className={`d-flex justify-content-between mt-3 ${s.valueContainer}`}>
                <div>Web Url: </div>
                <div className={s.value}>
                  {profile.weburl ? profile.weburl : 'N/A'}
                </div>
              </div>
              <div className={`d-flex justify-content-between mt-3 ${s.valueContainer}`}>
                <div>Market Capitalization: </div>
                <div className={s.value}>
                  {profile.marketCapitalization ? '$' + numberWithCommas(profile.marketCapitalization) + 'M' : 'N/A'}
                </div>
              </div>
              {Object.keys(renderedFields1) && 
                Object.keys(renderedFields1).map((section, index) => {
                  const totalLength = Object.keys(renderedFields1).length;
                  return (
                    <div key={index}>
                      <div className='d-flex align-self-start mt-3 w-100'>
                        <div className={s.sectionTitle}>{section}</div>
                      </div>
                      {renderedFields1[section].map((lineItem, fieldIndex) => {
                        const value = lineItem[1];
                        const type = lineItem[2];
                        return (
                          <div key={(fieldIndex+1)*totalLength} className={`d-flex justify-content-between mt-3 ${s.valueContainer}`}>
                            <div>{lineItem[0]}: </div>
                            <div className={s.value}>
                              {formatValue(value, type)}
                            </div>
                          </div>
                        )
                      })
                      }
                    </div>
                  )
                })
              }
            </GridItem>
            <GridItem lg={6} md={6} xs={12} className={`d-flex flex-column justify-content-start`}>
              {Object.keys(renderedFields2) && 
                Object.keys(renderedFields2).map((section, index) => {
                  const totalLength = Object.keys(renderedFields2).length;
                  return (
                    <div key={index}>
                      <div className='d-flex align-self-start mt-3 w-100'>
                        <div className={s.sectionTitle}>{section}</div>
                      </div>
                      {renderedFields2[section].map((lineItem, fieldIndex) => {
                        const value = lineItem[1];
                        const type = lineItem[2];
                        return (
                          <div key={(fieldIndex+1)*totalLength} className={`d-flex justify-content-between mt-3 ${s.valueContainer}`}>
                            <div>{lineItem[0]}: </div>
                            <div className={s.value}>
                              {formatValue(value, type)}
                            </div>
                          </div>
                        )
                      })
                      }
                    </div>
                  )
                })
              }
            </GridItem>
          </GridContainer>
        </>
      }
      
    </GridContainer>
  );
}

const mapStateToProps = (state) => {
  return {
    portfolio: state.simulator.portfolio,
    settings: state.simulator.settings,
    symbolData: state.data.symbolData,
  };
}

const mapDispatchToProps = (dispatch, history) => {
  return {
    pullSymbolData: (ticker) => dispatch(dataActions.pullSymbolData(ticker)),
    updateWidget: (key, widget, view) => dispatch(widgetActions.updateWidget(key, widget, view)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SymbolFinData));