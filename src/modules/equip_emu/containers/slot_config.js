import React, { Component } from 'react';
import './css/single_equip_settings.css';
import {connect} from 'react-redux';
import {copySet, selectEquipPos, selectSet} from '../actions';

import {Radio} from 'antd';
import Select from 'antd/es/select/index';
import Button from 'antd/es/button/button';
import Popconfirm from 'antd/es/popconfirm/index';

import ImportEquipContainer from './import_equip_panel';

class SlotConfigContainer extends Component {

  constructor(props) {
    super(props);


    this.state = {
      copyFrom: 0,
      copyTo: 0,
    };

    this.selectSet = this.selectSet.bind(this);
    this.copySet = this.copySet.bind(this);
    this.compareSet = this.compareSet.bind(this);
  }

  selectSet(setId) {
    this.props.selectSet(setId);
  }

  copySet(from, to) {
    this.props.copySet(from, to);
  }

  compareSet() {
    // todo 直接做到下面的面板里
  }

  renderSetSelect(state) {
    return (
      <Select defaultValue="壹" style={{ width: 52 }} onChange={(e) => this.setState({[state]: e})}>
        <Select.Option value="0">壹</Select.Option>
        <Select.Option value="1">贰</Select.Option>
        <Select.Option value="2">叁</Select.Option>
        <Select.Option value="3">肆</Select.Option>
        <Select.Option value="4">伍</Select.Option>
      </Select>
    );
  }

  render() {
    return (
      <div style={{textAlign: 'center'}}>
        <div>选择装备配置槽</div>
        <Radio.Group
          defaultValue={this.props.currentSet}
          buttonStyle="solid"
          onChange={(e) => this.selectSet(e.target.value)}
        >
          {
            ['壹' ,'贰', '叁', '肆', '伍'].map((text, i) => {

              return (
                <Radio.Button
                  key={i} value={i}
                  style={{padding: '0 10px'}}
                >
                  {text}
                </Radio.Button>
              );
            })
          }
        </Radio.Group>

        <div>复制配置</div>
        {this.renderSetSelect('copyFrom')} 到 {this.renderSetSelect('copyTo')}{' '}
        <Popconfirm placement="bottomLeft" title="确认复制配置么" onConfirm={() => {
          this.copySet(this.state.copyFrom, this.state.copyTo);
        }} okText="确认" cancelText="取消">
          <Button>确定</Button>
        </Popconfirm>
        <ImportEquipContainer />
      </div>
    );
  }

}


function mapStateToProps(state) {

  return {
    currentPos: state.currentPos,
    equipData: state.equipData,
    currentSet: state.equipData.current
  };
}

export default connect(mapStateToProps, {
  // actions
  selectSet,
  copySet
})(SlotConfigContainer);