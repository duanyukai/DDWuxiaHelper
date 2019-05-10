export const SET_MENPAI = 'SET_MENPAI';

// 设置门派
export function setMenpai(menpaiId) {
  return {
    type: SET_MENPAI,
    payload: menpaiId
  };
}