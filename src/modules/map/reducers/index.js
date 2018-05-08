import { combineReducers } from "redux";

const rootReducer = combineReducers({
  blank: (state = {}, action) => state
});

export default rootReducer;
