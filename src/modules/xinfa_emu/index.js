import React, { Component } from 'react';
import { Provider } from 'react-redux';
import reducers from './reducers';
import App from './components/app';
import {applyMiddleware, createStore, compose} from "redux";
import ReduxPromise from "redux-promise";
import persistState from 'redux-localstorage';

import './i18n/index';

class Root extends Component {
  constructor(props) {
    super(props);

    this.store = createStore(
      reducers,
      compose(
        applyMiddleware(ReduxPromise),
        persistState([
          'brkthruData'
        ], {
          key: 'xinfa'
        })
      ));
  }

  render() {
    return (
      <Provider store={this.store}>
        <App />
      </Provider>
    );
  }
}

export default Root;