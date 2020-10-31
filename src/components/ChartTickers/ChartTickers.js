import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

// core components
import GridItem from "components/Grid/GridItem.js";
import MultiSelect from 'components/MultiSelect/MultiSelect';
import Select from 'components/Select/Select';
import { cryptoCurrencies, indices, gspc, ndx, dji, usStocks, nyse, nasdaq } from 'components/MultiSelect/data';

import { alertActions, widgetActions, dataActions } from 'actions';
import { dataSets } from 'reducers/widget.reducer';
import OAuthObject from 'oauth2';
import { asyncForEach } from 'helpers';

import s from './ChartTickers.module.scss';

function ChartTickers(props) {
  // Formatted for widget
  const [tickers, setTickers] = useState(null);
  // Formated for react-select component
  const [selectedTicks, setSelectedTicks] = useState([]);
  const [defaultValues, setDefaultValues] = useState(null);
  const [selectAll, setSelectAll] = useState(false);
  const [heldTickers, setHeldTickers] = useState(null);
  const [tickerOptions, setTickerOptions] = useState(null);
  const [selectedDataSet, setSelectedDataSet] = useState(props.widget.dataSet);
  const [widgetType, setWidgetType] = useState(props.widget.widgetType);

  useEffect(() => {
    props.clear();
    updateOptions(props.widget.dataSet.value);
    checkTickers();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    checkTickers();
    if(props.widget.widgetType !== widgetType) {
      setTickers(null);
      setDefaultValues(null);
      checkTickers();
    }
    if(props.widget.dataSet !== selectedDataSet) {
      setSelectedDataSet(props.widget.dataSet);
      updateOptions(props.widget.dataSet.value);
    }
    // eslint-disable-next-line
  }, [tickers, props.widget.yType, props.widget.widgetType, props.widget.dataSet]);

  const checkTickers = () => {
    var tempTickers = tickers;
    if(!tickers)  {
      setWidgetType(props.widget.widgetType);
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
      setSelectedTicks(tempDefaultValues);
    }
  }

  const onDataSelectChange = (selectedValues) => {
    setSelectedTicks(selectedValues);
    let updatedTickers = [];
    let tempTickers = {};
    if(selectedValues) {
      selectedValues.forEach((ticker, index) => {
        tempTickers[index] = [ticker.value, ticker.label, ticker.color, ticker.tickerType];
        updatedTickers.push([ticker.value, ticker.label, ticker.color, ticker.tickerType]);
      });
    }
    setTickers(updatedTickers);
    props.setTickers(updatedTickers);
    var tempWidget = JSON.parse(JSON.stringify(props.widget));
    tempWidget.tickers = tempTickers;
    widgetActions.updateChartWidget(props.widgetId, tempWidget, props.view);
  }

  const updateOptions = async (dataSet) => {
    if(dataSet === 'heldTickers') {
      if(!heldTickers) {
        var accounts = await dataActions.getFinancialData("accounts");
        var tempHeldTickers = [];
        await asyncForEach(Object.keys(accounts), async key => {
          var accountObject = OAuthObject[accounts[key].displayName];
          var temp = await accountObject.getFinnhubTickers();
          tempHeldTickers = tempHeldTickers.concat(temp.array);
        })
        setTickerOptions(tempHeldTickers);
        setHeldTickers(tempHeldTickers);
      }
      else setTickerOptions(heldTickers);
      setSelectAll(true);
    }
    else if(dataSet === 'losers' || dataSet === 'gainers') {
      updateTopMovers(dataSet);
      setSelectAll(true);
    }
    else if(dataSet === 'crypto') {
      setTickerOptions(cryptoCurrencies)
      setSelectAll(false);
    }
    else if(dataSet === 'indices') {
      setTickerOptions(indices)
      setSelectAll(false);
    }
    else if(dataSet === 'dji') {
      setTickerOptions(dji)
      setSelectAll(false);
    }
    else if(dataSet === 'nasdaq') {
      setTickerOptions(nasdaq)
      setSelectAll(false);
    }
    else if(dataSet === 'nyse') {
      setTickerOptions(nyse)
      setSelectAll(false);
    }
    else if(dataSet === 'ndx') {
      setTickerOptions(ndx)
      setSelectAll(false);
    }
    else if(dataSet === 'gspc') {
      setTickerOptions(gspc)
      setSelectAll(false);
    }
    else if(dataSet === 'usStocks') {
      setTickerOptions(usStocks)
      setSelectAll(false);
    }
  }
  
  const updateTopMovers = async (dataSet) => {
    let tempTickers = await dataActions.getMovers(dataSet);
    setTickerOptions(tempTickers);
  }

  const onDataSetChange = async (selectedValue) => {
    setSelectedDataSet(selectedValue);
    updateOptions(selectedValue.value);
    var tempWidget = JSON.parse(JSON.stringify(props.widget));
    tempWidget.dataSet = selectedValue;
    widgetActions.updateChartWidget(props.widgetId, tempWidget, props.view);
  } 

  return (
    <GridItem xs={12} sm={12} lg={6} >
      {defaultValues && tickerOptions &&
        <>
          <div className="mt-3 d-flex flex-column">
            <p className={`${s.title}`}>Symbol Sets</p>
            <div className={`${s.inputContainer}`}>
              <Select 
                onSelectChange={onDataSetChange}
                defaultValue={selectedDataSet}
                options={props.widget.units === 'AccountsBalance' ? [dataSets[1]] : dataSets}
                value={selectedDataSet}
              />
            </div>
          </div>
          <div className="d-flex flex-column">
            <p className={`${s.title}`}>Symbols</p>
            <div className={`${s.inputContainer}`}>
              <MultiSelect 
                onSelectChange={onDataSelectChange}
                defaultValues={defaultValues}
                options={tickerOptions}
                value={selectedTicks}
                allowSelectAll={selectAll}
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