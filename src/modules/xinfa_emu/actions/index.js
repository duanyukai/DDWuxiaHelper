import xinfaList from '../assets/json/xinfa_list.json';

export const FETCH_XINFA_LIST = 'FETCH_XINFA_LIST';
export const SELECT_XINFA = 'SELECT_XINFA';
export const CHANGE_XINFA_CONFIG = 'CHANGE_XINFA_CONFIG';

export const INIT_CHONGXUE = 'INIT_CHONGXUE';
export const CHONGXUE = 'CHONGXUE';
export const FAST_CHONGXUE_LEVEL = 'FAST_CHONGXUE_LEVEL';


export const HANDLE_ERROR = 'HANDLE_ERROR';

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

export function fastBrkthruLevels(name, level) {
  return {
    type: FAST_CHONGXUE_LEVEL,
    payload: {name, level}
  }
}

// 普通冲穴（取消冲穴）单孔
export function chongxue(name, xinfaLevel, shujiId, shujiLevel) {
  console.log(23333333);
  return {
    type: CHONGXUE,
    payload: {name, xinfaLevel, shujiId, shujiLevel}
  };
}

// 快速冲穴
// export function fastChongxueBefore() {
//
// }


export function changeXinfaConfig(num) {
  console.log("切换action", num);
  return {
    type: CHANGE_XINFA_CONFIG,
    payload: num
  }
}
