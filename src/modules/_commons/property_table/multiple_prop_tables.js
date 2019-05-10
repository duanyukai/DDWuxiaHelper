import React, {Component} from 'react';

import PropTable from './prop_table';
import Radio from 'antd/es/radio';
import Tabs from 'antd/es/tabs';

import './css/multiple_prop_tables.css';
import Select from 'antd/es/select';
import {calcGongli, calcMenpai5dTranslatedProps, calcZhanli, minusProps} from '../property_calc/player_props_calc';

export default class MultiplePropsTableComponent extends Component {

  constructor(props) {
    super(props);

    this.state = {
      panelType: 'current',
      compareFrom: 0,
      compareTo: 1
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
    const {propsSet, currentSetId, menpaiId} = this.props;

    let originProps, menpaiProps, finalProps;
    let gongli, zhanli;
    if (this.state.panelType === 'current') {
      // 处理传入的原始属性，计算门派加成属性和最终属性
      originProps = propsSet[currentSetId];
      menpaiProps = calcMenpai5dTranslatedProps(originProps, menpaiId);
      gongli = calcGongli(originProps);
      zhanli = calcZhanli(originProps);
      // todo 最终属性 单独写个小工具
    } else {
      // 显示属性差值
      originProps = minusProps(propsSet[this.state.compareFrom], propsSet[this.state.compareTo]);
      menpaiProps = calcMenpai5dTranslatedProps(originProps, menpaiId);
      gongli = calcGongli(propsSet[this.state.compareFrom]) - calcGongli(propsSet[this.state.compareTo]);
      zhanli = calcZhanli(propsSet[this.state.compareFrom]) - calcZhanli(propsSet[this.state.compareTo]);
    }


    return (
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
          <div>对比属性(左侧减右侧)：</div>
          {this.renderSetSelect('compareFrom')} 与 {this.renderSetSelect('compareTo')}
        </div>
        }
        <Tabs tabPosition="top" size="small">
          <Tabs.TabPane tab="原始属性" key="1">
            原始属性，即五维未按门派折算时的属性面板。
            <PropTable equipProps={originProps} gongli={gongli} zhanli={zhanli} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="门派加成" key="2">
            加成属性，即五维已按门派折算后的属性面板。
            <PropTable equipProps={menpaiProps} gongli={gongli} zhanli={zhanli} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="最终面板" key="3">
            最终属性，即包含所有功力系统属性数据，五维已按门派折算后属性面板。该功能因欲与心法模拟器等其他功力系统打通，敬请期待！
          </Tabs.TabPane>
        </Tabs>
      </div>
    );
  }
}
