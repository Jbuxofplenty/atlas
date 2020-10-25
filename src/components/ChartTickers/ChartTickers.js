import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

// core components
import GridItem from "components/Grid/GridItem.js";
import MultiSelect from 'components/MultiSelect/MultiSelect';
import Select from 'components/Select/Select';
import { cryptoCurrencies, indices, gspc, ndx, dji, usStocks } from 'components/MultiSelect/data';

import { alertActions, widgetActions, dataActions } from 'actions';
import { dataSets } from 'reducers/widget.reducer';
import OAuthObject from 'oauth2';
import { asyncForEach } from 'helpers';

import s from './ChartTickers.module.scss';

function ChartTickers(props) {
  const [tickers, setTickers] = useState(null);
  const [defaultValues, setDefaultValues] = useState(null);
  const [heldTickers, setHeldTickers] = useState(null);
  const [tickerOptions, setTickerOptions] = useState(null);

  useEffect(() => {
    props.clear();
    updateOptions(props.widget.dataSet.value);
    checkTickers();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if(props.alertComponent === props.widgetId) {
      checkTickers();
    }
    // eslint-disable-next-line
  }, [tickers, props.widget.yType]);

  const checkTickers = () => {
    var tempTickers = tickers;
    if(!tickers)  {
      tempTickers = Object.values(JSON.parse(JSON.stringify(props.widget.tickers)));
      setTickers(tempTickers);
      props.setTickers(tempTickers);
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
  }

  const onDataSelectChange = (selectedValues) => {
    let updatedTickers = [];
    let tempTickers = {};
    if(selectedValues) {
      var containsAllTicker = false;
      selectedValues.forEach((ticker, index) => {
        if(ticker.value === 'all') {
          containsAllTicker = true;
        }
        else {
          tempTickers[index] = [ticker.value, ticker.label, ticker.color, ticker.tickerType];
          updatedTickers.push([ticker.value, ticker.label, ticker.color, ticker.tickerType]);
        }
      })
      if(containsAllTicker) {
        tickerOptions.forEach((ticker, index) => { 
          if(ticker.value !== 'all') {
            tempTickers[index] = [ticker.value, ticker.label, ticker.color, ticker.tickerType];
            updatedTickers.push([ticker.value, ticker.label, ticker.color, ticker.tickerType]);
          }
        });
      }
    }
    setTickers(updatedTickers);
    props.setTickers(updatedTickers);
    var tempWidget = JSON.parse(JSON.stringify(props.widget));
    tempWidget.tickers = tempTickers;
    widgetActions.updateCandleStickWidget(props.widgetId, tempWidget, props.view);
  }

  const updateOptions = async (dataSet) => {
    if(dataSet === 'heldTickers') {
      if(!heldTickers) {
        var accounts = await dataActions.getFinancialData("accounts");
        var tempHeldTickers = [{ value: 'all', label: 'All Held Tickers', color: '#000000' }];
        await asyncForEach(Object.keys(accounts), async key => {
          var accountObject = OAuthObject[accounts[key].displayName];
          var temp = await accountObject.getFinnhubTickers();
          tempHeldTickers = tempHeldTickers.concat(temp.array);
        })
        setTickerOptions(tempHeldTickers);
        setHeldTickers(tempHeldTickers);
      }
      else setTickerOptions(heldTickers);
    }
    else if(dataSet === 'crypto') {
      setTickerOptions(cryptoCurrencies)
    }
    else if(dataSet === 'indices') {
      setTickerOptions(indices)
    }
    else if(dataSet === 'dji') {
      setTickerOptions(dji)
    }
    else if(dataSet === 'ndx') {
      setTickerOptions(ndx)
    }
    else if(dataSet === 'gspc') {
      setTickerOptions(gspc)
    }
    else if(dataSet === 'usStocks') {
      setTickerOptions(usStocks)
    }
  }

  const onDataSetChange = async (selectedValue) => {
    updateOptions(selectedValue.value);
    var tempWidget = JSON.parse(JSON.stringify(props.widget));
    tempWidget.dataSet = selectedValue;
    widgetActions.updateCandleStickWidget(props.widgetId, tempWidget, props.view);
  } 

  return (
    <GridItem xs={12} sm={12} lg={6} >
      {defaultValues &&
        <>
          <div className="mt-3 d-flex flex-column">
            <p className={`${s.title}`}>Ticker Sets</p>
            <div className={`${s.inputContainer}`}>
              <Select 
                onSelectChange={onDataSetChange}
                defaultValue={props.widget.dataSet}
                options={dataSets}
              />
            </div>
          </div>
          <div className="d-flex flex-column">
            <p className={`${s.title}`}>Tickers</p>
            <div className={`${s.inputContainer}`}>
              <MultiSelect 
                onSelectChange={onDataSelectChange}
                defaultValues={defaultValues}
                options={tickerOptions}
              />
            </div>
          </div>
        </>
      }
    </GridItem>
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
    clear: () => dispatch(alertActions.clear()),
    setComponent: (component) => dispatch(alertActions.component(component)),
    resetWidgets: () => dispatch(widgetActions.resetWidgets()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ChartTickers);