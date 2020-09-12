import React, { useState } from "react";
import { connect } from 'react-redux';

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import AuthCustomInput from "components/AuthCustomInput/AuthCustomInput.js";

// material-ui
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Button from "components/CustomButtons/Button.js";

import s from '../Profile.module.scss';

function BackupKey(props) {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  return (
    <div>
      <h3 className={`${s.header} mb-3`}>Backup Private Key</h3>
      <div className="d-flex flex-column justify-content-center w-100">
        <div className={`${s.rounded}`}></div>
        <GridContainer justify="center" className={`${s.gridContainer}`}>
          <GridItem xs={12} sm={12}  md={6} lg={5} className={`${s.instructionContainer}`}>
            <div className={`${s.instructionText}`}>
              Because this framework uses end-to-end encryption, it places
              a larger burden on the user to manage encryption keys.
              Generating a backup password for your private key is critical
              because the key is located on your personal device. If you clear
              your cache before making a backup password for your key, all
              your encrypted financial data will need to be pulled from the
              origin servers again.
            </div>
          </GridItem>
          <GridItem xs={12} sm={12} md={6} lg={5}>
            <AuthCustomInput
              id="backup-password"
              labelText="Backup Password"
              value={password}
              white
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              inputProps={{
                color: "secondary",
                type: showPassword ? 'text' : 'password',
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      color="secondary"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </GridItem>
          <GridItem xs={12} sm={12} lg={2} className={`${s.instructionContainer}`}>
            <Button 
              color="primary" 
              size="lg" 
              className="mb-lg-3 ml-lg-5"
            >
              Backup key
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

export default connect(mapStateToProps)(BackupKey);
