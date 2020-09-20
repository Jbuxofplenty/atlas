import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  Table,
} from 'reactstrap';

import Widget from 'components/Widget/Widget';
import s from '../Dashboard.module.scss';


function AccountsWidget(props) {
  const now = new Date();
  return (
    <Widget className="w-100 align-self-center" close settings settingsClick={() => props.history.push('/app/accounts')}>
      <h3 className={`${s.header}`}>Accounts</h3>
      {props.accounts.length === 0 ? <div className={s.noAccounts}>No accounts have been linked yet!</div> :
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
              {props.accounts.map((account, index) =>
                <tr className={s.lineItem} key={index}>
                  <td className={s.cell}>{index+1}</td>
                  <td className={s.cell}>{account.displayName}</td>
                  <td className={s.cell}>${account.totalBalance.toFixed(2)}</td>
                  <td className={[s.notificationIcon, 'thumb-sm w-100', s.cell].join(' ')}>
                    <i className={`${s.cell} status mt-2 ${new Date(account.lastSynced+1000*60*60*2) > now ? "bg-success" : "bg-danger"}`} />
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
