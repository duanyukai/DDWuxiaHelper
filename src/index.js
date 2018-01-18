// 加载polyfill
import 'babel-polyfill';

import React, { Component } from 'react';
import { render } from 'react-dom';
import Index from './modules/App';

// let store = createStore(appReducer);


//<Provider store={store}>
//  <Index />
//</Provider>

render(
  <Index />
  ,
  document.getElementById('app')
);
