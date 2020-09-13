import React from 'react';
import {
  ButtonGroup,
  Button,
} from 'reactstrap';
import Settings from './Settings';
import Accounts from './Accounts';

import s from './UserDropdown.module.scss';

class UserDropdown extends React.Component {
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

  render() {
    let notificationsTab;

    switch (this.state.notificationsTabSelected) {
      case 1:
        notificationsTab = (<Settings toggle={this.props.toggle} openLogoutModal={this.props.openLogoutModal} />);
        break;
      case 2:
        notificationsTab = (<Accounts toggle={this.props.toggle} />);
        break;
      default:
        notificationsTab = (<Settings toggle={this.props.toggle} />);
        break;
    }
    return (
      <section className={`${s.notifications} navbar-notifications`}>
        <header className={[s.cardHeader, 'card-header'].join(' ')}>
          <ButtonGroup className={s.notificationButtons}>
            <Button outline color="default" size="sm" className={s.notificationButton} onClick={() => this.changeNotificationsTab(1)} active={this.state.notificationsTabSelected === 1}>Settings</Button>
            <Button outline color="default" size="sm" className={s.notificationButton} onClick={() => this.changeNotificationsTab(2)} active={this.state.notificationsTabSelected === 2}>Accounts</Button>
          </ButtonGroup>
        </header>
        {notificationsTab}
      </section>
    );
  }
}

export default UserDropdown;
