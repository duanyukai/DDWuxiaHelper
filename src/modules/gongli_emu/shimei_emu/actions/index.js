export const SET_MENPAI = 'SET_MENPAI';
export const SELECT_SET = 'SELECT_SET';
export const COPY_SET = 'COPY_SET';
export const RESET_ALL = 'RESET_ALL';
export const SET_CUR_SKILL_TYPE = 'SET_CUR_SKILL_TYPE';
export const SET_SKILL_TYPES = 'SET_SKILL_TYPES';
export const SET_5d_ITEM_PROP = 'SET_5d_ITEM_PROP';
export const SET_XINREN = 'SET_XINREN';
export const SET_SKILL_LEVEL = 'SET_SKILL_LEVEL';

// 设置门派
export function setMenpai(menpaiId) {
  return {
    type: SET_MENPAI,
    payload: menpaiId
  };
}

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

// 设置五维单项属性
export function set5dItemProp(type, value) {
  return {
    type: SET_5d_ITEM_PROP,
    payload: {
      type, value
    }
  };
}

// 设置信任度(直接存百分比)
export function setXinren(percent) {
  return {
    type: SET_XINREN,
    payload: percent
  };
}

// 设置当前选择的技能
export function setCurSkillType(typeId) {
  return {
    type: SET_CUR_SKILL_TYPE,
    payload: typeId
  };
}

// 设置已选的所有技能列表
export function setSkillTypes(typeIdList) {
  return {
    type: SET_SKILL_TYPES,
    payload: typeIdList
  };
}

// 设置单技能等级
export function setSkillLevel(skillTypeId, level) {
  return {
    type: SET_SKILL_LEVEL,
    payload: {skillTypeId, level}
  };
}