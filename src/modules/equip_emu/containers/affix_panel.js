import React, { Component } from 'react';
import {connect} from 'react-redux';
import range from 'lodash/range';

import {selectAffix} from '../actions';

import setData from '../assets/json/equip_set.json';
import affixData from '../assets/json/affix.json';
import {suiyinFormat} from '../utils/string_format';

import Cascader from 'antd/es/cascader/index';

import './css/affix_panel.css';

class AffixContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      affixCalcFrom: 0,
      affixCalcTo: 56,
      affixCost: '请点击计算按钮计算'
    };

    this.selectAffix = this.selectAffix.bind(this);
    this.calcAffixCost = this.calcAffixCost.bind(this);
  }

  selectAffix(pos, value) {
    this.props.selectAffix(this.props.currentPos, pos, value[0], value[1]);
  }

  calcAffixCost() {
    let from = this.state. affixCalcFrom;
    let to = this.state. affixCalcTo;
    if(to > from) {
      let exp = range(from, to).reduce((total, current) => {
        total += affixCostData[current].exp;
        return total;
      }, 0);
      let suiyin = exp * 250;
      let cailiao = Math.ceil(exp / 10);
      this.setState({affixCost: `消耗顶级材料${cailiao}个*，碎银${suiyinFormat(suiyin)}`});
    } else {
      this.setState({affixCost: '结束等级请填写大于开始等级的数值'});
    }
  }

  render() {
    // 词缀Options
    let curPosData = affixData[setData[this.props.currentPos].type];
    let affixOptions = ['词缀一', '词缀二'].map((affixPos) => {
      let affixData = curPosData[affixPos];
      // 第一级选项（词缀类型）
      return Object.keys(affixData).map((affixName) => {
        // 第二级选项（词缀等级）
        let affixLevelData = affixData[affixName];
        let levels = Object.keys(affixLevelData).map((levelKey) => {
          let levelData = affixLevelData[levelKey];
          return {
            value: levelKey,
            label: `${levelData.pinji}品，${levelData.jiangxin}匠心，${levelData.desc}`
          };
        });
        return {
          value: affixName,
          label: affixName,
          children: levels
        };
      });
    });
    // 词缀默认已选项
    let defaultValues = [0, 1].map((affixPos) => {
      let value = this.props.equipData[this.props.currentPos].affix[affixPos];
      if(value) {
        return [value.type, value.level];
      } else {
        return [];
      }
    });

    return(
      <div>
        温馨提示：此处词缀可任意配置，不与装备联通，方便您切换装备或单纯模拟词缀使用。属性计算时，将根据词缀所需匠心的琢磨等级等来判断是否生效。
        <div>第一条词缀：</div>
        <Cascader
          options={affixOptions[0]}
          styleName="affix-cascader"
          onChange={(v) => this.selectAffix(0, v)}
          value={defaultValues[0]}
          placeholder="请为第一条词缀进行选择"
        />
        <div>第二条词缀：</div>
        <Cascader
          options={affixOptions[1]}
          styleName="affix-cascader"
          onChange={(v) => this.selectAffix(1, v)}
          value={defaultValues[1]}
          placeholder="请为第二条词缀进行选择"
        />
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
  selectAffix
})(AffixContainer);