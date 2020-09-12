import React from 'react';
import {
  ListGroup,
  ListGroupItem,
} from 'reactstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { userActions } from 'actions';

import s from './ListGroup.module.scss'; // eslint-disable-line

class Settings extends React.Component {
  render() {
    return (
      <ListGroup className={[s.listGroup, 'thin-scroll'].join(' ')}>
      <ListGroupItem className={s.listGroupItem} onClick={() => {this.props.history.push('/app/settings'); this.props.toggle();}}>
          <span className={[s.notificationIcon, 'thumb-sm'].join(' ')}>
            <i className="fa fa-gear" />
          </span>
          <h5 className="m-0 mt-2">Settings</h5>
        </ListGroupItem>
        <ListGroupItem className={s.listGroupItem} onClick={() => {this.props.history.push('/app/profile'); this.props.toggle();}}>
          <span className={[s.notificationIcon, 'thumb-sm'].join(' ')}>
            <i className="fa fa-user" />
          </span>
          <h5 className="m-0 mt-2">Profile</h5>
        </ListGroupItem>
        <ListGroupItem className={s.listGroupItem} onClick={() => this.props.logout()}>
          <span className={[s.notificationIcon, 'thumb-sm'].join(' ')}>
            <i className="fa fa-sign-out" />
          </span>
          <h5 className="m-0 mt-2">Sign out</h5>
        </ListGroupItem>
      </ListGroup>
    );
  }
}

const mapDispatchToProps = (dispatch, history) => {
  return {
    logout: () => dispatch(userActions.logout()),
  };
}

export default withRouter(connect(null, mapDispatchToProps)(Settings));
