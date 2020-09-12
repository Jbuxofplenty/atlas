import React from 'react';
import { connect } from 'react-redux';
import { dataActions } from 'actions';
import {
  TabContent, 
  TabPane, 
  Nav, 
  NavItem, 
  NavLink, 
} from 'reactstrap';
import classnames from 'classnames';

// e2ee
import BackupKey from "./e2ee/BackupKey";
import RestoreKey from "./e2ee/RestoreKey";
import UpdatePassword from "./e2ee/UpdatePassword";
import DeleteBackup from "./e2ee/DeleteBackup";

// personal
import PersonalInformation from "./personal/PersonalInformation";
import ChangePassword from "./personal/UpdatePassword";

// security
import TwoFactorAuth from "./security/TwoFactorAuth";

import s from './Profile.module.scss';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: '2',
      password: "",
      showPassword: false,
      backedUp: false,
    };

  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };

  deleteBackup() {

  }

  render() {
    return (
      <section className={`${s.root} mb-4`}>
        <h1 className="page-title">Profile</h1>
        {/* tabs */}
        <Nav className="bg-transparent" tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '2' })}
              onClick={() => { this.toggle('2'); }}
            >
              <i className="icon-pane fa fa-lock"/>
              <span className="ml-xs">End to End Encryption</span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '3' })}
              onClick={() => { this.toggle('3'); }}
            >
              <i className="icon-pane fa fa-user"/>
              <span className="ml-xs">Personal Information</span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '4' })}
              onClick={() => { this.toggle('4'); }}
            >
              <i className="icon-pane fa fa-shield"/>
              <span className="ml-xs">Security</span>
            </NavLink>
          </NavItem>
        </Nav>

        {/* tab content */}

        <TabContent activeTab={this.state.activeTab}>
          {/* tab #2 */}
          <TabPane tabId="2" className="py-5">
            <div>
              {!this.state.backedUp ?
                <BackupKey />
                :
                <div>
                  <RestoreKey />
                  <UpdatePassword />
                  <DeleteBackup />
                </div>
              }
            </div>
          </TabPane>
          <TabPane tabId="3" className="py-5">
            <div>
              <PersonalInformation />
              <ChangePassword />
            </div>
          </TabPane>
          <TabPane tabId="4" className="py-5">
            <div>
              <TwoFactorAuth />
            </div>
          </TabPane>
        </TabContent>
      </section>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    backedUp: state.eThree.backedUp,
  };
}

const mapDispatchToProps = (dispatch, history) => {
  return {
    getInstitutions: () => dispatch(dataActions.getInstitutions()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
