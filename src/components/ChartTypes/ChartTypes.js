import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

// core components
import GridItem from "components/Grid/GridItem.js";
import Select from 'components/Select/Select';
import { chartTypes, chartTypesMap, units, unitsMap, chartUnitsMap } from 'components/Select/data';

import { initialState, defaultAccountsPie, dataSets, defaultCandleStickWidget } from 'reducers/widget.reducer';

import { widgetActions, alertActions } from 'actions';

import s from './ChartTypes.module.scss';

const defaultChartsMap = {
  'candleStick': defaultCandleStickWidget,
  'river': initialState['charts']['3'],
  'line': initialState['charts']['4'],
  'horizontalBar': initialState['charts']['1'],
  'accountsPie': defaultAccountsPie,
}

function ChartTypes(props) {
  const [render, setRender] = useState(true);
  const [selectedType, setSelectedType] = useState(chartTypes[chartTypesMap[props.widget.widgetType]]);
  const [selectedUnits, setSelectedUnits] = useState(units[unitsMap[props.widget.units]]);

  useEffect(() => {
    setRender(true);
  }, [props.widget]);

  const handleOnMouseDown = async (e) => {
    e.stopPropagation();
  }

  const onTypeSelectChange = (selectedValue) => {
    setSelectedType(selectedValue)
    setRender(false);
    var tempWidget = JSON.parse(JSON.stringify(props.widget));
    tempWidget.yType = selectedValue.yType;
    tempWidget.units = selectedValue.units;
    var widgetType = selectedValue.chartType;
    // Insert code to save widget (implement in widgetActions and hook up calculatorwidget too)
    if(widgetType !== tempWidget.widgetType) {
      var newChartWidget = JSON.parse(JSON.stringify(defaultChartsMap[widgetType]));
      newChartWidget.dataGrid.x = tempWidget.dataGrid.x;
      newChartWidget.dataGrid.y = tempWidget.dataGrid.y;
      if(tempWidget.dataGrid.h >= newChartWidget.dataGrid.minH) newChartWidget.dataGrid.h = tempWidget.dataGrid.h;
      newChartWidget.dataGrid.w = tempWidget.dataGrid.w;
      newChartWidget.dataGrid.i = tempWidget.dataGrid.i;
      newChartWidget.height = tempWidget.height;
      widgetActions.updateChartWidget(props.widgetId, newChartWidget, props.view);
    }
    else widgetActions.updateChartWidget(props.widgetId, tempWidget, props.view);
  }

  const onUnitsSelectChange = (selectedValue) => {
    setSelectedUnits(selectedValue)
    var tempWidget = JSON.parse(JSON.stringify(props.widget));
    tempWidget.units = selectedValue.value;
    tempWidget.yType = selectedValue.yType;
    if(selectedValue.value === "AccountsBalance") {
      tempWidget.dataSet = dataSets[1];
    }
    widgetActions.updateChartWidget(props.widgetId, tempWidget, props.view);
  }

  return (
    <GridItem xs={12} sm={12} lg={6} >
      {selectedType && selectedUnits &&
        <div className="d-flex flex-column">
        <div className="mt-3 d-flex flex-column">
          <p className={`${s.title}`}>Type</p>
          <div className={`${s.inputContainer}`} onMouseDown={handleOnMouseDown}>
            <Select 
              onSelectChange={onTypeSelectChange}
              options={chartTypes}
              value={selectedType}
            />
          </div>
        </div>
        {render &&
          <div className="d-flex flex-column">
            <p className={`${s.title}`}>Units</p>
            <div className={`${s.inputContainer}`} onMouseDown={handleOnMouseDown}>
              <Select 
                onSelectChange={onUnitsSelectChange}
                options={chartUnitsMap[props.widget.widgetType]}
                value={selectedUnits}
              />
            </div>
          </div>
        }
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ChartTypes);