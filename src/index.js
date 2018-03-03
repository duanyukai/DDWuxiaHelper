// 加载polyfill
import 'babel-polyfill';

import React, { Component } from 'react';
import { render } from 'react-dom';
import Index from './modules/App';
import './global.css';

// let store = createStore(appReducer);


//<Provider store={store}>
//  <Index />
//</Provider>

document.addEventListener('DOMContentLoaded', function () {
  render(<Index />, document.getElementById('app'));
});
