import xinfaList from '../assets/json/xinfa_list.json';

export const FETCH_XINFA_LIST = 'FETCH_XINFA_LIST';
export const SELECT_XINFA = 'SELECT_XINFA';
export const CHANGE_XINFA_CONFIG = 'CHANGE_XINFA_CONFIG';

export const INIT_CHONGXUE = 'INIT_CHONGXUE';
export const CHONGXUE = 'CHONGXUE';
export const FAST_CHONGXUE = 'FAST_CHONGXUE';
export const FAST_FULFILL_LEVELS = 'FAST_FULFILL_LEVELS';

export const PLACE_XINFA_SLOT = 'PLACE_XINFA_SLOT';
export const SELECT_QIANXIU_LEVEL = 'SELECT_QIANXIU_LEVEL';

export const SELECT_SKILL_LEVEL = 'SELECT_SKILL_LEVEL';

export const COPY_CONFIG = 'COPY_CONFIG';

export const REMOVE_ALL_LOCAL_DATA = 'REMOVE_ALL_LOCAL_DATA';

export const HANDLE_ERROR = 'HANDLE_ERROR';

export const SET_FIVE_DIM_ADDITION_PROPS = 'SET_FIVE_DIM_ADDITION_PROPS';

export function fetchXinfaList(keyword) {
  // const url = `${ROOT_URL}&q=${city},us`;
  // const request = axios.get(url);

  let filteredList = xinfaList;
  if(keyword !== "") {
    filteredList = xinfaList.filter(function (xinfa) {
      return xinfa.name.includes(keyword) || xinfa.pinyin[0].includes(keyword) || xinfa.pinyin[1].includes(keyword);
    });
  }

  return {
    type: FETCH_XINFA_LIST,
    payload: filteredList
  };
}

export function selectXinfa(xinfaName) {
  let xinfaData;
  if(!xinfaName) {
    xinfaData = {
      name: null,
      reinforce: [],
      skills: [],
      brkthruLevels: []
    };
  } else {
    // Promise
    xinfaData = import(`../assets/json/xinfa/${xinfaName}.json`);
  }
  return {
    type: SELECT_XINFA,
    payload: xinfaData
  }
}

// 普通冲穴（取消冲穴）单孔
export function chongxue(name, xinfaLevel, shujiId, shujiLevel) {
  return {
    type: CHONGXUE,
    payload: {name, xinfaLevel, shujiId, shujiLevel}
  };
}

// 快速填满前几重
export function fastFulFillLevels(name, level) {
  return {
    type: FAST_FULFILL_LEVELS,
    payload: {name, level}
  }
}

// 快速冲（取消）穴
export function fastBrkthruShuji(name, xinfaLevel, shujiIdLevelList) {
  return {
    type: FAST_CHONGXUE,
    payload: {name, xinfaLevel, shujiIdLevelList}
  }
}

// 切换心法配置
export function changeXinfaConfig(num) {
  return {
    type: CHANGE_XINFA_CONFIG,
    payload: num
  }
}

// 放置（取消）心法槽
export function placeXinfaSlot(slotId, xinfaName) {
  return {
    type: PLACE_XINFA_SLOT,
    payload: {slotId, xinfaName}
  }
}

// 选择潜修等级
export function selectQianxiuLevel(name, type, level) {
  return {
    type: SELECT_QIANXIU_LEVEL,
    payload: {name, type, level}
  }
}

// 选择技能等级
export function selectSkillLevel(xinfaName, skillName, skillLevel) {
  return {
    type: SELECT_SKILL_LEVEL,
    payload: {xinfaName, skillName, skillLevel}
  }
}

// 复制配置
export function copyConfig(indexFrom, indexTo) {
  return {
    type: COPY_CONFIG,
    payload: {indexFrom, indexTo}
  }
}

// 清除所有数据
export function removeAllLocalData() {
  return {
    type: REMOVE_ALL_LOCAL_DATA,
    payload: null
  }
}

// 设置五维加成属性
export function setFiveDimAdditionProps(data) {
  return {
    type: SET_FIVE_DIM_ADDITION_PROPS,
    payload: data
  }
}