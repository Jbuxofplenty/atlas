import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Widget from 'components/Widget/Widget';
import GridContainer from "components/Grid/GridContainer.js";
import HoldingsTable from './HoldingsTable';

import s from '../Simulator.module.scss';

import { widgetActions } from 'actions';


function PortfolioWidget(props) {

  useEffect(() => {
    var height = document.getElementById('holdings-table-container').clientHeight;
    var addedMinHeight = Math.round(height / 40);
    var tempWidget = JSON.parse(JSON.stringify(props.widget));
    if(tempWidget.defaultMinH + addedMinHeight !== tempWidget.dataGrid.minH) {
      tempWidget.dataGrid.minH = tempWidget.defaultMinH + addedMinHeight
      widgetActions.updateWidget(props.widgetId, tempWidget, props.view);
    }
    // eslint-disable-next-line
  }, [props.widget]);
  
  return (
    <Widget 
      className="w-100 align-self-center h-100" 
      collapse
      title={'Portfolio'}
      view={props.view}
      widgetId={props.widgetId}
    >
      <div className={`d-flex justify-content-center w-100`}>
        <GridContainer justify="center" className={`${s.gridContainer}`}>
          <div id="holdings-table-container" className="w-100">
            <HoldingsTable holdings={props.portfolio.holdings} />
          </div>
        </GridContainer>
      </div>
    </Widget>
  );
}

const mapStateToProps = (state) => {
  return {
    portfolio: state.simulator.portfolio,
  };
}

const mapDispatchToProps = (dispatch, history) => {
  return {
    resetWidgets: () => dispatch(widgetActions.resetWidgets()),
    updateWidget: (key, widget, view) => dispatch(widgetActions.updateWidget(key, widget, view)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PortfolioWidget));
