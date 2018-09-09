import React, { Component } from 'react';
import {connect} from 'react-redux';
import range from 'lodash/range';

import Select from 'antd/es/select/index';
import {selectLongzhu} from '../actions';
import InputNumber from 'antd/es/input-number/index';
import Button from 'antd/es/button/button';

import setData from '../assets/json/equip_set.json';
import longzhuData from '../assets/json/longzhu.json';
import {suiyinFormat} from '../utils/string_format';

import './css/longzhu_panel.css';

class LongzhuContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      longzhuCalcFrom: 0,
      longzhuCalcTo: 56,
      longzhuCost: '请点击计算按钮计算'
    };

    this.selectLongzhu = this.selectLongzhu.bind(this);
    this.calcLongzhuCost = this.calcLongzhuCost.bind(this);
  }

  selectLongzhu(level) {
    this.props.selectLongzhu(this.props.currentPos, level);
  }

  calcLongzhuCost() {
    let from = this.state. longzhuCalcFrom;
    let to = this.state. longzhuCalcTo;
    if(to > from) {
      let exp = range(from, to).reduce((total, current) => {
        total += longzhuCostData[current].exp;
        return total;
      }, 0);
      let suiyin = exp * 250;
      let cailiao = Math.ceil(exp / 10);
      this.setState({longzhuCost: `消耗顶级材料${cailiao}个*，碎银${suiyinFormat(suiyin)}`});
    } else {
      this.setState({longzhuCost: '结束等级请填写大于开始等级的数值'});
    }
  }

  render() {
    // 珑铸等级属性Options
    let longzhuOptions;
    if(longzhuData[this.props.menpaiId][setData[this.props.currentPos].type]) {
      // 此部位有珑铸
      longzhuOptions = range(0, 10).map((level) => {
        let row = longzhuData[this.props.menpaiId][setData[this.props.currentPos].type][level];
        return (
          <Select.Option key={level} value={level}>
            <span styleName="level">{row.name} {level}级</span>，属性加成：{row.props}，升级消耗碎银{suiyinFormat(row.suiyin)}
            <br/>
            技能效果：{row.deco.replace(/\$\$/g, '，')}
          </Select.Option>
        );
      });
    } else {
      // 此部位无珑铸
      longzhuOptions = [
        <Select.Option key={0} value={0}>
          该部位暂无珑铸
        </Select.Option>
      ];
    }

    return(
      <div>
        温馨提示：此处珑铸等级可任意配置，与门派联通，但不与装备联通，方便您切换装备或单纯模拟珑铸使用。属性计算时，默认生效，暂时未判断需求的琢磨等级。
        <Select
          defaultValue={1}
          value={this.props.equipData[this.props.currentPos].longzhuLV}
          showSearch
          size="large"
          style={{ width: '100%'}}
          styleName="longzhu-select"
          optionFilterProp="children"
          onChange={(value) => this.selectLongzhu(value)}
        >
          {longzhuOptions}
        </Select>
        <br />
        *: 关于珑铸材料消耗、属性、技能效果等详细攻略请参考<a target="_blank" href="http://bbs.duowan.com/thread-46407004-1-1.html">点击此处</a>。
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    menpaiId: state.menpaiId,
    currentPos: state.currentPos,
    equipData: state.equipData.sets[state.equipData.current]
  };
}

export default connect(mapStateToProps, {
  // actions
  selectLongzhu
})(LongzhuContainer);