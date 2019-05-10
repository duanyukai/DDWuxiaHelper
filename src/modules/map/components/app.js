import React, { Component } from 'react';

import leafletCss from 'leaflet/dist/leaflet.css';
import appCss from './css/app.css';

import WuxiaLeafletMap from './map';
import {
  Button, ButtonGroup, Checkbox, FormControl, Table,
} from 'react-bootstrap';

import markerTypeList from '../assets/json/marker_types.json';
import {Helmet} from 'react-helmet';
import Switch from '../../../../node_modules/antd/es/switch';
import Icon from '../../../../node_modules/antd/es/icon';
import Tabs from "../../../../node_modules/antd/es/tabs";
import AntdButton from "../../../../node_modules/antd/es/button/button";

class WuxiaMap extends Component {
  constructor(props) {
    super(props);

    // 设置各种标志初始显示状态
    let showState = {};
    markerTypeList.forEach(({id, name, data}) => {
      showState[id] = {
        show: true,
        showDetail: true
      };
    });

    this.state = {
      currentMapId: 'HZ',
      showMenu: true,
      showPosMarker: true,
      showState: showState
    };

    this.changeMenu = this.changeMenu.bind(this);
  }

  renderMapButtonGroup(array) {
    return array.map(({name, id}) => {
      return(
        <Button
          key={id}
          bsStyle={id === this.state.currentMapId ? 'primary' : 'default'}
          onClick={() => this.setState({currentMapId: id})}
        >
          {name}
        </Button>
      );
    });
  }

  changeMenu() {
    console.log('233', this.state.showMenu);
    this.setState({
      showMenu: !this.state.showMenu
    });
  }

  render() {
    return(
      <div style={{marginTop: '-50px'}}>
        <Helmet defer={false}>
          <meta charSet="utf-8" />
          <title>天刀地图助手，轻松查阅墨宝坐标、航海图鉴等 | 段段天刀综合助手</title>
          <meta name="keywords" content="天刀地图,天刀墨宝坐标,天刀航海图鉴" />
          <meta name="description" content="天刀地图助手是一个可交互的天刀地图，包括文士乐伶墨宝创作点、航海图鉴等内容。您可以有与游戏中相同的体验来快速精确查找坐标，并且有大量相关数据分享。" />
          <meta name="viewport" content="width=device-width"/>
        </Helmet>
        <WuxiaLeafletMap
          currentMapId={this.state.currentMapId}
          showState={this.state.showState}
          showPosMarker={this.state.showPosMarker}
        />

        <div styleName='appCss.menu-wrapper'>
          <AntdButton
            styleName='appCss.show-hide-btn'
            type="primary"
            onClick={this.changeMenu}
          >
            {this.state.showMenu ?
              <span><Icon type="menu-fold"/> 收起</span> :
              <span><Icon type="menu-unfold"/> 展开</span>
            }
          </AntdButton>
          <div style={{width: '100%', display: this.state.showMenu ? '' : 'none'}}>
            <div styleName='appCss.menu-inner'>
              <Tabs defaultActiveKey="1">
                <Tabs.TabPane key="1" tab='地图'>
                  <div styleName='appCss.scroll-wrapper'>
                    <div>
                      <p>
                        本地图助手尚为测试版，欢迎加入交流群660695387交流反馈建议与BUG。
                      </p>
                      <p>
                        您可善用“图层”等功能来筛选显示内容及详细程度。
                      </p>
                      <p>
                        20180522更新独立吃鸡地图。
                      </p>
                      <div>
                        <ButtonGroup styleName='appCss.map-btn-matrix-1'>
                          {this.renderMapButtonGroup([
                            {name: '一代宗师（徐海）', id: 'YDZS'}
                          ])}
                        </ButtonGroup>
                      </div>
                      <div>
                        <ButtonGroup styleName='appCss.map-btn-matrix-1'>
                          {this.renderMapButtonGroup([
                            {name: '中原', id: 'ZY'},
                            {name: '东海', id: 'DH'},
                            {name: '南海', id: 'NH'}
                          ])}
                        </ButtonGroup>
                      </div>
                      <div>
                        <ButtonGroup styleName='appCss.map-btn-matrix-1'>
                          {this.renderMapButtonGroup([
                            {name: '杭州', id: 'HZ'},
                            {name: '江南', id: 'JN'},
                            {name: '东越', id: 'DY'},
                            {name: '九华', id: 'JH'},
                            {name: '徐海', id: 'XH'},
                            {name: '开封', id: 'KF'},
                            {name: '秦川', id: 'QC'},
                            {name: '燕云', id: 'YY'},
                            {name: '巴蜀', id: 'BS'},
                            {name: '襄州', id: 'XZ'},
                            {name: '荆湖', id: 'JINGH'},
                            {name: '云滇', id: 'YD'}
                          ])}
                        </ButtonGroup>
                      </div>
                      <div>
                        <ButtonGroup styleName='appCss.map-btn-matrix-1'>
                          {this.renderMapButtonGroup([
                            {name: '移花岛', id: 'YH'},
                            {name: '太室山', id: 'TSS'},
                          ])}
                        </ButtonGroup>
                      </div>
                      <div>
                        <ButtonGroup styleName='appCss.map-btn-matrix-1'>
                          {this.renderMapButtonGroup([
                            {name: '海河州', id: 'HHZ'},
                            {name: '极境岛', id: 'JJD'},
                            {name: '松　林', id: 'SLWZ'},
                            {name: '长　洲', id: 'CZGY'},
                            {name: '嘲天宫', id: 'CTG'},
                            {name: '龙　渊', id: 'QLZY'}
                          ])}
                        </ButtonGroup>
                      </div>
                      <div>
                        <ButtonGroup styleName='appCss.map-btn-matrix-1'>
                          {this.renderMapButtonGroup([
                            {name: '　钱塘港', id: 'QTG'},
                            {name: '　江洋港', id: 'JYG'},
                            {name: '　泉州港', id: 'QZG'},
                            {name: '　望海岬', id: 'WHJ'},
                            {name: '　灵鹿岛', id: 'LLD'},
                            {name: '天涯盐场', id: 'TYYC'},
                            {name: '　沧浪岛', id: 'CLD'},
                            {name: '　幽灵岛', id: 'YLD'},
                            {name: '　宝矿山', id: 'BKS'},
                            {name: '琅嬛福地', id: 'LHFD'},
                            {name: '　大沧海', id: 'DCH'},
                            {name: '东海玉涡', id: 'DHYW'},
                          ])}
                        </ButtonGroup>
                      </div>
                    </div>
                  </div>
                </Tabs.TabPane>
                <Tabs.TabPane key="2" tab='图层'>
                  <div styleName='appCss.scroll-wrapper'>
                    <div>
                      显示大地标{' '}
                      <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked onChange={(checked) => this.setState({showPosMarker: checked})} />
                    </div>
                    <Table striped bordered condensed hover>
                      <thead>
                        <tr>
                          <th></th>
                          <th>
                            <Checkbox
                              inline
                              checked={Object.values(this.state.showState).map(({show}) => show).every(x => x)}
                              onChange={(e) => {
                                let showState = {...this.state.showState};
                                Object.keys(showState).forEach(v => showState[v].show = e.target.checked);
                                this.setState({showState});
                              }}
                            >
                            全选
                            </Checkbox>
                          </th>
                          <th>
                            <Checkbox
                              inline
                              checked={Object.values(this.state.showState).map(({showDetail}) => showDetail).every(x => x)}
                              onChange={(e) => {
                                let showState = {...this.state.showState};
                                Object.keys(showState).forEach(v => showState[v].showDetail = e.target.checked);
                                this.setState({showState});
                              }}
                            >
                            全选
                            </Checkbox>
                          </th>
                        </tr>
                        <tr>
                          <th>图例名称</th>
                          <th>是否显示</th>
                          <th>细节显示</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          markerTypeList.map(({id, name, data}) => {
                            return (
                              <tr key={id}>
                                <td>{name}</td>
                                <td>
                                  <Checkbox
                                    inline
                                    checked={this.state.showState[id].show}
                                    onChange={() => {
                                      let showState = {...this.state.showState};
                                      showState[id].show = !showState[id].show;
                                      this.setState({showState});
                                    }}
                                  >
                                  显示
                                  </Checkbox>
                                </td>
                                <td>
                                  <Checkbox
                                    inline
                                    checked={this.state.showState[id].showDetail}
                                    onChange={() => {
                                      let showState = {...this.state.showState};
                                      showState[id].showDetail = !showState[id].showDetail;
                                      this.setState({showState});
                                    }}
                                  >
                                  直显坐标
                                  </Checkbox>
                                </td>
                              </tr>
                            );
                          })
                        }
                      </tbody>
                    </Table>
                  </div>
                </Tabs.TabPane>
                <Tabs.TabPane key="3" tab='搜索'>
                  <div>
                    <FormControl
                      type="text"
                      // value={this.state.value}
                      placeholder="功能暂未实现，敬请期待！"
                      // onChange={this.handleChange}
                    />
                  </div>
                </Tabs.TabPane>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default WuxiaMap;