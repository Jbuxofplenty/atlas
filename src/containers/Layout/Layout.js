import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route, withRouter, Redirect } from 'react-router';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Hammer from 'rc-hammerjs';
import { isEmpty } from 'lodash';
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
import { openSidebar, closeSidebar } from 'actions/navigation.actions';

import s from './Layout.module.scss';
import { eThreeActions } from "actions";

// Style for app
import 'App.scss';
import 'assets/scss/theme.scss';

const CloseButton = ({closeToast}) => <i onClick={closeToast} className="la la-close notifications-close"/>

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
    this.handleSwipe = this.handleSwipe.bind(this);
    this.home = this.home.bind(this);
  }

  componentDidMount() {
    this.timeout = setTimeout(this.home, 3000);
  }
  
  componentWillUnmount() {
    clearTimeout(this.home);
  }

  async home() {
    if(isEmpty(this.props.user)) {
      this.props.history.replace('/');
    }
    else {
      const hasLocalPrivateKey = await this.props.localKeyPresent();
      if(!hasLocalPrivateKey) {
        toast.error(`You do not have a private key stored locally 
            on your device to decrypt you financial data! You will 
            need to restore your local key with the backup you made.`, {
          onClick: () => this.props.history.push('/app/profile')
        });
      }
    }
  }

  handleSwipe(e) {
    if ('ontouchstart' in window) {
      if (e.direction === 4 && !this.state.chatOpen) {
        this.props.dispatch(openSidebar());
        return;
      }

      if (e.direction === 2 && this.props.sidebarOpened) {
        this.props.dispatch(closeSidebar());
        return;
      }

      this.setState({ chatOpen: e.direction === 2 });
    }
  }

  render() {
    return (
      <div>
        {isEmpty(this.props.user) ? <Loader timeout={true} className="center-screen" /> :
          <div
            className={[
              s.root,
              'sidebar-' + this.props.sidebarPosition,
              'sidebar-' + this.props.sidebarVisibility,
            ].join(' ')}
          >
            <ToastContainer
                autoClose={15000}
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
    user: store.authentication.user,
    sidebarOpened: store.navigation.sidebarOpened,
    sidebarPosition: store.navigation.sidebarPosition,
    sidebarVisibility: store.navigation.sidebarVisibility,
  };
}

const mapDispatchToProps = (dispatch, history) => {
  return {
    localKeyPresent: () => dispatch(eThreeActions.localKeyPresent()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Layout));
