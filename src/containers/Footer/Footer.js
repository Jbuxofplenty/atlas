/*eslint-disable*/
import React from "react";
import { useHistory } from "react-router";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// material-ui core components
import { makeStyles } from "@material-ui/core/styles";
import Modal from '@material-ui/core/Modal';

// core components
import Button from "components/CustomButtons/Button.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import LowerCaseButton from "components/CustomButtons/LowerCaseButton.js";
import SubmitIssue from "components/SubmitIssue/SubmitIssue.js";

import styles from "assets/jss/material-kit-react/components/footerStyle.js";

const useStyles = makeStyles(styles);

export default function Footer(props) {
  const classes = useStyles();

  // Modal
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Navigation
  const history = useHistory();
  const terms = () => {
    if(!props.authenticated) {
      history.push('/terms-and-conditions')
    }
    else {
      history.push('/app/terms');
    }
  };
  const privacy = () => {
    if(!props.authenticated) {
      history.push('/privacy-policy')
    }
    else {
      history.push('/app/privacy');
    }
  };

  return (
    <footer>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <div>
          <SubmitIssue handleClose={handleClose} />
        </div>
      </Modal>
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={4}>
           <div className={classes.center}>
            <Button
              onClick={privacy}
              className={classes.inlineBlock}
              target="_blank"
              simple
              color="transparent"
            >
              Privacy Policy
            </Button>
            <Button
              onClick={terms}
              className={classes.inlineBlock}
              target="_blank"
              simple
              color="transparent"
            >
              Terms and Conditions
            </Button>
          </div>
        </GridItem>
        { props.authenticated ?
          <GridItem xs={12} sm={12} md={4}>
            <div className={classes.center}>
              <i className="fa fa-bug"/>
              <LowerCaseButton
                onClick={handleOpen}
                className={classes.inlineBlock}
                target="_blank"
                simple
                color="transparent"
              >
                Submit a bug or feature request
              </LowerCaseButton>
            </div>
          </GridItem> :
          <GridItem xs={12} sm={12} md={4}/>
        }
        <GridItem xs={12} sm={12} md={4}>
          <div className={classes.center}>
            &copy; {1900 + new Date().getYear()} Atlas One Incorporated
          </div>
        </GridItem>
      </GridContainer>
    </footer>
  );
}

Footer.propTypes = {
  whiteFont: PropTypes.bool
};
