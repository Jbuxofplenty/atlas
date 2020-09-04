import React, { useState } from "react";
// @material-ui
import { makeStyles } from "@material-ui/core/styles";
import Radio from "@material-ui/core/Radio";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import styles from "assets/jss/material-kit-react/components/submitIssue.js";

// API
import { submitIssue } from 'helpers';

const useStyles = makeStyles(styles);

function SubmitIssue(props) {
  const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
  const [bug, setBug] = React.useState(true);
  setTimeout(function() {
    setCardAnimation("");
  }, 300);

  const classes = useStyles();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState("");

  const isInvalid =
      title === '' ||
      body === '';

  const submitIssueHandle = async () => {
    setShowMessage(true);
    var success = await submitIssue(title, body, bug, false);
    if(success) {
      props.handleClose();
      setShowMessage(false);
    }
    else {
      setIsError(true);
      setError("Submission of issue to the development team failed!");
    }
  }

  const bugFeature = (event) => {
    if(event.target.name === "bug") {
      setBug(true);
    }
    else {
      setBug(false);
    }
  }

  return (
    <div className="submit-issue-modal">
      <GridContainer justify="center">
        <GridItem xs={12}>
          <Card className={classes[cardAnimaton]}>
            <form className={classes.form}>
              <CardHeader color="primary" className={classes.cardHeader}>
                <h4 className={classes.headerText}>Submit a bug or feature request to the development team</h4>
              </CardHeader>
              <CardBody>
                <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Title"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    formControlProps={{
                      fullWidth: true
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <div className={classes.radioContainer}>
                    <div className={classes.radioContainer}>
                      <div className={classes.radioLabel}><Radio checked={bug} name={"bug"} onChange={bugFeature} color="primary"/></div>
                      <div className={classes.radioLabel}>Bug</div>
                    </div>
                    <div className={classes.radioContainer}>
                      <div className={classes.radioLabel}><Radio checked={!bug} name={"feature"} onChange={bugFeature} color="primary"/></div>
                      <div className={classes.radioLabel}>Feature</div>
                    </div>
                  </div>
                </GridItem>
                </GridContainer>
                <CustomInput
                    labelText="Description"
                    id="body"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                  formControlProps={{
                    fullWidth: true,
                    className: classes.textArea
                  }}
                  inputProps={{
                    multiline: true,
                    rows: 5
                  }}
                />
              </CardBody>
              <CardFooter className={classes.cardFooter}>
                <Button disabled={isInvalid} simple color="primary" size="lg" onClick={submitIssueHandle}>
                  Submit Issue
                </Button>
                { showMessage ? isError 
                    ? <div className={classes.message}>{error}</div> 
                    : <span><i className={`la la-refresh la-spin ${classes.message}`} /> Loading...</span> 
                    : null 
                }
              </CardFooter>
            </form>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}

export default SubmitIssue;
