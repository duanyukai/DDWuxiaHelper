import React, {Component} from 'react';
import Collapse from 'antd/es/collapse/Collapse';
import Modal from 'antd/es/modal/Modal';
import {Radio} from 'antd';
import {selectEquip, setMenpai} from '../actions';
import {connect} from 'react-redux';
import Select from 'antd/es/select/index';
import { getEquipData } from '../utils/load_equip_data';

import setData from '../assets/json/equip_set.json';
import equipSetData from '../assets/json/equip_set.json';
import menpaiSetData from '../assets/json/menpai_set.json';
import tzjSetData from '../assets/json/tzj_set.json';
import levelColorData from '../assets/json/level_color.json';

import './css/base_settings.css';

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

class BaseSettingsContainer extends Component {

  constructor(props) {
    super(props);

    this.equipSelectionChange = this.equipSelectionChange.bind(this);
    this.selectMenpaiSet = this.selectMenpaiSet.bind(this);
    this.selectTZJSet = this.selectTZJSet.bind(this);
  }

  componentDidMount() {
    this.data = getEquipData();
  }


  equipSelectionChange(value) {
    console.log(`selected ${value}`);
    this.props.selectEquip(this.props.currentPos, parseInt(value));
  }

  selectMenpaiSet(value) {
    let self = this;
    // 获取所有装备名称
    let setInfo = menpaiSetData[value];
    let setEquips = setInfo.list.map((equipId) => {
      return getEquipData(null, equipId);
    });
    let content = setEquips.map((equip) => {
      return <span>{equip.name} <br/></span>;
    });
    content.unshift(<p>确认替换以下装备么？</p>);
    // 提示是否替换所有装备
    Modal.confirm({
      title: '你确认要替换么？',
      content: content,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        // 替换所有装备，偷懒直接提交N次选择单件装备action
        setEquips.forEach((equip) => {
          // 根据装备类型反查装备位置（如戒指），设置所有
          let equipPos = equip.equipPos;

          equipPos2RealPosMap[equipPos].forEach((realPos) => {
            self.props.selectEquip(realPos, equip.id);
          });
        });
      },
      onCancel() {},
    });
  }

  selectTZJSet(value) {
    let self = this;
    // 获取所有装备名称
    let setInfo = tzjSetData[value];
    let setEquips = setInfo.list.map((equipId) => {
      return getEquipData(null, equipId);
    });
    let content = setEquips.map((equip) => {
      return <span key={equip.id}>{equip.name} <br/></span>;
    });
    content.unshift(<p>确认替换以下装备么？</p>);
    // 提示是否替换所有装备
    Modal.confirm({
      title: '你确认要替换么？',
      content: content,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        // 替换所有装备，偷懒直接提交N次选择单件装备action
        setEquips.forEach((equip) => {
          // 根据装备类型反查装备位置（如戒指），设置所有
          let equipPos = equip.equipPos;

          equipPos2RealPosMap[equipPos].forEach((realPos) => {
            self.props.selectEquip(realPos, equip.id);
          });
        });
      },
      onCancel() {},
    });
  }

  render() {
    let equipData = getEquipData(null, currEquipId);
    // console.log('当前装备', equipData);
    let currPosData = equipData[equipSetData[this.props.currentPos].type];
    // 装备单独选择列表
    let optionData = Object.keys(currPosData).filter((equipId) => {
      // 过滤当前门派
      return currPosData[equipId].menpai === this.props.menpaiId || currPosData[equipId].menpai === -1;
    }).sort((a, b) => {
      return currPosData[b].evaluationLV - currPosData[a].evaluationLV;
    }).map((id) => {
      let row = currPosData[id];
      return <Select.Option key={id} value={id}><span styleName="equip-name" style={{background: levelColorData[row.quality][0]}}>{row.name}</span>，{row.evaluationLV}品质等级，{row.catDesc}</Select.Option>;
    });

    // 当前已选择装备文本
    let currEquipId = this.props.equipData[this.props.currentPos].id;

    // 门派套快速选择Option列表
    let menpaiSetOptions = menpaiSetData.filter(({menpaiId}) => {
      return menpaiId === this.props.menpaiId;
    }).map(({name, id}, i) => (
      <Select.Option value={id} key={i}>{name}</Select.Option>
    ));

    // 天泽金套快速选择Option列表
    let tzjSetOptions = tzjSetData.map(({name, id}, i) => (
      <Select.Option value={id} key={i}>{name}</Select.Option>
    ));
    return (
      <div>
        <Collapse defaultActiveKey={['2', '3']}>
          <Collapse.Panel header="门派、属性基础设置" key="1">
            <h5>门派基础配置（未来会与心法模拟器等数据互通）</h5>
            <Radio.Group
              defaultValue={this.props.menpaiId}
              buttonStyle="solid"
              onChange={(e) => this.props.setMenpai(e.target.value)}
            >
              {
                [
                  {name: '真武', disabled: false},
                  {name: '太白', disabled: false},
                  {name: '神威', disabled: false},
                  {name: '丐帮', disabled: false},
                  {name: '唐门', disabled: false},
                  {name: '五毒', disabled: false},
                  {name: '少林', disabled: true},
                  {name: '天香', disabled: false},
                  {name: '神刀', disabled: false},
                  {name: '移花', disabled: false},
                ].map(({name, disabled}, i) => (
                  <Radio.Button key={i} value={i} disabled={disabled}>
                    {name}
                  </Radio.Button>
                ))
              }
            </Radio.Group>
            <br />
            <br />
            <h5>属性配置敬请期待！</h5>
          </Collapse.Panel>
          <Collapse.Panel header="当前装备位配置" key="2">
            <h4>当前装备部位：{setData[this.props.currentPos].showName}</h4>
            <div>
              <Select
                value={currEquipId === null ? '请选择一件装备' : (currEquipId + '')}
                showSearch
                allowClear
                size="large"
                style={{ width: '100%' }}
                placeholder="选择该部位的装备"
                optionFilterProp="children"
                onChange={this.equipSelectionChange}
              >
                {optionData}
              </Select>
            </div>
          </Collapse.Panel>
          <Collapse.Panel header="快速套装选择" key="3">
            <h4>门派套装筛选</h4>
            <div>
              <span>您可以使用该选择器快速选择整套该门派pvp套装+通用套件，或该门派的pve套装+通用套件。</span>
              <Select
                showSearch
                size="large"
                style={{ width: '100%' }}
                placeholder="门派套装快速装备"
                optionFilterProp="children"
                onSelect={this.selectMenpaiSet}
              >
                {menpaiSetOptions}
              </Select>
            </div>
            <br />
            <h4>PVE天火泽兰金刚套装筛选</h4>
            <div>
              <span>您可以单独使用该选择器快速选择包含天火泽兰金刚套的部位。其他部位请用上一个选择器快速选择。</span>
              <Select
                showSearch
                size="large"
                style={{ width: '100%' }}
                placeholder="PVE天火泽兰金刚套装快速装备"
                optionFilterProp="children"
                onSelect={this.selectTZJSet}
              >
                {tzjSetOptions}
              </Select>
            </div>
          </Collapse.Panel>
        </Collapse>
      </div>
    );
  }
}

function mapStateToProps(state) {

  return {
    currentPos: state.currentPos,
    menpaiId: state.menpaiId,
    equipData: state.equipData.sets[state.equipData.current]
  };
}

export default connect(mapStateToProps, {
  // actions
  setMenpai,
  selectEquip,
})(BaseSettingsContainer);