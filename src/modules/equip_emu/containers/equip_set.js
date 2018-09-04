import React, { Component } from 'react';

import setData from '../assets/json/equip_set.json';
import Row from 'antd/es/grid/row';
import Col from 'antd/es/grid/col';
import {connect} from 'react-redux';
import {selectEquipPos} from '../actions';

import SlotConfigContainer from './slot_config';

import {ICON_URL_PREFIX} from '../utils/consts';
import './css/equip_set.css';
import {getEquipData} from '../utils/load_equip_data';
import levelColor from '../assets/json/level_color.json';

class EquipSetContainer extends Component {

  constructor(props) {
    super(props);


    this.selectPos = this.selectPos.bind(this);
  }

  selectPos(posId) {
    console.log(posId);
    this.props.selectEquipPos(posId);
  }

  render() {
    let setKeys = Object.keys(setData).sort((a, b) => setData[a]['index'] - setData[b]['index']);
    let setRenderer = (key) => {
      let name = setData[key]['showName'];
      let imgSrc = 'https://via.placeholder.com/64x64?text=o';
      let bgColor = '#fff';
      let showLongzhu = false;
      let equipPosData = this.props.equipData[key];
      if(equipPosData.id) {
        let equipData = getEquipData(setData[key].type, equipPosData.id);
        imgSrc = `${ICON_URL_PREFIX}${equipData.icon}.png`;
        bgColor = `linear-gradient(to bottom,${levelColor[equipData.quality][1]} 0%,${levelColor[equipData.quality][0]} 100%)`;
        showLongzhu = equipPosData.longzhuLV > 0;
      }
      return(
        <div key={key} onClick={this.selectPos.bind(this, key)} styleName={key === this.props.currentPos ? 'equip-pos-selected' : 'equip-pos'}>
          <span styleName="pos-name">{name}</span>
          <div styleName="pos-img-wrapper">
            <img styleName="pos-img" width="64" height="64" src={imgSrc} style={{background: bgColor}} />
            <div styleName="pos-img-border" />
            {showLongzhu &&
            <div styleName="pos-img-longzhu" />
            }
          </div>
        </div>
      );
    };
    return (
      <div>
        <Row>
          <Col span={24}>
            <SlotConfigContainer />
          </Col>
          <Col span={12}>
            {
              setKeys.slice(0, 6).map(setRenderer)
            }
          </Col>
          <Col span={12}>
            {
              setKeys.slice(6).map(setRenderer)
            }
          </Col>
        </Row>
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
  selectEquipPos
})(EquipSetContainer);