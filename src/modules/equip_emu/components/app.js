import React, { Component } from 'react';
import Row from 'antd/es/grid/row';
import Col from 'antd/es/grid/col';
import Card from 'antd/es/card/index';
import EquipSetContainer from '../containers/equip_set';
import BaseSettingsContainer from '../containers/base_settings';
import SingleEquipSettingsContainer from '../containers/single_equip_settings';
import PropPanelContainer from '../containers/prop_panel';
import {Helmet} from "react-helmet";

class App extends Component {
  render() {
    return (
      <div style={{background: '#ebebeb', padding: '30px 16px'}}>
        <Helmet defer={false}>
          <meta charSet="utf-8"/>
          <title>天刀装备模拟器，精工琢磨珑铸词缀完全模拟 | 段段天刀综合助手</title>
          <meta name="keywords" content="天刀装备模拟器"/>
          <meta name="viewport" content="width=1024"/>
        </Helmet>
        <Row gutter={16}>
          <Col xs={24} sm={24} md={24} lg={7} xl={6} xxl={5}>
            <div>
              <Card title="装备面板" style={{ width: '100%' }}>
                <EquipSetContainer />
              </Card>
            </div>
            <div>
              <Card title="属性面板" style={{ width: '100%', marginTop: 16}}>
                <PropPanelContainer />
              </Card>
            </div>
          </Col>
          <Col xs={24} sm={24} md={24} lg={17} xl={18} xxl={19}>
            <div>
              <Card title="基础配置面板" style={{ width: '100%'}}>
                <BaseSettingsContainer />
              </Card>
            </div>
            <div>
              <Card title="单装备精工、琢磨、珑铸、词缀配置面板" style={{ width: '100%', marginTop: 16 }}>
                <SingleEquipSettingsContainer />
              </Card>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default App;
