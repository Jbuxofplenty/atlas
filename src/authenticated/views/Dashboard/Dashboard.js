import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Responsive, WidthProvider } from 'react-grid-layout';
import _ from 'lodash';

import AddWidget from 'components/AddWidget/AddWidget';
import AccountsWidget from './components/AccountsWidget';
import ChartWidget from './components/ChartWidget';
import StockAnalyzer from 'components/StockAnalyzer/StockAnalyzer';
import CalculatorWidget from './components/CalculatorWidget';

import { isTouchDevice } from 'helpers';
import { widgetActions } from 'actions';

import s from './Dashboard.module.scss';

const strComponentMap = {
  'customize': AddWidget,
  'accountSummary': AccountsWidget,
  'candleStick': ChartWidget,
  'river': ChartWidget,
  'accountsPie': ChartWidget,
  'horizontalBar': ChartWidget,
  'line': ChartWidget,
  'compoundInterestCalculator': CalculatorWidget,
  'loanInterestCalculator': CalculatorWidget,
  'stockAnalyzer': StockAnalyzer,
}

const GridLayout = WidthProvider(Responsive);

function Dashboard(props) {
  const [gridWidth, setGridWidth] = useState(null);
  const [layout, setLayout] = useState(null);
  const [layouts, setLayouts] = useState(null);
  const breakpoints = {lg: 1000, md: 750, sm: 500, xs: 300, xxs: 0};

  useEffect(() => {
    buildLayout(props.widgets)
    var tempGridWidth = document.getElementById('dashboardContainer').clientWidth;
    setGridWidth(tempGridWidth);
    return function cleanup() {
      widgetActions.saveFirebaseWidgets('dashboard');
    };
    // eslint-disable-next-line
  }, []);

  const buildLayout = (widgets) => {
    if(widgets && !_.isEmpty(widgets)) {
      var newLayout = [];
      Object.keys(widgets).forEach(key => {
        newLayout.push(widgets[key].dataGrid);
      })
      var newLayouts = {};
      Object.keys(breakpoints).forEach(key => {
        newLayouts[key] = newLayout;
        return;
      })
      setLayout(newLayout);
      setLayouts(newLayouts);
    }
  }

  useEffect(() => {
    buildLayout(props.widgets)
    // eslint-disable-next-line
  }, [props.widgets]);

  const widgetResizeStop = async (layout, oldItem, newItem, placeholder, e, element) => {
    var height = document.getElementById(newItem.i).clientHeight;
    var widgetTitleElement = document.getElementById(newItem.i+'-widgetTitle');
    var timeScaleElement = document.getElementById(newItem.i+'-timeScale');
      layout.forEach(data => {
        var widget = JSON.parse(JSON.stringify(props.widgets[data.i]));
        widget.dataGrid.x = data.x;
        widget.dataGrid.y = data.y;
        widget.dataGrid.w = data.w;
        widget.dataGrid.h = data.h;
        if(widgetTitleElement && timeScaleElement) {
          if(data.i === newItem.i) {
            var widgetTitleHeight = widgetTitleElement.clientHeight;
            var timeScaleHeight = timeScaleElement.clientHeight;
            widget.height = height-widgetTitleHeight-100-timeScaleHeight;
          }
        }
        props.updateWidget(data.i, widget);
      })
  }

  const widgetDragStop = (layout, oldItem, newItem, placeholder, e, element) => {
    layout.forEach(data => {
      var widget = JSON.parse(JSON.stringify(props.widgets[data.i]));
      widget.dataGrid.x = data.x;
      widget.dataGrid.y = data.y;
      widget.dataGrid.w = data.w;
      widget.dataGrid.h = data.h;
      props.updateWidget(data.i, widget);
    })
  }

  const renderWidgets = () => {
    return Object.keys(props.widgets).map(key => {
      const widgetObject = JSON.parse(JSON.stringify(props.widgets[key]));
      const ComponentInMap = strComponentMap[widgetObject.widgetType];
      return (
        <div key={key} data-grid={widgetObject.dataGrid} id={key} >
          <ComponentInMap widget={widgetObject} widgetId={key} view={'dashboard'} />
        </div>
      )
    })
  }

  return (
    <div id="dashboardContainer" className={s.root}>
      {gridWidth && props.widgets && layout &&
        <>
          <h1 className="page-title">Dashboard &nbsp;</h1>
          <GridLayout 
              isDraggable={!isTouchDevice()}
              isResizable={!isTouchDevice()}
              className="w-100"
              rowHeight={30} 
              width={gridWidth}
              onResizeStop={widgetResizeStop}
              onDragStop={widgetDragStop}
              layout={layout}
              layouts={layouts}
              breakpoints={breakpoints}
              cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}}>
            {renderWidgets()}
          </GridLayout>
        </>
      }
    </div>
  );
}

const mapStateToProps = (store) => {
  return {
    widgets: store.widget.dashboard,
    stockData: store.data.stockData,
  };
}

const mapDispatchToProps = (dispatch, history) => {
  return {
    resetWidgets: () => dispatch(widgetActions.resetWidgets()),
    updateWidgets: (widgets) => dispatch(widgetActions.updateWidgets(widgets, 'dashboard')),
    updateWidget: (key, widget) => dispatch(widgetActions.updateWidget(key, widget, 'dashboard')),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);