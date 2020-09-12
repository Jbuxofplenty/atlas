import { eThreeConstants } from '../constants';
import { alertActions } from './alert.actions';
import { db, functions } from '../firebase';
import { EThree, KeyPairType } from '@virgilsecurity/e3kit-browser';

export const eThreeActions = {
  backupKey,
  InitializeEThree,
  deleteBackup,
  restoreKey,
  updatePassword,
  localKeyPresent,
};

// Virgil Security
async function InitializeEThree(registerUser) {
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
    if(registerUser) {
      await eThree.register()
        .then(() => console.log('success'))
        .catch(e => console.error('error: ', e));
    }
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

function localKeyPresent() {
  return async dispatch => {
    const eThree = await InitializeEThree(false);
    if(!eThree) {
      return false;
    }
    const hasLocalPrivateKey = await eThree.hasLocalPrivateKey();
    dispatch(complete(hasLocalPrivateKey));
    return hasLocalPrivateKey;
  }

  function complete(privateKeyPresent) { return { type: eThreeConstants.UPDATE_PRIVATE_KEY_PRESENT, privateKeyPresent } }
}

function backupKey(keyPassword, uid) {
  return async dispatch => {
    dispatch(alertActions.pending(true));
    const eThree = await InitializeEThree(false);
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
        dispatch(alertActions.visible(true));
      }).catch(e => {
        dispatch(alertActions.error(e.toString()));
        dispatch(alertActions.visible(true));
      });
    })
    .catch(e => {
      console.error('error: ', e)
      dispatch(alertActions.error(e.toString()));
      dispatch(alertActions.visible(true));
      return false;
    });
  }

  function complete(backedUp) { return { type: eThreeConstants.UPDATE_BACKED_UP, backedUp } }
}

function restoreKey(keyPassword) {
  return async dispatch => {
    dispatch(alertActions.pending(true));
    const eThree = await InitializeEThree(false);
    if(!eThree) {
      dispatch(alertActions.error("End-to-End encyption session has expired. Please log out and log back in to perform this action!"));
      dispatch(alertActions.visible(true));
      return;
    }
    const hasLocalPrivateKey = await eThree.hasLocalPrivateKey();

    if (!hasLocalPrivateKey) await eThree.restorePrivateKey(keyPassword)
      .then(async () => {
        console.log('Successfully retrieved your private key from the cloud!')
        dispatch(alertActions.success("Successfully retrieved your private key from the cloud!"));
        dispatch(alertActions.visible(true));
      })
      .catch(e => {
        console.error('error: ', e)
        dispatch(alertActions.error(e.toString()));
        dispatch(alertActions.visible(true));
        return false;
      });
    else {
      console.log('Private key is already stored locally!')
      dispatch(alertActions.success("Private key is already stored locally!"));
      dispatch(alertActions.visible(true));
    }
  }
}

function updatePassword(oldPassword, newPassword) {
  return async dispatch => {
    dispatch(alertActions.pending(true));
    const eThree = await InitializeEThree(false);
    if(!eThree) {
      dispatch(alertActions.error("End-to-End encyption session has expired. Please log out and log back in to perform this action!"));
      dispatch(alertActions.visible(true));
      return;
    }
    eThree.changePassword(oldPassword, newPassword)
      .then(async () => {
        console.log('Password updated successfully!')
        dispatch(alertActions.success("Password updated successfully!"));
        dispatch(alertActions.visible(true));
      })
      .catch(e => {
        console.error('error: ', e)
        dispatch(alertActions.error(e.toString()));
        dispatch(alertActions.visible(true));
        return false;
      });
  }
}

function deleteBackup(uid) {
  return async dispatch => {
    dispatch(alertActions.pending(true));
    const eThree = await InitializeEThree(false);
    if(!eThree) {
      dispatch(alertActions.error("End-to-End encyption session has expired. Please log out and log back in to perform this action!"));
      dispatch(alertActions.visible(true));
      return;
    }
    await eThree.resetPrivateKeyBackup()
    .then(async () => {
      await db.collection("users").doc(uid).update({
        backedUp: true,
      }).then(() => {
        console.log('Deleted backed up private key from the cloud!')
        dispatch(complete(false));
        dispatch(alertActions.success("Successfully deleted backed up private key from the cloud!"));
        dispatch(alertActions.visible(true));
      }).catch(e => {
        dispatch(alertActions.error(e.toString()));
        dispatch(alertActions.visible(true));
      });
    })
    .catch(e => {
      console.error('error: ', e)
      dispatch(alertActions.error(e.toString()));
      dispatch(alertActions.visible(true));
      return false;
    });
  }

  function complete(backedUp) { return { type: eThreeConstants.UPDATE_BACKED_UP, backedUp } }
}