import React, { Component } from 'react';

import setData from '../assets/json/equip_set.json';
import Row from 'antd/es/grid/row';
import Col from 'antd/es/grid/col';
import {connect} from 'react-redux';
import {clearCurrentConfig, clearCurrentPos, resetAll, selectEquipPos} from '../actions';

import SlotConfigContainer from './slot_config';

import {ICON_URL_PREFIX} from '../utils/consts';
import './css/equip_set.css';
import {getEquipData} from '../utils/load_equip_data';
import levelColor from '../assets/json/level_color.json';
import menpaiNameData from '../assets/json/menpai.json';
import Popover from 'antd/es/popover';
import Button from 'antd/es/button/button';
import Icon from 'antd/es/icon';

import emptyIcon from '../assets/img/empty.png';
import Collapse from 'antd/es/collapse/Collapse';
import Popconfirm from 'antd/es/popconfirm';

class EquipSetContainer extends Component {

  constructor(props) {
    super(props);


    this.selectPos = this.selectPos.bind(this);
    this.clearPos = this.clearPos.bind(this);
    this.clearCurrentConfig = this.clearCurrentConfig.bind(this);
    this.clearAll = this.clearAll.bind(this);
  }

  selectPos(posId) {
    this.props.selectEquipPos(posId);
  }

  clearPos(posId) {
    this.props.clearCurrentPos(posId);
  }

  clearCurrentConfig() {
    this.props.clearCurrentConfig();
  }

  clearAll() {
    this.props.resetAll();
  }

  render() {
    let setKeys = Object.keys(setData).sort((a, b) => setData[a]['index'] - setData[b]['index']);
    let setRenderer = (key) => {
      let name = setData[key]['showName'];
      let imgSrc = emptyIcon;
      let bgColor = '#fff';
      let showLongzhu = false;
      let equipPosData = this.props.equipData[key];
      let settingsPopover = <div>
        请在右侧面板先选择装备
      </div>;
      if(equipPosData.id) {
        let equipData = getEquipData(setData[key].type, equipPosData.id);
        imgSrc = `${ICON_URL_PREFIX}${equipData.icon}.png`;
        bgColor = `linear-gradient(to bottom,${levelColor[equipData.quality][1]} 0%,${levelColor[equipData.quality][0]} 100%)`;
        showLongzhu = equipPosData.longzhuLV > 0;
        settingsPopover = <div>
          {equipData.name}，{equipData.equipType === 2 ? 'PVP装' : 'PVE装'}，{menpaiNameData[equipData.menpai]}<br />
          {equipData.evaluationLV}品质等级，{equipData.catDesc}
          <hr style={{margin: 1}} />
          清空此部位所有数据：<br />
          <Popconfirm placement="topRight" title={<span>确认清空该部位所有数据吗？<br />这将移除装备，重置精工琢磨等至0级</span>}
            onConfirm={() => this.clearPos(key)}
            okText="确定" cancelText="取消"
          >
            <Button size="small" type="danger">清除此部位所有</Button>
          </Popconfirm>
        </div>;
      }
      return(
        <div key={key} onClick={this.selectPos.bind(this, key)} styleName={key === this.props.currentPos ? 'equip-pos-selected' : 'equip-pos'}>
          <div styleName="pos-img-wrapper">
            <img styleName="pos-img" width="64" height="64" src={imgSrc} style={{background: bgColor}} />
            <div styleName="pos-img-border" />
            {showLongzhu &&
            <div styleName="pos-img-longzhu" />
            }
            <Popover content={settingsPopover} trigger="hover">
              <Button type="primary" size="small" styleName="equip-setting-btn"><Icon type="setting" theme="outlined" /></Button>
            </Popover>
          </div>
          <span styleName="pos-name">{name}</span>
        </div>
      );
    };
    return (
      <div>
        <Row>
          <Col span={24}>
            <SlotConfigContainer />
          </Col>
          <Col span={24}>
            <Collapse defaultActiveKey={['1']} style={{margin: '10px -20px'}}>
              <Collapse.Panel header="装备槽" key="1">
                <Row>
                  <Col span={12}>
                    {
                      setKeys.slice(0, 6).map(setRenderer)
                    }
                  </Col>
                  <Col span={12}>
                    {
                      setKeys.slice(6).map(setRenderer)
                    }
                  </Col>
                </Row>
              </Collapse.Panel>
            </Collapse>
          </Col>
          <Col span={24}>
            <Popconfirm placement="topRight" title={'确定清空当前配置槽全部数据吗？'}
              onConfirm={this.clearCurrentConfig}
              okText="确定" cancelText="取消"
            >
              <Button size="small" type="danger" block>
                清空当前配置槽全部数据
              </Button>
            </Popconfirm>
            <br />
            <Popconfirm placement="topRight" title={<span>确认清空所有数据吗？<br />这将重置模拟器至最初始状态。<br />您也可在数据出现问题时尝试本功能。</span>}
              onConfirm={this.clearAll}
              okText="确定" cancelText="取消"
            >
              <Button size="small" type="danger" block style={{margin: '5px 0'}}>
                清空所有数据(出错时可尝试)
              </Button>
            </Popconfirm>
            如有模拟器数值上错误或无法运行等严重问题，请加Q群 660695387 进行反馈，感谢您的支持。
          </Col>
        </Row>
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
  selectEquipPos,
  clearCurrentPos,
  clearCurrentConfig,
  resetAll
})(EquipSetContainer);