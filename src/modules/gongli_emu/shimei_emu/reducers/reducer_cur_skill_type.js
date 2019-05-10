import {SET_CUR_SKILL_TYPE} from '../actions';

export default function(state = 201, action) {
  switch (action.type) {
  case SET_CUR_SKILL_TYPE:
    return action.payload;
  default:
    return state;
  }
}