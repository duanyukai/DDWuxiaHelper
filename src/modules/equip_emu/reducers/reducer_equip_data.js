import merge from 'lodash/merge';

import {
  BATCH_SET_EQUIPS,
  CLEAR_CURRENT_CONFIG,
  CLEAR_CURRENT_POS,
  COPY_SET, RESET_ALL,
  SELECT_AFFIX,
  SELECT_ENHANCE,
  SELECT_EQUIP,
  SELECT_JIANGXIN,
  SELECT_LONGZHU,
  SELECT_SET,

} from '../actions';

let singleEquipInitState = {
  zhuwu: {id: null, enhanceLV: 0, jiangxinLV: 0, longzhuLV: 0, affix: {0: null, 1: null}},
  fuwu: {id: null, enhanceLV: 0, jiangxinLV: 0, longzhuLV: 0, affix: {0: null, 1: null}},
  anqi: {id: null, enhanceLV: 0, jiangxinLV: 0, longzhuLV: 0, affix: {0: null, 1: null}},

  shouzhuo: {id: null, enhanceLV: 0, jiangxinLV: 0, longzhuLV: 0, affix: {0: null, 1: null}},
  jiezhi1: {id: null, enhanceLV: 0, jiangxinLV: 0, longzhuLV: 0, affix: {0: null, 1: null}},
  jiezhi2: {id: null, enhanceLV: 0, jiangxinLV: 0, longzhuLV: 0, affix: {0: null, 1: null}},
  xianglian: {id: null, enhanceLV: 0, jiangxinLV: 0, longzhuLV: 0, affix: {0: null, 1: null}},

  toushi: {id: null, enhanceLV: 0, jiangxinLV: 0, longzhuLV: 0, affix: {0: null, 1: null}},
  huwan: {id: null, enhanceLV: 0, jiangxinLV: 0, longzhuLV: 0, affix: {0: null, 1: null}},
  shangyi: {id: null, enhanceLV: 0, jiangxinLV: 0, longzhuLV: 0, affix: {0: null, 1: null}},
  neichen: {id: null, enhanceLV: 0, jiangxinLV: 0, longzhuLV: 0, affix: {0: null, 1: null}},
  yidai: {id: null, enhanceLV: 0, jiangxinLV: 0, longzhuLV: 0, affix: {0: null, 1: null}},
  xiezi: {id: null, enhanceLV: 0, jiangxinLV: 0, longzhuLV: 0, affix: {0: null, 1: null}}
};

let initState = {
  current: 0,
  sets: {
    0: {...singleEquipInitState},
    1: {...singleEquipInitState},
    2: {...singleEquipInitState},
    3: {...singleEquipInitState},
    4: {...singleEquipInitState}
  }
};

export default function(state = initState, action) {
  switch (action.type) {
  // 合并持久化数据
  case 'persist/REHYDRATE': {
    return merge(initState, action.payload ? action.payload.equipData : {});
  }
  // 选择配置
  case SELECT_SET: {
    return {
      ...state,
      current: action.payload
    };
  }
  // 当前装备套设置，传递给单装备Reducer
  case SELECT_ENHANCE:
  case SELECT_JIANGXIN:
  case SELECT_LONGZHU:
  case SELECT_AFFIX:
  case SELECT_EQUIP:
  case CLEAR_CURRENT_POS:
  case CLEAR_CURRENT_CONFIG:
  case BATCH_SET_EQUIPS: {
    let current = state.current;
    let set = state.sets[current];
    let newSet = singleEquipReducer(set, action);
    console.log('newSet', newSet);
    return {
      ...state,  // todo 或者直接替换？
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
    return {...initState};
  }
  default:
    return state;
  }
}

function singleEquipReducer(state, action) {
  switch (action.type) {
  // 选择装备
  case SELECT_EQUIP: {
    const {equipPosId, equipId} = action.payload;
    return {
      ...state,
      [equipPosId]: {
        ...state[equipPosId],
        id: equipId
      }
    };
  }
  // 选择精工等级
  case SELECT_ENHANCE: {
    const {equipPosId, level} = action.payload;
    return {
      ...state,
      [equipPosId]: {
        ...state[equipPosId],
        enhanceLV: level
      }
    };
  }
  // 选择琢磨等级
  case SELECT_JIANGXIN: {
    const {equipPosId, level} = action.payload;
    return {
      ...state,
      [equipPosId]: {
        ...state[equipPosId],
        jiangxinLV: level
      }
    };
  }
  // 选择珑铸等级
  case SELECT_LONGZHU: {
    const {equipPosId, level} = action.payload;
    return {
      ...state,
      [equipPosId]: {
        ...state[equipPosId],
        longzhuLV: level
      }
    };
  }
  // 选择词缀
  case SELECT_AFFIX: {
    const {equipPosId, affixPos, affixType, affixLevel} = action.payload;
    let newAffix;
    if(affixType) {
      newAffix = {
        type: affixType,
        level: affixLevel
      };
    } else {
      newAffix = null;
    }

    return {
      ...state,
      [equipPosId]: {
        ...state[equipPosId],
        affix: {
          ...state[equipPosId].affix,
          [affixPos]: newAffix
        }
      }
    };
  }
  // 清空当前装备位置
  case CLEAR_CURRENT_POS: {
    const {equipPosId} = action.payload;
    return {
      ...state,
      [equipPosId]: {
        ...state[equipPosId],
        id: null, enhanceLV: 0, jiangxinLV: 0, longzhuLV: 0, affix: {0: null, 1: null} // todo elegant way
      }
    };
  }
  // 清空当前槽全部
  case CLEAR_CURRENT_CONFIG: {
    return {...singleEquipInitState};
  }
  // 批量设置
  case BATCH_SET_EQUIPS: {
    // 使用空白的合并即可
    return {...singleEquipInitState, ...action.payload.batchData};
  }
  default:
    return state;
  }

}