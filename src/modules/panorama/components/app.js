import React, { Component } from 'react';
import {Button, ButtonGroup, Col, Grid, PageHeader, Panel, Row, Table} from "react-bootstrap";

import Viewer from './viewer';

import './css/app.css';

let panoramaBaseUrl = 'https://wuxia-tools-assets-1251080372.cos.ap-shanghai.myqcloud.com/panorama/regular/';

let panoramaData = [
  {name: '天香谷', url: 'tianxianggu.png'},
  {name: '华清古佛', url: 'huaqinggufo.png'},
  {name: '巴蜀翠海-晴日', url: 'bashucuihai-qing.png'},
  {name: '巴蜀翠海-雷雨', url: 'bashucuihai-yu.png'}
];

class PanoramaViewer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      curPanoIndex: 0
    };
  }

  componentDidMount() {
  }
  
  render() {
    return(
      <div styleName='container'>
        <Grid>
          <Row>
            <Col lg={12}>
              <Panel header="天刀全景图-美图欣赏" bsStyle="success">
                <h3>说明</h3>
                <p>
                  本工具是一个在线的全景图浏览工具，您可以在这里体验媲美游戏中效果的全景体验。全屏以及使用手机借助陀螺仪可使效果更佳。
                  图片资源、相关问题请加交流群660695387。
                </p>
                <p>
                  全景图制作详细教程请参考多玩论坛，“段儿段儿”用户发帖。
                </p>
                <p>
                  投稿请联系QQ 452214596。
                </p>
                <h3>全景图浏览</h3>
                <div>
                  选择图片
                  <div style={{margin: '10px'}}>
                    <ButtonGroup>
                      {
                        panoramaData.map(({name, url}, i) => {
                          return(
                            <Button
                              key={name}
                              onClick={() => this.setState({curPanoIndex: i})}
                            >
                              {name}
                            </Button>
                          );
                        })
                      }
                    </ButtonGroup>
                  </div>
                </div>
                <Viewer url={panoramaBaseUrl + panoramaData[this.state.curPanoIndex].url} />
              </Panel>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default PanoramaViewer;