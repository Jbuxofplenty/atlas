import { userConstants } from '../constants';
import { alertActions, dataActions } from './';
import { auth, db, firebase, apiBaseUrl } from "../firebase";

export const userActions = {
    login,
    logout,
    reset,
    register,
    forgotPassword,
    loginFailure,
    googleLogin,
    facebookLogin,
    reCaptchaUpdate,
    testReCaptcha,
    loginReset,
};

function loginFailure(loginError, error, user, userData) {
  return {
    type: userConstants.LOGIN_FAILURE,
    loginError,
    error,
    user,
    userData
  }
}

function loginReset() {
  return {
    type: userConstants.LOGIN_RESET
  }
}

function login(email, password, history) {
  return dispatch => {
    dispatch(request, true, null);
    auth
      .signInWithEmailAndPassword(email, password)
      .then(user => {
        var tempUser = {};
        if (user) {
          dispatch(request(true, email));
          db.collection("users").doc(user.user.uid).get().then(function (snapshot) {
            tempUser["email"] = snapshot.data().email;
            tempUser["username"] = snapshot.data().username;
            tempUser["phone"] = snapshot.data().phone;
            tempUser["firstName"] = snapshot.data().firstName;
            tempUser["lastName"] = snapshot.data().lastName;
            tempUser["headshot"] = snapshot.data().headshot;
            dispatch(request(false, email));
            dispatch(success(true, user, tempUser));
            history.push('/');
          },
            error => {
              dispatch(request(false, email));
              dispatch(loginFailure(true, error.toString(), null, null));
              dispatch(alertActions.error(error.toString()));
              dispatch(alertActions.visible(true));
            });
        }
      },
      error => {
          dispatch(request(false, email));
          dispatch(loginFailure(true, error.toString(), null, null));
          dispatch(alertActions.error(error.toString()));
          dispatch(alertActions.visible(true));
        });

  };

  function request(isLoginPending, user) { return { type: userConstants.LOGIN_REQUEST, isLoginPending, user } }
  function success(isLoginSuccess, user, userData) { return { type: userConstants.LOGIN_SUCCESS, isLoginSuccess, user, userData } }
}

function facebookLogin(history) {
  return dispatch => {
    var provider = new firebase.auth.FacebookAuthProvider();
    auth.signInWithPopup(provider).then(function(result) {
      var token = result.credential.accessToken;
      var user = result.user;
      var tempUser = {};
      console.log(user)
      if (user) {
        db.collection("users").doc(user.uid).get().then(function (snapshot) {
          if(snapshot.data()) {
            tempUser["email"] = snapshot.data().email;
            tempUser["username"] = snapshot.data().username;
            tempUser["phone"] = snapshot.data().phone;
            tempUser["firstName"] = snapshot.data().firstName;
            tempUser["lastName"] = snapshot.data().lastName;
            tempUser["headshot"] = snapshot.data().headshot;
            tempUser["facebookCredential"] = token;
          }
          else {
            db.collection("users").doc(user.uid).set({
              email: user.email,
              username: user.displayName,
              firstName: "",
              lastName: "",
              phone: "",
              headshot: user.photoURL,
            });
          }
          dispatch(request(false, result.email));
          dispatch(success(true, user, tempUser));
          history.push('/');
        },
          error => {
            dispatch(request(false, result.email));
            dispatch(loginFailure(true, error.toString(), null, null));
            dispatch(alertActions.error(error.toString()));
            dispatch(alertActions.visible(true));
          });
      }
    }).catch(function(error) {
      var email = error.email;
      dispatch(request(false, email));
      dispatch(loginFailure(true, error.toString(), null, null));
      dispatch(alertActions.error(error.toString()));
      dispatch(alertActions.visible(true));
    });
  };

  function request(isLoginPending, user) { return { type: userConstants.LOGIN_REQUEST, isLoginPending, user } }
  function success(isLoginSuccess, user, userData) { return { type: userConstants.LOGIN_SUCCESS, isLoginSuccess, user, userData } }
}

function googleLogin(history) {
  return dispatch => {
    var provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      var tempUser = {};
      if (user) {
        db.collection("users").doc(user.uid).get().then(function (snapshot) {
          if(snapshot.data()) {
            tempUser["email"] = snapshot.data().email;
            tempUser["username"] = snapshot.data().username;
            tempUser["phone"] = snapshot.data().phone;
            tempUser["firstName"] = snapshot.data().firstName;
            tempUser["lastName"] = snapshot.data().lastName;
            tempUser["headshot"] = snapshot.data().headshot;
            tempUser["googleCredential"] = token;
          }
          else {
            db.collection("users").doc(user.uid).set({
              email: user.email,
              username: user.displayName,
              firstName: "",
              lastName: "",
              phone: "",
              headshot: user.photoURL,
            });
          }
          dispatch(request(false, result.email));
          dispatch(success(true, user, tempUser));
          history.push('/');
        },
          error => {
            dispatch(request(false, result.email));
            dispatch(loginFailure(true, error.toString(), null, null));
            dispatch(alertActions.error(error.toString()));
            dispatch(alertActions.visible(true));
          });
      }
    }).catch(function(error) {
      var email = error.email;
      dispatch(request(false, email));
      dispatch(loginFailure(true, error.toString(), null, null));
      dispatch(alertActions.error(error.toString()));
      dispatch(alertActions.visible(true));
    });

  };

  function request(isLoginPending, user) { return { type: userConstants.LOGIN_REQUEST, isLoginPending, user } }
  function success(isLoginSuccess, user, userData) { return { type: userConstants.LOGIN_SUCCESS, isLoginSuccess, user, userData } }
}

function reset() {
  return dispatch => {
    dispatch(dataActions.dataReset());
  }
}

function reCaptchaUpdate(human, signUp) {
  return { type: userConstants.UPDATE_CAPTCHA, human, signUp}
}

function testReCaptcha(value, signUp) {
  return dispatch => {
    fetch(apiBaseUrl + 'checkRecaptcha/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "response": value
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.type === "success") {
        dispatch(reCaptchaUpdate(true, signUp));
        alertActions.clear();
      }
      else {
        dispatch(reCaptchaUpdate(false, signUp));
        alertActions.visible(true);
        alertActions.error(responseJson.type);
      }
    })
    .catch((error) => {
      dispatch(reCaptchaUpdate(false, signUp));
      alertActions.visible(true);
      alertActions.error(error);
    });
  }
}

function logout() {
  auth.signOut();
  return dispatch => {
    dispatch(userLogout());
  }

  function userLogout() { return { type: userConstants.LOGOUT } }
}

function register(email, firstName, password, history) {
   return dispatch => {
      dispatch(request, true, null);
      auth.createUserWithEmailAndPassword(email, password).then((authData) => {
        db.collection("users").doc(authData.user.uid).set({
          email: email,
          firstName: firstName,
          lastName: "",
          phone: "",
          headshot: "https://s3.amazonaws.com/dejafood.com/mobile_assets/deja_gradient.png",
        });
        dispatch(success(authData));
        dispatch(login(email, password, history));
        dispatch(alertActions.visible(false));
        dispatch(alertActions.clear());
      }).catch(function(error) {
      dispatch(loginFailure(true, error.toString(), null, null));
      dispatch(alertActions.error(error.toString()));
      dispatch(alertActions.visible(true));
    });
  };

  function request(isLoginPending, user) { return { type: userConstants.LOGIN_REQUEST, isLoginPending, user } }
  function success(user) { return { type: userConstants.REGISTER_SUCCESS, user } }
}

function forgotPassword(emailAddress, document) {
   return dispatch => {
     auth.sendPasswordResetEmail(emailAddress).then(() => {
      dispatch(alertActions.visible(true));
      dispatch(alertActions.error("Successfully sent password reset email!"));
    }).catch(function(error) {
      dispatch(alertActions.error(error.toString()));
      dispatch(alertActions.visible(true));
      document.getElementById("inputEmail").style.borderColor = "red";
    });
   };
}