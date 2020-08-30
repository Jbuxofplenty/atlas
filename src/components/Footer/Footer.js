/*eslint-disable*/
import React from "react";
import { useHistory } from "react-router";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// nodejs library that concatenates classes
import classNames from "classnames";
// material-ui core components
import { List, ListItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons
import Favorite from "@material-ui/icons/Favorite";

// core components
import Button from "components/CustomButtons/Button.js";

import styles from "assets/jss/material-kit-react/components/footerStyle.js";

const useStyles = makeStyles(styles);

export default function Footer(props) {
  const classes = useStyles();
  const { whiteFont } = props;
  const footerClasses = classNames({
    [classes.footer]: true,
    [classes.footerWhiteFont]: whiteFont
  });
  const aClasses = classNames({
    [classes.a]: true,
    [classes.footerWhiteFont]: whiteFont
  });
  const history = useHistory();
  const terms = () => {history.push('/terms-and-conditions')};
  const privacy = () => {history.push('/privacy-policy')};
  return (
    <footer className={footerClasses}>
      <div className={classes.container}>
        <div className={classes.left}>
          <List className={classes.list}>
            <ListItem className={classes.inlineBlock}>
              <Button
                onClick={privacy}
                className={classes.block}
                target="_blank"
                simple
                color="transparent"
              >
                Privacy Policy
              </Button>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <Button
                onClick={terms}
                className={classes.block}
                target="_blank"
                simple
                color="transparent"
              >
                Terms and Conditions
              </Button>
            </ListItem>
          </List>
        </div>
        <div className={classes.right}>
          &copy; {1900 + new Date().getYear()} Atlas One Incorporated
        </div>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  whiteFont: PropTypes.bool
};
