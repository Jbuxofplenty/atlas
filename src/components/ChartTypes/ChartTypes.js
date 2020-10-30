import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

// core components
import GridItem from "components/Grid/GridItem.js";
import Select from 'components/Select/Select';
import { chartTypes, chartTypesMap, units, unitsMap, chartUnitsMap } from 'components/Select/data';

import { initialState } from 'reducers/widget.reducer';

import { widgetActions, alertActions } from 'actions';

import s from './ChartTypes.module.scss';

const defaultChartsMap = {
  'candleStick': initialState['dashboard']['2'],
  'river': initialState['charts']['3'],
  'line': initialState['charts']['4'],
  'horizontalBar': initialState['charts']['1'],
}

function ChartTypes(props) {
  const [render, setRender] = useState(true);

  useEffect(() => {
    setRender(true);
  }, [props.widget]);

  const handleOnMouseDown = async (e) => {
    e.stopPropagation();
  }

  const onTypeSelectChange = (selectedValue) => {
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
      newChartWidget.dataGrid.h = tempWidget.dataGrid.h;
      newChartWidget.dataGrid.w = tempWidget.dataGrid.w;
      newChartWidget.dataGrid.i = tempWidget.dataGrid.i;
      widgetActions.updateChartWidget(props.widgetId, newChartWidget, props.view);
    }
    else widgetActions.updateChartWidget(props.widgetId, tempWidget, props.view);
  }

  const onUnitsSelectChange = (selectedValue) => {
    var tempWidget = JSON.parse(JSON.stringify(props.widget));
    tempWidget.units = selectedValue.value;
    tempWidget.yType = selectedValue.yType;
    widgetActions.updateChartWidget(props.widgetId, tempWidget, props.view);
  }

  return (
    <GridItem xs={12} sm={12} lg={6} >
      <div className="d-flex flex-column">
        <div className="mt-3 d-flex flex-column">
          <p className={`${s.title}`}>Type</p>
          <div className={`${s.inputContainer}`} onMouseDown={handleOnMouseDown}>
            <Select 
              onSelectChange={onTypeSelectChange}
              defaultValue={chartTypes[chartTypesMap[props.widget.widgetType]]}
              options={chartTypes}
            />
          </div>
        </div>
        {render &&
          <div className="d-flex flex-column">
            <p className={`${s.title}`}>Units</p>
            <div className={`${s.inputContainer}`} onMouseDown={handleOnMouseDown}>
              <Select 
                onSelectChange={onUnitsSelectChange}
                defaultValue={units[unitsMap[props.widget.units]]}
                options={chartUnitsMap[props.widget.widgetType]}
              />
            </div>
          </div>
        }
      </div>
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