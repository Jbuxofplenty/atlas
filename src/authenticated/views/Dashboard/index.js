import React, { Component } from 'react';
import { dataActions } from '../../../actions';
import { connect } from 'react-redux';

class DashboardPage extends Component {
  render() {
    return (
      <div className="esans">
        authenticated
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    isLoginSuccess: state.authentication.isLoginSuccess,
  };
}

const mapDispatchToProps = (dispatch, history) => {
  return {
    dataReset: () => dispatch(dataActions.dataReset())
  };
}

const Dashboard = connect(mapStateToProps, mapDispatchToProps)(DashboardPage);
export default Dashboard;
