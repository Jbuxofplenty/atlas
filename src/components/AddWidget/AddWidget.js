import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  Card,
} from 'react-bootstrap';

import Widget from 'components/Widget/Widget';
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import s from './AddWidget.module.scss';

import { widgetActions } from 'actions';
import { initialState } from 'reducers/widget.reducer';
import { generateRandomId } from 'helpers';


function AddWidget(props) {
  const [accountSummaryVisible, setAccountSummaryVisible] = useState(null);

  useEffect(() => {
  var isVisible = false;
  Object.keys(props.widgets).forEach(key => {
    if(props.widgets[key].widgetType === 'accountSummary') {
      isVisible = true;
    }
  })
  setAccountSummaryVisible(isVisible);
    // eslint-disable-next-line
  }, [props.widgets]);

  const addChart = async () => {
    let xy = widgetActions.getOpenSlot(initialState['dashboard']['2'].dataGrid.w, initialState['dashboard']['2'].dataGrid.h, props.view);
    var key = generateRandomId();
    var newChart = JSON.parse(JSON.stringify(initialState['dashboard']['2']));
    newChart.dataGrid.x = xy.x;
    newChart.dataGrid.y = xy.y;
    newChart.dataGrid.i = key;
    props.updateCandleStickWidget(key, newChart, props.view);
  }

  const addAccountWidget = async () => {
    let xy = widgetActions.getOpenSlot(initialState['dashboard']['1'].dataGrid.w, initialState['dashboard']['1'].dataGrid.h, props.view);
    var key = generateRandomId();
    var accountSummaryWidget = {
      widgetType: 'accountSummary',
      dataGrid: {x: xy.x, y: xy.y, w: 6, h: 6, minW: 5, minH: 6, i: key},
      collapsed: false,
    }
    props.updateWidget(key, accountSummaryWidget, props.view);
  }

  return (
    <Widget 
      className="w-100 align-self-center h-100" 
      collapse
      title={'Customize'}
      view={props.view}
      widgetId={props.widgetId}
    >
      <GridContainer justify="center" className={`${s.gridContainer} w-100`}>
        <GridItem xs={12} sm={12} lg={12}>      
          <Card
            key={1}
            className="my-2 bg-atlas-input text-white clickable"
            onClick={addChart}
          >
            <Card.Body>
              <Card.Text className="d-flex flex-row align-items-center justify-content-center">
                <i className={`${s.addWidgetIcon} text-white fa fa-plus`}/>
                <span className={`${s.addText} text-white`}>Add Chart</span>
              </Card.Text>
            </Card.Body>
          </Card>
        </GridItem>
        {!accountSummaryVisible &&
          <GridItem xs={12} sm={12} lg={12} >          
            <Card
              key={2}
              className="my-2 bg-atlas-input text-white clickable"
              onClick={addAccountWidget}
            >
              <Card.Body>
                <Card.Text className="d-flex flex-row align-items-center justify-content-center">
                  <i className={`${s.addWidgetIcon} text-white fa fa-plus`}/>
                  <span className={`${s.addText} text-white`}>Add Account Summary</span>
                </Card.Text>
              </Card.Body>
            </Card>
          </GridItem>
        }
      </GridContainer>
    </Widget>
  );
}

const mapStateToProps = (state) => {
  return {
    widgets: state.widget.dashboard,
  };
}

const mapDispatchToProps = (dispatch, history) => {
  return {
    resetWidgets: () => dispatch(widgetActions.resetWidgets()),
    updateWidgets: (widgets) => dispatch(widgetActions.updateWidgets(widgets, 'dashboard')),
    updateWidget: (key, widget) => dispatch(widgetActions.updateWidget(key, widget, 'dashboard')),
    updateCandleStickWidget: (key, widget) => dispatch(widgetActions.updateCandleStickWidget(key, widget, 'dashboard')),
    getFirebaseWidgets: () => dispatch(widgetActions.getFirebaseWidgets('dashboard')),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddWidget));
