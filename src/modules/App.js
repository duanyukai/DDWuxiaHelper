import React, { Component } from 'react';
import Loadable from 'react-loadable';

import {
  BrowserRouter as Router,
  Route,
  Link, NavLink, Switch, HashRouter
} from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.css';
import './index.css';

import {Button, Glyphicon, MenuItem, Nav, Navbar, NavDropdown, NavItem} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";

import Loading from './tiandao_ui/components/loading';

const Home = Loadable({
  loader: () => import('./portal/index'),
  loading: () => <Loading />
});

const XinfaEmu = Loadable({
  loader: () => import('./xinfa_emu/index'),
  loading: () => <Loading />
});

const FamilySkillEmu = Loadable({
  loader: () => import('./family_skill_emu/index'),
  loading: () => <Loading />
});

const Calendar = Loadable({
  loader: () => import('./calendar/index'),
  loading: () => <Loading />
});

const Index = () => (
  <HashRouter>
    <div>
      <Navbar inverse collapseOnSelect fixedTop>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to='/'>段段天刀综合助手</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            {/*<LinkContainer to='/'><NavItem eventKey={1}>首页</NavItem></LinkContainer>*/}
            <LinkContainer to='/xinfa'><NavItem eventKey={2}><Glyphicon glyph='remove' /> 心法模拟器</NavItem></LinkContainer>
            <LinkContainer to='/map'><NavItem eventKey={3}><Glyphicon glyph='remove' /> 地图助手</NavItem></LinkContainer>
            <LinkContainer to='/calendar'><NavItem eventKey={4}><Glyphicon glyph='ok' /> 天涯吉凶时刻</NavItem></LinkContainer>
            <LinkContainer to='/family-skill'><NavItem eventKey={5}><Glyphicon glyph='remove' /> 帮派技能模拟器</NavItem></LinkContainer>

          </Nav>
          <Nav pullRight>
            <NavItem eventKey={1} href='mailto:a@neu.la'>联系我</NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <div style={{marginTop: "50px"}}>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route path='/xinfa' component={XinfaEmu}/>
          <Route path='/family-skill' component={FamilySkillEmu}/>
          <Route path='/map' component={Home}/>
          <Route path='/calendar' component={Calendar}/>
        </Switch>
      </div>
      <div style={{textAlign: 'center', marginTop: '50px'}}>
        <hr />
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
  </HashRouter>
);

export default Index;