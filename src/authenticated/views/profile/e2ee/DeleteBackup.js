import React from "react";
import { connect } from 'react-redux';

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";

import s from '../Profile.module.scss';

function DeleteBackup(props) {

  return (
    <div>
      <h3 className={`${s.header} mb-3 mt-5`}>Delete Private Key Backup</h3>
      <div className="d-flex flex-column justify-content-center w-100">
        <div className={`${s.rounded}`}></div>
        <GridContainer justify="center" className={`${s.gridContainer}`}>
          <GridItem xs={12} sm={12} md={6} className={`${s.instructionContainer}`}>
            <div className={`${s.instructionText}`}>
              Delete your backup private key stored in the cloud.  Be careful,
              if you lose your existing key (from clearing you cache) you will
              lose access to all of your encrypted financial data on this 
              platform!
            </div>
          </GridItem>
          <GridItem xs={12} sm={12} md={6} className={`${s.instructionContainer}`}>
            <Button 
              color="danger" 
              size="lg" 
            >
              Delete Backup
            </Button>
          </GridItem>
        </GridContainer>
      </div>
    </div>
  );
}

function mapStateToProps(store) {
  return {
    email: store.authentication.user.email,
  };
}

export default connect(mapStateToProps)(DeleteBackup);
