import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import {
  Card,
} from 'react-bootstrap';

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import AuthCustomInput from "components/AuthCustomInput/AuthCustomInput.js";

// material-ui
import Button from "components/CustomButtons/Button.js";

import s from './Calculators.module.scss';
import { widgetActions, alertActions } from "actions";

export const compoundInterestCalculator = {
  widgetType: 'compoundInterestCalculator',
  dataGrid: {x: 0, y: 19, w: 4, h: 18, minH: 18, maxW: 6, minW: 4, i: "2"},
  defaultHeight: 18,
  more: false,
  collapsed: false,
  calculatorName: 'Compound Interest Calculator',
  name: 'Compound Interest Calculator',
  currentPrincipal: '',
  annualAddition: '',
  yearsToGrow: '',
  interestRate: '',
  compoundInterestFrequency: '',
  futureValue: 0,
  savedWidgets: {},
};

function CompoundInterestCalculator(props) {
  const [currentPrincipal, setCurrentPrincipal] = useState(props.widget.currentPrincipal);
  const [annualAddition, setAnnualAddition] = useState(props.widget.annualAddition);
  const [yearsToGrow, setYearsToGrow] = useState(props.widget.yearsToGrow);
  const [interestRate, setInterestRate] = useState(props.widget.interestRate);
  const [compoundInterestFrequency, setCompoundInterestFrequency] = useState(props.widget.compoundInterestFrequency);
  const [futureValue, setFutureValue] = useState(props.widget.futureValue);

  const isInvalid = currentPrincipal === ''
      || annualAddition === ''
      || yearsToGrow === ''
      || interestRate === ''
      || compoundInterestFrequency === '';

  const geomSeries = (z, m, n) => {
    var amt;
    if (z === 1.0) amt = n + 1;
    else amt = (Math.pow(z,n + 1) - 1)/(z - 1);
    if (m >= 1) amt -= geomSeries(z,0,m-1);
    return amt;
  }
  
  const calculateCompoundInterest = () => {
    var interestRatePerUnit = parseFloat(interestRate)/100/parseFloat(compoundInterestFrequency);
    var timeUnit = parseFloat(yearsToGrow)*parseFloat(compoundInterestFrequency);
    var z = (1+parseFloat(interestRatePerUnit))**(timeUnit);
    var contributionsPerTimeUnit = parseFloat(annualAddition) / parseFloat(compoundInterestFrequency);
    let calculatedValue = parseFloat(currentPrincipal)*z;
    calculatedValue += contributionsPerTimeUnit * geomSeries(1+interestRatePerUnit, 1, timeUnit);
    setFutureValue(calculatedValue);
    var calculatorWidget = JSON.parse(JSON.stringify(props.widget));
    calculatorWidget.currentPrincipal = currentPrincipal;
    calculatorWidget.annualAddition = annualAddition;
    calculatorWidget.yearsToGrow = yearsToGrow;
    calculatorWidget.interestRate = interestRate;
    calculatorWidget.compoundInterestFrequency = compoundInterestFrequency;
    calculatorWidget.futureValue = calculatedValue;
    props.updateWidget(props.widgetId, calculatorWidget, props.view);
  }

  const setValue = (e) => {
    var value = e.target.value;
    if(e.target.id === 'current-principal') {
      setCurrentPrincipal(value);
    }
    else if(e.target.id === 'annual-addition') {
      setAnnualAddition(value);
    }
    else if(e.target.id === 'years-to-grow') {
      setYearsToGrow(value);
    }
    else if(e.target.id === 'interest-rate') {
      setInterestRate(value);
    }
    else if(e.target.id === 'compound-interest-frequency') {
      setCompoundInterestFrequency(value);
    }
  }
  
  useEffect(() => {
    props.clear();
    // eslint-disable-next-line
  }, []);

  const handleOnClick = (e) => {
    e.stopPropagation();
  }

  return (
    <div className="d-flex flex-column justify-content-center w-100">
      <GridContainer justify="center" className={`${s.gridContainer}`}>
        <GridItem xs={5} sm={5} md={5} lg={5} className={`${s.instructionContainer}`}>
          <div className={`${s.instructionText}`}>
            Current Principal:
          </div>
        </GridItem>
        <GridItem xs={7} sm={7} md={7} lg={7} className={`${s.inputContainer}`}>
          <AuthCustomInput
            id="current-principal"
            labelText=""
            value={currentPrincipal}
            white
            onChange={setValue}
            fullWidth
            money
            type={'number'}
            inputProps={{
              color: "secondary",
            }}
          />
        </GridItem>
      </GridContainer>
      <GridContainer justify="center" className={`${s.gridContainer}`}>
        <GridItem xs={5} sm={5} md={5} lg={5} className={`${s.instructionContainer}`}>
          <div className={`${s.instructionText}`}>
            Annual Addition:
          </div>
        </GridItem>
        <GridItem xs={7} sm={7} md={7} lg={7} className={`${s.inputContainer}`}>
          <AuthCustomInput
            id="annual-addition"
            labelText=""
            value={annualAddition}
            white
            type={'number'}
            onChange={setValue}
            fullWidth
            money
            inputProps={{
              color: "secondary",
            }}
          />
        </GridItem>
      </GridContainer>
      <GridContainer justify="center" className={`${s.gridContainer}`}>
        <GridItem xs={5} sm={5} md={5} lg={5} className={`${s.instructionContainer}`}>
          <div className={`${s.instructionText}`}>
            Years to Grow:
          </div>
        </GridItem>
        <GridItem xs={7} sm={7} md={7} lg={7} className={`${s.inputContainer}`}>
          <AuthCustomInput
            id="years-to-grow"
            labelText=""
            value={yearsToGrow}
            white
            onChange={setValue}
            fullWidth
            type={'number'}
            inputProps={{
              color: "secondary",
            }}
          />
        </GridItem>
      </GridContainer>
      <GridContainer justify="center" className={`${s.gridContainer}`}>
        <GridItem xs={5} sm={5} md={5} lg={5} className={`${s.instructionContainer}`}>
          <div className={`${s.instructionText}`}>
          Interest Rate:
          </div>
        </GridItem>
        <GridItem xs={7} sm={7} md={7} lg={7} className={`${s.inputContainer}`}>
          <AuthCustomInput
            id="interest-rate"
            labelText=""
            value={interestRate}
            white
            onChange={setValue}
            fullWidth
            percent
            type={'number'}
            inputProps={{
              color: "secondary",
            }}
          />
        </GridItem>
      </GridContainer>
      <GridContainer justify="center" className={`${s.gridContainer}`}>
        <GridItem xs={5} sm={5} md={5} lg={5} className={`${s.instructionContainer}`}>
          <div className={`${s.instructionText}`}>
            Times per Year to Compound:
          </div>
        </GridItem>
        <GridItem xs={7} sm={7} md={7} lg={7} className={`${s.inputContainer}`}>
          <AuthCustomInput
            id="compound-interest-frequency"
            labelText=""
            value={compoundInterestFrequency}
            white
            onChange={setValue}
            fullWidth
            type={'number'}
            inputProps={{
              color: "secondary",
            }}
          />
        </GridItem>
      </GridContainer>
      <GridContainer justify="center" className={`${s.buttonContainer}`}>
        <GridItem xs={12} sm={12} md={12} lg={12}
          className={`${s.instructionContainer}`}
          onMouseDown={handleOnClick}>
          <Button 
            color="primary" 
            size="lg" 
            onClick={calculateCompoundInterest}
            fullWidth
            disabled={isInvalid}
          >
            Calculate
          </Button>
        </GridItem>
      </GridContainer>
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} lg={12}>    
          <div className="d-flex flex-row align-items-center justify-content-center"> 
            <Card
              key={1}
              className="my-2 bg-atlas-input text-white w-75"
              onMouseDown={handleOnClick}
            >
              <Card.Body>
                <Card.Text className="d-flex flex-row align-items-center justify-content-center">
                  <span className={`${s.addText} text-white`}>{`Future Value: $${futureValue.toFixed(2)}`}</span>
                </Card.Text>
              </Card.Body>
            </Card>
          </div>
        </GridItem>
      </GridContainer>
    </div>
  );
}

function mapStateToProps(store) {
  return {
    userData: store.user.userData,
  };
}

const mapDispatchToProps = (dispatch, history) => {
  return {
    clear: () => dispatch(alertActions.clear()),
    updateWidget: (key, widget) => dispatch(widgetActions.updateWidget(key, widget, 'dashboard')),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CompoundInterestCalculator);
