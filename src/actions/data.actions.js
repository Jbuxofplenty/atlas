import { dataConstants } from '../constants';
import { db, auth } from '../firebase';
import { eThreeActions } from 'actions';
import { store } from 'helpers';

const financialDataTypeMap = {
  "accessTokens": {
    storeUpdateFunction: (encryptedFinancialDataKey, encryptedFinancialData) => updateAccessTokens(encryptedFinancialDataKey, encryptedFinancialData)
  },
  "accounts": {
    storeUpdateFunction: (encryptedFinancialDataKey, encryptedFinancialData) => updateAccounts(encryptedFinancialDataKey, encryptedFinancialData)
  }
}

export const dataActions = {
  dataReset,
  getInstitutions,
  getFinancialDataFirestore,
  getFinancialData,
  storeFinancialData,
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

function storeFinancialData(institution, type, data) {
  return async (dispatch, getState) => {
    const { userData } = getState().user;
    var encryptedObject;
    var uid = auth.currentUser.uid;
    var password = await eThreeActions.cryptoPassword();
    var encryptedAccessTokensString = await eThreeActions.cryptoEncrypt(type, password);
    var accessTokens = await dispatch(getFinancialDataFirestore(type, userData.e2ee));
    if(userData.e2ee) {
      accessTokens[institution] = data;
      encryptedObject = await eThreeActions.eThreeEncrypt(accessTokens);
    }
    else {
      accessTokens[institution] = data;
      encryptedObject = await eThreeActions.cryptoEncrypt(accessTokens, password);
    }
    var encryptedAccessTokens = {
      [encryptedAccessTokensString]: encryptedObject
    };
    await db.collection("users").doc(uid).set({
      "financialData" : encryptedAccessTokens
    }, { merge: true });
    dispatch(financialDataTypeMap[type].storeUpdateFunction(encryptedAccessTokensString, encryptedObject));
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

function updateAccessTokens(key, accessTokens) { 
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