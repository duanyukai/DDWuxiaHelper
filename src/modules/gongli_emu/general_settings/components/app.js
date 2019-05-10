import React, { Component } from 'react';

import './css/app.css';

import AllSettings from '../containers/all_settings';

class App extends Component {
  render() {
    return (
      <div style={{padding: '30px 16px'}}>
        <AllSettings />
      </div>
    );
  }
}

export default App;
