import React, { Component } from 'react';

import {Helmet} from 'react-helmet';
import Menu from 'antd/es/menu';
import SubMenu from 'antd/es/menu/SubMenu';
import Icon from 'antd/es/icon';
import Tabs from 'antd/es/tabs';
import Card from 'antd/es/card';
import Input from 'antd/es/input/Input';

import {FashionSetContainer} from '../containers/fashion_set_container';

import fashionSetData from '../assets/json/set.json';
import {CategoryMenu} from "../containers/category_menu";

class GongliRankApp extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };

  }

  componentDidMount() {

  }

  render() {
    return(
      <div>
        <Helmet defer={false}>
          <meta charSet="utf-8" />
          <title>天刀时装魅力模拟器，时装、配饰、染色、魅力一览 | 段段天刀综合助手</title>
          <meta name="keywords" content="天刀时装魅力模拟器" />
          <meta name="description" content="天刀时装魅力模拟器同步游戏内时装数据，方便您浏览时装、配饰、赏玩物品的魅力，便于决策魅力增长方式。" />
          <meta name="viewport" content="width=device-width"/>
        </Helmet>
        <div>
          <div style={{borderBottom: '1px solid #e8e8e8', textAlign: 'center', padding: '10px'}}>
            <h3>段段天刀时装站 + 魅力模拟器</h3>
            <p>
              说明
            </p>
          </div>
          <div style={{background: '#f0f2f5', padding: '20px'}}>
            <div style={{background: '#fff', border: '1px solid #e8e8e8', borderRadius: '7px', padding: '10px'}}>
              配置切换<br/>
              当前魅力值<br/>
              总览相关<br/>
              总览相关<br/>
              {/*多栏*/}
              <Tabs defaultActiveKey="1">
                <Tabs.TabPane tab={<span><Icon type="shopping-cart" theme="outlined" />时装套装</span>} key="1">
                  {/*三栏结构*/}
                  <FashionSetContainer />
                </Tabs.TabPane>
                <Tabs.TabPane tab={<span><Icon type="table" theme="outlined" />分类散件</span>} key="2">
                  Content of Tab Pane 2
                </Tabs.TabPane>
                <Tabs.TabPane tab={<span><Icon type="setting" theme="outlined" />快速设置</span>} key="3">
                  Content of Tab Pane 3
                </Tabs.TabPane>
                <Tabs.TabPane tab={<span><Icon type="ordered-list" theme="outlined" />魅力汇总</span>} key="4">
                  Content of Tab Pane 3
                </Tabs.TabPane>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default GongliRankApp;