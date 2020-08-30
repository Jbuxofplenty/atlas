import React, { Component } from "react";
import { connect } from 'react-redux';
import { userActions } from 'actions';
import ReCAPTCHA from "react-google-recaptcha";

class ReCaptchaPage extends Component {
  onChange = value => {
    console.log(value)
    this.props.testReCaptcha(value, this.props.signUp);
  }

  onExpired = () => {
    this.props.reCaptchaUpdate(false, this.props.signUp);
  }

  render() {
    if (!this.props.show) return false;
    return (
      <div>
        <div className={"reCaptchaHolder"}>
          <div className="mt-3 mb-3 d-flex justify-content-center">
            <ReCAPTCHA
              sitekey="6LebX8UZAAAAALvXtDQ5obj2A8AXvS2AzB1S_iRe"
              onChange={this.onChange}
              onExpired={this.onExpired}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    signUp: state.authentication.signUp,
  };
}

const mapDispatchToProps = (dispatch, history) => {
  return {
    testReCaptcha: (value, signUp) => dispatch(userActions.testReCaptcha(value, signUp)),
    reCaptchaUpdate: (value, signUp) => dispatch(userActions.reCaptchaUpdate(value, signUp)),
  };
}

const ReCaptcha = connect(mapStateToProps, mapDispatchToProps)(ReCaptchaPage);
export default ReCaptcha;
