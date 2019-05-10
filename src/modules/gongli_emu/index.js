import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import configStore from './_store_utils/config_store';
import {Route, Switch} from "react-router-dom";
import NotFoundPage from "../portal/components/404";
import Loadable from "react-loadable";
import Loading from "../tiandao_ui/components/loading";


const ShimeiEmu = Loadable({
  loader: () => import('./shimei_emu/components/app'),
  loading: () => <Loading />
});

const ShenbingEmu = Loadable({
  loader: () => import('./shenbing_emu/components/app'),
  loading: () => <Loading />
});

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
          <Switch>
            <Route path='/shimei' exact component={ShimeiEmu}/>
            <Route path='/shenbing' exact component={ShenbingEmu}/>
            <Route component={NotFoundPage}/>
          </Switch>
        </PersistGate>
      </Provider>
    );
  }
}

export default Root;