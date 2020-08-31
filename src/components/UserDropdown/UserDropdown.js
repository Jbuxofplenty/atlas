import React from 'react';
import {
  ButtonGroup,
  Button,
} from 'reactstrap';
import classnames from 'classnames';
import Settings from './Settings';
import Accounts from './Accounts';
import NewAccounts from './NewAccounts';

import s from './UserDropdown.module.scss';

class Notifications extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notificationsTabSelected: 1,
      newNotifications: null,
      isLoad: false,
    };
  }

  changeNotificationsTab(tab) {
    this.setState({
      notificationsTabSelected: tab,
      newNotifications: null,
    });
  }

  loadNotifications() {
    this.setState({
      isLoad: true,
    });

    setTimeout(() => {
      this.setState({
        newNotifications: (<NewAccounts />),
        isLoad: false,
      });
    }, 1500);
  }

  render() {
    let notificationsTab;

    switch (this.state.notificationsTabSelected) {
      case 1:
        notificationsTab = (<Accounts />);
        break;
      case 2:
        notificationsTab = (<Settings />);
        break;
      default:
        notificationsTab = (<Accounts />);
        break;
    }
    return (
      <section className={`${s.notifications} navbar-notifications`}>
        <header className={[s.cardHeader, 'card-header'].join(' ')}>
          <ButtonGroup className={s.notificationButtons}>
            <Button outline color="default" size="sm" className={s.notificationButton} onClick={() => this.changeNotificationsTab(1)} active={this.state.notificationsTabSelected === 1}>Accounts</Button>
            <Button outline color="default" size="sm" className={s.notificationButton} onClick={() => this.changeNotificationsTab(2)} active={this.state.notificationsTabSelected === 2}>Settings</Button>
          </ButtonGroup>
        </header>
        {this.state.newNotifications || notificationsTab}
        <footer className={[s.cardFooter, 'text-sm', 'card-footer'].join(' ')}>
          <Button
            color="link"
            className={classnames({ disabled: this.state.isLoad }, s.btnNotificationsReload, 'btn-xs', 'float-right', 'py-0')}
            onClick={() => this.loadNotifications()}
            id="load-notifications-btn"
          >
            {this.state.isLoad ? <span><i className="la la-refresh la-spin" /> Loading...</span> : <i className="la la-refresh" />}
          </Button>
          <span className="fs-mini">Synced at: 21 Apr 2014 18:36</span>
        </footer>
      </section>
    );
  }
}

export default Notifications;
