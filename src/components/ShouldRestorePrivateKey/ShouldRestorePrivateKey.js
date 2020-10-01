import React from "react";
import { connect } from 'react-redux';

// core components
import RestoreKey from 'authenticated/views/profile/e2ee/RestoreKey';
import { alertActions } from "actions";

function ShouldRestorePrivateKey(props) {
  return (
    <>
      {props.userData.e2ee && !props.privateKeyPresent
        ? <RestoreKey />
        : props.component
      }
    </>
  );
}

function mapStateToProps(store) {
  return {
    userData: store.user.userData,
    privateKeyPresent: store.eThree.privateKeyPresent,
  };
}

const mapDispatchToProps = (dispatch, history) => {
  return {
    setComponent: (component) => dispatch(alertActions.component(component)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ShouldRestorePrivateKey);
