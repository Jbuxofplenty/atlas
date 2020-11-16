import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import GridItem from "components/Grid/GridItem.js";
import _ from 'lodash';
import { numberWithCommas } from 'helpers';

import s from './StockHeader.module.scss';

import { widgetActions } from 'actions';


function StockHeader(props) {
  return (
    <div className="w-100 d-flex justify-content-between align-items-center mt-3">
      <GridItem lg={9} md={9} xs={12} className="d-flex flex-column align-items-center">
        <GridItem lg={12} md={12} xs={12} className="d-flex align-items-center">
          <div className={s.profileTitle}>{props.name}</div>
          <div className={`${s.ticker} ml-3`}>({props.ticker})</div>
        </GridItem>
        {!_.isEmpty(props.profile) &&
          <GridItem lg={12} md={12} xs={12}>
            <div className={s.subTitle}>{props.profile.exchange}</div>
          </GridItem>
        }
        {!_.isEmpty(props.quote) &&
          <GridItem lg={12} md={12} xs={12} className="d-flex align-items-center">
            <div className={s.price}>${numberWithCommas(props.quote.c)}</div>
            <div className={`${s.percent} ${props.quote.percentChange < 0 ? 'errorMessage' : 'successMessage'} ml-3`}>
              ({numberWithCommas(props.quote.percentChange)}%)
            </div>
          </GridItem>
        }
      </GridItem>
      {!_.isEmpty(props.profile) && props.profile.logo !== "" &&
        <GridItem lg={3} md={3} xs={12} className="d-flex align-items-center justify-content-end">
          <img src={props.profile.logo} alt="Logo" className={s.logo} />
        </GridItem>
      }
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    widgets: state.widget,
  };
}

const mapDispatchToProps = (dispatch, history) => {
  return {
    resetWidgets: () => dispatch(widgetActions.resetWidgets()),
    updateWidget: (key, widget, view) => dispatch(widgetActions.updateWidget(key, widget, view)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(StockHeader));
