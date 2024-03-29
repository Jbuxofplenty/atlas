import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import DeleteAccountModal from "components/DeleteAccountModal/DeleteAccountModal.js";

// material-ui
import Modal from '@material-ui/core/Modal';

import s from '../Profile.module.scss';
import { eThreeActions, alertActions } from "actions";

function DeleteAccount(props) {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    props.visible(false);
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <div>
          <DeleteAccountModal handleClose={handleClose} />
        </div>
      </Modal>
      <h3 className={`${s.header} mb-3 mt-5`}>Delete Account</h3>
      <div className="d-flex flex-column justify-content-center w-100">
        <div className={`${s.rounded}`}></div>
        <GridContainer justify="center" className={`${s.gridContainer}`}>
          <GridItem xs={12} sm={12} md={6} className={`${s.instructionContainer}`}>
            <div className={`${s.instructionText} text-center text-sm-left`}>
              This action will securely delete all of your information on
              the Atlas One platform.  Note, you will need to create a new
              account if you'd like to continue to use our service.
            </div>
          </GridItem>
          <GridItem xs={12} sm={12} md={6} lg={6} className="my-4">
            <GridContainer justify="center" className={`${s.internalGridContainer}`}>
              <GridItem xs={12} sm={12} md={12} className={`${s.instructionContainer}`}>
                <Button 
                  color="danger" 
                  size="lg" 
                  onClick={() => setOpen(true)}
                >
                  Delete Account
                </Button>
              </GridItem>
              <GridItem xs={12} sm={12} lg={12} className={`mt-3 ${s.instructionContainer}`}>
                { props.alertVisible && props.alertType === "alert-pending" && props.alertComponent === "delete-account" && <i className="fas fa-spinner fa-spin" style={{fontSize: 20}}/> }
                { props.alertVisible && props.alertType === "alert-success" &&  props.alertComponent === "delete-account" && <div className="successMessage">{props.alertMessage}</div> }
                { props.alertVisible && props.alertType === "alert-error" && props.alertComponent === "delete-account" && <div className="errorMessage">{props.alertMessage}</div> }
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
    user: store.user.user,
    alertType: store.alert.type,
    alertMessage: store.alert.message,
    alertVisible: store.alert.visible,
    alertComponent: store.alert.component,
  };
}

const mapDispatchToProps = (dispatch, history) => {
  return {
    deleteAccount: (uid) => dispatch(eThreeActions.deleteAccount(uid)),
    visible: (show) => dispatch(alertActions.visible(show)),
    setComponent: (component) => dispatch(alertActions.component(component)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DeleteAccount);
