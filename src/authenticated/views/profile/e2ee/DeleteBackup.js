import React, { useEffect } from "react";
import { connect } from 'react-redux';

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";

import s from '../Profile.module.scss';
import { eThreeActions, alertActions } from "actions";
import { auth } from 'helpers';

function DeleteBackup(props) {

  const deleteBackup = () => {
    props.setComponent("delete-backup");
    props.deleteBackup(auth.currentUser.uid);
  }

  useEffect(() => {
    props.visible(false);
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <h3 className={`${s.header} mb-3 mt-5`}>Delete Private Key Backup</h3>
      <div className="d-flex flex-column justify-content-center w-100">
        <div className={`${s.rounded}`}></div>
        <GridContainer justify="center" className={`${s.gridContainer}`}>
          <GridItem xs={12} sm={12} md={6} className={`my-2 ${s.instructionContainer}`}>
            <div className={`${s.instructionText}`}>
              Delete your backup private key stored in the cloud.  Be careful,
              if you lose your existing key (from clearing you cookies) you will
              lose access to all of your encrypted financial data on this 
              platform!
            </div>
          </GridItem>
          <GridItem xs={12} sm={12} md={6} lg={6}>
            <GridContainer justify="center" className={`my-2 ${s.internalGridContainer}`}>
              <GridItem xs={12} sm={12} md={12} className={`${s.instructionContainer}`}>
                <Button 
                  color="danger" 
                  size="lg" 
                  onClick={() => deleteBackup()}
                >
                  Delete Backup
                </Button>
              </GridItem>
              <GridItem xs={12} sm={12} lg={12} className={`mt-3 ${s.instructionContainer}`}>
                { props.alertVisible && props.alertType === "alert-pending" && props.alertComponent === "delete-backup" && <i className="fas fa-spinner fa-spin" style={{fontSize: 20}}/> }
                { props.alertVisible && props.alertType === "alert-success" &&  props.alertComponent === "delete-backup" && <div className="successMessage">{props.alertMessage}</div> }
                { props.alertVisible && props.alertType === "alert-error" && props.alertComponent === "delete-backup" && <div className="errorMessage">{props.alertMessage}</div> }
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
    alertType: store.alert.type,
    alertMessage: store.alert.message,
    alertVisible: store.alert.visible,
    alertComponent: store.alert.component,
  };
}

const mapDispatchToProps = (dispatch, history) => {
  return {
    deleteBackup: (uid) => dispatch(eThreeActions.deleteBackup(uid)),
    visible: (show) => dispatch(alertActions.visible(show)),
    setComponent: (component) => dispatch(alertActions.component(component)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DeleteBackup);
