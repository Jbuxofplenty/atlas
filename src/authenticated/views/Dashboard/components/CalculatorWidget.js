import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Widget from 'components/Widget/Widget';
import EditableHeader from 'components/EditableHeader/EditableHeader';
import CompoundInterestCalculator from "components/Calculators/CompoundInterestCalculator";
import LoanInterestCalculator from "components/Calculators/LoanInterestCalculator";
import { compoundInterestCalculator } from "components/Calculators/CompoundInterestCalculator";
import { loanInterestCalculator } from "components/Calculators/LoanInterestCalculator";
import Select from 'components/Select/Select';

import { calculatorTypes, calculatorTypesMap } from 'components/Select/data';

import { userActions, alertActions, widgetActions } from "actions";

import s from '../Dashboard.module.scss';

const moreSize = 4;

const defaultCalculatorsMap = {
  'compoundInterestCalculator': compoundInterestCalculator,
  'loanInterestCalculator': loanInterestCalculator,
}

function CalculatorWidget(props) {
  const [more, setMore] = useState(false);
  const [calculatorType, setCalculatorType] = useState(calculatorTypes[calculatorTypesMap[props.widget.calculatorName]]);
  
  useEffect(() => {
    props.clear();
    var calculatorWidget = JSON.parse(JSON.stringify(props.widget));
    if(calculatorWidget.more) {
      calculatorWidget.dataGrid.h = calculatorWidget.defaultHeight;
      calculatorWidget.more = false;
    }
    props.updateWidget(props.widgetId, calculatorWidget, props.view);
    // eslint-disable-next-line
  }, []);

  const onTypeSelectChange = (selectedValue) => {
    setCalculatorType(selectedValue);
    var calculatorWidget = JSON.parse(JSON.stringify(props.widget));
    var widgetType = selectedValue.value;
    var newCalculatorWidget = JSON.parse(JSON.stringify(defaultCalculatorsMap[widgetType]));
    newCalculatorWidget.dataGrid.x = calculatorWidget.dataGrid.x;
    newCalculatorWidget.dataGrid.y = calculatorWidget.dataGrid.y;
    newCalculatorWidget.dataGrid.h = newCalculatorWidget.defaultHeight + moreSize;
    newCalculatorWidget.more = true;
    props.updateWidget(props.widgetId, newCalculatorWidget, props.view);
  }

  const handleMore = async () => {
    await setMore(!more);
    var calculatorWidget = JSON.parse(JSON.stringify(props.widget));
    if(more) {
      calculatorWidget.dataGrid.h = calculatorWidget.defaultHeight;
      calculatorWidget.more = false;
    }
    else{
      calculatorWidget.dataGrid.h += moreSize;
      calculatorWidget.more = true;
    }
    props.updateWidget(props.widgetId, calculatorWidget, props.view);
  }

  const handleOnMouseDown = async (e) => {
    e.stopPropagation();
  }

  return (
    <Widget 
      className="w-100 align-self-center h-100" 
      close 
      collapse
      title={<EditableHeader 
        title={props.widget.name} 
        id={props.widgetId + '-widgetTitle'} 
        widget={props.widget} 
        widgetId={props.widgetId} 
        view={props.view}/>
      }
      view={props.view}
      widgetId={props.widgetId}
    >
      {props.widget.widgetType === 'compoundInterestCalculator' && <CompoundInterestCalculator widget={props.widget} widgetId={props.widgetId} view={props.view} />}
      {props.widget.widgetType === 'loanInterestCalculator' && <LoanInterestCalculator widget={props.widget} widgetId={props.widgetId} view={props.view} />}
      { more &&
        <div className="d-flex justify-content-center">
          <GridContainer id="more" justify="center" className={`${s.gridContainer}`}>
            <GridItem xs={12} sm={12} lg={12} className={`mt-4 ${s.instructionContainer}`} >
              <h5 className={`${s.settingsTitle}`}>Settings</h5>
            </GridItem>
            <GridItem xs={12} sm={12} lg={12} >
              <div className="mt-3 d-flex flex-column">
                <p className={`${s.title}`}>Type</p>
                <div className={`${s.inputContainer}`} onMouseDown={handleOnMouseDown}>
                  <Select 
                    onSelectChange={onTypeSelectChange}
                    value={calculatorType}
                    options={calculatorTypes}
                  />
                </div>
              </div>
            </GridItem>
          </GridContainer>
        </div>
      }
      <div className="d-flex flex-column justify-content-center w-100 sticky-bottom">
        <div className={`halfCircle d-flex flex-column justify-content-center align-items-center`} onClick={handleMore} onMouseDown={handleOnMouseDown}>
          {more ? <i className={`la la-angle-up mt-1`} style={{ fontSize: "2vw" }}/> : <i className={`la la-angle-down mt-1`} style={{ fontSize: "2em" }} /> } 
        </div>
      </div>
    </Widget>
  );
}

function mapStateToProps(store) {
  return {
    userData: store.user.userData,
    firstName: store.user.userData.firstName,
    lastName: store.user.userData.lastName,
    alertType: store.alert.type,
    alertMessage: store.alert.message,
    alertVisible: store.alert.visible,
    alertComponent: store.alert.component,
  };
}

const mapDispatchToProps = (dispatch, history) => {
  return {
    updateUserData: (userData) => dispatch(userActions.updateUserData(userData)),
    sendVerificationEmail: () => dispatch(userActions.sendVerificationEmail()),
    setComponent: (component) => dispatch(alertActions.component(component)),
    clear: () => dispatch(alertActions.clear()),
    updateWidget: (key, widget) => dispatch(widgetActions.updateWidget(key, widget, 'dashboard')),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CalculatorWidget);
