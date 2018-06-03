import React, { Component } from 'react';

import leafletCss from 'leaflet/dist/leaflet.css';
import appCss from './css/app.css';

import WuxiaLeafletMap from './map';
import {
  Button, ButtonGroup, Checkbox, Col, FormControl, Grid, Row, Tab, Table,
  Tabs
} from 'react-bootstrap';

import markerTypeList from '../assets/json/marker_types.json';
import {Helmet} from "react-helmet";

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
      showState: showState
    };
  }

  // componentWillUpdate(nextProps, nextState) {
  //   if(nextState.showDetail) {
  //
  //   }
  // }

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
    })
  }

  render() {
    return(
      <div>
        <Helmet>
          <meta charSet="utf-8" />
          <title>天刀地图助手，轻松查阅墨宝坐标、航海图鉴等 | 段段天刀综合助手</title>
          <meta name="keywords" content="天刀地图,天刀墨宝坐标,天刀航海图鉴" />
          <meta name="description" content="天刀地图助手是一个可交互的天刀地图，包括文士乐伶墨宝创作点、航海图鉴等内容。您可以有与游戏中相同的体验来快速精确查找坐标，并且有大量相关数据分享。" />
        </Helmet>
        <WuxiaLeafletMap
          currentMapId={this.state.currentMapId}
          showState={this.state.showState}
        />

        <div styleName='appCss.toolbar-wrapper'>
          <Grid fluid={true}>
            <Row>
              <Col lg={3} md={4} sm={6} xs={12} style={{height: 0}}>
                <div styleName='appCss.toolbar-inner'>
                  <Tabs defaultActiveKey={1} id='toolbar-tabs'>
                    <Tab eventKey={0} title='收起'>
                    </Tab>
                    <Tab eventKey={1} title='地图'>
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
                    </Tab>
                    <Tab eventKey={2} title='图层'>
                      <div styleName='appCss.scroll-wrapper'>
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
                                )
                              })
                            }
                          </tbody>
                        </Table>
                      </div>
                    </Tab>
                    <Tab eventKey={3} title='搜索'>
                      <div>
                        <FormControl
                          type="text"
                          // value={this.state.value}
                          placeholder="功能暂未实现，敬请期待！"
                          // onChange={this.handleChange}
                        />
                      </div>
                    </Tab>
                  </Tabs>
                </div>
              </Col>
            </Row>
          </Grid>
        </div>
      </div>
    );
  }
}

export default WuxiaMap;