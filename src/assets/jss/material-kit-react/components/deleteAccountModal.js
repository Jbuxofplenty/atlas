const connectStyle = {
  headerText: {
    textAlign: "center",
    fontSize: '30px',
  },
  cardHidden: {
    opacity: "0",
    transform: "translate3d(0, -60px, 0)"
  },
  cardShown: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  cardFooter: {
    display: "flex",
    flexDirection: "column",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
  },
  message: {
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: '1em',
    marginBottom: "2em",
    fontSize: '14px',
    width: "85%",
  },
  icon: {
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: '60px',
    fill: 'green',
    width: "75%",
  },
  errorMessage: {
    color: 'red',
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: '1em',
    marginBottom: "2em",
    fontSize: '18px',
    width: "75%",
  },
  rounded: {
    borderTop: "2px solid #bbb",
    borderRadius: "5px",
    marginTop: "3em",
    width: "90%",
  },
  accountName: {
    textAlign: 'center',
    fontSize: '18px',
  },
  accountUrl: {
    marginLeft: "1.5em",
  },
  accountTextContainer: {
    justifyContent: 'center',
  },
  avatar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    fontSize: "50px",
    margin: "auto",
    color: "grey",
  },
  imageContainer: {
    display: "flex",
    alignItems: "center",
  },
  accountContainer: {
    display: "flex",
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionContainer: {
    display: "flex",
    justifyContent: 'center',
    alignItems: 'center',
  }
};

export default connectStyle;
