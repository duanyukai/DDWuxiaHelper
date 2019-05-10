import React, {Component} from 'react';
import {connect} from 'react-redux';
import Button from 'antd/es/button/index';
import Radio from 'antd/es/radio/index';

import './css/skill_select_sub.css';
import {selectSet, setCurSkillType} from '../actions';
import Select from 'antd/es/select';
import Popconfirm from "antd/es/popconfirm";

class SlotConfigContainer extends Component {

  constructor(props) {
    super(props);


    this.state = {
      copyFrom: 0,
      copyTo: 0,
    };

    this.selectSet = this.selectSet.bind(this);
    this.copySet = this.copySet.bind(this);
  }

  selectSet(setId) {
    this.props.selectSet(setId);
  }

  copySet(from, to) {
    this.props.copySet(from, to);
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
      <div>
        <h3>基本配置</h3>
        <div>选择师妹配置槽</div>
        <Radio.Group
          defaultValue={this.props.currentSet}
          buttonStyle="solid"
          onChange={(e) => this.props.selectSet(e.target.value)}
        >
          {
            ['壹', '贰', '叁', '肆', '伍'].map((name, i) => {
              return <Radio.Button key={i} value={i}>{name}</Radio.Button>;
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
      </div>
    );
  }
}

function mapStateToProps(state) {
  state = state.shimeiEmu;
  return {
    currentSet: state.shimeiData.current
  };
}

export default connect(mapStateToProps, {
  selectSet
})(SlotConfigContainer);