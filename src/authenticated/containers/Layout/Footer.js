import React, { Component } from 'react';
import ExploreIcon from '@material-ui/icons/Explore';
import { userActions, alertActions } from '../../../actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

export class FooterPage extends Component {
  constructor(props) {
    super(props);

    this.state={
      currentDate: new Date(),
    }

    this.home = this.home.bind(this);
    this.terms = this.terms.bind(this);
    this.privacy = this.privacy.bind(this);
    this.contactUs = this.contactUs.bind(this);
  }

  home() {
    this.props.history.push('/home');
  }

  terms() {
    this.props.history.push('/terms-and-conditions');
  }

  privacy() {
    this.props.history.push('/privacy-policy');
  }
  
  contactUs() {
    this.props.history.push('/contact-us');
  }

  render() {
    return (
      <footer className="foot pt-4 my-md-5 pt-md-5 pl-4 border-top bring-to-front">
        <div className="row">
          <div className="col-3 col-md d-flex flex-column justify-content-center">
            <div className="d-flex justify-content-center footer-button">
              <ExploreIcon color="primary" style={{ fontSize: 40, cursor: 'pointer' }} onClick={() => this.home}/>
            </div>
            <small className="d-block mb-3 text-muted d-flex justify-content-center">&copy;</small>
          </div>
          <div className="col-6 col-md">
            <h5 className="text-center" style={{cursor: 'pointer'}} onClick={this.contactUs}>Contact Us</h5>
            <ul className="list-unstyled text-small">
              <li className="text-center"><a className="text-muted" href="https://www.google.com/maps/place/Penland+School+of+Craft/@35.944926,-82.126351,14.47z/data=!4m12!1m6!3m5!1s0x8850a3c27f674e97:0xce3c1e2a5d430de1!2sPenland+School+of+Craft!8m2!3d35.9447029!4d-82.1160677!3m4!1s0x8850a3c27f674e97:0xce3c1e2a5d430de1!8m2!3d35.9447029!4d-82.1160677">Penland School of Craft, NC</a></li>
              <li className="text-center"><a className="text-muted" href="tel:15707808716">+1 (570) 780-8716</a></li>
              <li className="text-center"><a className="text-muted" href="mailto:rateartres@gmail.com">Email: jbuxofplenty@gmail.com</a></li>
            </ul>
          </div>
          <div className="col-6 col-md">
            <h5 className="text-center">About</h5>
            <ul className="list-unstyled text-small">
              <li className="text-center"><button className="text-muted footer-button" style={{cursor: 'pointer'}} onClick={() => this.terms()}>Terms and Conditions</button></li>
              <li className="text-center"><button className="text-muted footer-button" style={{cursor: 'pointer'}} onClick={() => this.privacy()}>Privacy Policy</button></li>
            </ul>
          </div>
        </div>
      </footer>
    )
  }
}

function mapStateToProps(state) {
  const { authentication } = state;
  const { user, userData } = authentication;
  return {
    user,
    userData,
  };
}

const mapDispatchToProps = (dispatch, history) => {
  return {
    errorVisible: (show) => dispatch(alertActions.visible(show)),
    error: (errorMessage) => dispatch(alertActions.error(errorMessage)),
    logout: () => dispatch(userActions.logout()),
    reset: () => dispatch(userActions.reset())
  };
}

const DefaultFooter = connect(mapStateToProps, mapDispatchToProps)(withRouter(FooterPage));
export default DefaultFooter;
