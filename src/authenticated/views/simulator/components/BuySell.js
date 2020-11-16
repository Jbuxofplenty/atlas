import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Typography from '@material-ui/core/Typography';

import Widget from 'components/Widget/Widget';
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import TickerSelect from 'components/Select/TickerSelect';
import StockHeader from 'components/StockHeader/StockHeader';
import BuySellToggle from 'components/BuySellToggle/BuySellToggle';
import SharesInput from 'components/SharesInput/SharesInput';
import Button from "components/CustomButtons/Button.js";

import s from '../Simulator.module.scss';

import { widgetActions, dataActions, simulatorActions } from 'actions';
import { numberWithCommas } from 'helpers';
import _ from 'lodash';
import { usStocks } from 'components/MultiSelect/data';


function BuySell(props) {
  const [selectedTicker, setSelectedTicker] = useState(props.widget.selectedTicker);
  const [numShares, setNumShares] = useState(props.widget.numShares ? props.widget.numShares : 1);
  const [submitted, setSubmitted] = useState(false);
  const [transactionType, setTransactionType] = useState('buy');
  const [maxShares, setMaxShares] = useState(100);
  const [toggleTypes, setToggleTypes] = useState(['buy', 'sell']);

  useEffect(() => {
    if(selectedTicker 
        && props.symbolData[selectedTicker.value]
        && !_.isEmpty(props.symbolData[selectedTicker.value].quote)) {
      handleMaxShares(transactionType);
    }
    //eslint-disable-next-line
  }, [props.symbolData]);

  useEffect(() => {
    handleMaxShares(transactionType);
    //eslint-disable-next-line
  }, [props.portfolio.holdings, props.settings.startingBalance]);

  const handleMaxShares = transactionType => {
    if(selectedTicker && props.symbolData[selectedTicker.value]) {
      var buyMaxShares = Math.floor((props.portfolio.buyingPower - props.settings.commission) / props.symbolData[selectedTicker.value].quote.c);
      var sellMaxShares = 0;
      props.portfolio.holdings.forEach(holding => {
        if(holding.symbol === selectedTicker.value) sellMaxShares = holding.quantity;
      })
      var newToggleTypes = [];
      if(buyMaxShares > 0) newToggleTypes.push('buy');
      if(sellMaxShares > 0) newToggleTypes.push('sell');
      if(!newToggleTypes.includes('buy')) {
        transactionType = 'sell'
        setTransactionType('sell');
      }
      if(transactionType === 'buy') {
        if(buyMaxShares < 0) buyMaxShares = 0;
        setMaxShares(buyMaxShares);
      }
      else if(transactionType === 'sell') {
        setMaxShares(sellMaxShares);
      }
      setToggleTypes(newToggleTypes);
    }
  }
  
  const onTickerChange = async (ticker) => {
    setSelectedTicker(ticker);
    if(ticker) {
      props.pullSymbolData(ticker.value);
      var tempWidget = JSON.parse(JSON.stringify(props.widget));
      tempWidget.selectedTicker = ticker;
      tempWidget.numShares = 1;
      props.updateWidget(props.widgetId, tempWidget, props.view);
    }
  }

  const handleOnMouseDown = async (e) => {
    e.stopPropagation();
  }

  const handleSubmit = async () => {
    var transaction = {
      ticker: selectedTicker,
      shares: numShares,
      date: new Date(),
      transactionType,
      price: props.symbolData[selectedTicker.value].quote.c,
      total: props.symbolData[selectedTicker.value].quote.c * numShares + props.settings.commission,
      commission: props.settings.commission,
    }
    props.buySell(transaction);
    var tempWidget = JSON.parse(JSON.stringify(props.widget));
    tempWidget.numShares = 1;
    tempWidget.selectedTicker = selectedTicker;
    props.updateWidget(props.widgetId, tempWidget, props.view);
    setSubmitted(true);
  }

  const handleReset = async () => {
    setTransactionType('buy');
    setNumShares(1);
    handleMaxShares('buy');
    setSubmitted(false);
  }

  const handleBuySell = (buySell) => {
    if(selectedTicker && !_.isEmpty(props.symbolData[selectedTicker.value].quote)) {
      handleMaxShares(buySell);
    }
    setTransactionType(buySell);
  }

  const handleShareChange = (shares) => {
    setNumShares(shares);
  }

  return (
    <Widget 
      className="w-100 align-self-center h-100" 
      collapse
      title={'Buy/Sell'}
      view={props.view}
      widgetId={props.widgetId}
    >
      <div className={`d-flex flex-column justify-content-center w-100`}>
        {!submitted ?
          <>
            <GridContainer justify="center" className={`${s.gridContainer}`}>
              <GridItem lg={12} md={12} xs={12}>
                <TickerSelect 
                  onSelectChange={onTickerChange}
                  options={usStocks}
                  value={selectedTicker}
                  placeholder={'Search for ticker symbols...'}
                />
              </GridItem>
            </GridContainer>
            <GridContainer justify="center" className={`${s.fullContainer}`}>
              {selectedTicker && props.symbolData[selectedTicker.value] ?
                <>
                  <StockHeader
                    name={selectedTicker.label}
                    ticker={selectedTicker.value}
                    profile={props.symbolData[selectedTicker.value].profile} 
                    quote={props.symbolData[selectedTicker.value].quote} 
                  />
                  {props.symbolData[selectedTicker.value].quote.c > 0 && toggleTypes.length > 0 ?
                    <div className="d-flex flex-column w-100">
                      <div className="mb-5 mt-3 align-self-center" >
                        <BuySellToggle transactionType={transactionType} handleBuySell={handleBuySell} toggleTypes={toggleTypes} />
                      </div>
                      <GridContainer justify="center" className={`${s.gridContainer}`}>
                        <GridItem lg={6} md={6} xs={12}>
                          <SharesInput handleShareChange={handleShareChange} max={maxShares} numShares={numShares} />
                        </GridItem>
                        <GridItem lg={6} md={6} xs={12}>
                          <div className={'d-flex flex-column'}>
                            <Typography gutterBottom className="align-self-end">
                              Order Summary
                            </Typography>
                            <div className='d-flex justify-content-between mt-3'>
                              <div>Price per Share: </div>
                              <div className={s.orderSummaryValue}>
                                ${numberWithCommas(props.symbolData[selectedTicker.value].quote.c)}
                              </div>
                            </div>
                            <div className='d-flex justify-content-between mt-3'>
                              <div>Number of Shares: </div>
                              <div className={s.orderSummaryValue}>
                                {numShares}
                              </div>
                            </div>
                            <div className='d-flex justify-content-between mt-3'>
                              <div>Commission: </div>
                              <div className={s.orderSummaryValue}>
                                ${numberWithCommas(props.settings.commission)}
                              </div>
                            </div>
                            <div className='d-flex justify-content-between mt-3'>
                              <div>Total: </div>
                              <div className={s.orderSummaryTotal}>
                                ${numberWithCommas(props.symbolData[selectedTicker.value].quote.c * numShares + props.settings.commission)}
                              </div>
                            </div>
                          </div>
                        </GridItem>
                        <GridContainer justify="center" className={`${s.gridContainer} mt-4`}>
                          <GridItem xs={6} sm={6} md={6} lg={6}
                            className={`${s.instructionContainer}`}
                            onMouseDown={handleOnMouseDown}>
                            <Button 
                              color="primary" 
                              size="lg" 
                              onClick={handleSubmit}
                              fullWidth
                            >
                              Submit Order
                            </Button>
                          </GridItem>
                          <GridItem xs={6} sm={6} md={6} lg={6}
                            className={`${s.instructionContainer}`}
                            onMouseDown={handleOnMouseDown}>
                            <Button 
                              size="lg" 
                              onClick={handleReset}
                              fullWidth
                            >
                              Reset
                            </Button>
                          </GridItem>
                        </GridContainer>
                      </GridContainer>
                    </div>
                    :
                    <GridContainer justify="center" className={`${s.errorPrice} mt-5 w-75`}>
                      <h5 className={`${s.title} text-center`}>
                        {toggleTypes.length === 0 ? 'Cannot buy/sell stock because of you do not have the buying power to purchase this stock and you do not own any shares of this stock!' : 
                          'Cannot make transactions with companies without price data!'}
                      </h5>
                    </GridContainer>
                  }
                </>
                :
                <h5 className={s.title}>No profile data to display...</h5>
              }
            </GridContainer>
          </>
          :
          <GridContainer justify="center" className={`${s.gridContainer}`}>
            <GridItem lg={12} md={12} xs={12}>
              <div className={'d-flex flex-column'}>
                <Typography gutterBottom className="align-self-center">
                  Order Summary
                </Typography>
                <div className='d-flex justify-content-between mt-3'>
                  <div>Price per Share: </div>
                  <div className={s.orderSummaryValue}>
                    ${numberWithCommas(props.symbolData[selectedTicker.value].quote.c)}
                  </div>
                </div>
                <div className='d-flex justify-content-between mt-3'>
                  <div>Number of Shares: </div>
                  <div className={s.orderSummaryValue}>
                    {numShares}
                  </div>
                </div>
                <div className='d-flex justify-content-between mt-3'>
                  <div>Commission: </div>
                  <div className={s.orderSummaryValue}>
                    ${numberWithCommas(props.settings.commission)}
                  </div>
                </div>
                <div className='d-flex justify-content-between mt-3'>
                  <div>Total: </div>
                  <div className={s.orderSummaryTotal}>
                    ${numberWithCommas(props.symbolData[selectedTicker.value].quote.c * numShares + props.settings.commission)}
                  </div>
                </div>
              </div>
            </GridItem>
            <GridItem xs={12} sm={12} md={12} lg={12}
              className={`${s.instructionContainer} mt-5`}
              onMouseDown={handleOnMouseDown}>
              <Button 
                color="primary" 
                size="lg" 
                onClick={handleReset}
              >
                Submit Another Order
              </Button>
            </GridItem>
          </GridContainer>
        }
      </div>
    </Widget>
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
    resetWidgets: () => dispatch(widgetActions.resetWidgets()),
    updateWidget: (key, widget, view) => dispatch(widgetActions.updateWidget(key, widget, view)),
    pullSymbolData: (ticker) => dispatch(dataActions.pullSymbolData(ticker)),
    buySell: (transaction) => dispatch(simulatorActions.buySell(transaction)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(BuySell));
