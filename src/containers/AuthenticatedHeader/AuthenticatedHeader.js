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
} from 'reactstrap';
import { isEmpty } from 'lodash';

// components
import UserDropdown from 'components/UserDropdown/UserDropdown';
import Notifications from 'components/Notifications/Notifications';
import Logout from "components/Logout/Logout.js";

// material-ui
import Modal from '@material-ui/core/Modal';

import { navigationActions, eThreeActions } from 'actions';

import s from './AuthenticatedHeader.module.scss';
import 'assets/scss/vendors/animate.css/animate.css';
import { auth } from 'helpers';

class AuthenticatedHeader extends React.Component {
  static propTypes = {
    sidebarPosition: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      userDropdownOpen: false,
      logoutModalOpen: false,
    };

    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.toggleUserDropdown = this.toggleUserDropdown.bind(this);
    this.openLogoutModal = this.openLogoutModal.bind(this);
    this.closeLogoutModal = this.closeLogoutModal.bind(this);
  }

  toggleUserDropdown = () => {
    this.setState({
      userDropdownOpen: !this.state.userDropdownOpen,
    });
  }

  toggleSidebar() {
    this.props.isSidebarOpened
      ? this.props.closeSidebar()
      : this.props.openSidebar()
  }

  openLogoutModal() {
    this.setState({ logoutModalOpen: true });
  }

  closeLogoutModal() {
    this.setState({ logoutModalOpen: false });
  }

  render() {
    return (
      <>
        <Modal
          open={this.state.logoutModalOpen}
          onClose={this.closeLogoutModal}
        >
          <div>
            <Logout handleClose={this.closeLogoutModal} />
          </div>
        </Modal>
        <Navbar className={`d-print-none ${s.root}`}>
          <Nav className="ml-md-0 d-flex nav-responsive">
            <Notifications />
            <NavItem className={`${s.divider} text-white`} />
            <Dropdown nav isOpen={this.state.userDropdownOpen} toggle={this.toggleUserDropdown} id="basic-nav-dropdown" className={`${s.notificationsMenu}`} style={{marginRight: 'auto'}}>
              <DropdownToggle nav caret style={{color: "#f4f4f5", padding: 0}}>
                <span className={`small ${s.accountCheck}`}>{auth.currentUser.displayName}</span>
                <span className={`${s.avatar} rounded-circle thumb-sm float-left ml-2 mr-2`}>
                  <img src={!isEmpty(this.props.userData) ? this.props.userData.headshot : ""} alt="..."/>
                </span>
              </DropdownToggle>
              <DropdownMenu right positionFixed className={`${s.notificationsWrapper} py-0 animate__animated animate__faster animate__fadeInUp`}>
                <UserDropdown toggle={this.toggleUserDropdown} openLogoutModal={this.openLogoutModal} />
              </DropdownMenu>
            </Dropdown>
            <NavItem className="d-md-none">
              <NavLink onClick={this.toggleSidebar} className={`${s.navItem} text-white`} href="#">
                <i className="fa fa-bars" />
              </NavLink>
            </NavItem>
          </Nav>
        </Navbar>
      </>
    );
  }
}

function mapStateToProps(store) {
  return {
    isSidebarOpened: store.navigation.sidebarOpened,
    sidebarVisibility: store.navigation.sidebarVisibility,
    sidebarPosition: store.navigation.sidebarPosition,
    userData: store.user.userData,
  };
}

const mapDispatchToProps = (dispatch, history) => {
  return {
    closeSidebar: () => dispatch(navigationActions.closeSidebar()),
    openSidebar: () => dispatch(navigationActions.openSidebar()),
    localKeyPresent: () => dispatch(eThreeActions.localKeyPresent()),
  };
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AuthenticatedHeader));

