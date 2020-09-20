import React, { useEffect } from "react";
import { connect } from 'react-redux';
import {
  Table,
} from 'reactstrap';

import Widget from 'components/Widget/Widget';
import s from './Wallets.module.scss';
import { eThreeActions, alertActions } from "actions";

function Wallet(props) {

  useEffect(() => {
    props.visible(false);
    // eslint-disable-next-line
  }, []);

  return (
    <div className={s.root}>
        <h4 className="page-title">Wallets</h4>
        {props.account.wallets.length === 0 ? <div className={s.noAccounts}>No wallets are attached to your {props.account.displayName} account!</div> :
          <Widget className="w-100 align-self-center">
            <div className="table-responsive align-self-center">
              <Table className="table-hover align-self-center">
                <thead>
                  <tr>
                    <th className={s.cell}>#</th>
                    <th className={s.cell}>Name</th>
                    <th className={s.cell}>Current Balance</th>
                  </tr>
                </thead>
                {/* eslint-disable */}
                <tbody>
                  {props.account.wallets.map((wallet, index) =>
                    <tr className={s.lineItem} key={index}>
                      <td className={s.cell}>{index+1}</td>
                      <td className={s.cell}>{wallet.currency.name}</td>
                      <td className={s.cell}>{wallet.balance.amount} {wallet.balance.currency}</td>
                    </tr>
                  )}
                </tbody>
                {/* eslint-enable */}
              </Table>
            </div>
          </Widget>
        }
      </div>
  );
}

function mapStateToProps(store) {
  return {
    alertType: store.alert.type,
    alertMessage: store.alert.message,
    alertVisible: store.alert.visible,
    alertComponent: store.alert.component,
  };
}

const mapDispatchToProps = (dispatch, history) => {
  return {
    backupKey: (keyPassword, uid) => dispatch(eThreeActions.backupKey(keyPassword, uid)),
    visible: (show) => dispatch(alertActions.visible(show)),
    setComponent: (component) => dispatch(alertActions.component(component)),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Wallet);