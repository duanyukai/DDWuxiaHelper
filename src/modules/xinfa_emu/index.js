import React, { Component } from 'react';
import { Provider } from 'react-redux';
import reducers from './reducers';
import App from './components/app';
import {applyMiddleware, createStore, compose} from "redux";
import ReduxPromise from "redux-promise";
import persistState from 'redux-localstorage';

import { I18nextProvider, translate } from 'react-i18next';
import i18n from './i18n/index';

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
        <I18nextProvider i18n={i18n}>
          <App />
        </I18nextProvider>
      </Provider>
    )
  }
}

export default Root;