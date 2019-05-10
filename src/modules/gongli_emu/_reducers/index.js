import {combineReducers} from 'redux';

import ShimeiEmuReducer from '../shimei_emu/reducers';
import ShenbingEmuReducer from '../shenbing_emu/reducers';
import GeneralReducer from '../general_settings/reducers';

const rootReducer = combineReducers({
  shimeiEmu: ShimeiEmuReducer,
  shenbingEmu: ShenbingEmuReducer,
  generalSettings: GeneralReducer,
});

export default rootReducer;
