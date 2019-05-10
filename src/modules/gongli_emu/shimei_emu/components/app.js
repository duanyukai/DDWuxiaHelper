import React, { Component } from 'react';
import Row from 'antd/es/grid/row';
import Col from 'antd/es/grid/col';
import Drawer from 'antd/es/drawer/index';
import Button from 'antd/es/button/index';

import './css/app.css';

import GeneralSettingsPanel from '../../general_settings/components/app';

import MainTable from '../containers/main_table';
import SlotConfigContainer from '../containers/set_config';
import SelectedSkillsContainer from '../containers/selected_skills';
import Shimei5dConfigContainer from '../containers/shimei_5d_config';
import ShimeiXinrenduContainer from '../containers/shimei_xinrendu';
import SkillSelectContainer from '../containers/skill_select';
import WholePropTableContainer from '../containers/whole_prop_table';
import {Helmet} from 'react-helmet';
import TextAd from "../../../_commons/ad/components/text_ad";
import BannerAd from "../../../_commons/ad/components/banner_ad";

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
        <title>段段天刀小师妹属性模拟器，精确模拟师妹技能、基础五维、信任度、收集度功力面板数据 | 段段天刀综合助手</title>
        <meta name="description" content="段段天刀小师妹属性模拟器，可以精确模拟师妹技能、基础五维、信任度、收集度功力面板数据。师妹蓝色紫色金色技能数据齐全，涵盖天人合一、镇如五岳、势如破竹、威如天狱、怒如山火完整数据。"/>
        <meta name="keywords" content="天刀小师妹模拟器"/>
        <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
      </Helmet>
      <div styleName="page-container">
        <div style={{textAlign: 'center'}}>
          <h1 style={{fontSize: 30}}>段段天刀小师妹系统属性模拟器（内测版）</h1>
          <p>涵盖小师妹精确的基础五维、技能的属性及功力战力模拟计算</p>
        </div>
        <TextAd />
        <Row style={{maxWidth: 750, margin: '0 auto', textAlign: 'center'}}>
          <Col xs={24} md={12}>
            <SlotConfigContainer />
            <Shimei5dConfigContainer />
            <ShimeiXinrenduContainer />
            <SelectedSkillsContainer />
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
        <SkillSelectContainer />

        <div style={{textAlign: 'center'}}>
          <MainTable />
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
      <BannerAd />
    </div>;
  }
}

export default App;
