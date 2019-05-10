import {combineReducers} from 'redux';

import ShimeiDataReducer from './reducer_shimei_data';
import CurSkillTypeReducer from './reducer_cur_skill_type';

const shimeiEmuReducer = combineReducers({
  shimeiData: ShimeiDataReducer,
  curSkillType: CurSkillTypeReducer,

});

export default shimeiEmuReducer;
