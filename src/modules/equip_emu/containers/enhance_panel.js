import React, { Component } from 'react';
import {connect} from 'react-redux';
import range from 'lodash/range';

import Select from 'antd/es/select/index';
import Modal from 'antd/es/modal/index';
import {selectEnhance} from '../actions';
import InputNumber from 'antd/es/input-number/index';
import Button from 'antd/es/button/button';

import setData from '../assets/json/equip_set.json';
import enhanceCostData from '../assets/json/enhance_cost.json';
import enhancePropData from '../assets/json/enhance_props.json';
import {suiyinFormat} from '../utils/string_format';

import './css/enhance_panel.css';

class EnhanceContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      enhanceCalcFrom: 0,
      enhanceCalcTo: 56,
      enhanceCost: '请点击计算按钮计算'
    };

    this.selectEnhance = this.selectEnhance.bind(this);
    this.selectAllEnhance = this.selectAllEnhance.bind(this);
    this.calcEnhanceCost = this.calcEnhanceCost.bind(this);
  }

  selectEnhance(level) {
    this.props.selectEnhance(this.props.currentPos, level);
  }

  selectAllEnhance(level) {
    // todo hack
    let self = this;
    Modal.confirm({
      title: '确定设置所有装备精工等级吗？',
      content: '13件装备的精工等级将全部设置为' + level,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        Object.keys(setData).forEach((pos) => {
          self.props.selectEnhance(pos, level);
        });
      },
      onCancel() {},
    });
  }

  calcEnhanceCost() {
    let from = this.state. enhanceCalcFrom;
    let to = this.state. enhanceCalcTo;
    if(to > from) {
      // todo
      let exp = range(from + 1, to + 1).reduce((total, current) => {
        total += enhanceCostData[current].exp;
        return total;
      }, 0);
      let suiyin = exp * 250;
      let cailiao = Math.ceil(exp / 20);
      this.setState({enhanceCost: `需经验${exp}点，无损材料${cailiao}个*，碎银${suiyinFormat(suiyin)}`});
    } else {
      this.setState({enhanceCost: '结束等级请填写大于开始等级的数值'});
    }
  }

  render() {
    // 精工等级属性Options
    let enhanceOptions = range(0, 71).map((level) => {
      let costData = enhanceCostData[level];
      let propData = enhancePropData[setData[this.props.currentPos].type][level];
      let propStr = '';
      [
        {type: 'wgMin', name: '外攻最小值'},
        {type: 'wgMax', name: '外攻最大值'},
        {type: 'ngMin', name: '内功最小值'},
        {type: 'ngMax', name: '内功最大值'},
        {type: 'wf', name: '外防'},
        {type: 'qx', name: '气血'},
      ].forEach(({type, name}) => {
        if(propData[type] > 0)
          propStr += `${name}+${propData[type]}，`;
      });
      propStr = propStr.replace(/，\s*$/, '');
      if(propStr === '')
        propStr = '该级无任何属性加成';
      return (
        <Select.Option key={level} value={level}><span styleName="level">精工{level}级</span>，该级{costData.exp}经验，{propStr}</Select.Option>
      );
    });
    return(
      <div>
        温馨提示：此处精工等级可任意配置，不与装备联通，方便您切换装备或单纯模拟精工使用。属性计算时，将根据精工等级是否超出装备最大精工等级来确定是否生效。
        另外，PVE装备不受此数值影响。
        <div>设置当前装备精工等级</div>
        <Select
          defaultValue='0'
          value={this.props.equipData[this.props.currentPos].enhanceLV}
          showSearch
          size="large"
          style={{ width: '100%' }}
          placeholder="选择精工等级"
          onChange={(value) => this.selectEnhance(value)}
          optionFilterProp="value"
        >
          {enhanceOptions}
        </Select>
        <div>批量设置精工等级</div>
        <Select
          showSearch
          size="large"
          value={null}
          style={{ width: '100%' }}
          placeholder="快速设置全套装备精工等级"
          optionFilterProp="value"
          onSelect={(value) => this.selectAllEnhance(value)}
        >
          {range(71).map(i => <Select.Option key={i} value={i}>精工{i}级</Select.Option>)}
        </Select>
        <div>精工消耗小计算器</div>
        从{' '}<InputNumber min={0} max={70} precision={0} defaultValue={0} onChange={(i) => this.setState({enhanceCalcFrom: i})} />{' '}
        级到{' '}<InputNumber min={0} max={70} precision={0} defaultValue={56} onChange={(i) => this.setState({enhanceCalcTo: i})} />{' '}
        <Button onClick={this.calcEnhanceCost}>计算</Button>{' '}结果：{this.state.enhanceCost}
        <br />
        *: 关于精工材料消耗、属性等详细攻略请参考<a target="_blank" href="http://bbs.duowan.com/thread-46459482-1-1.html">点击此处</a>。
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
  selectEnhance
})(EnhanceContainer);