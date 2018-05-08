import React, { Component } from 'react';
import WuxiaPanel from '../../tiandao_ui/panel';
import {changeXinfaConfig, fetchXinfaList, placeXinfaSlot, selectXinfa} from "../actions";
import {connect} from "react-redux";
import range from "lodash/range";

const xinfaPicPath = require.context('../assets/imgs/xinfa_icon', true);
import xinfaBgBlank from '../assets/imgs/ui/xinfa_bg_blank.png';
import {Button, ButtonGroup, Glyphicon} from "react-bootstrap";

import './css/xinfa_slots.css';

class XinfaSlotsPanel extends Component {

  switchConfig(id) {
    this.props.selectXinfa(null); // 切换至空白心法
    this.props.changeXinfaConfig(id);
  }

  renderConfig() {
    return [
      [0, '壹'],
      [1, '贰'],
      [2, '叁'],
      [3, '肆'],
      [4, '伍']
    ].map((arr) => {

      return (
        <Button
          key={arr[0]}
          styleName='view-btn-regular'
          onClick={this.switchConfig.bind(this, arr[0])}
          style={{
            background: arr[0] === this.props.brkthruData.current ? '#337ab7' : null
          }}
        >
          {arr[1]}
        </Button>
      )
    });
  }

  renderSlots() {
    return range(4).map((index) => {
      return(
        <div key={index} styleName='xinfa-slots'>
          <span
            onClick={() => this.props.selectXinfa(this.props.slotsData[index])}
          >
            <img
              styleName='xinfa-slot-img'
              src={
                this.props.slotsData[index] ? xinfaPicPath('./' + this.props.slotsData[index] + '.png', true) : xinfaBgBlank
              }
            />
            <span styleName='xinfa-slot-name'>{this.props.slotsData[index] || '空'}</span>
          </span>
          <span
            styleName='xinfa-slot-close'
            onClick={() => this.props.placeXinfaSlot(index, null)}
          >
            <Glyphicon glyph='remove' />
          </span>
        </div>
      );
    })
  }


  render() {
    return(
      <div>
      {/*<WuxiaPanel title='心法槽配置'>*/}
        <div style={{textAlign: 'center'}}>
          <div style={{fontWeight: 'bold'}}>切换配置</div>
          <ButtonGroup styleName='switch-button-group'>
            {this.renderConfig()}
          </ButtonGroup>
        </div>
        <div style={{textAlign: 'center'}}>
          <span style={{fontWeight: 'bold'}}>心法槽</span>
          <div styleName='xinfa-slots-wrapper'>
            {this.renderSlots()}
          </div>
        </div>
        <div styleName='site-info'>
          <hr />
          <p>作者：段段</p>
          <p style={{fontSize: '14px'}}>目前尚为测试版，恳请您加群反馈</p>
          <p style={{fontSize: '14px'}}>交流群：660695387<a target="_blank" href="//shang.qq.com/wpa/qunwpa?idkey=9b2aeed4e33ce89f62f35e6d009b9a6cbf8f6aac9090387cf841d3deb5bdcc58"><img border="0" src="//pub.idqqimg.com/wpa/images/group.png" alt="天刀助手交流wuxia.tools " title="天刀助手交流wuxia.tools " /></a></p>
        </div>
      {/*</WuxiaPanel>*/}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    // xinfaList: state.xinfaList,
    brkthruData: state.brkthruData,
    curBrkthruData: state.brkthruData.chongxue[state.brkthruData.current],
    slotsData: state.brkthruData.slots[state.brkthruData.current]
  };
}

export default connect(mapStateToProps, {
  fetchXinfaList,
  selectXinfa,
  placeXinfaSlot,
  changeXinfaConfig
})(XinfaSlotsPanel);