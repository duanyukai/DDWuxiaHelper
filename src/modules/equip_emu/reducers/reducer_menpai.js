import {SET_MENPAI} from '../actions';

export default function(state = 0, action) {
  switch (action.type) {
  case SET_MENPAI:
    return action.payload;
  default:
    return state;
  }
}