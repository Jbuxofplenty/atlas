/*eslint-disable*/
import React from "react";
import { useHistory } from "react-router";
// react components for routing our app without refresh
import { Link } from "react-router-dom";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Tooltip from "@material-ui/core/Tooltip";

// @font-awesome/icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';

// core components
import Button from "components/CustomButtons/Button.js";
import LowerCaseButton from "components/CustomButtons/LowerCaseButton.js";

import styles from "assets/jss/material-kit-react/components/headerLinksStyle.js";

const useStyles = makeStyles(styles);

export default function HeaderLinks(props) {
  const classes = useStyles();
  const history = useHistory();
  const login = () => {history.push('/login')};
  const signup = () => {history.push('/signup')};

  return (
    <List className={classes.list}>
      <ListItem className={classes.listItem}>
        <Tooltip
          id="instagram-twitter"
          title="Follow us on twitter"
          placement={window.innerWidth > 959 ? "top" : "left"}
          classes={{ tooltip: classes.tooltip }}
        >
          <Button
            href="https://twitter.com/AtlasOneFinn"
            target="_blank"
            color="transparent"
            className={classes.navLink}
          >
            <FontAwesomeIcon icon={faTwitter} className={classes.socialIcons} style={{cursor: 'pointer'}} />
          </Button>
        </Tooltip>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Tooltip
          id="instagram-facebook"
          title="Follow us on facebook"
          placement={window.innerWidth > 959 ? "top" : "left"}
          classes={{ tooltip: classes.tooltip }}
        >
          <Button
            color="transparent"
            href="https://facebook.com/atlasonefinn"
            target="_blank"
            className={classes.navLink}
          >
            <FontAwesomeIcon icon={faFacebook} className={classes.socialIcons} style={{cursor: 'pointer'}} />
          </Button>
        </Tooltip>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Tooltip
          id="instagram-tooltip"
          title="Follow us on instagram"
          placement={window.innerWidth > 959 ? "top" : "left"}
          classes={{ tooltip: classes.tooltip }}
        >
          <Button
            color="transparent"
            href="https://instagram.com/atlasonefinn"
            target="_blank"
            className={classes.navLink}
          >
            <FontAwesomeIcon icon={faInstagram} className={classes.socialIcons} style={{cursor: 'pointer'}} />
          </Button>
        </Tooltip>
      </ListItem>
      <ListItem className={classes.listItem}>
        <LowerCaseButton
          color="transparent"
          className={classes.socialIcons}
          size="sm"
          onClick={login}
          target="_blank"
          rel="noopener noreferrer"
        >
          Login
        </LowerCaseButton>
      </ListItem>
      <ListItem className={classes.listItem}>
        <LowerCaseButton
            color="transparent"
            variant="outlined"
            className={classes.socialIcons}
            size="sm"
            onClick={signup}
            target="_blank"
            rel="noopener noreferrer"
          >
            Sign Up
          </LowerCaseButton>
        </ListItem>
    </List>
  );
}
