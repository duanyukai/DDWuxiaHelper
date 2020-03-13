import React, { Component } from 'react';
import { Menu } from 'antd';

class RightMenu extends Component {
  render() {
    return (
      <Menu mode={this.props.mode} theme="dark">
        <Menu.Item key="contact">
          <a href="#">联系与捐助</a>
        </Menu.Item>
        {/*<Menu.Item key="app">*/}
        {/*  <a href="#">Signup</a>*/}
        {/*</Menu.Item>*/}
      </Menu>
    );
  }
}

export default RightMenu;
