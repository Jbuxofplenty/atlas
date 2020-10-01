import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route, withRouter, Redirect } from 'react-router';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Hammer from 'rc-hammerjs';
import { toast, ToastContainer } from 'react-toastify';

import Profile from 'authenticated/views/profile/Profile';
import Settings from 'authenticated/views/settings/Settings';
import Accounts from 'authenticated/views/accounts/Accounts';
import UINotifications from 'authenticated/views/notifications';
import Orders from 'authenticated/views/orders/Orders';
import Charts from 'authenticated/views/charts/Charts';
import Dashboard from 'authenticated/views/dashboard';
import TermsAndConditions from 'views/TermsAndConditions/TermsAndConditions';
import PrivacyPolicy from 'views/PrivacyPolicy/PrivacyPolicy';

import AuthenticatedHeader from '../AuthenticatedHeader/AuthenticatedHeader';
import Footer from '../Footer/Footer';
import Sidebar from '../Sidebar';
import BreadcrumbHistory from 'components/BreadcrumbHistory';
import Loader from 'components/Loader';
import { navigationActions } from 'actions';

import s from './Layout.module.scss';
import { eThreeActions } from "actions";
import { apiBaseUrl, auth } from 'helpers';

// Style for app
import 'App.scss';
import 'assets/scss/theme.scss';

const CloseButton = ({closeToast}) => <i onClick={(e) => {e.stopPropagation(); closeToast(e);}} className="la la-close notifications-close"/>

class Layout extends React.Component {
  static propTypes = {
    sidebarStatic: PropTypes.bool,
    sidebarOpened: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    sidebarStatic: false,
    sidebarOpened: false,
  };

  constructor(props) {
    super(props);
    this.userCheck = this.userCheck.bind(this);
    this.whileYouWereAway = this.whileYouWereAway.bind(this);
  }

  componentDidMount() {
    this.userTimeout = setTimeout(this.userCheck, 5000);
    this.whileYouWereAwayInterval = setInterval(this.whileYouWereAway, 5000);
  }
  
  componentWillUnmount() {
    clearTimeout(this.userTimeout);
    clearInterval(this.whileYouWereAwayInterval);
  }

  whileYouWereAway() {
    let userData = this.props.userData;
    if(userData) {
      let whileYouWereAway = userData.whileYouWereAway;
      var user = auth.currentUser;
      if(whileYouWereAway !== undefined && user) {
        clearInterval(this.whileYouWereAwayInterval);
        const now = new Date();
        const currentTimeUTC = now.getTime();
        const lastLoginAt = new Date(user.metadata.lastSignInTime);
        const lastLoginAtUTC = lastLoginAt.getTime();
        let lastLoggedInDifference = currentTimeUTC - lastLoginAtUTC;
        let oneDayMilli = 86400000;
        let oneMinuteMilli = 60000;
        if(whileYouWereAway.enabled && (lastLoggedInDifference > oneDayMilli || lastLoggedInDifference < oneMinuteMilli)) {
          let uid = auth.currentUser.uid;
          fetch(apiBaseUrl() + 'github/whileYouWereAway/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              uid,
              whileYouWereAway
            })
          })
          .then((response) => response.json())
          .then((responseJson) => {
            if(responseJson.commitMessages.length > 0) {
              toast.info(
                <div className={s.toastContainer}>
                  <strong>While You Were Away!</strong><br/>
                  {this.renderCommits(responseJson.commitMessages)}
                </div>, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 10000
              });
            }
          })
          .catch((e) => {
            toast.error(`While You Were Away\n ${e.message}`, {
              position: toast.POSITION.TOP_CENTER,
              autoClose: 3000
            });
          });
        }
      }
    }
  }

  renderCommits(commits) {
    return commits.map((commitText) => 
      <div key={commitText} className={s.commitItem}>{commitText}</div>
    )
  }

  async userCheck() {
    if(!auth.currentUser) {
      this.props.history.replace('/');
    }
    else {
      if(this.props.userData.e2ee) {
        const hasLocalPrivateKey = await this.props.localKeyPresent();
        if(!hasLocalPrivateKey) {
          toast.error(`You do not have a private key stored locally 
              on your device to decrypt you financial data! You will 
              need to restore your local key with the backup you made.`, {
            onClick: () => this.props.history.push('/app/profile',),
            autoClose: 15000
          });
        }
      }
    }
  }

  render() {
    return (
      <div>
        {!auth.currentUser ? <Loader timeout={true} className="center-screen" /> :
          <div
            className={[
              s.root,
              'sidebar-' + this.props.sidebarPosition,
              'sidebar-' + this.props.sidebarVisibility,
            ].join(' ')}
          >
            <ToastContainer
                hideProgressBar
                closeButton={<CloseButton/>}
                pauseOnHover
                closeOnClick
            />
            <div className={s.wrap}>
              <AuthenticatedHeader />
              <Sidebar />
              <Hammer onSwipe={this.handleSwipe}>
                <main className={s.content}>
                  <BreadcrumbHistory url={this.props.location.pathname} />
                  <TransitionGroup>
                    <CSSTransition
                      key={this.props.location.key}
                      classNames="fade"
                      timeout={200}
                      exit={false}
                      unmountOnExit
                    >
                      <Switch>
                        <Route path="/app" exact render={() => <Redirect to="/app/dashboard" />} />
                        <Route path="/app/dashboard" exact component={Dashboard} />
                        <Route path="/app/profile" exact component={Profile} />
                        <Route path="/app/settings" exact component={Settings} />
                        <Route path="/app/accounts" exact component={Accounts} />
                        <Route path="/app/notifications" exact component={UINotifications} />
                        <Route path="/app/charts" exact component={Charts} />
                        <Route path="/app/orders" exact component={Orders} />
                        <Route path="/app/terms" exact component={TermsAndConditions} />
                        <Route path="/app/privacy" exact component={PrivacyPolicy} />
                        <Redirect to="/404" />
                      </Switch>
                    </CSSTransition>
                  </TransitionGroup>
                </main>
              </Hammer>
            </div>
            <Footer authenticated={true} />
          </div>
        }
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    userData: store.user.userData,
    sidebarOpened: store.navigation.sidebarOpened,
    sidebarPosition: store.navigation.sidebarPosition,
    sidebarVisibility: store.navigation.sidebarVisibility,
  };
}

const mapDispatchToProps = (dispatch, history) => {
  return {
    closeSidebar: () => dispatch(navigationActions.closeSidebar()),
    openSidebar: () => dispatch(navigationActions.openSidebar()),
    localKeyPresent: () => dispatch(eThreeActions.localKeyPresent()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Layout));
