import {SET_CUR_SHENBING_ID} from '../actions';

export default function(state = 1, action) {  // 默认神兵id hardcode一下 todo
  switch (action.type) {
  case SET_CUR_SHENBING_ID:
    return action.payload;
  default:
    return state;
  }
}