import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

// material-ui
import Switch from '@material-ui/core/Switch';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';

import { db, auth } from '../../../../firebase';

import s from '../Profile.module.scss';
import { 
  alertActions, 
  userActions, 
  eThreeActions,
} from "actions";

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


function EnableE2EE(props) {
  const [e2eeEnabled, setE2EE] = useState(props.userData.e2ee);

  useEffect(() => {
    props.clear();
    // eslint-disable-next-line
  }, []);

  const handleChange = async (event) => {
    props.clear();
    props.setComponent('e2ee');
    var e2ee = event.target.checked;
    // Enabled
    if(e2ee) {
      await props.registerNewUser();
      await props.convertE2EE(true);
    }
    else {
      var hasLocalPrivateKey = await props.localKeyPresent();
      if(!hasLocalPrivateKey) {
        props.error("You do not have your private key stored locally on your machine! Please restore it before performing this action so you don't lose all of your financial data");
        return;
      }
      await props.convertE2EE(false);
      let eThreeUnregistered = await eThreeActions.unregister();
      if(!eThreeUnregistered) {
        props.error("Unable to unregister your EThree account!")
      }
    }
    setE2EE(e2ee);
    db.collection("users").doc(auth.currentUser.uid).update({ e2ee });

    // Update redux store after all operations have been performed
    var userData = {};
    Object.assign(userData, props.userData);
    userData.e2ee = e2ee;
    props.updateUserData(userData);
  };

  return (
    <div>
      <h3 className={`${s.header} mb-3`}>E2EE</h3>
      <div className="d-flex flex-column justify-content-center w-100">
        <div className={`${s.rounded}`}></div>
        <GridContainer justify="center" className={`${s.gridContainer}`}>
          <GridItem xs={10} sm={9} md={9} className={`${s.instructionContainer}`}>
            <div className={`${s.instructionText}`}>
              Enabling this feature encrypts all of your financial data
              as defined in the end-to-end encryption paradigm.  The
              private key to decrypt all of your financial data resides 
              on your devices alone.
            </div>
          </GridItem>
          <GridItem xs={2} sm={3} md={3} className={`${s.instructionContainer}`}>
            <GreenSwitch
              checked={e2eeEnabled}
              onChange={handleChange}
              name="e2ee"
            />
          </GridItem>
        </GridContainer>
        <GridContainer justify="center" className={`mt-5 ${s.gridContainer}`}>
          <GridItem xs={12} sm={12} lg={12} className={`${s.instructionContainer} mb-5`}>
            { props.alertVisible && props.alertType === "alert-pending" && props.alertComponent === "e2ee" && <i className="fas fa-spinner fa-spin" style={{fontSize: 20}}/> }
            { props.alertVisible && props.alertType === "alert-success" && props.alertComponent === "e2ee" &&  <div className="successMessage">{props.alertMessage}</div> }
            { props.alertVisible && props.alertType === "alert-error" && props.alertComponent === "e2ee" && <div className="errorMessage">{props.alertMessage}</div> }
          </GridItem>
        </GridContainer>
      </div>
    </div>
  );
}

function mapStateToProps(store) {
  return {
    userData: store.user.userData,
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
    clear: () => dispatch(alertActions.clear()),
    success: (message) => dispatch(alertActions.success(message)),
    error: (message) => dispatch(alertActions.error(message)),
    setComponent: (component) => dispatch(alertActions.component(component)),
    registerNewUser: () => dispatch(eThreeActions.registerNewUser()),
    convertE2EE: (nextE2EE) => dispatch(eThreeActions.convertE2EE(nextE2EE)),
    localKeyPresent: () => dispatch(eThreeActions.localKeyPresent()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(EnableE2EE));
