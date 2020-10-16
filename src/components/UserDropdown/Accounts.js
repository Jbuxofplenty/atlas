import React from 'react';
import {
  ListGroup,
  ListGroupItem,
} from 'reactstrap';

import s from './ListGroup.module.scss';

// core components
import SyncAccount from "components/SyncAccount/SyncAccount.js";

import OAuthObject from 'oauth2';

import { dataActions } from 'actions';

class Accounts extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoad: false,
      updated: new Date(),
      now: new Date(),
      accounts: null,
    };

    this.pullAccountData = this.pullAccountData.bind(this);
  }

  async componentDidMount() {
    var tempAccounts = await dataActions.getFinancialData("accounts");
    var accounts = [];
    var longestLastSynced = Number.MAX_SAFE_INTEGER;
    for (var key in tempAccounts){
      accounts.push(tempAccounts[key]);
      if(longestLastSynced > tempAccounts[key].lastSynced) {
        longestLastSynced = tempAccounts[key].lastSynced;
      }
    }
    var updated = new Date(longestLastSynced);
    this.setState({ accounts, updated });
  }

  pullAccountData() {
    this.setState({
      isLoad: true,
    });
    this.state.accounts.forEach(async account => {
      var accountObject = OAuthObject[account.displayName];
      await accountObject.pullAccountData();
    });
    this.setState({
      isLoad: false,
      updated: new Date(),
    })
  }

  render() {
    return (
      <div>
        {this.state.accounts && 
          <>
          {this.state.accounts.length === 0 ? <ListGroup className={s.noAccounts}>No accounts have been linked yet!</ListGroup>:
            <>
              <ListGroup className={[s.listGroup, 'thin-scroll'].join(' ')}>
                {this.state.accounts.map((account, index) => 
                  <ListGroupItem className={s.listGroupItem} key={index}>
                    <span className={[s.notificationIcon, 'thumb-sm'].join(' ')}>
                      <i className={`status mt-2 ${new Date(account.lastSynced+1000*60*60*2) > this.state.now ? "bg-success" : "bg-danger"}`} />
                    </span>
                    <h5 className="m-0 mt-2">{account.displayName}</h5>
                  </ListGroupItem>
                )}
                
              </ListGroup>
              <SyncAccount accounts={this.state.accounts}/>
            </>
          }
          </>
        }
      </div>
    );
  }
}

export default Accounts;
