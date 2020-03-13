import React, { Component } from 'react';
import { Menu } from 'antd';
import {Link} from 'react-router-dom';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class LeftMenu extends Component {
  render() {
    return (
      <Menu mode={this.props.mode} theme="dark">
        {/*<Menu.Item key="mail">*/}
        {/*  <a href="#">单独连接</a>*/}
        {/*</Menu.Item>*/}
        <SubMenu title={<span>模拟器系列</span>} popupOffset={[0, 2]}>
          <Menu.Item key="xinfa"><Link to="/xinfa">心法模拟器</Link></Menu.Item>
          <Menu.Item key="equip"><Link to="/equip">装备模拟器</Link></Menu.Item>
          <Menu.Item key="shimei"><Link to="/shimei">小师妹模拟器</Link></Menu.Item>
          <Menu.Item key="family-tech"><Link to="/family-tech">帮派技能模拟器</Link></Menu.Item>
        </SubMenu>
        <SubMenu title={<span>数据百科系列</span>} popupOffset={[0, 2]}>
          <Menu.Item key="tour"><Link to="/data/tour">小师妹游历大全</Link></Menu.Item>
          <Menu.Item key="cook"><Link to="/data/cook">厨师食材菜谱大全</Link></Menu.Item>
          <Menu.Item key="item"><Link to="/data/item">天刀全物品数据大全</Link></Menu.Item>
          <Menu.Item key="gem"><Link to="/data/gem">砭石数据大全</Link></Menu.Item>
          <Menu.Item key="affix"><Link to="/data/affix">装备词缀大全</Link></Menu.Item>
        </SubMenu>
        <Menu.Item key="map">
          <Link to="/map">地图助手</Link>
        </Menu.Item>
        <Menu.Item key="rank">
          <Link to="/rank">功力榜</Link>
        </Menu.Item>
        <Menu.Item key="calendar">
          <Link to="/calendar">吉凶时刻</Link>
        </Menu.Item>
        <SubMenu title={<span>其他</span>}>
          <Menu.Item key="panorama"><Link to="/panorama">全景图</Link></Menu.Item>
        </SubMenu>
      </Menu>
    );
  }
}

export default LeftMenu;
