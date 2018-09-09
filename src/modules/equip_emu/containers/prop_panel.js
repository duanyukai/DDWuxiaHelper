import React, { Component } from 'react';
import {connect} from 'react-redux';
import Tabs from 'antd/es/tabs';
import Radio from 'antd/es/radio';
import PropTable from '../components/prop_table';

import './css/prop_panel.css';
import {calcAllEquip, calcMenpaiProps, subtractProps} from '../utils/calc_props';
import Button from "../../../../node_modules/antd/es/button/button";
import Select from "../../../../node_modules/antd/es/select";

class PropPanelContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      panelType: 'current',
      compareFrom: 0,
      compareTo: 0
    };
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
    // 设置显示当前配置属性还是属性差
    // 计算总属性
    let props, gongli, zhanli, taozhuangDesList, maxTotalJiangxin, maxTotalJiangxinDesList;
    switch(this.state.panelType) {
    case 'current':
      ({props, gongli, zhanli, taozhuangDesList, maxTotalJiangxin, maxTotalJiangxinDesList} = calcAllEquip(this.props.currentEquipData));
      break;
    case 'compare': {
      let from = calcAllEquip(this.props.allEquipData[this.state.compareFrom]);
      let to = calcAllEquip(this.props.allEquipData[this.state.compareTo]);
      props = subtractProps(from.props, to.props);
      console.log('fromto', from, to, props);
      gongli = from.gongli - to.gongli;
      zhanli = from.zhanli - to.zhanli;
      break;
    }
    }
    return(
      <div styleName="prop-tabs">
        <div style={{textAlign: 'center', marginTop: 5}}>
          <Radio.Group
            defaultValue="current"
            value={this.state.panelType}
            onChange={(e) => this.setState({panelType: e.target.value})}
            buttonStyle="solid"
          >
            <Radio.Button value="current">当前配置属性</Radio.Button>
            <Radio.Button value="compare">计算对比属性</Radio.Button>
          </Radio.Group>
        </div>
        {this.state.panelType === 'compare' &&
          <div style={{textAlign: 'center'}}>
            <div>对比属性，左侧减右侧：</div>
            {this.renderSetSelect('compareFrom')} 到 {this.renderSetSelect('compareTo')}
          </div>
        }
        <Tabs tabPosition="top" size="small">
          <Tabs.TabPane tab="原始属性" key="1">
            您可与游戏内属性面板“装备”页签数据进行对比，理论上完全匹配。
            <PropTable equipProps={props} gongli={gongli} zhanli={zhanli} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="门派加成" key="2">
            您可与游戏内卸掉全部装备前后数据差进行对比，理论上排除百分比加成后正确。
            <PropTable equipProps={calcMenpaiProps(props, this.props.menpaiId)} gongli={gongli} zhanli={zhanli} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="最终面板" key="3">
            该功能因欲与心法模拟器等打通，敬请期待！
          </Tabs.TabPane>
        </Tabs>
        {this.state.panelType === 'current' &&
        <div styleName="taozhuang-panel">
          <hr />
          <div>生效的套装属性</div>
          <ol>
            {taozhuangDesList.length === 0 && <li>无</li>}
            {taozhuangDesList.map((str, i) => <li key={i}>{str}</li>)}
          </ol>
          <div>全身琢磨等级已达：{maxTotalJiangxin}</div>
          <div>生效的效果</div>
          <ol>
            {maxTotalJiangxinDesList.length === 0 && <li>无</li>}
            {maxTotalJiangxinDesList.map((str, i) => <li key={i}>{str}</li>)}
          </ol>
        </div>
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    menpaiId: state.menpaiId,
    allEquipData: state.equipData.sets,
    currentEquipData: state.equipData.sets[state.equipData.current],
  };
}

export default connect(mapStateToProps, {
  // actions

})(PropPanelContainer);