import React, { Component } from 'react';
import App from './components/app';

class Root extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    return (
        <App />
    )
  }
}

export default Root;