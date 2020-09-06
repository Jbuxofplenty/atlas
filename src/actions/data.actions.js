import { dataConstants } from '../constants';
import { db } from '../firebase';

// const dateformat = require('dateformat');
export const dataActions = {
  dataReset,
  getInstitutions,
};

function dataReset() {
  return dispatch => {
    dispatch(dataResetSuccess());
  }
  function dataResetSuccess() { return { type: dataConstants.DATA_RESET } }
}

function getInstitutions() {
  return dispatch => {
    db.collection("institutions").get().then(function(querySnapshot) {
      var institutions = {};
      querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        institutions[doc.id] = doc.data();
        dispatch(updateInstitutions(institutions));
      });
    })
    .catch(error => {
      console.log(error)
      dispatch(updateInstitutions({}));
    })
  }
  function updateInstitutions(institutions) { return { type: dataConstants.UPDATE_INSTITUTIONS, institutions } }
}