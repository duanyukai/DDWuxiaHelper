import React, {Component} from 'react';
import Loadable from 'react-loadable';
import Cookies from 'js-cookie';

import {
  BrowserRouter,
  Route,
  Link, NavLink, Switch
} from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.css';
import './index.css';

import {Button, Glyphicon, MenuItem, Nav, Navbar, NavDropdown, NavItem, Modal} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";

import alipay from '../assets/imgs/alipay.jpg';
import wechat from '../assets/imgs/wechat.jpg';
import pay from '../assets/imgs/pay.png';

import Loading from './tiandao_ui/components/loading';

import Home from './portal/index';
import {Helmet} from "react-helmet";

// const Home = Loadable({
//   loader: () => import('./portal/index'),
//   loading: () => <Loading />
// });


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

class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal20180501: false
    }
  }

  componentDidMount() {
    // 判断是否已经看过弹窗
    if(Cookies.get('showModal20180501')) {
      // 已经看过
    } else {
      // 没看过
      this.setState({
        showModal20180501: true
      });
    }
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <Helmet>
            <meta charSet="utf-8" />
            <title>段段天刀综合助手 | 天涯明月刀：心法模拟器、地图助手、时辰吉凶、帮派技能模拟器、数据百科</title>
            <meta name="keywords" content="段段天刀综合助手,段段天刀助手,天涯明月刀助手,心法模拟器,天刀地图助手,帮派技能模拟器" />
            <meta name="description" content="段段天刀综合助手是一款针对“天涯明月刀”网游的综合工具，包括最新最准确的天刀心法模拟器、天刀地图助手、时辰吉凶表、帮派技能模拟器、数据百科等等。" />
            <link rel="canonical" href="http://mysite.com/example" />
          </Helmet>
          <Navbar inverse collapseOnSelect fixedTop>
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
                <LinkContainer to='/map'><NavItem eventKey={3}>地图助手</NavItem></LinkContainer>
                <LinkContainer to='/calendar'><NavItem eventKey={4}>天涯吉凶时刻</NavItem></LinkContainer>
                <LinkContainer to='/family-tech'><NavItem eventKey={5}>帮派技能模拟器</NavItem></LinkContainer>
                <LinkContainer to='/data-wiki'><NavItem eventKey={6}>数据百科</NavItem></LinkContainer>
                <NavDropdown eventKey={7} title='其他功能' id='others-nav-dropdown'>
                  <LinkContainer to='/rank'><NavItem eventKey={7.1}><Glyphicon
                    glyph='remove'/> 功力排行榜</NavItem></LinkContainer>
                  <LinkContainer to='/panorama'><NavItem eventKey={7.2}><Glyphicon
                    glyph='ok'/> 天刀全景图</NavItem></LinkContainer>
                </NavDropdown>
              </Nav>
              <Nav pullRight>
                <NavItem
                  eventKey={1}
                  onClick={() => this.setState({showModal20180501: true})}
                ><b style={{color: '#faa'}}>联系、帮助与支持</b></NavItem>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          {/*联系我们Modal*/}
          <div className="static-modal">
            <Modal show={this.state.showModal20180501} onHide={() => this.setState({showModal20180501: false})}>
              <Modal.Header closeButton>
                <Modal.Title>首次访问弹窗（20180509版本更新说明）</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>
                  大家好，我是本站的作者段段（长生剑，id涂铃铃）~
                </p>
                <p>
                  本弹窗为大家提示一下，本站现已购买了国内的服务器，并且买了com域名通过了备案。
                  新网址为： <a target="_blank"  href="http://www.wuxiatools.com">http://www.wuxiatools.com</a>{' '}
                </p>
                <p>
                  希望能给大家更好的体验！新网址同样好记，即将原来的“wuxia.tools”合并，后面加.com就可以了，即“wuxiatools.com”。
                  同时旧域名“http://wuxia.tools”我目前还会继续保留。
                </p>
                <p>
                  <b>更换域名带来的一个小问题是：本地数据无法同步了，也就是您的心法数据需要重新配置</b>还请您见谅。
                </p>
                <p>
                  本次本站大更新主要包括心法模拟器“一代宗师”大版本部分，已经趋于完善，更多教程内容可以在多玩论坛上查看。
                </p>
                <p>
                  同时段段将秉持最初的服务思想，为大家制作<b>免费使用</b>的各种走心好用的工具。当然也离不开大家的帮助，您可以从以下方式来帮助我：
                  <dl>
                    <dt>1.在github上为本项目star一下~</dt>
                    <dd>本项目为开源项目，地址<a target="_blank"  href="https://github.com/duanyukai/DDWuxiaHelper">https://github.com/duanyukai/DDWuxiaHelper</a>，虽然代码可能有点烂，但是你的Star是我最大的动力！</dd>
                    <dt>2.加入交流群多多反馈意见，和群友尬聊~</dt>
                    <dd>QQ群号：660695387，快速加群连接：<a target="_blank" href="//shang.qq.com/wpa/qunwpa?idkey=9b2aeed4e33ce89f62f35e6d009b9a6cbf8f6aac9090387cf841d3deb5bdcc58"><img border="0" src="//pub.idqqimg.com/wpa/images/group.png" /></a></dd>
                    <dt>3.最后您当然还可以为我捐助来弥补每月逾百元的服务器支出~</dt>
                    <dd>段段现在还是一个0收入，靠奖学金过活的念大学的程序猿，您可以通过下方二维码为我捐助，捐助请注明ID，便于我统计数据，我将在有空时做一个捐助列表放在网站上。</dd>
                    {/*<img width="220" src={alipay} />*/}
                    {/*<img width="220" src={wechat} />*/}
                    <img style={{width: '100%'}} src={pay} />
                  </dl>
                </p>
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
              <Route path='/data-wiki' component={DataWiki}/>
            </Switch>
          </div>
          <div style={{textAlign: 'center', marginTop: '50px'}}>
            <hr/>
            <p>
              Copyright © 2017 段段~ （长生剑的一只狗太白，ID涂铃铃）
            </p>
            <p>
              联系方式： QQ: 452214596 邮箱: a@neu.la
            </p>
            <p>
              交流QQ群：660695387
            </p>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default Index;