import { userConstants, eThreeConstants } from '../constants';
import { alertActions, dataActions, eThreeActions } from './';
import { auth, db } from "../firebase";
import { apiBaseUrl } from 'helpers';

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
    changePassword,
    updateUserData,
    sendVerificationEmail,
    deleteAccount,
};

/////////////////////
// Helpers
/////////////////////
function loginReset() {
  return {
    type: userConstants.LOGIN_RESET
  }
}

function updateBackedUp(backedUp) { 
  return { 
    type: eThreeConstants.UPDATE_BACKED_UP, 
    backedUp 
  }
}

function updateUserData(userData) {
  return { 
    type: userConstants.UPDATE_USER_DATA, 
    userData 
  }
}

function reset() {
  return dispatch => {
    dispatch(dataActions.dataReset());
  }
}

function loginFailure(loginError, error, user, userData) {
  return {
    type: userConstants.LOGIN_FAILURE,
    loginError,
    error,
    user,
    userData
  }
}

/////////////////////
// Login/Signup
/////////////////////

function login(user, history) {
  return async dispatch => {
    var tempUser = {};
    if (user) {
      user = user.user;
      await eThreeActions.InitializeEThree(false);
      dispatch(request(true, user));
      db.collection("users").doc(user.uid).get().then(function (snapshot) {
        tempUser = snapshot.data();
        let backedUp = snapshot.data().backedUp;
        dispatch(request(false, user));
        dispatch(success(true, user, tempUser));
        dispatch(updateBackedUp(backedUp));
        history.push('/app/dashboard');
      },
        error => {
          dispatch(request(false, user));
          dispatch(loginFailure(true, error.toString(), {}, {}));
          dispatch(alertActions.error(error.toString()));
        });
      }
      else{
        dispatch(request(false, {}));
        dispatch(loginFailure(true, "Passed user is null!", {}, {}));
        dispatch(alertActions.error("Passed user is null!"));
      };

  };

  function request(isLoginPending, user) { return { type: userConstants.LOGIN_REQUEST, isLoginPending, user } }
  function success(isLoginSuccess, user, userData) { return { type: userConstants.LOGIN_SUCCESS, isLoginSuccess, user, userData } }
}

function facebookLogin(result, history) {
  return async dispatch => {
    var token = result.credential.accessToken;
    var user = result.user;
    var tempUser = {};
    if (user) {
      let createdAt = new Date(user.metadata.creationTime);
      let lastSignInTime = new Date(user.metadata.lastSignInTime);
      if(createdAt.getTime() === lastSignInTime.getTime()) {
        await eThreeActions.InitializeEThree(true);
      }
      else {
        await eThreeActions.InitializeEThree(false);
      }
      let backedUp = false;
      db.collection("users").doc(user.uid).get().then(function (snapshot) {
        if(snapshot.data()) {
          tempUser = snapshot.data();
          tempUser["facebookCredential"] = token;
          backedUp = snapshot.data().backedUp;
        }
        else {
          tempUser = {    
            email: user.email,
            username: user.displayName,
            firstName: "",
            lastName: "",
            phoneNumber: "",
            headshot: user.photoURL,
            backedUp: false,
            provider: "facebook",
            twoFactorAuth: false,
            whileYouWereAway: {
              enabled: true,
              lastShownMilli: 0,
            },
            financialData: {},
          }
          db.collection("users").doc(user.uid).set(tempUser);
        }
        dispatch(request(false, user));
        dispatch(success(true, user, tempUser));
        dispatch(updateBackedUp(backedUp));
        history.push('/app/dashboard');
      },
        error => {
          dispatch(request(false, {}));
          dispatch(loginFailure(true, error.toString(), {}, {}));
          dispatch(alertActions.error(error.toString()));
        });
    }
    else {
      dispatch(request(false, {}));
      dispatch(loginFailure(true, "Passed user is null!", {}, {}));
      dispatch(alertActions.error("Passed user is null!"));
    }
  };

  function request(isLoginPending, user) { return { type: userConstants.LOGIN_REQUEST, isLoginPending, user } }
  function success(isLoginSuccess, user, userData) { return { type: userConstants.LOGIN_SUCCESS, isLoginSuccess, user, userData } }
}

function googleLogin(result, history) {
  return async dispatch => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    var tempUser = {};
    if (user) {
      let createdAt = new Date(user.metadata.creationTime);
      let lastSignInTime = new Date(user.metadata.lastSignInTime);
      if(createdAt.getTime() === lastSignInTime.getTime()) {
        await eThreeActions.InitializeEThree(true);
      }
      else {
        await eThreeActions.InitializeEThree(false);
      }
      let backedUp = false;
      db.collection("users").doc(user.uid).get().then(function (snapshot) {
        if(snapshot.data()) {
          tempUser = snapshot.data();
          tempUser["googleCredential"] = token;
          backedUp = snapshot.data().backedUp;
        }
        else {   
          tempUser = {    
            email: user.email,
            username: user.displayName,
            firstName: "",
            lastName: "",
            phoneNumber: "",
            headshot: user.photoURL,
            backedUp: false,
            provider: "facebook",
            twoFactorAuth: false,
            whileYouWereAway: {
              enabled: true,
              lastShownMilli: 0,
            },
            financialData: {},
          }
          db.collection("users").doc(user.uid).set(tempUser);
        }
        dispatch(request(false, user));
        dispatch(success(true, user, tempUser));
        dispatch(updateBackedUp(backedUp));
        history.push('/app/dashboard');
      },
        error => {
          dispatch(request(false, {}));
          dispatch(loginFailure(true, error.toString(), {}, {}));
          dispatch(alertActions.error(error.toString()));
        });
    }    
    else {
      dispatch(request(false, {}));
      dispatch(loginFailure(true, "Passed user is null!", {}, {}));
      dispatch(alertActions.error("Passed user is null!"));
    }

  };

  function request(isLoginPending, user) { return { type: userConstants.LOGIN_REQUEST, isLoginPending, user } }
  function success(isLoginSuccess, user, userData) { return { type: userConstants.LOGIN_SUCCESS, isLoginSuccess, user, userData } }
}

function register(email, firstName, password, history) {
   return dispatch => {
      dispatch(request, true, {});
      auth.createUserWithEmailAndPassword(email, password).then(async (user) => {
        await eThreeActions.InitializeEThree(true);
        var tempUser = {
          email: email,
          firstName: firstName,
          lastName: "",
          phoneNumber: "",
          headshot: "https://s3.amazonaws.com/dejafood.com/mobile_assets/deja_gradient.png",
          backedUp: false,
          provider: 'atlas',
          twoFactorAuth: false,
          whileYouWereAway: {
            enabled: true,
            lastShownMilli: 0,
          },
          financialData: {},
        }
        dispatch(sendVerificationEmail());
        db.collection("users").doc(user.user.uid).set(tempUser);
        let backedUp = tempUser.backedUp;
        dispatch(request(false, user.user));
        dispatch(success(true, user.user, tempUser));
        dispatch(updateBackedUp(backedUp));
        dispatch(alertActions.visible(false));
        dispatch(alertActions.clear());
        history.push('/app/dashboard');
      }).catch(function(error) {
      dispatch(loginFailure(true, error.toString(), {}, {}));
      dispatch(alertActions.error(error.toString()));
    });
  };

  function request(isLoginPending, user) { return { type: userConstants.LOGIN_REQUEST, isLoginPending, user } }
  function success(isLoginSuccess, user, userData) { return { type: userConstants.LOGIN_SUCCESS, isLoginSuccess, user, userData } }
}

/////////////////////
// Firebase utilities
/////////////////////

function sendVerificationEmail() {
  return dispatch => {
    var user = auth.currentUser;
    if(user) {
      user.sendEmailVerification().then(() => {
        dispatch(alertActions.success("Successfully sent password verification email!"));
      }).catch(function(error) {
        dispatch(alertActions.error(error.toString()));
      });
    }
    else {  
      dispatch(alertActions.error("No active user! Sign out and in again to perform this action."));
    }

  };
}

function forgotPassword(emailAddress) {
   return dispatch => {
     auth.sendPasswordResetEmail(emailAddress).then(() => {
      dispatch(alertActions.success("Successfully sent password reset email!"));
    }).catch(function(error) {
      dispatch(alertActions.error(error.toString()));
    });
   };
}

function changePassword(password) {
  return dispatch => {
    var user = auth.currentUser;
    user.updatePassword(password).then(() => {
      dispatch(alertActions.success("Successfully updated your password! Use this password next time you login to Atlas One."));
    }).catch(e => {
      dispatch(alertActions.error(e.toString()));
    });
   };
}


/////////////////////
// Recaptcha
/////////////////////


function testReCaptcha(value, signUp) {
  return dispatch => {
    fetch(apiBaseUrl() + 'auth/checkRecaptcha/', {
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
        alertActions.error(responseJson.type);
      }
    })
    .catch((error) => {
      dispatch(reCaptchaUpdate(false, signUp));
      alertActions.error(error);
    });
  }
}

function reCaptchaUpdate(human, signUp) {
  return { type: userConstants.UPDATE_CAPTCHA, human, signUp}
}


//////////////////////
// Tear Down
//////////////////////

function logout() {
  return async dispatch => {
    let eThreeLoggedOut = await eThreeActions.logout();
    if(eThreeLoggedOut) {
      auth.signOut();
      dispatch(userLogout());
      dispatch(ethreeReset());
    }
    else {
      console.log("EThree unable to log out the user!");
      dispatch(alertActions.error("EThree unable to log out the user!"));
    }
  }

  function userLogout() { return { type: userConstants.LOGOUT } }
  function ethreeReset() { return { type: eThreeConstants.ETHREE_RESET } }
}

function deleteAccount(uid) {
  return async dispatch => {
    let eThreeUnregistered = await eThreeActions.unregister();
    if(eThreeUnregistered) {
      console.log("Successfully unregistered your subscription to the end-to-end encryption service...")
      db.collection("users").doc(uid).delete().then(function() {
          console.log("User data successfully deleted from our databases!");
      }).catch(function(error) {
          console.error("Error removing user data from database: ", error.toString());
      });
      var user = auth.currentUser;
      user.delete().then(function() {
        console.log("User account successfully deleted!");
      }).catch(function(error) {
        console.log("Error deleting user account: ", error.toString());
      });
      dispatch(userLogout());
      dispatch(ethreeReset());
    }
    else {
      console.log("Unable to unregister your subscription to the end-to-end encryption service...")
    }
    console.log('deleting account....')
  }

  function userLogout() { return { type: userConstants.LOGOUT } }
  function ethreeReset() { return { type: eThreeConstants.ETHREE_RESET } }
}