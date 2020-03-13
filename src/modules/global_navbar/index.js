import React, { Component } from 'react';
import LeftMenu from './left_menu';
import RightMenu from './right_menu';
import { Drawer, Button, Icon } from 'antd';

import './navbar.css';
import {Link} from "react-router-dom";

class GlobalNavbar extends Component {

  constructor(props) {
    super(props);

    this.state = {
      visible: false
    };

    this.showDrawer = this.showDrawer.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  showDrawer() {
    this.setState({
      visible: true
    });
  }

  onClose() {
    this.setState({
      visible: false
    });
  }

  render() {
    return (
      <nav styleName="menu">
        <div styleName="menu__logo">
          <Link to="/">段段天刀综合助手</Link>
        </div>
        <div styleName="menu__container">
          <div styleName="menu_left">
            <LeftMenu mode="horizontal" />
          </div>
          <div styleName="menu_right">
            <RightMenu mode="horizontal" />
          </div>
          <Button
            styleName="menu__mobile-button"
            type="primary"
            onClick={this.showDrawer}
          >
            <Icon type="align-right" />
          </Button>
          <Drawer
            placement="right"
            styleName="menu_drawer"
            closable={false}
            onClose={this.onClose}
            visible={this.state.visible}
          >
            <LeftMenu mode="inline" />
            <RightMenu mode="inline" />
          </Drawer>
        </div>
      </nav>
    );
  }
}

export default GlobalNavbar;