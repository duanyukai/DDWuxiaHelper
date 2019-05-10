import React, { Component } from 'react';
import Row from 'antd/es/grid/row';
import Col from 'antd/es/grid/col';
import Drawer from 'antd/es/drawer/index';
import Button from 'antd/es/button/index';

import './css/app.css';

import Helmet from 'react-helmet/es/Helmet';

import GeneralSettingsPanel from '../../general_settings/components/app';
import WholePropTableContainer from '../containers/whole_prop_table';
import ShenbingSelectContainer from '../containers/shenbing_select';
import ZhiliaoSelectContainer from '../containers/zhiliao_select';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showBasicSettings: false
    };
  }

  render() {
    return <div styleName="whole-page">
      <Helmet defer={false}>
        <meta charSet="utf-8"/>
        <title>段段天刀神兵模拟器，精确模拟神兵功力属性数据，完整神兵故事文案、配音 | 段段天刀综合助手</title>
        <meta name="description" content="段段天刀神兵模拟器，精确模拟神兵功力属性数据，完整神兵故事文案、配音"/>
        <meta name="keywords" content="天刀神兵模拟器"/>
        <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
      </Helmet>
      <div styleName="page-container">
        <div style={{textAlign: 'center'}}>
          <h1 style={{fontSize: 30}}>段段天刀神兵模拟器</h1>
          <p>涵盖天刀神兵玩法精确的属性、消耗等级数据，完整故事文案与配音</p>
        </div>
        <Row style={{maxWidth: 750, margin: '0 auto', textAlign: 'center'}}>
          <Col xs={24} md={12}>
            基础配置
            。。。

          </Col>
          <Col xs={24} md={12} style={{textAlign: 'center'}}>
            <Button
              type="primary"
              onClick={() => this.setState({
                showBasicSettings: !this.state.showBasicSettings
              })}
            >
              角色通用基础设置
            </Button>
            <WholePropTableContainer />
          </Col>
        </Row>
        {/*神兵选择*/}
        <ShenbingSelectContainer />
        {/*质料选择*/}
        <ZhiliaoSelectContainer />

        <div style={{textAlign: 'center'}}>
          {/*<MainTable />*/}
        </div>
      </div>
      <Drawer
        title="功力模拟器通用配置"
        placement="right"
        closable={true}
        onClose={() => this.setState({showBasicSettings: false})}
        visible={this.state.showBasicSettings}
        zIndex={99999}
        className="changelog-drawer"
        width=""
      >
        <GeneralSettingsPanel />
      </Drawer>
    </div>;
  }
}

export default App;
