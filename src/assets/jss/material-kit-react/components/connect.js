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
    fontSize: '18px',
    width: "75%",
    color: "grey"
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
    fontWeight: "600",
    fontSize: '25px',
    marginLeft: "0.5em",
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
    height: "33px",
    width: "33px",
    fontWeight: "600",
    fontSize: "18px",
    margin: "auto",
  },
  imageContainer: {
    display: "flex",
    alignItems: "center",
  },
  accountContainer: {
    display: "flex",
  }
};

export default connectStyle;
