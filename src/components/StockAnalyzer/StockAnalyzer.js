import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Widget from 'components/Widget/Widget';
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import TickerSelect from 'components/Select/TickerSelect';
import StockHeader from 'components/StockHeader/StockHeader';
import EditableHeader from 'components/EditableHeader/EditableHeader';
import SymbolNews from 'components/SymbolNews/SymbolNews';
import SymbolFinData from 'components/SymbolFinData/SymbolFinData';

import s from './StockAnalyzer.module.scss';

import { widgetActions, dataActions } from 'actions';
import { usStocks } from 'components/MultiSelect/data';


function StockAnalyzer(props) {
  const [selectedTicker, setSelectedTicker] = useState(props.widget.selectedTicker);

  useEffect(() => {
    if(selectedTicker) {
      props.pullSymbolData(selectedTicker.value);
    }
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    //eslint-disable-next-line
  }, [props.symbolData]);
  
  const onTickerChange = async (ticker) => {
    setSelectedTicker(ticker);
    if(ticker) {
      props.pullSymbolData(ticker.value);
      var tempWidget = JSON.parse(JSON.stringify(props.widget));
      tempWidget.selectedTicker = ticker;
      props.updateWidget(props.widgetId, tempWidget, props.view);
    }
  }

  return (
    <Widget 
      className="w-100 align-self-center h-100" 
      collapse
      close
      title={<EditableHeader 
        title={props.widget.name} 
        id={props.widgetId + '-widgetTitle'} 
        widget={props.widget} 
        widgetId={props.widgetId} 
        view={props.view} />
      }
      view={props.view}
      widgetId={props.widgetId}
    >
      <div className={`d-flex flex-column justify-content-center w-100`}>
        <div className={`d-flex justify-content-center w-50 align-self-center`}>
          <GridContainer justify="center" className={`w-100`}>
            <GridItem lg={12} md={12} xs={12}>
              <TickerSelect 
                onSelectChange={onTickerChange}
                options={usStocks}
                value={selectedTicker}
                placeholder={'Search for ticker symbols...'}
              />
            </GridItem>
          </GridContainer>
        </div>
        <GridContainer justify="center" className={`${s.gridContainer}`}>
          {selectedTicker && props.symbolData[selectedTicker.value] ?
            <>
              <StockHeader
                name={selectedTicker.label}
                ticker={selectedTicker.value}
                profile={props.symbolData[selectedTicker.value].profile} 
                quote={props.symbolData[selectedTicker.value].quote} 
              />
            </>
            :
            <h5 className={s.title}>No profile data to display...</h5>
          }
        </GridContainer>
        <GridContainer justify="center" className={`${s.gridContainer} w-100 mt-4`}>
          <GridItem lg={6} md={6} xs={12}>
            {selectedTicker && props.symbolData[selectedTicker.value] 
              && props.symbolData[selectedTicker.value].profile 
              && props.symbolData[selectedTicker.value].financialMetrics &&
              <SymbolFinData 
                ticker={selectedTicker}
                widget={props.widget} 
                widgetId={props.widgetId} 
                view={props.view} />
            }
          </GridItem>
          <GridItem lg={6} md={6} xs={12}>
            <SymbolNews ticker={selectedTicker} />
          </GridItem>
        </GridContainer>
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
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(StockAnalyzer));
