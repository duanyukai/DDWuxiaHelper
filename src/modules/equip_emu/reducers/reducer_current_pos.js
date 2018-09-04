import {SELECT_EQUIP_POS} from "../actions";

export default function(state = 'zhuwu', action) {
  switch (action.type) {
    case SELECT_EQUIP_POS:
      return action.payload;
    default:
      return state;
  }
}