import React, { useState } from 'react';
import { connect } from 'react-redux';

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CircleButton from "components/CircleButton/CircleButton.js";

import s from './TimeScale.module.scss';

import { widgetActions } from 'actions';

 function TimeScale(props) {
  const [selected, setSelected] = useState(props.widget.timeScale);

  const handleChange = (name) => {
    setSelected(name);
    props.handleChange(name);
  }

  return (
    <div id={props.id} className="d-flex justify-content-center align-items-center w-100">
      <GridContainer justify="center" className={`${s.gridContainer}`}>
        <GridItem xs={2} sm={2} md={2} lg={2} className={`${s.circleContainer}`}>
          <CircleButton name={'1D'} handleChange={handleChange} selected={selected === '1D'}/>
        </GridItem>
        <GridItem xs={2} sm={2} md={2} lg={2} className={`${s.circleContainer}`}>
          <CircleButton name={'1W'} handleChange={handleChange} selected={selected === '1W'}/>
        </GridItem>
        <GridItem xs={2} sm={2} md={2} lg={2} className={`${s.circleContainer}`}>
          <CircleButton name={'1M'} handleChange={handleChange} selected={selected === '1M'}/>
        </GridItem>
        <GridItem xs={2} sm={2} md={2} lg={2} className={`${s.circleContainer}`}>
          <CircleButton name={'6M'} handleChange={handleChange} selected={selected === '6M'}/>
        </GridItem>
        <GridItem xs={2} sm={2} md={2} lg={2} className={`${s.circleContainer}`}>
          <CircleButton name={'YTD'} handleChange={handleChange} selected={selected === 'YTD'}/>
        </GridItem>
        <GridItem xs={2} sm={2} md={2} lg={2} className={`${s.circleContainer}`}>
          <CircleButton name={'1Y'} handleChange={handleChange} selected={selected === '1Y'}/>
        </GridItem>
      </GridContainer>
    </div>
  )
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
    updateWidget: (key, widget, view) => dispatch(widgetActions.updateWidget(key, widget, view)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TimeScale);