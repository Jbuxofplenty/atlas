import React, { useState } from "react";
import { connect } from 'react-redux';

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

// material-ui
import Switch from '@material-ui/core/Switch';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';

import { db, auth } from '../../../firebase';

import s from './Settings.module.scss';
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


function WhileYouWereAway(props) {
  const [enabled, setEnabled] = useState(props.userData.whileYouWereAway.enabled);

  const handleChange = (event) => {
    let enabled = event.target.checked;
    setEnabled(enabled);
    var userData = {};
    Object.assign(userData, props.userData);
    userData.whileYouWereAway.enabled = enabled;
    let whileYouWereAway = userData.whileYouWereAway;
    props.updateUserData(userData);
    db.collection("users").doc(auth.currentUser.uid).update({ whileYouWereAway });
  };

  return (
    <div>
      <h3 className={`${s.header} mb-3`}>While You Were Away</h3>
      <div className="d-flex flex-column justify-content-center w-100">
        <div className={`${s.rounded}`}></div>
        <GridContainer justify="center" className={`${s.gridContainer}`}>
          <GridItem xs={12} sm={6} md={9} className={`${s.instructionContainer}`}>
            <div className={`${s.instructionText}`}>
              Turning on this notification will notify you of all the sweet changes
              we've been making to the app you when you login to your
              dashboard
            </div>
          </GridItem>
          <GridItem xs={12} sm={6} md={3} className={`${s.instructionContainer}`}>
            <GreenSwitch
              checked={enabled}
              onChange={handleChange}
              name="whileYouWereAway"
            />
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
    success: (message) => dispatch(alertActions.success(message)),
    error: (message) => dispatch(alertActions.error(message)),
    setComponent: (component) => dispatch(alertActions.component(component)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(WhileYouWereAway);
