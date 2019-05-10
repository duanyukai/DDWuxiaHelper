import React, {Component} from 'react';
import Loadable from 'react-loadable';
import Cookies from 'js-cookie';

import {
  BrowserRouter,
  Route,
  Link, Switch
} from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.css';
import 'antd/dist/antd.css';

import {Button, Nav, Navbar, NavDropdown, NavItem, Modal, Collapse, Well} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";

import pay from '../assets/imgs/pay.png';

import Loading from './tiandao_ui/components/loading';

import Home from './portal/index';
import NotFoundPage from './portal/components/404';

import {Helmet} from "react-helmet";
import Row from "antd/es/grid/row";
import Col from "antd/es/grid/col";

import appCss from './app.css';
import Drawer from "antd/es/drawer";

import changelogMd from 'raw-loader!../../CHANGELOG.md';
import ReactMarkdown from "react-markdown";

const XinfaEmu = Loadable({
  loader: () => import('./xinfa_emu/index'),
  loading: () => <Loading/>
});

const WuxiaMap = Loadable({
  loader: () => import('./map/index'),
  loading: () => <Loading/>
});

const Calendar = Loadable({
  loader: () => import('./calendar/index'),
  loading: () => <Loading/>
});

const FamilyTechEmu = Loadable({
  loader: () => import('./family_skill_emu/index'),
  loading: () => <Loading/>
});

const GongliRank = Loadable({
  loader: () => import('./gongli_rank/index'),
  loading: () => <Loading/>
});

const Panorama = Loadable({
  loader: () => import('./panorama/index'),
  loading: () => <Loading/>
});

const DataWiki = Loadable({
  loader: () => import('./data_wiki/index'),
  loading: () => <Loading/>
});

const EquipEmu = Loadable({
  loader: () => import('./equip_emu/index'),
  loading: () => <Loading/>
});

const GlamourEmu = Loadable({
  loader: () => import('./glamour/index'),
  loading: () => <Loading/>
});

const GongliEmu = Loadable({
  loader: () => import('./gongli_emu'),
  loading: () => <Loading/>
});

class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal20180501: false,
      open: true,
      blinkChangelog: true,
      showChangelog: false,
      changelogDate: null
    };

    this.openChangelog = this.openChangelog.bind(this);
  }

  componentDidMount() {
    // 判断是否已经看过弹窗
    // 暂时去掉，有空加上
    // if(Cookies.get('showModal20180501')) {
    //   // 已经看过
    // } else {
    //   // 没看过
    //   this.setState({
    //     showModal20180501: true
    //   });
    // }

    // 计算日志最新更新日期
    let date = changelogMd.match(/20\d{2}-\d{2}-\d{2}/)[0];
    this.setState({
      changelogDate: date
    });
    // 判断是否看过更新日志
    if(localStorage.getItem(`changelog:${date}`)) {
      this.setState({
        blinkChangelog: false
      });
    }
  }

  openChangelog() {
    // 设置已经看过
    localStorage.setItem(`changelog:${this.state.changelogDate}`, 'true');
    this.setState({
      showChangelog: true,
      blinkChangelog: false
    });
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <Helmet>
            <meta charSet="utf-8" />
            <title>段段天刀综合助手 | 天涯明月刀：心法模拟器、地图助手、时辰吉凶、帮派技能模拟器、数据百科</title>
            <meta name="keywords" content="段段天刀综合助手,段段天刀助手,天涯明月刀助手,心法模拟器,天刀地图助手,帮派技能模拟器" />
            <meta name="description" content="段段天刀综合助手是一款针对“天涯明月刀”网游的综合工具，包括最新最准确的天刀心法模拟器、天刀地图助手、时辰吉凶表、帮派技能模拟器、数据百科(小师妹游历玩法数据大全、物品数据、词缀数据)等。" />
            <meta name="viewport" content="width=device-width"/>
          </Helmet>
          <Navbar id="global-navbar" inverse collapseOnSelect fixedTop>
            <Navbar.Header>
              <Navbar.Brand>
                <Link to='/'>段段天刀综合助手</Link>
              </Navbar.Brand>
              <Navbar.Toggle/>
            </Navbar.Header>
            <Navbar.Collapse>
              <Nav>
                {/*<LinkContainer to='/'><NavItem eventKey={1}>首页</NavItem></LinkContainer>*/}
                <LinkContainer to='/xinfa'><NavItem eventKey={2}>心法模拟器</NavItem></LinkContainer>
                <LinkContainer to='/shimei'><NavItem eventKey={5}>小师妹模拟器</NavItem></LinkContainer>
                <LinkContainer to='/map'><NavItem eventKey={3}>地图助手</NavItem></LinkContainer>
                <LinkContainer to='/equip'><NavItem eventKey={3.3}>装备模拟器</NavItem></LinkContainer>
                <LinkContainer to='/calendar'><NavItem eventKey={4}>天涯吉凶时刻</NavItem></LinkContainer>
                <LinkContainer to='/data'><NavItem eventKey={6}>数据百科</NavItem></LinkContainer>
                <NavDropdown eventKey={7} title='其他功能' id='others-nav-dropdown'>
                  <LinkContainer to='/family-tech'><NavItem eventKey={7.3}>帮派技能模拟器</NavItem></LinkContainer>
                  <LinkContainer to='/rank'><NavItem eventKey={7.1}>功力排行榜</NavItem></LinkContainer>
                  <LinkContainer to='/panorama'><NavItem eventKey={7.2}>天刀全景图</NavItem></LinkContainer>
                </NavDropdown>
              </Nav>
              <Nav pullRight>
                <NavItem
                  eventKey={1}
                  onClick={() => this.setState({showModal20180501: true})}
                ><b styleName="appCss.donate-link">联系与捐助</b></NavItem>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <div styleName="appCss.changelog-wrapper">
            <div styleName="appCss.changelog-wrapper-2">
              <div
                styleName={`appCss.changelog-btn ${this.state.blinkChangelog?'appCss.changelog-btn-animate':''}`}
                onClick={() => this.openChangelog()}
                style={{display: this.state.showChangelog?'none':''}}
              >
                {this.state.changelogDate}更新说明
              </div>
            </div>
          </div>
          <Drawer
            title="更新日志"
            placement="right"
            closable={true}
            onClose={() => this.setState({showChangelog: false})}
            visible={this.state.showChangelog}
            zIndex={99999}
            className="changelog-drawer"
            width=""
          >
            <ReactMarkdown source={changelogMd} />
          </Drawer>
          <div className="static-modal">
            <Modal show={this.state.showModal20180501} onHide={() => this.setState({showModal20180501: false})}>
              <Modal.Header closeButton>
                <Modal.Title>关于</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>
                  大家好，我是本站的作者段段（长生剑/欢乐英雄，id涂铃铃）。
                </p>
                <p>
                  本站现已购买了国内的服务器，并且买了com域名通过了备案。
                  新网址为： <a target="_blank"  href="http://www.wuxiatools.com">http://www.wuxiatools.com</a>{' '}
                </p>
                <p>
                  希望能给大家更好的体验！新网址同样好记，即将原来的“wuxia.tools”合并，后面加.com就可以了，即“wuxiatools.com”。
                  同时旧域名“http://wuxia.tools”我目前还会继续保留。
                </p>
                <p>
                  同时段段将秉持最初的服务思想，为大家制作<b>免费使用</b>的各种走心好用的工具。当然也离不开大家的帮助。近日网站访问流量骤增，服务器压力也较大。您可以从以下方式来帮助我：
                </p>
                <Button bsStyle="primary" onClick={() => this.setState({ open: !this.state.open })}>
                  点击展开
                </Button>
                <Collapse in={this.state.open}>
                  <div>
                    <Well>
                      <dl>
                        <dt><b>1.在github上为本项目star一下~</b></dt>
                        <dd>本项目为开源项目，地址<a target="_blank"  href="https://github.com/duanyukai/DDWuxiaHelper">https://github.com/duanyukai/DDWuxiaHelper</a>，虽然时间紧，代码写的比较随意比较烂，但是你的Star是我最大的动力！</dd>
                        <dt><b>2.加入交流群多多反馈意见，和群友尬聊~</b></dt>
                        <dd>QQ群号：660695387，快速加群连接：<a target="_blank" href="//shang.qq.com/wpa/qunwpa?idkey=9b2aeed4e33ce89f62f35e6d009b9a6cbf8f6aac9090387cf841d3deb5bdcc58"><img border="0" src="//pub.idqqimg.com/wpa/images/group.png" /></a></dd>
                        <dt><b>3.最后您当然还可以为我捐助来弥补每月逾百元的服务器支出~</b></dt>
                        <dd>段段现在还是一个0收入的读研的程序猿，您可以通过下方二维码为我捐助，捐助可以匿名或注明ID，并且我会考虑是否可以做一个捐助列表放在网站上。</dd>
                        <img style={{width: '100%'}} src={pay} />
                      </dl>
                    </Well>
                  </div>
                </Collapse>
              </Modal.Body>
              <Modal.Footer>
                <Button bsStyle="primary" onClick={() => this.setState({showModal20180501: false})}>本次关闭</Button>
                <Button bsStyle="primary" onClick={() => {
                  Cookies.set('showModal20180501', true, { expires: 365 });
                  this.setState({showModal20180501: false})
                }}>不再显示<small>（页面右上角可重新打开）</small></Button>
              </Modal.Footer>
            </Modal>
          </div>
          {/*Router*/}
          <div style={{marginTop: "50px"}}>
            <Switch>
              <Route exact path='/' component={Home}/>
              <Route path='/xinfa' component={XinfaEmu}/>
              <Route path='/family-tech' component={FamilyTechEmu}/>
              <Route path='/map' component={WuxiaMap}/>
              <Route path='/calendar' component={Calendar}/>
              <Route path='/rank' component={GongliRank}/>
              <Route path='/panorama' component={Panorama}/>
              <Route path='/data' component={DataWiki}/>
              <Route path='/equip' exact component={EquipEmu}/>
              <Route path='/glamour' exact component={GlamourEmu}/>
              <Route path='/shimei' component={GongliEmu}/>
              <Route path='/shenbing' component={GongliEmu}/>
              <Route component={NotFoundPage} />
            </Switch>
          </div>
          <div styleName="appCss.footer-wrapper">
            <div styleName="appCss.footer-wrapper-2">
              <Row gutter={32}>
                <Col xs={24} lg={8}>
                  <div style={{margin: 4}}>
                    <h4>友情链接</h4>
                    注：免费申请友链请联系站长
                  </div>
                </Col>
                <Col xs={24} lg={8}>
                  <div style={{margin: '4px auto', maxWidth: 300}}>
                    <h4>网站说明</h4>
                    段段天刀综合助手是一款针对“天涯明月刀”网游的综合工具，包括最新最准确的天刀心法模拟器、天刀地图助手、时辰吉凶表、帮派技能模拟器、数据百科等等。<br />
                    数据工具庞大繁杂，建议使用电脑浏览器访问本站。<br />
                    推荐使用chrome浏览器以得到最佳效果。
                  </div>
                </Col>
                <Col xs={24} lg={8}>
                  <div style={{margin: 4}}>
                    <h4>版权信息</h4>
                    © {(new Date()).getFullYear()} 段段天刀综合助手<br/>
                    备案号：<a href="http://www.miitbeian.gov.cn">辽ICP备15017607号-2</a><br/>
                    交流群：660695387 <a target="_blank" href="//shang.qq.com/wpa/qunwpa?idkey=182f40b60ccba796a3798e2e45fd963ca5dc299e643aced13f468b41eb31799d"><img border="0" src="//pub.idqqimg.com/wpa/images/group.png" alt="天刀助手交流群" title="天刀助手交流群" /></a><br/>
                    站长：<a href="https://www.duan.sh">段段</a><br/>
                    <span style={{fontSize: 10}}>
                    QQ 452214596 <br/>
                    邮箱 <a href="mailto:dyk18@mails.tsinghua.edu.cn">dyk18@mails.tsinghua.edu.cn</a> <br/>
                  </span>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default Index;