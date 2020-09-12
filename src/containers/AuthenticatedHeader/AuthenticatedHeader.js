import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import {
  Navbar,
  Nav,
  NavItem,
  NavLink,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Badge,
} from 'reactstrap';
import UserDropdown from 'components/UserDropdown/UserDropdown';
import { openSidebar, closeSidebar, changeSidebarPosition, changeSidebarVisibility } from 'actions/navigation.actions';

import s from './AuthenticatedHeader.module.scss';
import 'assets/scss/vendors/animate.css/animate.css';

class AuthenticatedHeader extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    sidebarPosition: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.doLogout = this.doLogout.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.toggleMessagesDropdown = this.toggleMessagesDropdown.bind(this);
    this.toggleSupportDropdown = this.toggleSupportDropdown.bind(this);
    this.toggleSettingsDropdown = this.toggleSettingsDropdown.bind(this);
    this.toggleAccountDropdown = this.toggleAccountDropdown.bind(this);
    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.toggleSearchOpen = this.toggleSearchOpen.bind(this);

    this.state = {
      visible: true,
      messagesOpen: false,
      supportOpen: false,
      settingsOpen: false,
      searchFocused: false,
      searchOpen: false,
      notificationsOpen: false
    };
  }

  toggleUserDropdown = () => {
    this.setState({
      notificationsOpen: !this.state.notificationsOpen,
    });
  }

  onDismiss() {
    this.setState({ visible: false });
  }

  doLogout() {
  }

  toggleMessagesDropdown() {
    this.setState({
      messagesOpen: !this.state.messagesOpen,
    });
  }

  toggleSupportDropdown() {
    this.setState({
      supportOpen: !this.state.supportOpen,
    });
  }

  toggleSettingsDropdown() {
    this.setState({
      settingsOpen: !this.state.settingsOpen,
    });
  }

  toggleAccountDropdown() {
    this.setState({
      accountOpen: !this.state.accountOpen,
    });
  }

  toggleSearchOpen() {
    this.setState({
      searchOpen: !this.state.searchOpen,
    });
  }

  toggleSidebar() {
    this.props.isSidebarOpened
      ? this.props.dispatch(closeSidebar())
      : this.props.dispatch(openSidebar())
  }

  moveSidebar(position) {
    this.props.dispatch(changeSidebarPosition(position));
  }

  toggleVisibilitySidebar(visibility) {
    this.props.dispatch(changeSidebarVisibility(visibility));
  }

  render() {
    return (
      <Navbar className={`d-print-none ${s.root}`}>
        <Nav className="ml-md-0 d-flex nav-responsive">
          <Dropdown nav isOpen={this.state.supportOpen} toggle={this.toggleSupportDropdown}>
            <DropdownToggle nav className={`${s.navItem} text-white`}>
              <i className="fa fa-bell" />
              <span className={s.count}>1</span>
            </DropdownToggle>
            <DropdownMenu right className={`${s.dropdownMenu} ${s.support}`}>
              <DropdownItem onClick={() => this.props.history.push('/app/profile')}>
                <Badge color="danger"><i className="fa fa-bell-o" /></Badge>
                <div className={s.details}>
                  Backup your private key!
                </div>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <NavItem className={`${s.divider} text-white`} />
          <Dropdown nav isOpen={this.state.notificationsOpen} toggle={this.toggleUserDropdown} id="basic-nav-dropdown" className={`${s.notificationsMenu}`} style={{marginRight: 'auto'}}>
            <DropdownToggle nav caret style={{color: "#f4f4f5", padding: 0}}>
              <span className={`small ${s.accountCheck}`}>{this.props.displayName}</span>
              <span className={`${s.avatar} rounded-circle thumb-sm float-left ml-2 mr-2`}>
                <img src={this.props.photoURL} alt="..."/>
              </span>
            </DropdownToggle>
            <DropdownMenu right className={`${s.notificationsWrapper} py-0 animate__animated animate__faster animate__fadeInUp`}>
              <UserDropdown toggle={this.toggleUserDropdown} />
            </DropdownMenu>
          </Dropdown>
          <NavItem className="d-md-none">
            <NavLink onClick={this.toggleSidebar} className={`${s.navItem} text-white`} href="#">
              <i className="fa fa-bars" />
            </NavLink>
          </NavItem>
        </Nav>
      </Navbar>
    );
  }
}

function mapStateToProps(store) {
  return {
    isSidebarOpened: store.navigation.sidebarOpened,
    sidebarVisibility: store.navigation.sidebarVisibility,
    sidebarPosition: store.navigation.sidebarPosition,
    photoURL: store.authentication.user.photoURL,
    displayName: store.authentication.user.displayName,
  };
}

export default withRouter(connect(mapStateToProps)(AuthenticatedHeader));

