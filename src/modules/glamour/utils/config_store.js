import {applyMiddleware, compose, createStore} from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import rootReducer from '../reducers';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';

const middlewares = [];

if (process.env.NODE_ENV === 'development') {
  const { logger } = require('redux-logger');

  middlewares.push(logger);
}

const persistConfig = {
  key: 'glamour-emu',
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