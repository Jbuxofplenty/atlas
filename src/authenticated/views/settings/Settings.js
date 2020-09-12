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

// sections
import WhileYouWereAway from "./WhileYouWereAway";

import s from './Settings.module.scss';

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: '2',
      password: "",
      showPassword: false,
      backedUp: props.backedUp,
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
        <h1 className="page-title">Settings</h1>
        {/* tabs */}
        <Nav className="bg-transparent" tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '2' })}
              onClick={() => { this.toggle('2'); }}
            >
              <i className="icon-pane fa fa-lock"/>
              <span className="ml-xs">Notifications</span>
            </NavLink>
          </NavItem>
        </Nav>

        {/* tab content */}

        <TabContent activeTab={this.state.activeTab}>
          {/* tab #2 */}
          <TabPane tabId="2" className="py-5">
            <div>
              <WhileYouWereAway />
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

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
