import { combineReducers } from 'redux';

import { authentication } from './authentication.reducer';
import { registration } from './registration.reducer';
import { alert } from './alert.reducer';
import { data } from './data.reducer';

const rootReducer = combineReducers({
  authentication,
  registration,
  alert,
  data
});

export default rootReducer;
