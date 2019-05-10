import {
} from '../actions';
import merge from 'lodash/merge';
import {zeroProps} from '../../../_commons/property_calc/player_props_calc';
import {mulProps, sumProps} from '../../../_commons/property_calc/player_props_calc';
import {SELECT_SET} from "../actions";
import {SET_SINGLE_ZHILIAO_LEVEL} from "../actions";
import {SET_SHENBING_SKILL_LEVEL} from "../actions";
import {SET_CUR_SHENBING_ID} from "../actions";
import {COPY_SET} from "../actions";
import {RESET_ALL} from "../actions";

let singleShenbingInitState = {
  props: {},  // 算好的属性表
  zhiliaolevels: {},  // 各神兵质料对应等级，如善念之鞘：15级，即3重零3节 todo
  skillLevels: {},  // 各神兵技能对应等级，如气明？，15级，最高16级，和章节等级连锁，被三个质料等级共同限制
};

let shenbingInitState = {
  current: 0,
  curProps: {...zeroProps},
  sets: {
    0: {...singleShenbingInitState},
    1: {...singleShenbingInitState},
    2: {...singleShenbingInitState},
    3: {...singleShenbingInitState},
    4: {...singleShenbingInitState},
  }
};

export default function(state = shenbingInitState, action) {
  switch (action.type) {
  // 合并持久化数据
  case 'persist/REHYDRATE': {
    return merge(shenbingInitState, action.payload ? action.payload.shenbingData : {});
  }
  // 选择配置
  case SELECT_SET: {
    return {
      ...state,
      current: action.payload
    };
  }
  // 当前神兵套设置，传递给单神兵配置Reducer
  case SET_SINGLE_ZHILIAO_LEVEL:
  case SET_SHENBING_SKILL_LEVEL: {
    let current = state.current;
    let set = state.sets[current];
    // 先设置配置
    let newSet = singleShenbingReducer(set, action);
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
    return {...shenbingInitState};
  }
  default:
    return state;
  }
}

function singleShenbingReducer(state, action) {
  switch (action.type) {
  // 设置单个质料等级
  case SET_SINGLE_ZHILIAO_LEVEL: {
    const {type, level} = action.payload;
    return {
      ...state,
      zhiliaoLevels: {
        ...state.zhiliaoLevels,
        [type]: level
      }
    };
  }
  // 设置神兵技能（章节）等级
  case SET_SHENBING_SKILL_LEVEL: {
    const {type, level} = action.payload;
    return {
      ...state,
      skillLevels: {
        ...state.zhiliaoLevels,
        [type]: level
      }
    };
  }
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