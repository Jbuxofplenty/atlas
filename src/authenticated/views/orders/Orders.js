import React, { useEffect, useState, useRef } from 'react';
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
  const [timer, setTimer] = useState(null);
  const mounted = useRef(true);

  const startTimer = () => {
    return setTimeout(() => {
      mounted.current && updateAccounts();
    }, 500);
  }

  useEffect(() => {
    setTimer(startTimer());
    return () => {
      mounted.current = false;
      clearTimeout(timer);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    clearTimeout(timer);
    mounted.current && setTimer(startTimer());
    // eslint-disable-next-line
  }, [props.accounts]);

  const updateAccounts = async () => {
    var accountsObject = await dataActions.getFinancialData("accounts");
    var tempAccounts = [];
    for (var key in accountsObject){
      tempAccounts.push(accountsObject[key]);
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
    accounts: state.data.accounts,
  };
}

const mapDispatchToProps = (dispatch, history) => {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Orders);
