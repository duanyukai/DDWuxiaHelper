import Ajv from 'ajv';

import {SELECT_XINFA, CHONGXUE, CHANGE_XINFA_CONFIG, FAST_CHONGXUE_LEVEL} from "../actions/index";

import localDataSchema from '../assets/json_schema/local_tupo_data.json';

export default function(state = {
  current: 0,
  chongxue: [{}, {}, {}, {} ,{}]
}, action) {
  // 验证本地数据合法性
  let ajv = new Ajv();
  var validate = ajv.compile(localDataSchema);
  var valid = validate(state);
  if (!valid) {
    console.log("验证错误", validate.errors);
    return {
      current: 0,
      chongxue: [{}, {}, {}, {} ,{}]
    };
  }
  let newState = {...state};
  switch (action.type) {
    case SELECT_XINFA:
      // 选择心法时，初始化该心法数据
      if(!state.chongxue[state.current].hasOwnProperty(action.payload.name)) {
        newState.chongxue[newState.current][action.payload.name] = {
          fulfilledLevel: -1,
          curLevelCX: {
            "0": 1
          }
        };
      }
      return newState;
    case FAST_CHONGXUE_LEVEL:
      newState.chongxue[newState.current][action.payload.name] = {
        fulfilledLevel: action.payload.level,
        curLevelCX: {
          "0": 1
        }
      };
      return newState;
    case CHONGXUE:
      let curLevel = newState.chongxue[newState.current][action.payload.name].curLevelCX;
      curLevel[action.payload.shujiId] = action.payload.shujiLevel;


      return newState;
    case CHANGE_XINFA_CONFIG:
      console.log("切换心法配置");
      newState.current = action.payload;
      return newState;
  }
  return state;
}
