import React, { Component } from 'react';
import './App.scss';

// Firebase
import { auth } from './firebase';

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
