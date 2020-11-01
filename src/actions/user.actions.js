import { userConstants, eThreeConstants } from '../constants';
import { alertActions, dataActions, eThreeActions, widgetActions } from './';
import OAuthObject from 'oauth2';
import { auth, db } from "../helpers/firebase";
import { apiBaseUrl, generateRandomId, p } from 'helpers';

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
  return dispatch => {
    dispatch(widgetActions.resetWidgets());
    dispatch(dataActions.dataReset());
    dispatch(reset());
  }
  function reset() { return { type: userConstants.LOGIN_RESET } }
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

function loginFailure(loginError, error, userData) {
  return {
    type: userConstants.LOGIN_FAILURE,
    loginError,
    error,
    userData
  }
}

/////////////////////
// Login/Signup
/////////////////////

const defaultUser = {    
  username: "",
  firstName: "",
  lastName: "",
  phoneNumber: "",
  headshot: "",
  backedUp: false,
  provider: "",
  twoFactorAuth: false,
  whileYouWereAway: {
    enabled: true,
    lastShownMilli: 0,
  },
  financialData: {},
  e2ee: false,
}

function commonLogin(user, backedUp) {
  return async dispatch => {
    await dataActions.getFinancialDataFirestore("accessTokens", user.e2ee);
    await dataActions.getFinancialDataFirestore("accounts", user.e2ee);
    var localKeyPresent = true;
    if(user.e2ee) {
      localKeyPresent = await eThreeActions.instantLocalKeyPresent();
    }
    if(localKeyPresent) {
      var tempAccounts = await dataActions.getFinancialData("accounts");
      Object.keys(tempAccounts).forEach(key => {
        var accountName = tempAccounts[key].displayName;
        var accountObject = OAuthObject['Plaid'];
        if(!tempAccounts[key].plaid) {
          accountObject = OAuthObject[accountName];
        }
        var pullConfig = JSON.parse(JSON.stringify(accountObject.pullConfig));
        pullConfig.minimal = true;
        pullConfig.name = tempAccounts[key].displayName;
        accountObject.pullAccountData(pullConfig);
      })
    }
    dispatch(widgetActions.getAllFirebaseWidgets());
    dispatch(request(false));
    dispatch(success(true, user));
    dispatch(updateBackedUp(backedUp));
  }
}

function request(isLoginPending) { return { type: userConstants.LOGIN_REQUEST, isLoginPending } }
function success(isLoginSuccess, userData) { return { type: userConstants.LOGIN_SUCCESS, isLoginSuccess, userData } }

function login(user) {
  return dispatch => {
    var tempUser = {};
    if (user) {
      user = user.user;
      dispatch(request(true));
      db.collection("users").doc(user.uid).get().then(async function (snapshot) {
        tempUser = snapshot.data();
        await dispatch(scrubUser(tempUser));
        let backedUp = snapshot.data().backedUp;
        if(tempUser.e2ee) {
          await eThreeActions.initializeEThree();
        }
        dispatch(commonLogin(tempUser, backedUp));
      },
        error => {
          dispatch(request(false));
          dispatch(loginFailure(true, error.toString(), {}, {}));
          dispatch(alertActions.error(error.toString()));
        });
      }
      else{
        dispatch(request(false));
        dispatch(loginFailure(true, "Passed user is null!", {}, {}));
        dispatch(alertActions.error("Passed user is null!"));
      };

  };
}

function facebookLogin(result) {
  return dispatch => {
    var token = result.credential.accessToken;
    var user = result.user;
    dispatch(request(true));
    if (user) {
      let backedUp = false;
      var tempUser = {};
      db.collection("users").doc(user.uid).get().then(async function (snapshot) {
        if(snapshot.data()) {
          tempUser = snapshot.data();
          tempUser["facebookCredential"] = token;
          backedUp = snapshot.data().backedUp;
        }
        else {
          Object.assign(tempUser, defaultUser)
          tempUser.email = user.email;
          tempUser.username = user.displayName;
          tempUser.headshot = user.photoURL;
          tempUser.provider = "facebook";
          tempUser.randomId = generateRandomId();
          await db.collection("users").doc(user.uid).set(tempUser);
        }
        if(tempUser.e2ee) {
          await eThreeActions.initializeEThree();
        }
        await dispatch(scrubUser(tempUser));
        dispatch(commonLogin(tempUser, backedUp));
      },
        error => {
          dispatch(request(false));
          dispatch(loginFailure(true, error.toString(), {}, {}));
          dispatch(alertActions.error(error.toString()));
        });
    }
    else {
      dispatch(request(false));
      dispatch(loginFailure(true, "Passed user is null!", {}, {}));
      dispatch(alertActions.error("Passed user is null!"));
    }
  };
}

function googleLogin(result) {
  return dispatch => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    dispatch(request(true));
    var tempUser = {};
    if (user) {
      let backedUp = false;
      db.collection("users").doc(user.uid).get().then(async function (snapshot) {
        if(snapshot.data()) {
          tempUser = snapshot.data();
          tempUser["googleCredential"] = token;
          backedUp = snapshot.data().backedUp;
        }
        else {   
          Object.assign(tempUser, defaultUser)
          tempUser.email = user.email;
          tempUser.username = user.displayName;
          tempUser.headshot = user.photoURL;
          tempUser.provider = "google";
          tempUser.randomId = generateRandomId();
          await db.collection("users").doc(user.uid).set(tempUser);
        }
        if(tempUser.e2ee) {
          await eThreeActions.initializeEThree();
        }
        await dispatch(scrubUser(tempUser));
        dispatch(commonLogin(tempUser, backedUp));
      },
        error => {
          dispatch(request(false));
          dispatch(loginFailure(true, error.toString(), {}, {}));
          dispatch(alertActions.error(error.toString()));
        });
    }    
    else {
      dispatch(request(false));
      dispatch(loginFailure(true, "Passed user is null!", {}, {}));
      dispatch(alertActions.error("Passed user is null!"));
    }

  };
}

function register(email, firstName, password) {
   return dispatch => {
      dispatch(request, true, {});
      auth.createUserWithEmailAndPassword(email, password).then(async (user) => {
        var tempUser = {};
        Object.assign(tempUser, defaultUser)
        tempUser.email = email;
        tempUser.firstName = firstName;
        tempUser.headshot = "https://s3.amazonaws.com/dejafood.com/mobile_assets/deja_gradient.png";
        tempUser.provider = "atlas";
        dispatch(sendVerificationEmail());
        tempUser.randomId = generateRandomId();
        await db.collection("users").doc(user.uid).set(tempUser);
        let backedUp = tempUser.backedUp;
        await dispatch(scrubUser(tempUser));
        dispatch(commonLogin(tempUser, backedUp));
        dispatch(alertActions.clear());
      }).catch(function(error) {
      dispatch(loginFailure(true, error.toString(), {}, {}));
      dispatch(alertActions.error(error.toString()));
    });
  };
}

/////////////////////
// Firebase utilities
/////////////////////

function scrubUser(user) {
  return async dispatch => {
    var uid = auth.currentUser.uid;
    var password = uid.concat(user.randomId);
    var financialDataTypes = ["accessTokens", "accounts"];
    financialDataTypes.forEach(async type => {
      var crypted = await eThreeActions.cryptoEncrypt(type, password);
      dispatch(dataActions.financialDataTypeMap[type].storeUpdateFunction(crypted, user.financialData[crypted]));
      delete user.financialData[crypted];
    })
    delete user.randomId;
  }
}

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
  return async (dispatch, getState) => {
    await widgetActions.saveAllFirebaseWidgets();
    let eThreeLoggedOut = true;
    const { userData } = getState().user;
    if(userData.e2ee) {
      eThreeLoggedOut = await eThreeActions.logout();
    }
    if(eThreeLoggedOut) {
      auth.signOut();
      dispatch(userLogout());
      dispatch(ethreeReset());
      dispatch(dataActions.dataReset());
      dispatch(widgetActions.resetWidgets());
    }
    else {
      p("EThree unable to log out the user!");
      dispatch(alertActions.error("EThree unable to log out the user!"));
    }
  }

  function userLogout() { return { type: userConstants.LOGOUT } }
  function ethreeReset() { return { type: eThreeConstants.ETHREE_RESET } }
}

function deleteAccount(uid) {
  return async (dispatch, getState) => {
    // Very yucky, only way to tell if the user needs to sign in again before deleting his/her account
    let success = await auth.currentUser.updatePassword("password").then(() => {return true}).catch(e => {
      if (e.code === 'auth/requires-recent-login') {
        dispatch(alertActions.error(e.toString()));
        return false;
      }
      return true;
    });
    if (success) {
      let eThreeUnregistered = true;
      const { userData } = getState().user;
      if(userData.e2ee) {
        eThreeUnregistered = await eThreeActions.unregister();
      }
      if(eThreeUnregistered) {
        if(userData.e2ee) {
          p("Successfully unregistered your subscription to the end-to-end encryption service...")
        }
        db.collection("users").doc(uid).delete().then(function() {
            p("User data successfully deleted from our databases!");
        }).catch(function(error) {
            p("Error removing user data from database: ", error.toString());
        });
        var user = auth.currentUser;
        user.delete().then(function() {
          p("User account successfully deleted!");
        }).catch(function(error) {
          p("Error deleting user account: ", error.toString());
        });
        dispatch(userLogout());
        dispatch(ethreeReset());
        dispatch(dataActions.dataReset());
      }
      else {
        p("Unable to unregister your subscription to the end-to-end encryption service...")
      }
    }
  }

  function userLogout() { return { type: userConstants.LOGOUT } }
  function ethreeReset() { return { type: eThreeConstants.ETHREE_RESET } }
}