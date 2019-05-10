export const SELECT_SET = 'SELECT_SET';
export const COPY_SET = 'COPY_SET';
export const RESET_ALL = 'RESET_ALL';
export const SET_SINGLE_ZHILIAO_LEVEL = 'SET_SINGLE_ZHILIAO_LEVEL';
export const SET_SHENBING_SKILL_LEVEL = 'SET_SHENBING_SKILL_LEVEL';
export const SET_CUR_SHENBING_ID = 'SET_CUR_SHENBING_ID';
export const SET_CUR_ZHILIAO_ID = 'SET_CUR_ZHILIAO_ID';

// 选择配置
export function selectSet(setId) {
  return {
    type: SELECT_SET,
    payload: setId
  };
}

// 复制配置
export function copySet(src, dst) {
  return {
    type: COPY_SET,
    payload: {src, dst}
  };
}

// 重置所有数据
export function resetAll() {
  return {
    type: RESET_ALL
  };
}

// 设置单个质料等级（-1为未解锁，0为刚解锁，最高16）
export function setSingleZhiliaoLevel(type, level) {
  return {
    type: SET_SINGLE_ZHILIAO_LEVEL,
    payload: {
      type, level
    }
  };
}

// 设置技能等级（即章节进度）
export function setShenbingSkillLevel(type, level) {
  return {
    type: SET_SHENBING_SKILL_LEVEL,
    payload: {
      type, level
    }
  };
}

// 设置当前选择的神兵
export function setCurShenbingId(shenbingId) {
  return {
    type: SET_CUR_SHENBING_ID,
    payload: shenbingId
  };
}

// 设置当前选择的质料
export function setCurZhiliaoId(zhiliaoId) {
  return {
    type: SET_CUR_ZHILIAO_ID,
    payload: zhiliaoId
  };
}