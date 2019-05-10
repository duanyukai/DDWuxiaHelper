import React, { Component } from 'react';
import {connect} from 'react-redux';
import range from 'lodash/range';

import Select from 'antd/es/select/index';
import {selectJiangxin} from '../actions';
import InputNumber from 'antd/es/input-number/index';
import Button from 'antd/es/button/button';

import jiangxinCostData from '../assets/json/jiangxin_cost.json';
import jiangxinRatioData from '../assets/json/jiangxin_percentage.json';
import {suiyinFormat} from '../utils/string_format';
import Modal from 'antd/es/modal';
import setData from '../assets/json/equip_set.json';

import './css/jiangxin_panel.css';

class JiangxinContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      jiangxinCalcFrom: 0,
      jiangxinCalcTo: 56,
      jiangxinCost: '请点击计算按钮计算'
    };

    this.selectJiangxin = this.selectJiangxin.bind(this);
    this.selectAllJiangxin = this.selectAllJiangxin.bind(this);
    this.calcJiangxinCost = this.calcJiangxinCost.bind(this);
  }

  selectJiangxin(level) {
    this.props.selectJiangxin(this.props.currentPos, level);
  }

  selectAllJiangxin(level) {
    // todo hack
    let self = this;
    Modal.confirm({
      title: '确定设置所有装备琢磨等级吗？',
      content: '13件装备的琢磨等级将全部设置为' + level,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        Object.keys(setData).forEach((pos) => {
          self.props.selectJiangxin(pos, level);
        });
      },
      onCancel() {},
    });
  }

  calcJiangxinCost() {
    let from = this.state. jiangxinCalcFrom;
    let to = this.state. jiangxinCalcTo;
    if(to > from) {
      // todo 如从4到6级，则计算5、6的和即可
      let exp = range(from + 1, to + 1).reduce((total, current) => {
        total += jiangxinCostData[current].exp;
        return total;
      }, 0);
      let suiyin = exp * 250;
      let cailiao = Math.ceil(exp / 20);
      this.setState({jiangxinCost: `需经验${exp}点，无损材料${cailiao}个*，碎银${suiyinFormat(suiyin)}`});
    } else {
      this.setState({jiangxinCost: '结束等级请填写大于开始等级的数值'});
    }
  }

  render() {
    // 琢磨等级属性Options
    let jiangxinOptions = range(0, 51).map((level) => {
      let costData = jiangxinCostData[level];
      let ratioData = jiangxinRatioData[level];
      return (
        <Select.Option key={level} value={level}><span styleName="level">琢磨{level}级</span>，该级{costData.exp}经验，装备属性提升{+(ratioData.ratio*100).toFixed(8)}%</Select.Option>
      );
    });
    return(
      <div>
        温馨提示：此处琢磨等级可任意配置，不与装备联通，方便您切换装备或单纯模拟琢磨使用。属性计算时，将根据琢磨等级是否超出装备最大琢磨等级来确定是否生效。
        另外，PVE装备不受此数值影响。
        <Select
          defaultValue={1}
          value={this.props.equipData[this.props.currentPos].jiangxinLV}
          showSearch
          size="large"
          style={{ width: '100%' }}
          optionFilterProp="value"
          onChange={(value) => this.selectJiangxin(value)}
        >
          {jiangxinOptions}
        </Select>
        <div>批量设置琢磨等级</div>
        <Select
          showSearch
          size="large"
          value={null}
          style={{ width: '100%' }}
          placeholder="快速设置全套装备琢磨等级"
          optionFilterProp="value"
          onSelect={(value) => this.selectAllJiangxin(value)}
        >
          {range(51).map(i => <Select.Option key={i} value={i}>琢磨{i}级</Select.Option>)}
        </Select>
        <div>琢磨消耗小计算器</div>
        从{' '}<InputNumber min={0} max={50} precision={0} defaultValue={0} onChange={(i) => this.setState({jiangxinCalcFrom: i})} />{' '}
        级到{' '}<InputNumber min={0} max={50} precision={0} defaultValue={50} onChange={(i) => this.setState({jiangxinCalcTo: i})} />{' '}
        <Button onClick={this.calcJiangxinCost}>计算</Button>{' '}结果：{this.state.jiangxinCost}
        <br />
        *: 关于琢磨材料消耗、属性等详细攻略请参考<a href="#">点击此处</a>。
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
  selectJiangxin
})(JiangxinContainer);