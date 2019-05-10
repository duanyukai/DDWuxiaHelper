import React, { Component } from 'react';
import Row from 'antd/es/grid/row';
import Col from 'antd/es/grid/col';
import Card from 'antd/es/card/index';
import EquipSetContainer from '../containers/equip_set';
import BaseSettingsContainer from '../containers/base_settings';
import SingleEquipSettingsContainer from '../containers/single_equip_settings';
import PropPanelContainer from '../containers/prop_panel';
import {Helmet} from 'react-helmet';
import Collapse from 'antd/es/collapse/Collapse';

import './css/app.css';
import TextAd from '../../_commons/ad/components/text_ad';
import BannerAd from '../../_commons/ad/components/banner_ad';

class App extends Component {
  render() {
    return (
      <div style={{background: '#ebebeb', padding: '30px 16px'}}>
        <Helmet defer={false}>
          <meta charSet="utf-8"/>
          <title>天刀装备模拟器，精确模拟精工、琢磨、珑铸、词缀之功力战力、属性 | 段段天刀综合助手</title>
          <meta name="description" content="段段天刀装备模拟器是一款数据精确，功能完整的模拟器，装备基础数据齐全，精工琢磨珑铸词缀等级数据精确，可以方便地模拟装备属性与功力战力值情况，方便在游戏内最优化地实际操作。"/>
          <meta name="keywords" content="天刀装备模拟器"/>
          <meta name="viewport" content="width=1024"/>
        </Helmet>
        <div style={{background: '#fff', margin: '-30px -16px 10px -16px', padding: '10px 40px', borderBottom: '1px solid rgb(232, 232, 232)'}}>
          <div style={{maxWidth: 1250, margin: '0 auto'}}>
            <Collapse bordered={false} defaultActiveKey={['1']} styleName="header-collapse">
              <Collapse.Panel header={
                <h1 style={{fontSize: 30, margin: 0}}>
                  {/*<img width={32} src="https://wuxia-tools-assets-1251080372.file.myqcloud.com/equip/icon/ICON_64_equip_coat_M_M_ZW_0013.png" />*/}
                  段段天刀装备模拟器
                </h1>
              } key="1"
              style={{
                border: 0
              }}
              >
                <div style={{padding: '0 30px'}}>
                  <p>
                    段段天刀装备模拟器是一款功能完善的《天涯明月刀OL》网游装备信息模拟工具。本工具覆盖所有装备信息，
                    可以自由搭配装备，完整地精确模拟精工、琢磨、珑铸、词缀数据，并提供功力战力计算及比较功能，以及装备信息可视化。
                  </p>
                  <p>
                    装备附加的“精工、琢磨、珑铸、词缀”的数据上也力求精准，大家可以方便地单独配置或批量配置这些属性。
                    在属性模拟方面，经段段实测，功力战力、属性数据误差均小于1，也就是说模拟器中的数据是比游戏中还要精确的。
                    使用本模拟器当然也可仅使用部分功能，比如想看看各装备部位的白薯紫薯词缀数据，可以直接前往词缀菜单翻阅即可。
                  </p>
                  <p>
                    11月更新中，新增了导入游戏内装备数据的功能，使得本工具的易用性得到了极大提高。您现在可以使用左侧导入按钮，
                    仅需输入用户ID，选择对应的游戏角色，即可完整精确地导入游戏中的PVP或PVE装备数据。
                  </p>
                  <p>
                    玩家交流QQ群：660695387 <a target="_blank"
                      href="//shang.qq.com/wpa/qunwpa?idkey=182f40b60ccba796a3798e2e45fd963ca5dc299e643aced13f468b41eb31799d"><img
                        border="0" src="//pub.idqqimg.com/wpa/images/group.png" alt="天刀助手交流群" title="天刀助手交流群" /></a>
                    反馈bug、讨论属性、水群都可以来哦～
                  </p>
                </div>
              </Collapse.Panel>
            </Collapse>
          </div>
        </div>
        <TextAd />
        <Row gutter={16} style={{maxWidth: 1250, margin: '0 auto'}}>
          <Col xs={24} sm={24} md={24} lg={8} xl={7} xxl={6}>
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
          <Col xs={24} sm={24} md={24} lg={16} xl={17} xxl={18}>
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
        <BannerAd/>
      </div>
    );
  }
}

export default App;
