import { dataConstants } from '../constants';

// const dateformat = require('dateformat');
export const dataActions = {
  dataReset,
};

function dataReset() {
  return dispatch => {
    dispatch(dataResetSuccess());
  }
  function dataResetSuccess() { return { type: dataConstants.DATA_RESET } }
}
