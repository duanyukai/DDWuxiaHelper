import React, { Component } from 'react';

import leafletCss from 'leaflet/dist/leaflet.css';
import appCss from './css/app.css';

import WuxiaLeafletMap from './map';
import {
  Button, ButtonGroup, Checkbox, Col, FormControl, FormGroup, Grid, Row, Tab,
  Tabs
} from 'react-bootstrap';

import markerTypeList from '../assets/json/marker_types.json';

class WuxiaMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMapId: 'HZ'
    };
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
    })
  }

  render() {
    return(
      <div>
        <WuxiaLeafletMap
          currentMapId={this.state.currentMapId}
        />

        <div styleName='appCss.toolbar-wrapper'>
          <Grid fluid={true}>
            <Row>
              <Col lg={3} md={4} sm={6} xs={12} style={{height: 0}}>
                <div styleName='appCss.toolbar-inner'>
                  <Tabs defaultActiveKey={1} id='toolbar-tabs'>
                    <Tab eventKey={1} title='地图'>
                      <div styleName='appCss.scroll-wrapper'>
                        <div>
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
                        {
                          markerTypeList.map(({id, name, data}) => {
                            return (
                              <div key={id}>
                               <span>{name}</span><Checkbox inline>显示</Checkbox>{' '}<Checkbox inline>直接展示</Checkbox>
                              </div>
                            )
                          })
                        }
                      </div>
                    </Tab>
                    <Tab eventKey={3} title='搜索'>
                      <div>
                        <FormControl
                          type="text"
                          // value={this.state.value}
                          placeholder="搜索位置"
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