import React, { useState } from "react";
import { connect } from 'react-redux';
import { db } from "../../../../firebase";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import AuthCustomInput from "components/AuthCustomInput/AuthCustomInput.js";

import s from '../Profile.module.scss';
import { userActions } from "actions";

function PersonalInformation(props) {
  const [firstName, setFirstName] = useState(props.firstName);
  const [lastName, setLastName] = useState(props.lastName);

  const updateNames = () => {
    db.collection("users").doc(props.uid).update({ firstName, lastName });
    var userData = {};
    Object.assign(userData, props.userData);
    userData["firstName"] = firstName;
    userData["lastName"] = lastName;
    props.updateUserData(userData);
  }

  return (
    <div>
      <h3 className={`${s.header} mb-3 mt-5`}>Personal Information</h3>
      <div className="d-flex flex-column justify-content-center w-100">
        <div className={`${s.rounded}`}></div>
        <GridContainer justify="center" className={`${s.gridContainer}`}>
          <GridItem xs={12} sm={12} md={6}>
            <AuthCustomInput
              id="first-name"
              labelText="First Name"
              value={firstName}
              white
              onBlur={() => updateNames()}
              onChange={(e) => setFirstName(e.target.value)}
              fullWidth
              inputProps={{
                color: "secondary",
              }}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={6}>
            <AuthCustomInput
              id="last-name"
              labelText="Last Name"
              value={lastName}
              white
              onBlur={() => updateNames()}
              onChange={(e) => setLastName(e.target.value)}
              fullWidth
              inputProps={{
                color: "secondary",
              }}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={6}>
            <AuthCustomInput
              id="email"
              labelText="Email"
              value={props.email}
              disabled
              fullWidth
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
    uid: store.authentication.user.uid,
    userData: store.authentication.userData,
    firstName: store.authentication.userData.firstName,
    lastName: store.authentication.userData.lastName,
  };
}

const mapDispatchToProps = (dispatch, history) => {
  return {
    updateUserData: (userData) => dispatch(userActions.updateUserData(userData)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonalInformation);
