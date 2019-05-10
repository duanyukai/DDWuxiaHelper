import {combineReducers} from 'redux';

import MenpaiIdReducer from './reducer_menpai';

const rootReducer = combineReducers({
  menpaiId: MenpaiIdReducer,
});

export default rootReducer;
