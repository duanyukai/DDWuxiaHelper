import React, { Component } from 'react';
import App from './components/app';

class Root extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    alert('本工具尚在制作中…');
  }

  render() {
    return (
        <App />
    )
  }
}

export default Root;