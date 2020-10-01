import React from 'react';
import { connect } from 'react-redux';
import { dataActions, eThreeActions } from 'actions';
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
import RotateKey from "./e2ee/RotateKey";
import RestoreKey from "./e2ee/RestoreKey";
import UpdatePassword from "./e2ee/UpdatePassword";
import DeleteBackup from "./e2ee/DeleteBackup";
import EnableE2EE from "./e2ee/EnableE2EE";

// personal
import PersonalInformation from "./personal/PersonalInformation";
import ChangePassword from "./personal/UpdatePassword";
import DeleteAccount from "./personal/DeleteAccount";

// security
import TwoFactorAuth from "./security/TwoFactorAuth";

import s from './Profile.module.scss';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: '2',
      backedUp: props.backedUp,
      localKeyPresent: false,
      e2ee: props.userData.e2ee,
    };

    this.toggle = this.toggle.bind(this);
    this.updateBackedUp = this.updateBackedUp.bind(this);
    this.newKeyGenerated = this.newKeyGenerated.bind(this);
    this.checkLocalKeyPresent = this.checkLocalKeyPresent.bind(this);
    this._isMounted = false;
  }

  componentDidUpdate(nextProps) {
    if(this.props.backedUp !== nextProps.backedUp) {
      this.timeout = setTimeout(
        this.updateBackedUp, 
        3000
      );
    }
    if(nextProps.userData.e2ee !== this.props.userData.e2ee) {
      this.setState({ e2ee: this.props.userData.e2ee });
      this.checkLocalKeyPresent();
    }
  }

  componentDidMount() {
    this._isMounted = true;
    this._isMounted && this.checkLocalKeyPresent();
  }

  updateBackedUp() {
    var backedUp = this.props.backedUp;
    this.setState({ backedUp });
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  async checkLocalKeyPresent() {
    let localKeyPresent = await this.props.localKeyPresent();
    this.setState({ localKeyPresent });
  }

  newKeyGenerated() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(
      this.checkLocalKeyPresent, 
      3000
    );
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  renderEncryption() {
    if(!this.state.e2ee) {
      return null;
    }
    else if(!this.state.backedUp && !this.state.localKeyPresent) {
      return (
        <RotateKey newKeyGenerated={this.newKeyGenerated} /> 
      )
    }
    else if(!this.state.backedUp && this.state.localKeyPresent) {
      return (
        <BackupKey />
      )
    }
    else {
      return (
        <div>
          <RestoreKey />
          <UpdatePassword />
          <DeleteBackup />
        </div>
      )
    }
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
            {this.state.activeTab === '2' &&
              <div>
                <EnableE2EE />
                {this.renderEncryption()}
              </div>
            } 
          </TabPane>
          <TabPane tabId="3" className="py-5">
            {this.state.activeTab === '3' &&
              <div>
                <PersonalInformation />
                {this.props.userData.provider !== "google" && 
                this.props.userData.provider !== "facebook" && 
                  <ChangePassword /> 
                }
                <DeleteAccount />
              </div>
            } 
          </TabPane>
          <TabPane tabId="4" className="py-5">
            {this.state.activeTab === '4' &&
              <div>
                <TwoFactorAuth />
              </div>
            } 
          </TabPane>
        </TabContent>
      </section>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    backedUp: state.eThree.backedUp,
    userData: state.user.userData,
  };
}

const mapDispatchToProps = (dispatch, history) => {
  return {
    getInstitutions: () => dispatch(dataActions.getInstitutions()),
    localKeyPresent: () => dispatch(eThreeActions.localKeyPresent()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
