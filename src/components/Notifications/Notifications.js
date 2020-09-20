import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Badge,
} from 'reactstrap';

import s from './Notifications.module.scss';
import 'assets/scss/vendors/animate.css/animate.css';

class Notifications extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    sidebarPosition: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.toggleDropdown = this.toggleDropdown.bind(this);

    this.state = {
      open: false,
      numNotifications: 0,
      backedUp: props.userData.e2ee ? props.backedUp : true,
    };
  }

  componentDidMount() {
    this.updateNumNotifications(this.props);
  }

  updateNumNotifications(props) {
    let numNotifications = 0;
    if(this.props.userData.e2ee) {   
      if(!props.backedUp) numNotifications += 1;
    }
    this.setState({ numNotifications });
  }

  componentDidUpdate(nextProps) {
    if(this.props.backedUp !== nextProps.backedUp || this.props.userData.e2ee !== nextProps.userData.e2ee) {
      this.updateNumNotifications(this.props);
      if(this.props.userData.e2ee) {   
        let backedUp = this.props.backedUp;
        this.setState({ backedUp });
      }
    }
  }

  renderBackup() {
    return (
      <DropdownItem onClick={() => this.props.history.push('/app/profile')}>
        <Badge color="danger"><i className="fa fa-bell-o" /></Badge>
        <div className={s.details}>
          Backup your private key!
        </div>
      </DropdownItem>
    )
  }

  toggleDropdown() {
    if(this.state.numNotifications > 0) {
      this.setState({
        open: !this.state.open,
      });
    }
  }

  render() {
    return (
      <Dropdown nav isOpen={this.state.open} toggle={this.toggleDropdown}>
        <DropdownToggle nav className={`${s.navItem} text-white`}>
          <i className="fa fa-bell" />
          {this.state.numNotifications > 0 && <span className={s.count}>{this.state.numNotifications}</span> }
        </DropdownToggle>
        <DropdownMenu right className={`${s.dropdownMenu} ${s.support}`}>
          {!this.state.backedUp && this.renderBackup()}
        </DropdownMenu>
      </Dropdown>
    );
  }
}

function mapStateToProps(store) {
  return {
    backedUp: store.eThree.backedUp,
    userData: store.user.userData,
  };
}

export default withRouter(connect(mapStateToProps)(Notifications));

