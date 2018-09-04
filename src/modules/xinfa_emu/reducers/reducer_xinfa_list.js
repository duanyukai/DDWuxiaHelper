import { FETCH_XINFA_LIST } from "../actions/index";

export default function(state = [], action) {
  switch (action.type) {
    case FETCH_XINFA_LIST:
      return action.payload;
  }
  return state;
}
