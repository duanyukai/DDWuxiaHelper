import {SET_CUR_ZHILIAO_ID} from '../actions';

export default function(state = 100, action) {  // 默认质料id hardcode一下 todo
  switch (action.type) {
  case SET_CUR_ZHILIAO_ID:
    return action.payload;
  default:
    return state;
  }
}