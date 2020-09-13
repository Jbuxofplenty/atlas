import React, { useEffect } from "react";
import { connect } from 'react-redux';

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

// material-ui
import Button from "components/CustomButtons/Button.js";

import s from '../Profile.module.scss';
import { eThreeActions, alertActions } from "actions";

function RotateKey(props) {
  const rotateKey = () => {
    props.setComponent("rotate-key");
    props.rotateKey(props.uid);
  }

  useEffect(() => {
    if(props.alertType === "alert-success") {
      props.newKeyGenerated();
    }
    // eslint-disable-next-line
  }, [props.alertType]);

  useEffect(() => {
    props.visible(false);
    props.clear();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <h3 className={`${s.header} mb-3`}>Generate New Private Key</h3>
      <div className="d-flex flex-column justify-content-center w-100">
        <div className={`${s.rounded}`}></div>
        <GridContainer justify="center" className={`${s.gridContainer}`}>
          <GridItem xs={12} sm={12}  md={6} lg={5} className={`${s.instructionContainer}`}>
            <div className={`${s.instructionText}`}>
              Unfortunately, you do not have a private key stored on this 
              device or a backup of the private key in the cloud.  You
              will need to generate a new private key and all of your
              financial data will be reset.  Backup your new private
              key as soon as it's generated and store the password
              you use to backup the key in a safe place.
            </div>
          </GridItem>
          <GridItem xs={12} sm={12} md={6} lg={7}>
            <GridContainer justify="center" className={`${s.gridContainer}`}>
              <GridItem xs={12} sm={12} lg={12} className={`${s.instructionContainer}`}>
                <Button 
                  color="primary" 
                  size="lg" 
                  className="mb-lg-3 ml-lg-5"
                  onClick={()=> rotateKey()}
                >
                  Generate new private key
                </Button>
              </GridItem>
              <GridItem xs={12} sm={12} lg={12} className={`${s.instructionContainer}`}>
                { props.alertVisible && props.alertType === "alert-pending" && props.alertComponent === "rotate-key" && <i className="fas fa-spinner fa-spin" style={{fontSize: 20}}/> }
                { props.alertVisible && props.alertType === "alert-success" &&  props.alertComponent === "rotate-key" && <div className="successMessage">{props.alertMessage}</div> }
                { props.alertVisible && props.alertType === "alert-error" && props.alertComponent === "rotate-key" && <div className="errorMessage">{props.alertMessage}</div> }
              </GridItem>
            </GridContainer>
          </GridItem>
        </GridContainer>
      </div>
    </div>
  );
}

function mapStateToProps(store) {
  return {
    uid: store.authentication.user.uid,
    alertType: store.alert.type,
    alertMessage: store.alert.message,
    alertVisible: store.alert.visible,
    alertComponent: store.alert.component,
  };
}

const mapDispatchToProps = (dispatch, history) => {
  return {
    rotateKey: (uid) => dispatch(eThreeActions.rotateKey(uid)),
    visible: (show) => dispatch(alertActions.visible(show)),
    clear: () => dispatch(alertActions.clear()),
    setComponent: (component) => dispatch(alertActions.component(component)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RotateKey);
