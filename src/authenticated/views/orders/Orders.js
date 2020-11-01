import React, { useEffect, useState } from 'react';
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

function Orders (props) {
  const [activeTab, setActiveTab] = useState(0);
  const [accounts, setAccounts] = useState(null);
  const [mounted, setMounted] = useState(true);


  useEffect(() => {
    mounted && updateAccounts();
    return function cleanup() {
      setMounted(false);
    }
  }, [props.data, mounted]);

  const updateAccounts = async () => {
    var accountsObject = await dataActions.getFinancialData("accounts");
    var tempAccounts = [];
    for (var key in accountsObject){
      if(accountsObject[key].plaid) {
        //TODO: Insert code to populate investment tabs
      }
      else {
        tempAccounts.push(accountsObject[key]);
      }
    }
    setAccounts(tempAccounts);
  }

  const toggle = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  }
  return (
    <section className={`${s.root} mb-4`}>
      <h1 className="page-title">Orders</h1>
      {accounts &&
        <>
          <Nav className="bg-transparent" tabs>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === 0 })}
                onClick={() => { toggle(0); }}
              >
                <i className="icon-pane fa fa-globe-americas"/>
                <span className="ml-xs">All Orders</span>
              </NavLink>
            </NavItem>
              {accounts.map((account, index) => 
                <NavItem key={index}>
                  <NavLink
                    className={classnames({ active: activeTab === index+1 })}
                    onClick={() => { toggle(index+1); }}
                  >
                    <span className="ml-xs">{account.displayName}</span>
                  </NavLink>
                </NavItem>
              )}
          </Nav>

          {/* tab content */}

          <TabContent activeTab={activeTab}>
            {accounts.map((account, index) => 
              <TabPane tabId={index+1} className="py-5" key={index}>
                <OrdersTable account={account} />
              </TabPane>
            )}
            <TabPane tabId={0} className="py-5">
              <OrdersTable accounts={accounts} />
            </TabPane>
          </TabContent>
        </>
      } 
    </section>
  );
}

const mapStateToProps = (state) => {
  return {
    institutions: state.data.institutions,
    data: state.data.accounts,
  };
}

const mapDispatchToProps = (dispatch, history) => {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Orders);
