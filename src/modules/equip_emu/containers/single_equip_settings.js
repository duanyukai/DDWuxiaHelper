import React, { Component } from 'react';
import range from 'lodash/range';
import './css/single_equip_settings.css';
import {connect} from 'react-redux';
import {selectEnhance, selectEquipPos, selectJiangxin} from '../actions';
import Collapse from 'antd/es/collapse/Collapse';

import EnhanceContainer from './enhance_panel';
import JiangxinContainer from './jiangxin_panel';
import LongzhuContainer from './longzhu_panel';
import AffixContainer from './affix_panel';
import ImgEmuPanelContainer from './img_emu_panel';

class SingleEquipSettingsContainer extends Component {

  constructor(props) {
    super(props);

    this.selectJiangxin = this.selectJiangxin.bind(this);
  }



  selectJiangxin(level) {
    this.props.selectJiangxin(this.props.currentPos, level);
  }

  render() {


    return (
      <div>
        <Collapse defaultActiveKey={['1', '2', '3', '4', '5']}>
          <Collapse.Panel header="当前装备界面模拟" key="1">
            <ImgEmuPanelContainer />
          </Collapse.Panel>
          <Collapse.Panel header="精工选择" key="2">
            <EnhanceContainer />
          </Collapse.Panel>
          <Collapse.Panel header="琢磨选择" key="3">
            <JiangxinContainer />
          </Collapse.Panel>
          <Collapse.Panel header="珑铸选择" key="4">
            <LongzhuContainer />
          </Collapse.Panel>
          <Collapse.Panel header="词缀选择" key="5">
            <AffixContainer />
          </Collapse.Panel>
        </Collapse>
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
  selectEnhance,
  selectJiangxin
})(SingleEquipSettingsContainer);