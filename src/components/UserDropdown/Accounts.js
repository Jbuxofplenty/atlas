import React from 'react';
import {
  Button,
  ListGroup,
  ListGroupItem,
} from 'reactstrap';

import classnames from 'classnames';
import s from './ListGroup.module.scss';

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
              <footer className={[s.cardFooter, 'text-sm', 'card-footer'].join(' ')}>
                <Button
                  color="link"
                  className={classnames({ disabled: this.state.isLoad }, s.btnNotificationsReload, 'btn-xs', 'float-right', 'py-0')}
                  onClick={() => this.pullAccountData()}
                  id="load-notifications-btn"
                >
                  {this.state.isLoad ? <span><i className="la la-refresh la-spin" /> Loading...</span> : <i className="la la-refresh" />}
                </Button>
                <span className="fs-mini">Synced at: {this.state.updated.toLocaleString("en-US")}</span>
              </footer>
            </>
          }
          </>
        }
      </div>
    );
  }
}

export default Accounts;
