import { combineReducers } from 'redux';

import { user } from './user.reducer';
import { registration } from './registration.reducer';
import { alert } from './alert.reducer';
import { data } from './data.reducer';
import { navigation } from './navigation.reducer';
import { eThree } from './ethree.reducer';
import { widget } from './widget.reducer';
import { simulator } from './simulator.reducer';

const rootReducer = combineReducers({
  user,
  registration,
  alert,
  data,
  navigation,
  eThree,
  widget,
  simulator,
});

export default rootReducer;
