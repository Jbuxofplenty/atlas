import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';
import { userActions } from 'actions';
import ReCAPTCHA from "react-google-recaptcha";
// nodejs library to set properties for components
import PropTypes from "prop-types";

const siteKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY;

const ReCaptchaPage = (props) => {
  const [show, setShow] = useState(props.show);

  const onChange = value => {
    props.testReCaptcha(value, props.signUp);
  }

  const onExpired = () => {
    props.reCaptchaUpdate(false, props.signUp);
  }

  const componentClasses = ['recaptcha'];
  if (show) { componentClasses.push('show'); }

  useEffect(() => {
    setShow(props.show);
  }, [props.show]);

  return (
    <div className={componentClasses.join(' ')}>
      <div className="my-3 d-flex justify-content-center w-100">
        <ReCAPTCHA
          sitekey="6LebX8UZAAAAALvXtDQ5obj2A8AXvS2AzB1S_iRe"
          onChange={onChange}
          onExpired={onExpired}
          size={props.size}
        />
      </div>
    </div>
  );
}

ReCaptchaPage.propTypes = {
  show: PropTypes.bool.isRequired,
  signUp: PropTypes.bool.isRequired
}

const mapStateToProps = (state) => {
  return {
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    testReCaptcha: (value, signUp) => dispatch(userActions.testReCaptcha(value, signUp)),
    reCaptchaUpdate: (value, signUp) => dispatch(userActions.reCaptchaUpdate(value, signUp)),
  };
}

const ReCaptcha = connect(mapStateToProps, mapDispatchToProps)(ReCaptchaPage);
export default ReCaptcha;
