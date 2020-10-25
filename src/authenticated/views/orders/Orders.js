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

import OrdersTable from "./components/OrdersTable.js";

import s from './Orders.module.scss';

class Orders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0,
      accounts: null,
    };

    this.toggle = this.toggle.bind(this);
    this.updateAccounts = this.updateAccounts.bind(this)
    this._isMounted = false;
  }

  async componentDidMount() {
    this._isMounted = true;
    this.updateAccounts()
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentWillUpdate(nextProps) {
    if(this.props.data !== nextProps.data) {
      this.updateAccounts();
    }
  }

  async updateAccounts() {
    var tempAccounts = this._isMounted && await dataActions.getFinancialData("accounts");
    var accounts = [];
    for (var key in tempAccounts){
      accounts.push(tempAccounts[key]);
    }
    this._isMounted && this.setState({ accounts });
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  render() {
    return (
      <section className={`${s.root} mb-4`}>
        <h1 className="page-title">Orders</h1>
        {this.state.accounts &&
          <>
            <Nav className="bg-transparent" tabs>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === 0 })}
                  onClick={() => { this.toggle(0); }}
                >
                  <i className="icon-pane fa fa-globe-americas"/>
                  <span className="ml-xs">All Orders</span>
                </NavLink>
              </NavItem>
                {this.state.accounts.map((account, index) => 
                  <NavItem key={index}>
                    <NavLink
                      className={classnames({ active: this.state.activeTab === index+1 })}
                      onClick={() => { this.toggle(index+1); }}
                    >
                      <span className="ml-xs">{account.displayName}</span>
                    </NavLink>
                  </NavItem>
                )}
            </Nav>

            {/* tab content */}

            <TabContent activeTab={this.state.activeTab}>
              {this.state.accounts.map((account, index) => 
                <TabPane tabId={index+1} className="py-5" key={index}>
                  <OrdersTable account={account} />
                </TabPane>
              )}
              <TabPane tabId={0} className="py-5">
                <OrdersTable accounts={this.state.accounts} />
              </TabPane>
            </TabContent>
          </>
        } 
      </section>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    institutions: state.data.institutions,
    data: state.data,
  };
}

const mapDispatchToProps = (dispatch, history) => {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Orders);
