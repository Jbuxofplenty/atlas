import { container, primaryColor } from "assets/jss/material-kit-react.js";

const footerStyle = {
  block: {
    color: "inherit",
    padding: "0.9375rem",
    fontWeight: "500",
    fontSize: "12px",
    textTransform: "uppercase",
    borderRadius: "3px",
    textDecoration: "none",
    position: "relative",
    display: "block"
  },
  left: {
    float: "left!important",
    display: "block"
  },
  right: {
    padding: "15px 0",
    margin: "0",
    float: "right!important"
  },
  footer: {
    textAlign: "center",
    zIndex: "100",
    position: "relative",
    width: "100vw",
  },
  a: {
    color: primaryColor,
    textDecoration: "none",
    backgroundColor: "transparent"
  },
  footerWhiteFont: {
    "&,&:hover,&:focus": {
      color: "#FFFFFF"
    }
  },
  container,
  list: {
    marginBottom: "0",
    padding: "0",
    marginTop: "0"
  },
  inlineBlock: {
    display: "inline-block",
    padding: "0px",
    width: "auto",
    marginRight: "2em",
    marginLeft: "2em"
  },
  center: {
    display: "block",
    textAlign: "center",
    margin: "auto",
    marginTop: "1em",
    marginBottom: "1em"
  },
  icon: {
    width: "18px",
    height: "18px",
    position: "relative",
    top: "3px"
  },
  gridContainer: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%'
  },
  footerContainer: {
    width: '95%'
  }
};
export default footerStyle;
