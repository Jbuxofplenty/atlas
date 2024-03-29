import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  Table,
} from 'reactstrap';

// core components
import SyncAccount from "components/SyncAccount/SyncAccount.js";
import Widget from 'components/Widget/Widget';

import { dataActions, widgetActions } from 'actions';
import { numberWithCommas } from 'helpers';

import s from '../Dashboard.module.scss';

function AccountsWidget(props) {
  const now = new Date();
  const [accounts, setAccounts] = useState([]);
  const mounted = useRef(true);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [props.accounts]);

  useEffect(() => {
    return () => { mounted.current = false; };
    // eslint-disable-next-line
  }, []);


  const fetchData = async () => {
    var tempAccounts = mounted.current && await dataActions.getFinancialData("accounts");
    var financialAccounts = [];
    for (var key in tempAccounts){
      financialAccounts.push(tempAccounts[key]);
    }
    var tempWidget = JSON.parse(JSON.stringify(props.widget));
    tempWidget.dataGrid.h = tempWidget.dataGrid.minH + financialAccounts.length / 2;
    mounted.current && props.updateWidget(props.widgetId, tempWidget);
    mounted.current && setAccounts(financialAccounts)
  }

  return (
    <Widget 
      className="w-100 align-self-center h-100" 
      close 
      settings 
      settingsClick={() => props.history.push('/app/accounts')}
      title={'Account Summary'}
      view={props.view}
      widgetId={props.widgetId}
    >
      {accounts.length === 0 ? <div className={s.noAccounts}>No accounts have been linked yet!</div> :
        <div>
          <div className="table-responsive align-self-center">
            <Table className="table-hover align-self-center">
              <thead>
                <tr>
                  <th className={s.cell}>#</th>
                  <th className={s.cell}>Account</th>
                  <th className={s.cell}>Total Balance</th>
                  <th className={s.cell}>Synced</th>
                </tr>
              </thead>
              {/* eslint-disable */}
              <tbody>
                {accounts.map((account, index) =>
                  <tr className={s.lineItem} key={index}>
                    <td className={s.cell}>{index+1}</td>
                    <td className={s.cell}>{account.displayName}</td>
                    <td className={s.cell}>${account.totalBalance && numberWithCommas(account.totalBalance)}</td>
                    <td className={['thumb-sm w-100', s.cell].join(' ')}>
                      <i className={`status ${new Date(account.lastSynced+1000*60*60*2) > now ? "bg-success" : "bg-danger"}`} />
                    </td>
                  </tr>
                )}
              </tbody>
              {/* eslint-enable */}
            </Table>
          </div>
          <SyncAccount accounts={accounts}/>
        </div>
      }
    </Widget>
  );
}

function mapStateToProps(store) {
  return {
    accounts: store.data.accounts,
    alertType: store.alert.type,
  };
}

const mapDispatchToProps = (dispatch, history) => {
  return {
    updateWidget: (key, widget) => dispatch(widgetActions.updateWidget(key, widget, 'dashboard')),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AccountsWidget));
