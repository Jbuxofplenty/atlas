import React, { useState } from "react";
import { connect } from 'react-redux';

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import MaterialUiPhoneNumber from 'components/MuiPhoneNumber';

// material-ui
import Switch from '@material-ui/core/Switch';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';

import s from '../Profile.module.scss';

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

const styles = {
  root: {
    background: "rgba(0, 0, 0, 0.24)",
  },
  input: {
    color: "white"
  }
};


function TwoFactorAuth(props) {
  const [twoFA, setTwoFA] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(props.phoneNumber || "");
  const { classes } = props;

  const handleChange = (event) => {
    setTwoFA(event.target.checked);
  };

  const handlePhoneChange = (value) => {
    setPhoneNumber(value);
  };

  return (
    <div>
      <h3 className={`${s.header} mb-3`}>Two Factor Authentication</h3>
      <div className="d-flex flex-column justify-content-center w-100">
        <div className={`${s.rounded}`}></div>
        <GridContainer justify="center" className={`${s.gridContainer}`}>
          <GridItem xs={12} sm={6} md={9} className={`${s.instructionContainer}`}>
            <div className={`${s.instructionText}`}>
              This feature should definitely be enabled.  It provides an extra
              layer of security to ensure nefarious individuals can't access
              your personal data.
            </div>
          </GridItem>
          <GridItem xs={12} sm={6} md={3} className={`${s.instructionContainer}`}>
            <GreenSwitch
              checked={twoFA}
              onChange={handleChange}
              name="twoFA"
            />
          </GridItem>
        </GridContainer>
        {twoFA &&
          <GridContainer justify="center" className={`mt-5 ${s.gridContainer}`}>
            <GridItem xs={12} sm={6} md={6} className={`${s.instructionContainer}`}>
              <div className={`align-text-center ${s.instructionText}`}>
                Phone Number
              </div>
              <MaterialUiPhoneNumber 
                onlyCountries={['us']}
                defaultCountry={'us'} 
                onChange={handlePhoneChange}
                className={classes.root}
                fullWidth
                InputProps={{
                  className: classes.input
                }}/>
            </GridItem>
          </GridContainer>
        }
      </div>
    </div>
  );
}

function mapStateToProps(store) {
  return {
    email: store.authentication.user.email,
    twoFA: store.authentication.twoFA,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(TwoFactorAuth));
