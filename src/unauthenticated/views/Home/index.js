import React, { Component } from 'react';
import { dataActions } from '../../../actions';
import { connect } from 'react-redux';

class HomePage extends Component {
  render() {
    return (
      <div className="esans">
        unauthenticated
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

const Home = connect(mapStateToProps, mapDispatchToProps)(HomePage);
export default Home;
