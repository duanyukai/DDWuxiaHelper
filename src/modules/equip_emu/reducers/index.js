import {combineReducers} from 'redux';

import CurrentPosReducer from './reducer_current_pos';
import EquipDataReducer from './reducer_equip_data';
import MenpaiReducer from './reducer_menpai';

const rootReducer = combineReducers({
  currentPos: CurrentPosReducer,
  equipData: EquipDataReducer,
  menpaiId: MenpaiReducer
});

export default rootReducer;
