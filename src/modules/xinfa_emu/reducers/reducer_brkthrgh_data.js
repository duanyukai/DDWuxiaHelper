import Ajv from 'ajv';

import {SELECT_XINFA, CHONGXUE, CHANGE_XINFA_CONFIG} from "../actions/index";

import localDataSchema from '../assets/json_schema/local_tupo_data.json';
import {
  COPY_CONFIG,
  FAST_CHONGXUE, FAST_FULFILL_LEVELS, PLACE_XINFA_SLOT, REMOVE_ALL_LOCAL_DATA, SELECT_QIANXIU_LEVEL,
  SELECT_SKILL_LEVEL
} from "../actions";

let localDataTemplate = {
  current: 0,
  slots: [[],[],[],[],[]],
  chongxue: [{}, {}, {}, {} ,{}]
};

export default function(state = {
  ...localDataTemplate
}, action) {
  // 验证本地数据合法性
  let ajv = new Ajv();
  let validate = ajv.compile(localDataSchema);
  let valid = validate(state);
  if (!valid) {
    console.log("验证错误", validate.errors);
    alert("本地数据校验出错，将为您初始化本地数据");
    return {
      ...localDataTemplate
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
          },
          qianxiuLevels: {'ld': 0, 'qj': 0, 'gg': 0, 'dc': 0, 'sf': 0},
          skillLevels: {}
        };
      }
      return newState;
    case CHONGXUE:
      // 单枢机冲穴
      let curLevel = newState.chongxue[newState.current][action.payload.name].curLevelCX;
      curLevel[action.payload.shujiId] = action.payload.shujiLevel;
      return newState;

    case FAST_FULFILL_LEVELS:
      let chongxueData = newState.chongxue[newState.current][action.payload.name];
      chongxueData.fulfilledLevel = action.payload.level;
      chongxueData.curLevelCX = {
        "0": 1
      };
      return newState;

    case FAST_CHONGXUE:
      // 快速冲穴，按照数组依次修改
      curLevel = newState.chongxue[newState.current][action.payload.name].curLevelCX;
      action.payload.shujiIdLevelList.forEach(({ shujiId, shujiLevel }) => {
        curLevel[shujiId] = shujiLevel;
      });
      return newState;

    case CHANGE_XINFA_CONFIG:
      console.log("切换心法配置");
      newState.current = action.payload;
      return newState;

    case PLACE_XINFA_SLOT:
      newState.slots[newState.current][action.payload.slotId] = action.payload.xinfaName;
      console.log(action.payload.xinfaName);
      return newState;

    case SELECT_QIANXIU_LEVEL:
      // 选择潜修等级
      let qianxiuLevels = newState.chongxue[newState.current][action.payload.name].qianxiuLevels;
      qianxiuLevels[action.payload.type] = action.payload.level;
      return newState;

    case SELECT_SKILL_LEVEL:
      let skillLevels = newState.chongxue[newState.current][action.payload.xinfaName].skillLevels;
      skillLevels[action.payload.skillName] = action.payload.skillLevel;
      return newState;

    case COPY_CONFIG:
      let from = action.payload.indexFrom;
      let to = action.payload.indexTo;
      newState.chongxue[to] = JSON.parse(JSON.stringify(newState.chongxue[from]));
      newState.slots[to] = JSON.parse(JSON.stringify(newState.slots[from]));
      return newState;

    case REMOVE_ALL_LOCAL_DATA:
      return localDataTemplate;
  }
  return state;
}
