import React, { Component } from 'react';

import './css/app.css';
import {Col, Grid, Jumbotron, PageHeader, Panel, Row} from "react-bootstrap";

import panelPic1 from '../assets/imgs/1.png';
import panelPic2 from '../assets/imgs/2.png';
import panelPic3 from '../assets/imgs/3.png';
import panelPic4 from '../assets/imgs/4.png';

import xinfaPic from '../assets/imgs/xinfa.png';
import mapPic from '../assets/imgs/map.png';
import calendarPic from '../assets/imgs/calendar.png';


import {Link} from "react-router-dom";

class PortalApp extends Component {
  render() {
    return(
      <div>
        <Jumbotron styleName='pic-header'>
          <Grid>
            <Row>
              <Col md={10} mdOffset={1} style={{border: 'black 1px #000'}}>
                <h1>段段天刀综合助手</h1>
                <p>本助手工具计划包括天刀导航、天刀墨宝、盟会、东海交互地图、心法模拟器、天涯时刻预测、数据百科等，功能尚在完善中。</p>
                <p>请记住我们：<a href="http://wuxia.tools">http://wuxia.tools</a>，前缀“wuxia”，后缀“.tools”工具之意，十分易记。</p>
                <p>交流群：660695387，欢迎小伙伴来提建议~</p>
                <p>资金有限，目前服务器在美国速度可能稍慢，还请大家见谅！</p>
              </Col>
            </Row>
          </Grid>
        </Jumbotron>
        <Grid>
          <Row>
            <Col md={12}>
              <PageHeader>
                快速站外导航 <small>进错域名不担心，记住我们http://wuxia.tools，一站导航</small>
              </PageHeader>
              <Row style={{display: 'flex', flexWrap: 'wrap'}}>
                <Col md={3} sm={6}>
                  <Panel styleName='nav-panel'>
                    <a target='_blank' href='http://wuxia.qq.com'><img src={panelPic1} /></a>
                    <div styleName='nav-panel-div'>
                      <p><a target='_blank' href='http://wuxia.qq.com'>天涯明月刀首页(wuxia.qq.com)</a></p>
                      <hr />
                      <p><a target='_blank' href='http://wuxia.qq.com/main.shtml'>天刀官网主站</a></p>
                      <p><a target='_blank' href='http://wuxia.qq.com/events.shtml'>天刀官网活动中心</a></p>
                      <p><a target='_blank' href='http://wuxia.qq.com/kz'>逍遥客栈</a></p>
                      <p><a target='_blank' href='http://daoju.qq.com/wuxia'>腾讯道聚城</a></p>
                    </div>
                  </Panel>
                </Col>
                <Col md={3} sm={6}>
                  <Panel styleName='nav-panel'>
                    <a target='_blank' href='http://wuxia.qq.com'><img src={panelPic2}/></a>
                    <div styleName='nav-panel-div'>
                      <p><a target='_blank' href='http://wuxia.duowan.com'>多玩天刀首页(wuxia.duowan.com)</a></p>
                      <hr />
                      <p><a target='_blank' href='http://bbs.duowan.com/forum-2162-1.html'>多玩天刀论坛导航</a></p>
                      <p><a target='_blank' href='http://bbs.duowan.com/forum-2400-1.html'>论坛综合讨论版</a></p>
                      <p><a target='_blank' href='http://bbs.duowan.com/forum-2372-1.html'>论坛恩怨自爆版</a></p>
                      <p><a target='_blank' href='http://bbs.duowan.com/forum-2533-1.html'>论坛捏脸数据版</a></p>
                    </div>
                  </Panel>
                </Col>
                <Col md={3} sm={6}>
                  <Panel styleName='nav-panel'>
                    <img src={panelPic3}/>
                    <div styleName='nav-panel-div'>
                      <hr />
                      <p><a target='_blank' href='https://www.douyu.com/directory/game/tianya'>斗鱼天刀</a></p>
                      <p><a target='_blank' href='https://www.panda.tv/cate/tymyd'>熊猫天刀</a></p>
                      <p><a target='_blank' href='http://www.huya.com/g/tymyd'>虎牙天刀</a></p>
                      <p><a target='_blank' href='https://www.zhanqi.tv/games/tianyamingyuedao'>战旗天刀</a></p>
                    </div>
                  </Panel>
                </Col>
                <Col md={3} sm={6}>
                  <Panel styleName='nav-panel'>
                    <img src={panelPic4}/>
                    <div styleName='nav-panel-div'>
                      <hr />
                      <p><a target='_blank' href='https://tieba.baidu.com/f?kw=%E5%A4%A9%E6%B6%AF%E6%98%8E%E6%9C%88%E5%88%80ol&ie=utf-8'>天涯明月刀ol贴吧</a></p>
                      <p><a target='_blank' href='https://weibo.com/206667365'>天刀值日团微博</a></p>
                    </div>
                  </Panel>
                </Col>
              </Row>
              <PageHeader>
                站内功能导航
              </PageHeader>
              <Row style={{display: 'flex', flexWrap: 'wrap'}}>
                <Col md={3} sm={6} xs={12}>
                  <Panel styleName='nav-panel'>
                    <Link to='/xinfa'><img src={xinfaPic} /></Link>
                    <div styleName='nav-panel-div'>
                      <Link to='/xinfa'>
                        <h3>心法模拟器<br />（完善中）</h3>
                        <hr />
                        <p>
                          本工具是一个高仿游戏内UI的心法模拟器。<br />
                          数据最新；样式直观；操作简便。<br />
                          （尚在完善测试中）
                        </p>
                      </Link>
                    </div>
                  </Panel>
                </Col>
                <Col md={3} sm={6}>
                  <Panel styleName='nav-panel'>
                    <Link to='/map'><img src={mapPic} /></Link>
                    <div styleName='nav-panel-div'>
                      <Link to='/map'>
                        <h3>交互式地图助手<br />（制作中）</h3>
                        <hr />
                        <p>
                          本工具是一个可交互的天刀地图，包括文士乐伶墨宝创作点、航海图鉴等内容。<br />（尚在制作中）
                        </p>
                      </Link>
                    </div>
                  </Panel>
                </Col>
                <Col md={3} sm={6}>
                  <Panel styleName='nav-panel'>
                    <Link to='/calendar'><img src={calendarPic} /></Link>
                    <div styleName='nav-panel-div'>
                      <Link to='/calendar'>
                        <h3>天涯时刻吉凶预测</h3>
                        <hr />
                        <p>
                          本工具包含现实时间、天涯时刻对照的模拟时钟，及未来时间吉凶预测时间轴.时间精确到秒，方便文士乐伶绘画、建房求风水等需求。
                        </p>
                      </Link>
                    </div>
                  </Panel>
                </Col>
              </Row>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default PortalApp;