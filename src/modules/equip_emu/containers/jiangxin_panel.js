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

class JiangxinContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      jiangxinCalcFrom: 0,
      jiangxinCalcTo: 56,
      jiangxinCost: '请点击计算按钮计算'
    };

    this.selectJiangxin = this.selectJiangxin.bind(this);
    this.calcJiangxinCost = this.calcJiangxinCost.bind(this);
  }

  selectJiangxin(level) {
    this.props.selectJiangxin(this.props.currentPos, level);
  }

  calcJiangxinCost() {
    let from = this.state. jiangxinCalcFrom;
    let to = this.state. jiangxinCalcTo;
    if(to > from) {
      let exp = range(from, to).reduce((total, current) => {
        total += jiangxinCostData[current].exp;
        return total;
      }, 0);
      let suiyin = exp * 250;
      let cailiao = Math.ceil(exp / 10);
      this.setState({jiangxinCost: `消耗顶级材料${cailiao}个*，碎银${suiyinFormat(suiyin)}`});
    } else {
      this.setState({jiangxinCost: '结束等级请填写大于开始等级的数值'});
    }
  }

  render() {
    // 琢磨等级属性Options
    let jiangxinOptions = range(0, 57).map((level) => {
      let costData = jiangxinCostData[level];
      let ratioData = jiangxinRatioData[level];
      return (
        <Select.Option key={level} value={level}>{level}级，该级{costData.exp}经验，装备属性提升{+(ratioData.ratio*100).toFixed(8)}%</Select.Option>
      );
    });
    return(
      <div>
        温馨提示：此处琢磨等级可任意配置，不与装备联通，方便您切换装备或单纯模拟琢磨使用。属性计算时，将根据琢磨等级是否超出装备最大琢磨等级来确定是否生效。
        <Select
          defaultValue={1}
          value={this.props.equipData[this.props.currentPos].jiangxinLV}
          showSearch
          size="large"
          style={{ width: '100%' }}
          placeholder="选择该部位的装备"
          optionFilterProp="children"
          onChange={(value) => this.selectJiangxin(value)}
        >
          {jiangxinOptions}
        </Select>
        <div>琢磨消耗小计算器</div>
        从{' '}<InputNumber min={0} max={56} precision={0} defaultValue={0} onChange={(i) => this.setState({jiangxinCalcFrom: i})} />{' '}
        级到{' '}<InputNumber min={0} max={56} precision={0} defaultValue={56} onChange={(i) => this.setState({jiangxinCalcTo: i})} />{' '}
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