import { combineReducers } from 'redux';

import { authentication } from './authentication.reducer';
import { registration } from './registration.reducer';
import { alert } from './alert.reducer';
import { data } from './data.reducer';
import { navigation } from './navigation.reducer';
import { eThree } from './ethree.reducer';

const rootReducer = combineReducers({
  authentication,
  registration,
  alert,
  data,
  navigation,
  eThree,
});

export default rootReducer;
