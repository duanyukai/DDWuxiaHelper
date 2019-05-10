import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import App from './components/app';
import configStore from './utils/config_store';

class Root extends Component {
  constructor(props) {
    super(props);

    let {store, persistor} = configStore();
    this.store = store;
    this.persistor = persistor;
  }

  render() {
    return (
      <Provider store={this.store}>
        <PersistGate loading={null} persistor={this.persistor}>
          <App />
        </PersistGate>
      </Provider>
    )
  }
}

export default Root;