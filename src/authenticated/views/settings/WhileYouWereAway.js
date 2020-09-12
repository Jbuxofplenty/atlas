import React, { useState } from "react";
import { connect } from 'react-redux';

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

// material-ui
import Switch from '@material-ui/core/Switch';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';

import s from './Settings.module.scss';

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
  const [notifications, setNotifications] = useState(false);

  const handleChange = (event) => {
    setNotifications(event.target.checked);
  };

  return (
    <div>
      <h3 className={`${s.header} mb-3`}>While You Were Away</h3>
      <div className="d-flex flex-column justify-content-center w-100">
        <div className={`${s.rounded}`}></div>
        <GridContainer justify="center" className={`${s.gridContainer}`}>
          <GridItem xs={12} sm={6} md={9} className={`${s.instructionContainer}`}>
            <div className={`${s.instructionText}`}>
              Turning on this notification will notify of all the sweet changes
              we've been making to the app you when you login to your
              dashboard
            </div>
          </GridItem>
          <GridItem xs={12} sm={6} md={3} className={`${s.instructionContainer}`}>
            <GreenSwitch
              checked={notifications}
              onChange={handleChange}
              name="notifications"
            />
          </GridItem>
        </GridContainer>
      </div>
    </div>
  );
}

function mapStateToProps(store) {
  return {
    email: store.authentication.user.email,
    notifications: store.authentication.notifications,
  };
}

export default connect(mapStateToProps)(WhileYouWereAway);
