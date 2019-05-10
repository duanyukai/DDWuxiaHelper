import {
  COPY_SET,
  RESET_ALL,
  SELECT_SET,
  SET_5d_ITEM_PROP,
  SET_SKILL_LEVEL,
  SET_SKILL_TYPES,
  SET_XINREN
} from '../actions';
import merge from 'lodash/merge';
import {zeroProps} from '../../../_commons/property_calc/player_props_calc';
import {mulProps, sumProps} from '../../../_commons/property_calc/player_props_calc';
import {getAllSkillCollectPoints, getAllSkillProps, getPlayerRealShimei5dPropsWithXinren} from "../utils/data_utils";

let singleShimeiInitState = {
  slots: [],
  props: {},  // 算好的属性表
  xinren: 0,
  base5d: {
    ld: 0, dc: 0, qj: 0, gg: 0, sf: 0
  },
  levels: {}
};

let shimeiDataInitState = {
  current: 0,
  curProps: {...zeroProps},
  sets: {
    0: {...singleShimeiInitState},
    1: {...singleShimeiInitState},
    2: {...singleShimeiInitState},
    3: {...singleShimeiInitState},
    4: {...singleShimeiInitState},
  }
};

export default function(state = shimeiDataInitState, action) {
  switch (action.type) {
  // 合并持久化数据
  case 'persist/REHYDRATE': {
    return merge(shimeiDataInitState, action.payload ? action.payload.shimeiData : {});
  }
  // 选择配置
  case SELECT_SET: {
    return {
      ...state,
      current: action.payload
    };
  }
  // 当前师妹套设置，传递给单师妹配置Reducer
  case SET_5d_ITEM_PROP:
  case SET_SKILL_TYPES:
  case SET_SKILL_LEVEL:
  case SET_XINREN: {
    let current = state.current;
    let set = state.sets[current];
    // 先设置配置
    let newSet = singleShimeiReducer(set, action);
    // 再重新计算属性
    newSet = recalcPlayerProps(newSet);
    return {
      ...state,
      sets: {
        ...state.sets,
        [current]: newSet
      }
    };
  }
  // 复制配置
  case COPY_SET: {
    let {src, dst} = action.payload;
    return {
      ...state,
      sets: {
        ...state.sets,
        [dst]: JSON.parse(JSON.stringify(state.sets[src]))
      }
    };
  }
  // 清空重置全部
  case RESET_ALL: {
    return {...shimeiDataInitState};
  }
  default:
    return state;
  }
}

function singleShimeiReducer(state, action) {
  switch (action.type) {
  // 设置五维单项属性
  case SET_5d_ITEM_PROP: {
    const {type, value} = action.payload;
    return {
      ...state,
      base5d: {
        ...state.base5d,
        [type]: value
      }
    };
  }
  // 设置信任度
  case SET_XINREN: {
    const percent = action.payload;
    return {
      ...state,
      xinren: percent
    };
  }
  // 设置当前所有技能
  case SET_SKILL_TYPES: {
    const list = action.payload;
    return {
      ...state,
      slots: [...list]
    };
  }
  // 设置技能等级
  case SET_SKILL_LEVEL: {
    const {skillTypeId, level} = action.payload;
    return {
      ...state,
      levels: {
        ...state.levels,
        [skillTypeId]: level
      }
    };
  }
  // // 选择精工等级
  // case SELECT_ENHANCE: {
  //   const {equipPosId, level} = action.payload;
  //   return {
  //     ...state,
  //     [equipPosId]: {
  //       ...state[equipPosId],
  //       enhanceLV: level
  //     }
  //   };
  // }
  }
}

// 每当改变属性计算的reducer触发，重新计算属性，并存储
function recalcPlayerProps(set) {

  // a.师妹五维折算比例
  let base5dProps = getPlayerRealShimei5dPropsWithXinren(set.base5d, set.xinren * 0.01);
  console.log('base5dProps', base5dProps);
  // b.最多五本技能，分别求完属性，最后求和
  let allSkillProps = getAllSkillProps(set.slots.reduce((map, id) => {map[id] = set.levels[id]; return map;}, {}), set.base5d);
  console.log('allSkillProps', allSkillProps);
  // c.计算所有的收集度数据
  let allCollectPoints = getAllSkillCollectPoints({...set.levels});  // 直接传入所有的。暂且不考虑冗余数据
  let allCollectPointsProps = {
    ld: allCollectPoints / 10,
    dc: allCollectPoints / 10,
    sf: allCollectPoints / 10,
    gg: allCollectPoints / 10,
    qj: allCollectPoints / 10
  };
  console.log('allCollectPointsProps', allCollectPointsProps);

  set.props = sumProps(base5dProps, allSkillProps, allCollectPointsProps);



  return set;
}