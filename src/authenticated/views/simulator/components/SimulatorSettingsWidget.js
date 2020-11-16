import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Widget from 'components/Widget/Widget';
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import AuthCustomInput from "components/AuthCustomInput/AuthCustomInput.js";
import Button from "components/CustomButtons/Button.js";

// material-ui
import Switch from '@material-ui/core/Switch';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';

import s from '../Simulator.module.scss';

import { widgetActions, simulatorActions } from 'actions';
import { initialState } from 'reducers/simulator.reducer';

const GreenSwitch = withStyles({
  switchBase: {
    '&$checked': {
      color: green[500],
    },
    '&$checked + $track': {
      backgroundColor: green[500],
    },
  },
  checked: {},
  track: {},
})(Switch);

function SimulatorSettingsWidget(props) {
  const [startingBalance, setStartingBalance] = useState(props.settings.startingBalance);
  const [commission, setCommission] = useState(props.settings.commission);
  const [borrowingFactor, setBorrowingFactor] = useState(props.settings.borrowingFactor);
  const [creditInterestRate, setCreditInterestRate] = useState(props.settings.creditInterestRate);
  const [margin, setMargin] = useState(props.settings.margin);

  useEffect(() => {
    // eslint-disable-next-line
  }, []);

  const setValue = (e) => {
    var value = e.target.value;
    if(e.target.id === 'starting-balance') {
      setStartingBalance(value);
    }
    else if(e.target.id === 'borrowing-factor') {
      setBorrowingFactor(value);
    }
    else if(e.target.id === 'interest-rate') {
      setCreditInterestRate(value);
    }
    else if(e.target.id === 'commission') {
      setCommission(value);
    }
  }

  const handleChange = (e) => {
    e.stopPropagation();
    // var value = e.target.checked;
    // setMargin(value);
  }

  const handleOnMouseDown = async (e) => {
    e.stopPropagation();
  }

  const handleSave = () => {
    let settings = {
      startingBalance: parseFloat(startingBalance),
      commission: parseFloat(commission),
      borrowingFactor: parseFloat(borrowingFactor),
      creditInterestRate: parseFloat(creditInterestRate),
      margin,
    }
    props.updateSimulatorSettings(settings);
  }

  const handleReset = () => {
    setStartingBalance(initialState.settings.startingBalance);
    setCommission(initialState.settings.commission);
    setBorrowingFactor(initialState.settings.borrowingFactor);
    setCreditInterestRate(initialState.settings.creditInterestRate);
    setMargin(initialState.settings.margin);
    props.updateSimulatorSettings(JSON.parse(JSON.stringify(initialState.settings)));
    props.updateSimulatorPortfolio(JSON.parse(JSON.stringify(initialState.portfolio)));
  }


  return (
    <Widget 
      className="w-100 align-self-center h-100" 
      collapse
      close
      title={'Simulator Settings'}
      view={props.view}
      widgetId={props.widgetId}
    >
      <div className={`d-flex justify-content-center w-100`}>
        <GridContainer justify="center" className={`${s.gridContainer}`}>
          <GridItem xs={2} sm={2} md={2} lg={2} className={`${s.instructionContainer}`}>
            <div className={`${s.instructionText}`}>
              Starting Balance:
            </div>
          </GridItem>
          <GridItem xs={4} sm={4} md={4} lg={4} className={`${s.inputContainer}`}>
            <AuthCustomInput
              id="starting-balance"
              labelText=""
              value={startingBalance}
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
          <GridItem xs={2} sm={2} md={2} lg={2} className={`${s.instructionContainer}`}>
            <div className={`${s.instructionText}`}>
              Commission (per trade):
            </div>
          </GridItem>
          <GridItem xs={4} sm={4} md={4} lg={4} className={`${s.inputContainer}`}>
            <AuthCustomInput
              id="commission"
              labelText=""
              value={commission}
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
          <div className={`${s.rounded}`}></div>
          <GridContainer justify="center" className={`${s.gridContainer} ${!margin && 'mb-5'}`}>
            <GridItem xs={6} sm={6} md={6} lg={6} className={`${s.instructionContainer}`}>
              <div className={`${s.instructionText}`}>
                Margin Trading:
              </div>
            </GridItem>
            <GridItem xs={6} sm={6} md={6} lg={6} className={`${s.inputContainer} d-flex justify-content-center`}>
              <GreenSwitch
                checked={margin}
                onChange={handleChange}
                name="margin"
              />
            </GridItem>
          </GridContainer>
          {margin && 
            <>
                <GridItem xs={2} sm={2} md={2} lg={2} className={`${s.instructionContainer}`}>
                  <div className={`${s.instructionText}`}>
                    Borrowing Factor:
                  </div>
                </GridItem>
                <GridItem xs={4} sm={4} md={4} lg={4} className={`${s.inputContainer}`}>
                  <AuthCustomInput
                    id="borrowing-factor"
                    labelText=""
                    value={borrowingFactor}
                    white
                    onChange={setValue}
                    fullWidth
                    type={'number'}
                    inputProps={{
                      color: "secondary",
                    }}
                  />
                </GridItem>
                <GridItem xs={2} sm={2} md={2} lg={2} className={`${s.instructionContainer}`}>
                  <div className={`${s.instructionText}`}>
                  Credit Interest Rate:
                  </div>
                </GridItem>
                <GridItem xs={4} sm={4} md={4} lg={4} className={`${s.inputContainer}`}>
                  <AuthCustomInput
                    id="interest-rate"
                    labelText=""
                    value={creditInterestRate}
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
            </>
          }
          <GridContainer justify="center" className={`${s.gridContainer}`}>
            <GridItem xs={6} sm={6} md={6} lg={6}
              className={`${s.instructionContainer}`}
              onMouseDown={handleOnMouseDown}>
              <Button 
                color="primary" 
                size="lg" 
                onClick={handleSave}
                fullWidth
              >
                Save
              </Button>
            </GridItem>
            <GridItem xs={6} sm={6} md={6} lg={6}
              className={`${s.instructionContainer}`}
              onMouseDown={handleOnMouseDown}>
              <Button 
                color="danger" 
                size="lg" 
                onClick={handleReset}
                fullWidth
              >
                Reset Simulator
              </Button>
            </GridItem>
          </GridContainer>
        </GridContainer>
      </div>
    </Widget>
  );
}

const mapStateToProps = (state) => {
  return {
    settings: state.simulator.settings,
  };
}

const mapDispatchToProps = (dispatch, history) => {
  return {
    updateSimulatorSettings: (settings) => dispatch(simulatorActions.updateSimulatorSettings(settings)),
    updateSimulatorPortfolio: (portfolio) => dispatch(simulatorActions.updateSimulatorPortfolio(portfolio)),
    updateWidget: (key, widget, view) => dispatch(widgetActions.updateWidget(key, widget, view)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SimulatorSettingsWidget));
