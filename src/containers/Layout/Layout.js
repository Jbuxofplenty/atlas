import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route, withRouter, Redirect } from 'react-router';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Hammer from 'rc-hammerjs';

import Profile from 'authenticated/views/profile/Profile';
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
import { openSidebar, closeSidebar } from 'actions/navigation.actions';
import s from './Layout.module.scss';

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
      <div
        className={[
          s.root,
          'sidebar-' + this.props.sidebarPosition,
          'sidebar-' + this.props.sidebarVisibility,
        ].join(' ')}
      >
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
                >
                  <Switch>
                    <Route path="/app" exact render={() => <Redirect to="/app/dashboard" />} />
                    <Route path="/app/dashboard" exact component={Dashboard} />
                    <Route path="/app/profile" exact component={Profile} />
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
    );
  }
}

function mapStateToProps(store) {
  return {
    sidebarOpened: store.navigation.sidebarOpened,
    sidebarPosition: store.navigation.sidebarPosition,
    sidebarVisibility: store.navigation.sidebarVisibility,
  };
}

export default withRouter(connect(mapStateToProps)(Layout));
