import crypto from 'crypto';
import { eThreeConstants } from '../constants';
import { alertActions, dataActions } from 'actions';
import { db, functions, auth } from '../firebase';
import { EThree, KeyPairType } from '@virgilsecurity/e3kit-browser';

const algorithm = 'aes-256-ctr';

export const eThreeActions = {
  backupKey,
  initializeEThree,
  registerNewUser,
  deleteBackup,
  restoreKey,
  updatePassword,
  localKeyPresent,
  logout,
  unregister,
  rotateKey,
  cryptoPassword,
  cryptoEncrypt,
  cryptoDecrypt,
  eThreeDecrypt,
  eThreeEncrypt,
  convertE2EE,
};

// Virgil Security
async function initializeEThree() {
  const getToken = functions.httpsCallable('getVirgilJwt');
  const initializeFunction = () => getToken()
      .then(result => result.data.token)
      .catch(error => {
        console.log(error);
        return null;
      });
  if(!initializeFunction) {
    return null;
  }
  // initialize E3Kit with tokenCallback and keyPairType 
  // with specified post-quantum algorithm type (E3Kit uses Round5 
  // for encryption and Falcon for signature)
  const eThree = await EThree.initialize(initializeFunction, {
    keyPairType: KeyPairType.CURVE25519_ROUND5_ED25519_FALCON,
  }).then(async eThree => {
    console.log('Initialized EThree instance succesfully!')
    return eThree;
  }).catch(error => {
      // Error handling
      const code = error.code;
      // code === 'unauthenticated' if user not authenticated
      console.log(code, error)
      return null;
  });
  return eThree;
}

function registerNewUser() {
  return async dispatch => {
    const getToken = functions.httpsCallable('getVirgilJwt');
    const initializeFunction = () => getToken()
        .then(result => result.data.token)
        .catch(error => {
          console.log(error);
          return null;
        });
    if(!initializeFunction) {
      return null;
    }
    // initialize E3Kit with tokenCallback and keyPairType 
    // with specified post-quantum algorithm type (E3Kit uses Round5 
    // for encryption and Falcon for signature)
    const eThree = await EThree.initialize(initializeFunction, {
      keyPairType: KeyPairType.CURVE25519_ROUND5_ED25519_FALCON,
    }).then(async eThree => {
      await eThree.register()
        .then(() => {
          console.log('success')
          dispatch(complete(true));
        })
        .catch(e => {
          console.error('error: ', e)
          dispatch(complete(false));
        });
      console.log('Initialized EThree instance succesfully!')
      return eThree;
    }).catch(error => {
        // Error handling
        const code = error.code;
        // code === 'unauthenticated' if user not authenticated
        console.log(code, error)
        return null;
    });
    return eThree;
  }

  function complete(privateKeyPresent) { return { type: eThreeConstants.UPDATE_PRIVATE_KEY_PRESENT, privateKeyPresent } }
}

// nextE2EE = false if user is enabling E2EE
function convertE2EE(nextE2EE) {
  return async (dispatch) => {
    var financialDataTypes = ["accessTokens", "accounts"];
    financialDataTypes.forEach(async type => {
      var encryptedObject;
      var password = await cryptoPassword();
      var encryptedAccessTokensString = await cryptoEncrypt("accessTokens", password);
      var accessTokens = await dispatch(dataActions.getFinancialDataFirestore("accessTokens", !nextE2EE));
      if(nextE2EE) {
        encryptedObject = await eThreeEncrypt(accessTokens);
      }
      else {
        encryptedObject = await cryptoEncrypt(accessTokens, password);
      }
      var uid = auth.currentUser.uid;
      await db.collection("users").doc(uid).update({
        "financialData" : {
          [encryptedAccessTokensString]: encryptedObject
        }
      });
      dispatch(dataActions.financialDataTypeMap[type].storeUpdateFunction(encryptedAccessTokensString, encryptedObject));
    });
  }
}

async function eThreeEncrypt(item) {
  var eThree = await initializeEThree();
  var text = item;
  if(typeof item === 'object') {
    text = JSON.stringify(item);
  }
  var crypted = await eThree.authEncrypt(text);
  return crypted;
}

async function eThreeDecrypt(item) {
  var eThree = await initializeEThree();
  var decrypted = await eThree.authDecrypt(item);
  try {
    return JSON.parse(decrypted);
  } catch(e) {
    return decrypted;
  }
}

async function cryptoPassword() {
  var tempUserData;
  var uid = auth.currentUser.uid;
  await db.collection("users").doc(uid).get().then(async function (snapshot) {
    tempUserData = snapshot.data();
  });
  var randomId = tempUserData.randomId;
  var password = uid.concat(randomId);
  return password;
}

async function cryptoEncrypt(item, password) {
  let cipher = crypto.createCipher(algorithm, password);
  var crypted;
  if(typeof item === 'string') {
    crypted = cipher.update(item,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
  }
  else if(typeof item === 'object') {
    crypted = cipher.update(JSON.stringify(item),'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
  }
}

async function cryptoDecrypt(item, password) {
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(item,'hex','utf8');
  dec += decipher.final('utf8');
  try {
    return JSON.parse(dec);
  } catch(e) {
    return dec;
  }
}

function localKeyPresent() {
  return async dispatch => {
    const eThree = await initializeEThree().catch( e => {
      return false;
    });
    if(!eThree) {
      return false;
    }
    const hasLocalPrivateKey = await eThree.hasLocalPrivateKey().catch( e => {
      return false;
    });
    dispatch(complete(hasLocalPrivateKey));
    return hasLocalPrivateKey;
  }

  function complete(privateKeyPresent) { return { type: eThreeConstants.UPDATE_PRIVATE_KEY_PRESENT, privateKeyPresent } }
}

async function unregister() {
  const eThree = await initializeEThree();
  if(!eThree) {
    console.log("End-to-End encyption session has expired. Please log out and log back in to perform this action!");
    return false;
  }
  return await eThree.unregister()
  .then(async () => {
    console.log('Successfully unregistered your EThree account!')
    return true;
  })
  .catch(e => {
    console.error('error: ', e)
    return false;
  });
}

async function logout() {
  const eThree = await initializeEThree();
  if(!eThree) {
    console.log("End-to-End encyption session has expired. Please log out and log back in to perform this action!");
    return false;
  }
  return await eThree.cleanup()
  .then(async () => {
    console.log('Successfully deleted your private key in preparation for logging out!')
    return true;
  })
  .catch(e => {
    console.error('error: ', e)
    return false;
  });
}

function backupKey(keyPassword, uid) {
  return async dispatch => {
    dispatch(alertActions.pending(true));
    const eThree = await initializeEThree();
    if(!eThree) {
      dispatch(alertActions.error("End-to-End encyption session has expired. Please log out and log back in to perform this action!"));
      dispatch(alertActions.visible(true));
      return;
    }
    await eThree.backupPrivateKey(keyPassword)
    .then(async () => {
      await db.collection("users").doc(uid).update({
        backedUp: true,
      }).then(() => {
        console.log('Successfully backed up your private key to the cloud!')
        dispatch(complete(true));
        dispatch(alertActions.success("Successfully backed up your private key to the cloud!"));
      }).catch(e => {
        dispatch(alertActions.error(e.toString()));
      });
    })
    .catch(e => {
      console.error('error: ', e)
      dispatch(alertActions.error(e.toString()));
      return false;
    });
  }

  function complete(backedUp) { return { type: eThreeConstants.UPDATE_BACKED_UP, backedUp } }
}

function rotateKey(uid) {
  return async dispatch => {
    dispatch(alertActions.pending(true));
    const eThree = await initializeEThree();
    if(!eThree) {
      dispatch(alertActions.error("End-to-End encyption session has expired. Please log out and log back in to perform this action!"));
      return;
    }

    await eThree.rotatePrivateKey()
      .then(async () => {   
        await db.collection("users").doc(uid).update({
          financialData: {},
        }).then(() => {
          console.log('Successfully generated your new private key! Make sure to make a backup!')
          dispatch(complete(true));
          dispatch(alertActions.success("Successfully generated your new private key! Make sure to make a backup!"));
        }).catch(e => {
          dispatch(complete(false));
          dispatch(alertActions.error(e.toString()));
        });
      })
      .catch(e => {
        console.error('error: ', e)
        dispatch(complete(false));
        dispatch(alertActions.error(e.toString()));
        return false;
      });
  }

  function complete(privateKeyPresent) { return { type: eThreeConstants.UPDATE_PRIVATE_KEY_PRESENT, privateKeyPresent } }
}

function restoreKey(keyPassword) {
  return async dispatch => {
    dispatch(alertActions.pending(true));
    const eThree = await initializeEThree();
    if(!eThree) {
      dispatch(alertActions.error("End-to-End encyption session has expired. Please log out and log back in to perform this action!"));
      return;
    }
    const hasLocalPrivateKey = await eThree.hasLocalPrivateKey();

    if (!hasLocalPrivateKey) await eThree.restorePrivateKey(keyPassword)
      .then(async () => {
        console.log('Successfully retrieved your private key from the cloud!')
        dispatch(alertActions.success("Successfully retrieved your private key from the cloud!"));
      })
      .catch(e => {
        console.error('error: ', e)
        dispatch(alertActions.error(e.toString()));
        return false;
      });
    else {
      console.log('Private key is already stored locally!')
      dispatch(alertActions.success("Private key is already stored locally!"));
    }
  }
}

function updatePassword(oldPassword, newPassword) {
  return async dispatch => {
    dispatch(alertActions.pending(true));
    const eThree = await initializeEThree();
    if(!eThree) {
      dispatch(alertActions.error("End-to-End encyption session has expired. Please log out and log back in to perform this action!"));
      return;
    }
    eThree.changePassword(oldPassword, newPassword)
      .then(async () => {
        console.log('Password updated successfully!')
        dispatch(alertActions.success("Password updated successfully!"));
      })
      .catch(e => {
        console.error('error: ', e)
        dispatch(alertActions.error(e.toString()));
        return false;
      });
  }
}

function deleteBackup(uid) {
  return async dispatch => {
    dispatch(alertActions.pending(true));
    const eThree = await initializeEThree();
    if(!eThree) {
      dispatch(alertActions.error("End-to-End encyption session has expired. Please log out and log back in to perform this action!"));
      return;
    }
    await eThree.resetPrivateKeyBackup()
    .then(async () => {
      await db.collection("users").doc(uid).update({
        backedUp: false,
      }).then(() => {
        console.log('Deleted backed up private key from the cloud!')
        dispatch(complete(false));
        dispatch(alertActions.success("Successfully deleted backed up private key from the cloud!"));
      }).catch(e => {
        dispatch(alertActions.error(e.toString()));
      });
    })
    .catch(e => {
      console.error('error: ', e)
      dispatch(alertActions.error(e.toString()));
      return false;
    });
  }

  function complete(backedUp) { return { type: eThreeConstants.UPDATE_BACKED_UP, backedUp } }
}