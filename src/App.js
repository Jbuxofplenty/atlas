import React, { Component } from 'react';
import './App.scss';

// Firebase
import { auth } from './firebase';
import { submitIssue } from './helpers';

const AuthenticatedApp = React.lazy(() => import('./authenticated/AuthenticatedApp'))
const UnauthenticatedApp = React.lazy(() => import('./unauthenticated/UnauthenticatedApp'))

class App extends Component {
  constructor(props) {
    super(props);
    this.state={
      user: auth.currentUser,
    }
  }

  componentDidMount() {
    auth.onAuthStateChanged(function(user) {
      this.setState({user});
    }.bind(this));
    window.addEventListener("error", function (e) {
      submitIssue(e.error.message, e.error.stack, true, true);
    })
  }
  
  render() {
    return (
    <div>
      {this.state.user 
        ? <AuthenticatedApp /> 
        : <UnauthenticatedApp />
      }
    </div>
    );
  }
}

export default App;
