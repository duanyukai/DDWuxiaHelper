import React, { Component } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import appReducer from './modules/root_reducer';
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
