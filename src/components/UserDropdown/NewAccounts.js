import React from 'react';
import {
  ListGroup,
  ListGroupItem,
} from 'reactstrap';

import s from './ListGroup.module.scss';

class NewAccounts extends React.Component {
  render() {
    return (
      <ListGroup className={[s.listGroup, 'thin-scroll'].join(' ')}>
      <ListGroupItem className={s.listGroupItem} onClick={() => this.props.history.push('/app/profile')}>
          <span className={[s.notificationIcon, 'thumb-sm'].join(' ')}>
            <i className="fa fa-btc" />
            <i className="status status-bottom bg-success" />
          </span>
          <h5 className="m-0 mt-2">Coinbase</h5>
        </ListGroupItem>
      </ListGroup>
    );
  }
}

export default NewAccounts;
