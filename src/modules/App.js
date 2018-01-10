import React, { Component } from 'react';
import Loadable from 'react-loadable';

import {
  BrowserRouter as Router,
  Route,
  Link, NavLink, Switch, HashRouter
} from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.css';

import {Button, MenuItem, Nav, Navbar, NavDropdown, NavItem} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";

const Home = Loadable({
  loader: () => import('./portal/index'),
  loading: () => <div>Loading...</div>
});

const XinfaEmu = Loadable({
  loader: () => import('./xinfa_emu/index'),
  loading: () => <div>Loading...</div>
});

const FamilySkillEmu = Loadable({
  loader: () => import('./family_skill_emu/index'),
  loading: () => <div>Loading...</div>
});

const Calendar = Loadable({
  loader: () => import('./calendar/index'),
  loading: () => <div>Loading...</div>
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
            <LinkContainer to='/xinfa'><NavItem eventKey={2}>心法模拟器</NavItem></LinkContainer>
            <LinkContainer to='/family-skill'><NavItem eventKey={3}>帮派技能模拟器</NavItem></LinkContainer>
            <LinkContainer to='/map'><NavItem eventKey={4}>地图助手</NavItem></LinkContainer>
            <LinkContainer to='/calendar'><NavItem eventKey={5}>天涯吉凶时刻</NavItem></LinkContainer>
          </Nav>
          <Nav pullRight>
            <NavItem eventKey={1} href="#">联系我</NavItem>
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
      <div style={{textAlign: 'center'}}>
        Copyright © 2017 段段~ （东北大学软件学院）
        联系方式： QQ: 452214596 EMAIL: a@neu.la
      </div>
    </div>
  </HashRouter>
);

export default Index;