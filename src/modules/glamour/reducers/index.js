import {combineReducers} from 'redux';

import FashionPartsReducer from './reducer_fashion_parts';

const rootReducer = combineReducers({
  fashionParts: FashionPartsReducer
});

export default rootReducer;
