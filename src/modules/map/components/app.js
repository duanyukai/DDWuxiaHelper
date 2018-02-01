import React, { Component } from 'react';

import leafletCss from 'leaflet/dist/leaflet.css';
import appCss from './css/app.css';

import WuxiaLeafletMap from './map';
import {
  Button, ButtonGroup, Checkbox, Col, FormControl, FormGroup, Grid, Row, Tab,
  Tabs
} from 'react-bootstrap';

class WuxiaMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMapId: 'HZ'
    };
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
                          <ButtonGroup>
                            <Button>中原</Button>
                            <Button>东海</Button>
                            <Button>南海</Button>
                          </ButtonGroup>
                          <ButtonGroup styleName="appCss.map-btn-matrix-1">
                            <Button onClick={() => this.setState({currentMapId: 'HZ'})}>杭州</Button>
                            <Button>江南</Button>
                            <Button>东越</Button>
                            <Button>九华</Button>
                            <Button>徐海</Button>
                            <Button>开封</Button>
                            <Button>秦川</Button>
                            <Button>燕云</Button>
                            <Button>巴蜀</Button>
                            <Button>襄州</Button>
                            <Button>荆湖</Button>
                            <Button>云滇</Button>
                          </ButtonGroup>
                        </div>
                      </div>
                    </Tab>
                    <Tab eventKey={2} title='图层'>
                      <div styleName='appCss.scroll-wrapper'>
                        <FormGroup>
                          墨宝
                          <Checkbox inline>显示</Checkbox>{' '}<Checkbox inline>直接展示</Checkbox>
                        </FormGroup>
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