import React, { Component } from 'react';

import XinfaConfig from '../containers/xinfa_config';
import XinfaList from '../containers/xinfa_list';
import XinfaProps from '../containers/xinfa_props';
import XinfaShuji from '../containers/xinfa_shuji';
import {Col, Grid, Row} from "react-bootstrap";

import WuxiaPanel from '../../tiandao_ui/panel';

import './css/app.css';

class XinfaEmuApp extends Component {
  render() {
    return (
      <div styleName="container">
        <Grid>
          <Row>
            <Col md={12} lg={10} lgOffset={1}>
              <WuxiaPanel title='测试版说明'>
                本心法模拟器还在积极更新、测试中，由于时间紧迫，可能会有数据、UI等方面的bug，恳请您积极反馈问题，段段也会争取早日发布正式版。
                <br/>
                恳请您加入天刀综合助手交流群：660695387 <a target="_blank" href="//shang.qq.com/wpa/qunwpa?idkey=9b2aeed4e33ce89f62f35e6d009b9a6cbf8f6aac9090387cf841d3deb5bdcc58"><img border="0" src="//pub.idqqimg.com/wpa/images/group.png" alt="天刀助手交流wuxia.tools " title="天刀助手交流wuxia.tools " /></a>
                <br />
                本工具的更新内容会积极更新在多玩论坛上。网址：<a target='_blank' href='http://bbs.duowan.com/thread-46128429-1-1.html'>http://bbs.duowan.com/thread-46128429-1-1.html</a>
                <br />
                注：上次更新中出现一个较影响使用的bug（清空枢机出现白屏），现已修复。
                <br />
                目前门派等加成属性配置尚在制作中，会尽快发布。
              </WuxiaPanel>
              <Row>
                <Col xs={12} md={4}>
                  <XinfaConfig />
                </Col>
                <Col xs={12} md={8}>
                  <XinfaList />
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={4}>
                  <XinfaProps />

                </Col>
                <Col xs={12} md={8}>
                  <XinfaShuji />
                </Col>
              </Row>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default XinfaEmuApp;