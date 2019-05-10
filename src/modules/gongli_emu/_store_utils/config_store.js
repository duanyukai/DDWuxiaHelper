import {applyMiddleware, compose, createStore} from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage/index';
import { createStateSyncMiddleware } from 'redux-state-sync';

import rootReducer from '../_reducers';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';

// 中间件
const middlewares = [
  // createStateSyncMiddleware({blacklist: ['TOGGLE_TODO']})  // 网页间state同步
];

// 开发环境LOG
if (process.env.NODE_ENV === 'development') {
  const { logger } = require('redux-logger');
  middlewares.push(logger);
}

// state持久化
const persistConfig = {
  key: 'gongli-emu',
  storage,
  // whitelist: ['shimeiData', 'menpaiId'],  // 不管白名单
  stateReconciler: autoMergeLevel2
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default () => {
  // let store = createStore(persistedReducer);
  let store = compose(applyMiddleware(...middlewares))(createStore)(persistedReducer);
  let persistor = persistStore(store);
  return { store, persistor };
};