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
import { numberWithCommas } from 'helpers';

export const loanInterestCalculator = {
  widgetType: 'loanInterestCalculator',
  dataGrid: {x: 0, y: 19, w: 4, h: 17, minH: 17, maxW: 6, minW: 4, i: "2"},
  defaultHeight: 17,
  more: false,
  collapsed: false,
  calculatorName: 'Loan Interest Calculator',
  name: 'Loan Interest Calculator',
  loanAmount: '',
  loanTerm: '',
  interestRate: '',
  totalInterest: 0,
  monthlyPayments: 0,
  savedWidgets: {},
};



function LoanInterestCalculator(props) {
  const [loanAmount, setLoanAmount] = useState(props.widget.loanAmount);
  const [loanTerm, setLoanTerm] = useState(props.widget.loanTerm);
  const [interestRate, setInterestRate] = useState(props.widget.interestRate);
  const [totalInterest, setTotalInterest] = useState(props.widget.totalInterest);
  const [monthlyPayments, setMonthlyPayments] = useState(props.widget.monthlyPayments);

  const isInvalid = loanAmount === ''
      || loanTerm === ''
      || interestRate === ''
      || totalInterest === '';
      
  
  const calculateCompoundInterest = () => {
    // payment = principle * monthly interest/(1 - (1/(1+MonthlyInterest)*Months))
    var interestRatePerUnit = parseFloat(interestRate)/100/12;
    var timeUnit = parseFloat(loanTerm)*12;
    var z = interestRatePerUnit / (1 - (1/(1+interestRatePerUnit))**timeUnit);
    let calculatedValue = parseFloat(loanAmount)*z;
    setMonthlyPayments(calculatedValue);
    setTotalInterest(calculatedValue*timeUnit - parseFloat(loanAmount));
    var calculatorWidget = JSON.parse(JSON.stringify(props.widget));
    calculatorWidget.loanAmount = loanAmount;
    calculatorWidget.loanTerm = loanTerm;
    calculatorWidget.interestRate = interestRate;
    calculatorWidget.totalInterest = calculatedValue*timeUnit - parseFloat(loanAmount);
    calculatorWidget.monthlyPayments = calculatedValue;
    props.updateWidget(props.widgetId, calculatorWidget, props.view);
  }

  const setValue = (e) => {
    var value = e.target.value;
    if(e.target.id === 'loan-amount') {
      setLoanAmount(value);
    }
    else if(e.target.id === 'loan-term') {
      setLoanTerm(value);
    }
    else if(e.target.id === 'interest-rate') {
      setInterestRate(value);
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
            Loan Amount:
          </div>
        </GridItem>
        <GridItem xs={7} sm={7} md={7} lg={7} className={`${s.inputContainer}`}>
          <AuthCustomInput
            id="loan-amount"
            labelText=""
            value={loanAmount}
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
            Loan Term (years):
          </div>
        </GridItem>
        <GridItem xs={7} sm={7} md={7} lg={7} className={`${s.inputContainer}`}>
          <AuthCustomInput
            id="loan-term"
            labelText=""
            value={loanTerm}
            white
            type={'number'}
            onChange={setValue}
            fullWidth
            inputProps={{
              color: "secondary",
            }}
          />
        </GridItem>
      </GridContainer>
      <GridContainer justify="center" className={`${s.gridContainer}`}>
        <GridItem xs={5} sm={5} md={5} lg={5} className={`${s.instructionContainer}`}>
          <div className={`${s.instructionText}`}>
          Interest Rate (APY):
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
                  <span className={`${s.addText} text-white`}>{`Monthly Payments: $${numberWithCommas(monthlyPayments)}`}</span>
                </Card.Text>
              </Card.Body>
            </Card>
          </div>
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
                  <span className={`${s.addText} text-white`}>{`Total Interest: $${numberWithCommas(totalInterest)}`}</span>
                </Card.Text>
              </Card.Body>
            </Card>
          </div>
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
                  <span className={`${s.addText} text-white`}>
                    {`Total Paid: $${isNaN(parseFloat(loanAmount)+parseFloat(totalInterest)) ? '0.00' : numberWithCommas(parseFloat(loanAmount)+parseFloat(totalInterest))}`}
                  </span>
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

export default connect(mapStateToProps, mapDispatchToProps)(LoanInterestCalculator);
