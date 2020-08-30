import React, { Component } from 'react';
import { dataActions } from '../../../actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

export class NavBarPage extends Component {
  constructor(props) {
    super(props);
    this.home = this.home.bind(this);
  }

  home() {
    this.props.history.push('/home');
  }

  render() {
    return (
      <div></div>
    )
  }
}

function mapStateToProps(state) {
  const { authentication } = state;
  const { user, userData } = authentication;
  return {
    user,
    userData,
  };
}

const mapDispatchToProps = (dispatch, history) => {
  return {
    dataReset: () => dispatch(dataActions.dataReset())
  };
}

const DefaultHeader = connect(mapStateToProps, mapDispatchToProps)(withRouter(NavBarPage));
export default DefaultHeader;
