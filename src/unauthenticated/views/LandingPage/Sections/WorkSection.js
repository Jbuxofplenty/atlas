import React, { useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";

import styles from "assets/jss/material-kit-react/views/landingPageSections/workStyle.js";

// API
import { submitIssue } from 'helpers';

const useStyles = makeStyles(styles);

export default function WorkSection(props) {
  const classes = useStyles();
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState("");

  const isInvalid =
      name === '' ||
      email === '' ||
      message === '';

  const emailValid =
      re.test(String(email).toLowerCase()) ||
      email === '';

  const submitMessage = async () => {
    setShowMessage(true);
    setShowSuccess(false);
    if(!emailValid) {
      setIsError(true);
      setError("Email address formatted incorrectly!");
      return;
    }
    var title = email + ': ' + name;
    var success = await submitIssue(title, message, "message", false);
    if(success) {
      setShowMessage(false);
      setShowSuccess(true);
    }
    else {
      setIsError(true);
      setError("Submission of message to the Atlas team failed!");
    }
  }

  return (
    <div className={classes.section}>
      <GridContainer justify="center">
        <GridItem cs={12} sm={12} md={8}>
          <h2 className={classes.title}>Ping Us</h2>
          <h4 className={classes.description}>
          We’ve unofficially soft-launched and are looking for user feedback! 
          Shoot us a quick note below about your thoughts, questions, comments, concerns, or suggestions of new features you’d like to see. 
          We’ll reciprocate the love and get back to you right away.
          </h4>
          <form>
            <GridContainer>
              <GridItem xs={12} sm={12} md={6}>
                <CustomInput
                  labelText="Your Name"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  formControlProps={{
                    fullWidth: true
                  }}
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={6}>
                <CustomInput
                  labelText="Your Email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!emailValid}
                  formControlProps={{
                    fullWidth: true
                  }}
                />
              </GridItem>
              <CustomInput
                labelText="Your Message"
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                formControlProps={{
                  fullWidth: true,
                  className: classes.textArea
                }}
                inputProps={{
                  multiline: true,
                  rows: 5
                }}
              />
              <GridItem xs={12} sm={12} md={4}>
                <Button disabled={isInvalid} color="primary" onClick={submitMessage}>Send Message</Button>
                { showMessage ? isError 
                    ? <div className={classes.errorMessage}>{error}</div> 
                    : <span><i className={`la la-refresh la-spin ${classes.loading}`} /> Loading...</span> 
                    : null 
                }
                { showSuccess 
                    ? <div className={classes.successMessage}>Submitted message successfully!</div> 
                    : null 
                }
              </GridItem>
            </GridContainer>
          </form>
        </GridItem>
      </GridContainer>
    </div>
  );
}
