import React, { Component } from 'react';
import {connect} from 'react-redux';
import axios from 'axios';

import Select from 'antd/es/select/index';
import Modal from 'antd/es/modal/index';
import {batchSetEquips, selectEnhance, setMenpai} from '../actions';
import InputNumber from 'antd/es/input-number/index';
import Button from 'antd/es/button/button';

import {suiyinFormat} from '../utils/string_format';

import './css/import_equip_panel.css';
import Icon from 'antd/es/icon';
import Input from 'antd/es/input/Input';
import List from 'antd/es/list';
import {getEquipData} from '../utils/load_equip_data';
import {DataFormat} from '../components/prop_table';
import Spin from 'antd/es/spin';
import Popconfirm from 'antd/es/popconfirm';
import Popover from 'antd/es/popover';

const LoadingBlock = (props) => {
  return <div style={{margin: 15, textAlign: 'center'}}>
    <Spin />
  </div>;
};

class ImportEquipContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      roleLoading: false,
      roleList: [],

      selectedRole: null,
      selectedJob: 0,

      showDetail: false,
      equipLoading: false,
      equipList: []
    };

    this.showModal = this.showModal.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.searchRoleList = this.searchRoleList.bind(this);
    this.getEquipList = this.getEquipList.bind(this);
    this.batchSet = this.batchSet.bind(this);
  }

  showModal() {
    this.setState({
      showModal: true,
    });
  }

  handleOk(e) {
    this.setState({
      showModal: false,
    });
  }

  handleCancel(e) {
    this.setState({
      showModal: false,
    });
  }

  searchRoleList(id) {
    let self = this;
    // 先弄个loading
    self.setState({
      roleLoading: true
    });
    // 取消loading
    axios.get(`https://api.wuxiatools.com/role/list/${id}`).then((res) => {
      self.setState({
        roleList: res.data,
        roleLoading: false
      });
    });
  }

  getEquipList(uin, serverId, longRoleId) {
    let self = this;
    self.setState({
      equipLoading: true
    });
    axios.get(`https://api.wuxiatools.com/role/detailed/${uin}/${serverId}/${longRoleId}`).then((res) => {
      self.setState({
        equipList: res.data.equips,
        equipLoading: false
      });
    });
  }

  renderEquipList() {
    let equipListData = this.state.equipList.map((item) => {
      // 查询装备信息
      let equip = getEquipData(null, item.equipId);
      return {
        ...item,
        equip: equip
      };
    })
      .sort((a, b) => b.equip.equipType - a.equip.equipType)
      .map(({equipId, enhanceLV, jiangxinLV, longzhuLV, affix}) => {
      // 查询装备信息
        let equip = getEquipData(null, equipId);
        // 计算词缀信息
        // 如：11001063，11指戒指，001指力道，06指6品，3指升级
        let nameList = [
          null, '淬力', '益气', '养髓', '慧观',
          '纳敏', '开碑', '倒海', '含锋', '蓄雷',
          '厚德', '旷息', '无漏', '盾拒', '超诣',
          '聚神', '柔缠', '海纳', '项王', '武圣',
          '常山', '黄巾', '子房', '易水', '诸葛',
          '秦皇', '淮南', '青莲', '愚公', '彭祖'
        ];

        let affixData = affix.map(affixId => {
          let affixType = parseInt(affixId.slice(-6, -3));
          let affixTypeStr = '';
          if(affixType === 30) {
          // 特殊处理
            if(['ZhuWuQi', 'AnQi'].includes(equip.equipPos)) {
              affixTypeStr = '飞将';
            } else if(equip.equipPos === 'FuWuQi') {
              affixTypeStr = '赵客';
            } else if(['HuWan', 'XieZi'].includes(equip.equipPos)) {
              affixTypeStr = '龙城';
            } else {
              affixTypeStr = null;
            }
          } else {
            affixTypeStr = nameList[affixType];
          }
          return {
            type: affixTypeStr,
            level: parseInt(affixId.slice(-3, -1)) + '-' + affixId.slice(-1)
          };
        });

        return {
          equipId: equip.id,
          equip: equip,
          enhanceLV: parseInt(enhanceLV),
          jiangxinLV: parseInt(jiangxinLV),
          longzhuLV: parseInt(longzhuLV),
          affix: affixData
        };
      });

    let equipTableBody = equipListData.map(({equip, enhanceLV, jiangxinLV, longzhuLV, affix}, i) => {
      return <tr key={i}>
        <td>{equip.name}</td>
        <td>{equip.equipType === 1 ? 'PVE' : 'PVP'}</td>
        <td>{enhanceLV}级</td>
        <td>{jiangxinLV}级</td>
        <td>{longzhuLV}级</td>
        <td>
          {affix[0] ? affix[0].type + affix[0].level : '无'}
          {affix[1] && '+' + affix[1].type + affix[1].level}
        </td>
      </tr>;
    });

    return <div>
      <table styleName="prop-table">
        <thead>
          <tr>
            <th>名称</th><th>类型</th><th>精工</th><th>琢磨</th><th>珑铸</th><th>词缀</th>
          </tr>
        </thead>
        <tbody>
          {equipTableBody}
        </tbody>
      </table>
      {this.state.equipList.length !== 0 &&
      <div style={{marginTop: 10}}>
        <Popconfirm
          title={<p>确认替换列表中全部PVP装备么？<br />这将覆盖您当前配置槽的全部数据。</p>}
          onConfirm={() => this.batchSet(equipListData, 'PVP')}
          okText="确认" cancelText="取消"
        >
          <Button type="primary">
            极速上PVP装
          </Button>
        </Popconfirm>{' '}
        <Popconfirm
          title={<p>确认替换成列表中全部PVE装备么？<br />这将覆盖您当前配置槽的全部数据。<br />PVE装备将继承列表中PVP装备精工琢磨珑铸词缀数据。</p>}
          onConfirm={() => this.batchSet(equipListData, 'PVE')}
          okText="确认" cancelText="取消"
        >
          <Button type="primary">
            极速上PVE装（含PVP穿透属性）
          </Button>
        </Popconfirm>
      </div>
      }
    </div>;
  }

  batchSet(data, type) {
    // 根据data里的数据，推测装备位置即可
    let batchData = {};
    let jiezhiIndexToggle = 0;
    let equipPos2RealPosMap = {
      ZhuWuQi: ['zhuwu'],
      FuWuQi: ['fuwu'],
      AnQi: ['anqi'],
      ShouZhuo: ['shouzhuo'],
      JieZhi: ['jiezhi1', 'jiezhi2'],
      XiangLian: ['xianglian'],
      TouShi: ['toushi'],
      HuWan: ['huwan'],
      ShangYi: ['shangyi'],
      NeiChen: ['neichen'],
      YaoDai: ['yidai'],
      XieZi: ['xiezi'],
    };
    // 无论pvp、pve，都先按pvp走一遍属性
    data.forEach(({equipId, equip, enhanceLV, jiangxinLV, longzhuLV, affix}) => {
      if(equip.equipType === 2) {
        let pos;
        if(equip.equipPos === 'JieZhi') {
          pos = equipPos2RealPosMap['JieZhi'][jiezhiIndexToggle];
          jiezhiIndexToggle = (jiezhiIndexToggle + 1) % 2;
        } else {
          pos = equipPos2RealPosMap[equip.equipPos][0];
        }

        batchData[pos] = {
          id: equipId,
          enhanceLV, jiangxinLV, longzhuLV, affix
        };
      }
    });

    // 如果是pve，用pve装备替换pvp的数据即可
    jiezhiIndexToggle = 0;
    if(type === 'PVE') {
      data.forEach(({equipId, equip}) => {
        if(equip.equipType === 1) {
          let pos;
          if(equip.equipPos === 'JieZhi') {
            pos = equipPos2RealPosMap['JieZhi'][jiezhiIndexToggle];
            jiezhiIndexToggle = (jiezhiIndexToggle + 1) % 2;
          } else {
            pos = equipPos2RealPosMap[equip.equipPos][0];
          }

          if(batchData.hasOwnProperty(pos)) {
            batchData[pos].id = equipId;
          } else {
            batchData[pos] = {
              id: equipId,
              enhanceLV: 0, jiangxinLV: 0, longzhuLV: 0, affix: {0: null, 1: null}
            };
          }
        }
      });
    }

    // 提交action
    // 门派设置
    this.props.setMenpai(this.state.selectedJob);
    // 装备设置
    this.props.batchSetEquips(batchData);
    // 关闭弹窗
    this.handleCancel();
  }

  render() {
    let self = this;

    return(
      <div style={{marginTop: 10}}>
        <Button
          type="primary"
          size="large"
          onClick={this.showModal}
        >
          <Icon type="sound" />
          [New!] 极速导入游戏内数据
        </Button>
        <Modal
          title="极速导入游戏内装备数据"
          visible={this.state.showModal}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          style={{width: 720}}
          footer={null}
        >
          重磅更新！本装备模拟器现支持极速导入游戏内装备数据，装备精工琢磨珑铸词缀完整导入！<br />
          具体原理与本站<a href="/role/" target="_blank">角色信息查询工具</a>相同。<br />
          由于本功能依赖外部接口，如出现不可用问题可以加交流群660695387反馈。
          {/*您目前可以在角色查询工具中存储您的id历史方便随后使用，未来也会在本工具中也加入历史存储功能。*/}
          <Popover
            placement="bottom" trigger="click"
            content={<div style={{maxWidth: 300}}>
              <ol>
                <li>打开天刀手机app；</li>
                <li>点击左上角菜单按钮（或向右滑动界面）；</li>
                <li>点击“系统设置”；</li>
                <li>第一行的“助手账号”即帐号ID；</li>
                <li>可以记录下自己ID，以便日后使用。</li>
              </ol>
              <p>另外，如果在游戏内更改装备，需要大概最多三分钟才能更新到模拟器中获取的数据，不过这一点应该不影响基本使用。</p>
            </div>} title="如何找到帐号ID及使用说明">
            <Button type="primary">如何找到帐号ID及使用说明</Button>
          </Popover>
          <Input.Search
            style={{marginTop: 10}}
            name="app-user-id"
            placeholder="输入天刀app帐号Id"
            onSearch={value => this.searchRoleList(value)}
            enterButton
          />

          {this.state.roleLoading ?
            <LoadingBlock /> :
            <List
              style={{marginTop: 10}}
              bordered
              locale={{emptyText: '无结果，请在上方搜索框输入正确id进行查找'}}
              dataSource={this.state.roleList}
              renderItem={item => (<List.Item
                styleName="role-list"
                onClick={() => {
                  self.getEquipList(item.uin, item.serverId, item.longRoleId);
                  self.setState({
                    selectedRole: item.roleName,
                    selectedJob: item.roleJobId
                  });
                }}
              >
                {item.roleName} {item.roleJob} {item.serverName}
              </List.Item>)}
            />
          }
          {this.state.selectedRole &&
            <div styleName="equip-list">
              已选择角色：{this.state.selectedRole}
              <br />
              PVP、PVE所有装备列表：
              {this.state.equipLoading ?
                <LoadingBlock /> :
                this.renderEquipList()
              }
            </div>
          }

        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentPos: state.currentPos,
    equipData: state.equipData.sets[state.equipData.current]
  };
}

export default connect(mapStateToProps, {
  // actions
  batchSetEquips,
  setMenpai
})(ImportEquipContainer);