import React, { Component } from 'react';
import debounce from 'lodash/debounce';
import leafletCss from 'leaflet/dist/leaflet.css';
import appCss from './css/app.css';

import WuxiaLeafletMap from './map';
import markerTypeList from '../assets/json/marker_types.json';
import {Helmet} from 'react-helmet';
import {Switch, Icon, Tabs, Button, Checkbox, Input} from 'antd';
import mapsProps from '../assets/json/maps_props.json';
import {searchPos} from "../utils/data_to_search";

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

    // 判断是否有hash，提取其中地图与坐标
    let matched = window.location.hash.match(/#(.+)\((\d+),(\d+),(\d)\)/);
    let mapId = 'HZ';  // 默认地图
    let x = null, y = null, zoom = 3;  // 默认中心，设置为null，当无初始地图时，使用配置中的默认参数
    if(window.location.hash && matched) {
      if (mapsProps.hasOwnProperty(mapId)) {
        mapId = matched[1];
        x = matched[2];
        y = matched[3];
        zoom = matched[4];
      }
    }

    // 设置state
    this.state = {
      currentMapId: mapId, // 默认地图
      x: x, // 默认显示中心的x轴 todo 尚未绑定更新事件
      y: y, // 默认显示中心的y轴
      zoom: zoom, // 默认缩放
      markerData: null, // 当前打开的marker的数据
      showMenu: true,
      showPosMarker: true,
      showState: showState,
      searchText: '',
      searchResult: []
    };

    this.changeMenu = this.changeMenu.bind(this);
    this.changeMap = this.changeMap.bind(this);
    this.changePos = this.changePos.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);

    this.debounceSearch = debounce(this.debounceSearch, 300);
  }

  renderMapButtonGroup(array) {
    return array.map(({name, id}) => {
      return(
        <button
          styleName={`appCss.map-btn${id === this.state.currentMapId ? ' appCss.map-btn-active' : ''}`}
          key={id}
          onClick={() => this.setState({currentMapId: id})}
        >
          {name}
        </button>
      );
    });
  }

  changeMenu() {
    this.setState({
      showMenu: !this.state.showMenu
    });
  }

  componentDidMount() {
    // // 初始调用，显示地图
    // let {currentMapId, x, y, zoom} = this.state;
    // this.changeMap(currentMapId, x, y, zoom);
  }

  changeMap(mapId, x, y, zoom, markerData) {
    if (markerData) {
      this.setState({
        currentMapId: mapId,
        x, y, zoom, markerData
      });
    } else {
      this.setState({
        currentMapId: mapId,
        x, y, zoom
      });
    }
  }

  // 单纯的修改中心点坐标与缩放
  changePos(x, y, zoom) {
    this.setState({
      x, y, zoom
    });
  }

  onSearchChange(e) {
    let self = this;
    let text = e.target.value;
    this.setState({
      searchText: text
    }, () => {
      self.debounceSearch(text);
    });
  }

  debounceSearch(text) {
    let result = searchPos(null, text);
    this.setState({
      searchResult: result
    });
  }

  render() {
    let self = this;
    return(
      <div style={{marginTop: '-46px'}}>
        <Helmet defer={false}>
          <meta charSet="utf-8" />
          <title>天刀地图助手，轻松查阅墨宝坐标、航海图鉴等 | 段段天刀综合助手</title>
          <meta name="keywords" content="天刀地图,天刀墨宝坐标,天刀航海图鉴" />
          <meta name="description" content="天刀地图助手是一个可交互的天刀地图，包括文士乐伶墨宝创作点、航海图鉴等内容。您可以有与游戏中相同的体验来快速精确查找坐标，并且有大量相关数据分享。" />
          <meta name="viewport" content="width=device-width"/>
        </Helmet>
        <WuxiaLeafletMap
          currentMapId={this.state.currentMapId}
          x={this.state.x}
          y={this.state.y}
          zoom={this.state.zoom}
          markerData={this.state.markerData}
          showState={this.state.showState}
          showPosMarker={this.state.showPosMarker}
          changeMap={this.changeMap}
          changePos={this.changePos}
        />

        <div styleName='appCss.menu-wrapper'>
          <Button
            styleName='appCss.show-hide-btn'
            type="primary"
            onClick={this.changeMenu}
          >
            {this.state.showMenu ?
              <span><Icon type="menu-fold"/> 收起</span> :
              <span><Icon type="menu-unfold"/> 展开</span>
            }
          </Button>
          <div style={{width: '100%', display: this.state.showMenu ? '' : 'none'}}>
            <div styleName='appCss.menu-inner'>
              <Tabs defaultActiveKey="1">
                <Tabs.TabPane key="1" tab='地图'>
                  <div styleName='appCss.scroll-wrapper'>
                    <div>
                      <p>
                       欢迎加入交流群660695387交流反馈建议与BUG。
                      </p>
                      <p>
                        您可善用上方“图层”、“搜索”等功能来筛选显示内容及细节。
                      </p>
                      <div>
                        <div styleName='appCss.map-btn-matrix-1'>
                          {this.renderMapButtonGroup([
                            {name: '中原', id: 'ZY'},
                            {name: '东海', id: 'DH'},
                            {name: '南海', id: 'NH'}
                          ])}
                        </div>
                      </div>
                      <div>
                        <div styleName='appCss.map-btn-matrix-1'>
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
                        </div>
                      </div>
                      <div>
                        <div styleName='appCss.map-btn-matrix-1'>
                          {this.renderMapButtonGroup([
                            {name: '移花岛', id: 'YH'},
                            {name: '太室山', id: 'TSS'},
                          ])}
                        </div>
                      </div>
                      <div>
                        <div styleName='appCss.map-btn-matrix-1'>
                          {this.renderMapButtonGroup([
                            {name: '一代宗师', id: 'YDZS'}
                          ])}
                        </div>
                      </div>
                      <div>
                        <div styleName='appCss.map-btn-matrix-1'>
                          {this.renderMapButtonGroup([
                            {name: '海河州', id: 'HHZ'},
                            {name: '极境岛', id: 'JJD'},
                            {name: '松　林', id: 'SLWZ'},
                            {name: '长　洲', id: 'CZGY'},
                            {name: '嘲天宫', id: 'CTG'},
                            {name: '龙　渊', id: 'QLZY'}
                          ])}
                        </div>
                      </div>
                      <div>
                        <div styleName='appCss.map-btn-matrix-1'>
                          {this.renderMapButtonGroup([
                            {name: ' 钱塘港 ', id: 'QTG'},
                            {name: ' 江洋港 ', id: 'JYG'},
                            {name: ' 泉州港 ', id: 'QZG'},
                            {name: ' 望海岬 ', id: 'WHJ'},
                            {name: ' 灵鹿岛 ', id: 'LLD'},
                            {name: '天涯盐场', id: 'TYYC'},
                            {name: ' 沧浪岛 ', id: 'CLD'},
                            {name: ' 幽灵岛 ', id: 'YLD'},
                            {name: ' 宝矿山 ', id: 'BKS'},
                            {name: '琅嬛福地', id: 'LHFD'},
                            {name: ' 大沧海 ', id: 'DCH'},
                            {name: '东海玉涡', id: 'DHYW'},
                          ])}
                        </div>
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
                    <table>
                      <thead>
                        <tr>
                          <th></th>
                          <th>
                            <Checkbox
                              type="checkbox"
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
                              type="checkbox"
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
                                    type="checkbox"
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
                    </table>
                  </div>
                </Tabs.TabPane>
                <Tabs.TabPane key="3" tab='搜索'>
                  <div>
                    <Input
                      type="text"
                      value={this.state.searchText}
                      placeholder="请输出查找内容"
                      onChange={this.onSearchChange}
                    />
                  </div>
                  <div styleName="appCss.search-result-wrapper">
                    {
                      this.state.searchResult.map((pos, i) => <div
                        key={i} styleName="appCss.search-result-item"
                        onClick={() => {
                          console.log('切换至', pos.mapId, pos.x, pos.y);
                          self.changeMap(pos.mapId, parseFloat(pos.x), parseFloat(pos.y), 3, pos);  // todo zoom level
                        }}
                      >
                        <div>
                          <span styleName="appCss.name">{pos.name}</span>
                          <span styleName="appCss.map">{pos.mapName}</span>
                          <span styleName="appCss.x">{parseInt(pos.x)}, </span>
                          <span styleName="appCss.y">{parseInt(pos.y)}</span>
                        </div>
                        <div>
                          <span styleName="appCss.category">{pos.markerCategoryName}</span>
                        </div>
                        <div>
                          {pos.des && <span styleName="appCss.des">{pos.des}</span>}
                        </div>
                      </div>)
                    }
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