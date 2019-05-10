import {combineReducers} from 'redux';

import ShenbingDataReducer from './reducer_shenbing_data';
import CurShenbingIdReducer from './reducer_cur_shenbing_id';
import CurZhiliaoIdReducer from './reducer_cur_zhiliao_id';

const shenbingEmuReducer = combineReducers({
  shenbingData: ShenbingDataReducer,
  curShenbingId: CurShenbingIdReducer,
  curZhiliaoId: CurZhiliaoIdReducer,

});

export default shenbingEmuReducer;
