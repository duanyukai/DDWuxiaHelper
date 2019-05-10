import {applyMiddleware, compose, createStore} from 'redux/index';
import { persistStore, persistReducer } from 'redux-persist/src/index';
import storage from 'redux-persist/lib/storage/index';

import rootReducer from '../reducers';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';

const middlewares = [];

if (process.env.NODE_ENV === 'development') {
  const { logger } = require('redux-logger');

  middlewares.push(logger);
}

const persistConfig = {
  key: 'gongli-emu',
  storage,
  // whitelist: ['equipData', 'menpaiId'],
  stateReconciler: autoMergeLevel2
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default () => {
  // let store = createStore(persistedReducer);
  let store = compose(applyMiddleware(...middlewares))(createStore)(persistedReducer);
  let persistor = persistStore(store);
  return { store, persistor };
};