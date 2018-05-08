import { combineReducers } from "redux";
import XinfaListReducer from "./reducer_xinfa_list";
import XinfaDataReducer from "./reducer_xinfa_data";
import BrkThrghDataReducer from "./reducer_brkthrgh_data";

const rootReducer = combineReducers({
  xinfaList: XinfaListReducer,
  xinfaData: XinfaDataReducer,
  brkthruData: BrkThrghDataReducer
});

export default rootReducer;
