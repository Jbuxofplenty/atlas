import { dataConstants } from '../constants';
import { db, auth } from '../firebase';
import { eThreeActions, alertActions } from 'actions';
import { store } from 'helpers';
import OAuthObject from 'oauth2';

const financialDataTypeMap = {
  "accessTokens": {
    storeUpdateFunction: (encryptedAccessTokensKey, encryptedAccessTokens) => updateFinancialData(encryptedAccessTokensKey, encryptedAccessTokens)
  },
  "accounts": {
    storeUpdateFunction: (encryptedAccountsKey, encryptedAccounts) => updateAccounts(encryptedAccountsKey, encryptedAccounts)
  }
}

export const dataActions = {
  dataReset,
  getInstitutions,
  getFinancialDataFirestore,
  getFinancialData,
  storeFinancialDataFirestore,
  storeFinancialData,
  deleteAccount,
  financialDataTypeMap,
};

function dataReset() {
  return dispatch => {
    dispatch(dataResetSuccess());
  }
  function dataResetSuccess() { return { type: dataConstants.DATA_RESET } }
}

/////////////////////////////
////// Financial Data ///////
/////////////////////////////

function storeFinancialDataFirestore(institution, type, data) {
  return async (dispatch, getState) => {
    const { userData } = getState().user;
    var encryptedObject;
    var uid = auth.currentUser.uid;
    var password = await eThreeActions.cryptoPassword();
    var encryptedFinancialDataString = await eThreeActions.cryptoEncrypt(type, password);
    var financialData = await dispatch(getFinancialDataFirestore(type, userData.e2ee));
    if(userData.e2ee) {
      financialData[institution] = data;
      encryptedObject = await eThreeActions.eThreeEncrypt(financialData);
    }
    else {
      financialData[institution] = data;
      encryptedObject = await eThreeActions.cryptoEncrypt(financialData, password);
    }
    var encryptedFinancialData = {
      [encryptedFinancialDataString]: encryptedObject
    };
    await db.collection("users").doc(uid).set({
      "financialData" : encryptedFinancialData
    }, { merge: true });
    dispatch(financialDataTypeMap[type].storeUpdateFunction(encryptedFinancialDataString, encryptedObject));
  }
}

function storeFinancialData(institution, type, data) {
  return async (dispatch, getState) => {
    const { userData } = getState().user;
    var encryptedObject;
    var password = await eThreeActions.cryptoPassword();
    var encryptedFinancialDataString = await eThreeActions.cryptoEncrypt(type, password);
    var financialData = await getFinancialData(type, userData.e2ee);
    if(userData.e2ee) {
      financialData[institution] = data;
      encryptedObject = await eThreeActions.eThreeEncrypt(financialData);
    }
    else {
      financialData[institution] = data;
      encryptedObject = await eThreeActions.cryptoEncrypt(financialData, password);
    }
    dispatch(financialDataTypeMap[type].storeUpdateFunction(encryptedFinancialDataString, encryptedObject));
  }
}

function getFinancialDataFirestore(type, e2ee) {
  return async (dispatch) => {
    var uid = auth.currentUser.uid;
    var password = await eThreeActions.cryptoPassword();
    var encryptedFinancialDataKey = await eThreeActions.cryptoEncrypt(type, password);
    return db.collection("users").doc(uid).get().then(async function(snapshot) {
      var allFinancialData = snapshot.data().financialData;
      var encryptedFinancialData = allFinancialData[encryptedFinancialDataKey];
      var unEncryptedFinancialData;
      if(!encryptedFinancialData) {
        encryptedFinancialData = {};
        return {};
      }
      else if(e2ee) {
        unEncryptedFinancialData = await eThreeActions.eThreeDecrypt(encryptedFinancialData);
        dispatch(financialDataTypeMap[type].storeUpdateFunction(encryptedFinancialDataKey, encryptedFinancialData));
        return unEncryptedFinancialData;
      }
      else {
        unEncryptedFinancialData = await eThreeActions.cryptoDecrypt(encryptedFinancialData, password);
        dispatch(financialDataTypeMap[type].storeUpdateFunction(encryptedFinancialDataKey, encryptedFinancialData));
        return unEncryptedFinancialData;
      }
    })
    .catch(error => {
      console.log(error)
    })
  }
}

async function getFinancialData(type) {
  var { userData } = store.getState().user;
  var allFinancialData = store.getState().data;
  var password = await eThreeActions.cryptoPassword();
  var encryptedFinancialDataKey = await eThreeActions.cryptoEncrypt(type, password);
  var encryptedFinancialData = allFinancialData[encryptedFinancialDataKey];
  var unEncryptedFinancialData;
  if(!encryptedFinancialData) {
    encryptedFinancialData = {};
    return {};
  }
  else if(userData.e2ee) {
    unEncryptedFinancialData = await eThreeActions.eThreeDecrypt(encryptedFinancialData);
    return unEncryptedFinancialData;
  }
  else {
    unEncryptedFinancialData = await eThreeActions.cryptoDecrypt(encryptedFinancialData, password);
    return unEncryptedFinancialData;
  }
}

function deleteAccount(institution) {
  return async (dispatch, getState) => {
    dispatch(alertActions.pending(true));
    const { userData } = getState().user;
    // Revoke the access token first
    var financialData = await dispatch(getFinancialDataFirestore("accessTokens", userData.e2ee));
    var success = await OAuthObject[institution].revokeToken(financialData[institution].access_token);
    if(!success) {
      dispatch(alertActions.error("Unable to revoke your access token!"));
      return
    }
    var encryptedObject;
    var uid = auth.currentUser.uid;
    var password = await eThreeActions.cryptoPassword();
    const types = ["accessTokens", "accounts"];
    var encryptedFinancialData = {};
    types.forEach(async type => {
      var encryptedFinancialDataString = await eThreeActions.cryptoEncrypt(type, password);
      financialData = await dispatch(getFinancialDataFirestore(type, userData.e2ee));
      if(userData.e2ee) {
        delete financialData[institution];
        encryptedObject = await eThreeActions.eThreeEncrypt(financialData);
      }
      else {
        delete financialData[institution];
        encryptedObject = await eThreeActions.cryptoEncrypt(financialData, password);
      }
      encryptedFinancialData[encryptedFinancialDataString] = encryptedObject;
      dispatch(financialDataTypeMap[type].storeUpdateFunction(encryptedFinancialDataString, encryptedObject));
    })
    await db.collection("users").doc(uid).set({
      "financialData" : encryptedFinancialData
    });
    dispatch(alertActions.success("Successfully deleted your account!  Click the button to reload this page."));
  }
}

function updateFinancialData(key, accessTokens) { 
  return { type: dataConstants.UPDATE_ACCESS_TOKENS, key, accessTokens } 
}

function updateAccounts(key, accounts) { 
  return { type: dataConstants.UPDATE_ACCOUNTS, key, accounts } 
}

/////////////////////////////
/////// Institutions ////////
/////////////////////////////

function getInstitutions() {
  return dispatch => {
    db.collection("institutions").get().then(function(querySnapshot) {
      var institutions = [];
      querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        institutions[doc.id] = doc.data();
      });
      dispatch(updateInstitutions(institutions));
    })
    .catch(error => {
      console.log(error)
      dispatch(updateInstitutions({}));
    })
  }
  function updateInstitutions(institutions) { return { type: dataConstants.UPDATE_INSTITUTIONS, institutions } }
}