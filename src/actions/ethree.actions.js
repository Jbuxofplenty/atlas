import { eThreeConstants } from '../constants';
import { alertActions } from './alert.actions';
import { db } from '../firebase';
import { EThree } from '@virgilsecurity/e3kit-browser';

export const eThreeActions = {
  backupKey,
};

function backupKey(eThree, keyPassword) {
  return async dispatch => {
    await eThree.backupPrivateKey(keyPassword)
    .then(() => {
      console.log('success')
    })
    .catch(e => {
      console.error('error: ', e)
      return false;
    });
  }

  function complete(backedUp) { return { type: eThreeConstants.UPDATE_BACKED_UP, backedUp } }
}