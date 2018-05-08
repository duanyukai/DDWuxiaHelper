import React, { Component } from 'react';

import XinfaConfig from '../containers/xinfa_config';
import XinfaList from '../containers/xinfa_list';
import XinfaProps from '../containers/xinfa_props';
import XinfaShuji from '../containers/xinfa_shuji';
import {Col, Grid, Panel, Row} from "react-bootstrap";

import WuxiaPanel from '../../tiandao_ui/panel';

import {translate} from 'react-i18next';

import './css/app.css';
import XinfaSlotsPanel from "../containers/xinfa_slots";
import XinfaTotalPropsPanel from "../containers/xinfa_total_props";
import {Helmet} from "react-helmet";

class XinfaEmuApp extends Component {
  render() {
    return (
      <div styleName='container'>
        <Helmet>
          <meta charSet="utf-8" />
          <title>天刀心法模拟器，精确计算功力、突破、潜修、砭石 | 段段天刀综合助手</title>
          <meta name="keywords" content="心法模拟器,天刀心法模拟器,心法潜修,心法突破,心法所需砭石" />
          <meta name="description" content="段段天刀心法模拟器是一个高仿游戏内UI的心法模拟器。拥有数据最新、样式直观、操作简便等特点。可精确计算功力、突破、潜修、砭石等数据。" />
        </Helmet>
        <div styleName='emu-container'>
          <Grid>
            <Row>
              <Col xs={12} lg={10} lgOffset={1}>
                <Col xs={12} style={{padding: '0'}}>
                  <WuxiaPanel title='测试版说明'>
                    本心法模拟器还在积极更新、测试中，由于时间紧迫，可能会有数据、UI等方面的bug，恳请您积极反馈问题，段段也会争取早日发布正式版。
                    <br/>
                    恳请您加入天刀综合助手交流群：660695387 <a target="_blank" href="//shang.qq.com/wpa/qunwpa?idkey=9b2aeed4e33ce89f62f35e6d009b9a6cbf8f6aac9090387cf841d3deb5bdcc58"><img border="0" src="//pub.idqqimg.com/wpa/images/group.png" alt="天刀助手交流wuxia.tools " title="天刀助手交流wuxia.tools " /></a>
                    <br />
                    本工具的更新内容会积极更新在多玩论坛上。网址：<a target='_blank' href='http://bbs.duowan.com/thread-46128429-1-1.html'>http://bbs.duowan.com/thread-46128429-1-1.html</a>
                    <br />
                    本次更新较大，主要包括：
                    <ul>
                      <li>更新“一代宗师”大版本心法数据，即每本紫色、金色心法新出的3~6个枢机位及炼武心法开放10重潜修；</li>
                      <li>战力精确算法更新，以及修罗、灵素等心法“虚”战力计算；</li>
                      <li>更新UI界面，如直接显示套装心法总属性；</li>
                      <li>增加国际化支持。韩语、英语语言包尚在制作中，恳请有意愿协助翻译的小伙伴进群联系合作。</li>
                    </ul>
                  </WuxiaPanel>
                </Col>
                <Row>
                  <Col xs={12} sm={4} style={{padding: '3px'}}>
                    <XinfaTotalPropsPanel />
                  </Col>
                  <Col xs={12} sm={8} style={{padding: '3px'}}>
                    <Col xs={12}  style={{padding: 0}}>
                      <WuxiaPanel title='心法配置'>
                        <Row>
                          <Col xs={12} sm={6}>
                            <XinfaSlotsPanel />
                          </Col>
                          <Col xs={12} sm={6}>
                            <XinfaConfig />
                          </Col>
                        </Row>
                      </WuxiaPanel>
                    </Col>
                    <Col xs={12}  style={{padding: 0}}>
                      <XinfaList />
                    </Col>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} sm={4} style={{padding: '3px'}}>
                    <XinfaProps />

                  </Col>
                  <Col xs={12} sm={8} style={{padding: '3px'}}>
                    <XinfaShuji />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Grid>
        </div>
        {/*<div styleName='other-container'>*/}
          {/*<Grid>*/}
            {/*<Row>*/}
              {/*<Col xs={12} md={10} mdOffset={1}>*/}
                {/*<Panel>*/}
                  {/*<ChangyanComment sourceId='xinfa-emu' />*/}
                {/*</Panel>*/}
              {/*</Col>*/}
            {/*</Row>*/}
          {/*</Grid>*/}
        {/*</div>*/}
      </div>
    );
  }
}

export default XinfaEmuApp;