import React, { Component } from 'react';
import {connect} from 'react-redux';
import range from 'lodash/range';

import {selectAffix} from '../actions';

import setData from '../assets/json/equip_set.json';
import affixData from '../assets/json/affix.json';
import {suiyinFormat} from '../utils/string_format';

import Cascader from 'antd/es/cascader/index';

import './css/affix_panel.css';
import {Link} from "react-router-dom";

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
    this.displayRender = this.displayRender.bind(this);
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

  displayRender(label, selectedOptions) {
    return <span>{label[0]} {label[1]}</span>;
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
            label: <span>
              <span styleName="affix-name" style={{color: levelData.color === 2 ? '#bc8fbc' : '#fff'}}>{levelData.pinji}品</span>
              ，{levelData.jiangxin}匠心，{levelData.desc}，
              ({levelData.special})
            </span>
          };
        });

        return {
          value: affixName,
          label: <span styleName="affix-name" style={{color: affixLevelData[Object.keys(affixLevelData)[0]].color === 2 ? '#bc8fbc' : '#fff'}}>{affixName}</span>,
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
          displayRender={this.displayRender}
          popupPlacement="topLeft"
        />
        <div>第二条词缀：</div>
        <Cascader
          options={affixOptions[1]}
          styleName="affix-cascader"
          onChange={(v) => this.selectAffix(1, v)}
          value={defaultValues[1]}
          placeholder="请为第二条词缀进行选择"
          displayRender={this.displayRender}
          popupPlacement="topLeft"
        />
        <p>
        注：词缀列表中，末尾附加了该条词缀的种类。在上词缀中，洗炼时会洗出该品低级或中级属性，在8品时仅能洗炼出特殊的“洗炼”分类的数据；
        在下词缀中，制造可以概率产出1-5品低级或中级词缀，1-4品时，词缀升级仅能升级出低级词缀，而5品以上升级仅能得到专有的“升级”分类词缀，
        该属性及匠心值基本上是该品低级和中级词缀数据的平均数。另外，部分紫薯有功力平衡（虚功力）。
        </p>
        <p>
          关于词缀数据大全，您可参考<Link to="/data/affix" target="_blank">这里</Link>。
        </p>
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