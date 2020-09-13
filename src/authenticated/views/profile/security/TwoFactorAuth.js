import React, { useState, useRef, useEffect } from "react";
import { connect } from 'react-redux';

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import MaterialUiPhoneNumber from 'components/MuiPhoneNumber';
import TwoFactorAuthModal from 'components/TwoFactorAuthModal/TwoFactorAuthModal';

// material-ui
import Switch from '@material-ui/core/Switch';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import Modal from '@material-ui/core/Modal';

import { db, auth } from '../../../../firebase';

import s from '../Profile.module.scss';
import { alertActions, userActions } from "actions";

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
  const [twoFA, setTwoFA] = useState(props.userData.twoFactorAuth);
  const [open, setOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(props.userData.phoneNumber);
  const [isError, setIsError] = useState(false);
  const { classes } = props;

  const interval = useRef(null);

  const handleChange = async (event) => {
    props.setComponent('2fa');
    var twoFactorAuth = event.target.checked;
    setTwoFA(twoFactorAuth);
    let userData = props.userData;
    userData.twoFactorAuth = twoFactorAuth;
    if(!twoFactorAuth) {
      db.collection("users").doc(props.uid).update({ twoFactorAuth, phoneNumber: "" });
      setPhoneNumber("");
      userData.phoneNumber = "";
      var options = auth.currentUser.multiFactor.enrolledFactors;
      if(options.length > 0) {
        await auth.currentUser.multiFactor.unenroll(options[0])
        .then(function() {
          props.success("Successfully unenrolled from multi-factor authentication!");
        })
        .catch(e => {
          props.error(e.message);
        });
      }
    }
    else {
      console.log(props.uid)
      db.collection("users").doc(props.uid).update({ twoFactorAuth });
    }
    props.updateUserData(userData);
  };

  const handlePhoneChange = async (value) => {
    await setPhoneNumber(value);
    let userData = props.userData;
    userData.phoneNumber = value;
    props.updateUserData(userData);
    if(value.length === 17) {
      handleOpen(value);
      db.collection("users").doc(props.uid).update({ phoneNumber: value });
    }
  };

  // Modal
  const handleOpen = (number) => {
    if(!number) number = phoneNumber;
    if(open) return;
    var options = auth.currentUser.multiFactor.enrolledFactors;
    if(options.length > 0) return;
    props.visible(false);
    props.setComponent("2fa");
    setIsError(false);
    if(number.length !== 17) {
      setIsError(true);
      props.error("Phone number is not long enough!");
      return;
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const checkEnrolled = () => {
    var user = auth.currentUser;
    if(user) {
      clearInterval(interval.current);
      if(twoFA) {
        var options = auth.currentUser.multiFactor.enrolledFactors;
        if(options.length === 0) {
          props.setComponent('2fa');
          props.error("You have not completed the enrollment process yet! Modify your phone number to enroll again.")
        }
      }
    }
  }

  useEffect(() => {
    interval.current = setInterval(function() {
      checkEnrolled();
    }, 100);
    return () => clearInterval(interval.current);
  // eslint-disable-next-line
  }, []);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <div>
          <TwoFactorAuthModal phoneNumber={phoneNumber} handleClose={handleClose} enroll={true} />
        </div>
      </Modal>
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
                onBlur={() => handleOpen()}
                className={classes.root}
                value={phoneNumber}
                fullWidth
                error={isError}
                InputProps={{
                  className: classes.input
                }}/>
            </GridItem>
          </GridContainer>
        }
        <GridContainer justify="center" className={`mt-5 ${s.gridContainer}`}>
          <GridItem xs={12} sm={12} lg={12} className={`${s.instructionContainer} mt-5`}>
            { props.alertVisible && props.alertType === "alert-pending" && props.alertComponent === "2fa" && <i className="fas fa-spinner fa-spin" style={{fontSize: 20}}/> }
            { props.alertVisible && props.alertType === "alert-success" && props.alertComponent === "2fa" &&  <div className="successMessage">{props.alertMessage}</div> }
            { props.alertVisible && props.alertType === "alert-error" && props.alertComponent === "2fa" && <div className="errorMessage">{props.alertMessage}</div> }
          </GridItem>
        </GridContainer>
      </div>
    </div>
  );
}

function mapStateToProps(store) {
  return {
    uid: store.authentication.user.uid,
    userData: store.authentication.userData,
    alertType: store.alert.type,
    alertMessage: store.alert.message,
    alertVisible: store.alert.visible,
    alertComponent: store.alert.component,
  };
}
const mapDispatchToProps = (dispatch, history) => {
  return {
    updateUserData: (userData) => dispatch(userActions.updateUserData(userData)),
    visible: (show) => dispatch(alertActions.visible(show)),
    success: (message) => dispatch(alertActions.success(message)),
    error: (message) => dispatch(alertActions.error(message)),
    setComponent: (component) => dispatch(alertActions.component(component)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(TwoFactorAuth));
