import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  Table,
} from 'reactstrap';

import Widget from 'components/Widget/Widget';

import { dataActions } from 'actions';

import s from '../Dashboard.module.scss';

function AccountsWidget(props) {
  const now = new Date();
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      var tempAccounts = await dataActions.getFinancialData("accounts");
      var financialAccounts = [];
      for (var key in tempAccounts){
        financialAccounts.push(tempAccounts[key]);
      }
      setAccounts(financialAccounts)
    }
    fetchData();
    // eslint-disable-next-line
  }, []);

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
                  <td className={s.cell}>${account.totalBalance.toFixed(2)}</td>
                  <td className={['thumb-sm w-100', s.cell].join(' ')}>
                    <i className={`status ${new Date(account.lastSynced+1000*60*60*2) > now ? "bg-success" : "bg-danger"}`} />
                  </td>
                </tr>
              )}
            </tbody>
            {/* eslint-enable */}
          </Table>
        </div>
      }
    </Widget>
  );
}

function mapStateToProps(store) {
  return {
    alertType: store.alert.type,
  };
}

const mapDispatchToProps = (dispatch, history) => {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AccountsWidget));
