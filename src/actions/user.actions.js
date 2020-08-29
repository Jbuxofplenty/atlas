import { userConstants } from '../constants';
import { alertActions, dataActions } from './';
import fire from "../firebase";

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
    //delete: _delete
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

function login(email, password, history) {
  return dispatch => {
    fire.auth()
      .signInWithEmailAndPassword(email, password)
      .then(user => {
        var tempUser = {};
        if (user) {
          dispatch(request(true, email));
          fire.firestore().collection("users").doc(user.user.uid).get().then(function (snapshot) {
            tempUser["email"] = snapshot.data().email;
            tempUser["username"] = snapshot.data().username;
            tempUser["phone"] = snapshot.data().phone;
            tempUser["firstName"] = snapshot.data().firstName;
            tempUser["lastName"] = snapshot.data().lastName;
            tempUser["headshot"] = snapshot.data().headshot;
            dispatch(request(false, email));
            dispatch(success(true, user, tempUser));
            dispatch(alertActions.visible(true));
          },
            error => {
              document.getElementById("inputEmail").style.borderColor = "red";
              document.getElementById("inputPassword").style.borderColor = "red";
              dispatch(request(false, email));
              dispatch(loginFailure(true, error.toString(), null, null));
              dispatch(alertActions.error(error.toString()));
              dispatch(alertActions.visible(true));
            });
        }
      },
      error => {
          document.getElementById("inputEmail").style.borderColor = "red";
          document.getElementById("inputPassword").style.borderColor = "red";
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
    var provider = new fire.auth.FacebookAuthProvider();
    fire.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      var tempUser = {};
      if (user) {
        fire.firestore().collection("users").doc(user.uid).get().then(function (snapshot) {
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
            fire.firestore().collection("users").doc(user.uid).set({
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
          dispatch(alertActions.visible(true));
        },
          error => {
            document.getElementById("inputEmail").style.borderColor = "red";
            document.getElementById("inputPassword").style.borderColor = "red";
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
    var provider = new fire.auth.GoogleAuthProvider();
    fire.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      var tempUser = {};
      if (user) {
        fire.firestore().collection("users").doc(user.uid).get().then(function (snapshot) {
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
            fire.firestore().collection("users").doc(user.uid).set({
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
          dispatch(alertActions.visible(true));
        },
          error => {
            document.getElementById("inputEmail").style.borderColor = "red";
            document.getElementById("inputPassword").style.borderColor = "red";
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

function reCaptchaUpdate(human, signUp, latestAction) {
  return { type: userConstants.UPDATE_CAPTCHA, human, signUp, latestAction }
}

function logout() {
  //fire.auth().signOut();
  return dispatch => {
    dispatch(userLogout());
  }

  function userLogout() { return { type: userConstants.LOGOUT } }
}

function register(email, username, password, history, document) {
   return dispatch => {
       dispatch(request(email));
       fire.auth().createUserWithEmailAndPassword(email, password).then((authData) => {
        fire.firestore().collection("users").doc(authData.user.uid).set({
          email: email,
          username: username,
          firstName: "",
          lastName: "",
          phone: "",
          headshot: "https://s3.amazonaws.com/dejafood.com/mobile_assets/deja_gradient.png",
        });
        dispatch(success(authData));
        dispatch(login(email, password, history));
        dispatch(alertActions.visible(false));
        dispatch(alertActions.clear());
       }).catch(function(error) {
        dispatch(failure(true, error.toString(), null, null));
        dispatch(alertActions.error(error.toString()));
        dispatch(alertActions.visible(true));
        document.getElementById("inputEmail").style.borderColor = "red";
        document.getElementById("inputUsername").style.borderColor = "red";
        document.getElementById("inputPassword").style.borderColor = "red";
      });
     };

   function request(user) { return { type: userConstants.REGISTER_REQUEST, user } }
   function success(user) { return { type: userConstants.REGISTER_SUCCESS, user } }
   function failure(error) { return { type: userConstants.REGISTER_FAILURE, error } }
}

function forgotPassword(emailAddress, document) {
   return dispatch => {
     fire.auth().sendPasswordResetEmail(emailAddress).then(() => {
      dispatch(alertActions.visible(true));
      dispatch(alertActions.error("Successfully sent password reset email!"));
    }).catch(function(error) {
      dispatch(alertActions.error(error.toString()));
      dispatch(alertActions.visible(true));
      document.getElementById("inputEmail").style.borderColor = "red";
    });
   };
}

//// prefixed function name with underscore because delete is a reserved word in javascript
//function _delete(id) {
//    return dispatch => {
//        dispatch(request(id));

//        userService.delete(id)
//            .then(
//                user => dispatch(success(id)),
//                error => dispatch(failure(id, error.toString()))
//            );
//    };

//    function request(id) { return { type: userConstants.DELETE_REQUEST, id } }
//    function success(id) { return { type: userConstants.DELETE_SUCCESS, id } }
//    function failure(id, error) { return { type: userConstants.DELETE_FAILURE, id, error } }
//}
