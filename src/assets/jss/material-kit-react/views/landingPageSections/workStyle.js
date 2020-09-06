import { title } from "assets/jss/material-kit-react.js";

const workStyle = {
  section: {
    padding: "70px 0"
  },
  title: {
    ...title,
    marginBottom: "50px",
    marginTop: "30px",
    minHeight: "32px",
    textDecoration: "none",
    textAlign: "center"
  },
  description: {
    color: "#999",
    textAlign: "center"
  },
  textCenter: {
    textAlign: "center"
  },
  textArea: {
    marginRight: "15px",
    marginLeft: "15px"
  },
  errorMessage: {
    color: "red",
    marginTop: '1em'
  },
  successMessage: {
    color: "green",
    marginTop: '1em'
  },
  loading: {
    color: "grey",
    marginTop: '1em'
  }
};

export default workStyle;
