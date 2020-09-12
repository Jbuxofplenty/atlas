import React from 'react';
import {
  Button,
  ListGroup,
  ListGroupItem,
} from 'reactstrap';

import classnames from 'classnames';
import NewAccounts from './NewAccounts';

import s from './ListGroup.module.scss';

class Accounts extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      newNotifications: null,
      isLoad: false,
      updated: Date(),
    };
  }

  loadNotifications() {
    this.setState({
      isLoad: true,
    });

    setTimeout(() => this.timerFunc, 1500);
  }

  timerFunc() {
    this.setState({
      newNotifications: (<NewAccounts />),
      isLoad: false,
    });
  }

  componentWillUnmount() {
    clearTimeout(this.timerFunc);
  }

  render() {
    return (
      <div>
        {this.state.newNotifications ||
          <ListGroup className={[s.listGroup, 'thin-scroll'].join(' ')}>
          <ListGroupItem className={s.listGroupItem}>
              <span className={[s.notificationIcon, 'thumb-sm'].join(' ')}>
                <i className="fa fa-btc" />
                <i className="status status-bottom bg-success" />
              </span>
              <h5 className="m-0 mt-2">Coinbase</h5>
            </ListGroupItem>
          </ListGroup>
        }
        <footer className={[s.cardFooter, 'text-sm', 'card-footer'].join(' ')}>
          <Button
            color="link"
            className={classnames({ disabled: this.state.isLoad }, s.btnNotificationsReload, 'btn-xs', 'float-right', 'py-0')}
            onClick={() => this.loadNotifications()}
            id="load-notifications-btn"
          >
            {this.state.isLoad ? <span><i className="la la-refresh la-spin" /> Loading...</span> : <i className="la la-refresh" />}
          </Button>
          <span className="fs-mini">Synced at: {this.state.updated.toLocaleString("en-US")}</span>
        </footer>
      </div>
    );
  }
}

export default Accounts;
