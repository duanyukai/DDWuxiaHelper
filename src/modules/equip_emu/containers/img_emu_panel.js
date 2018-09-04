import React, { Component } from 'react';
import {connect} from 'react-redux';
import range from 'lodash/range';

import Select from 'antd/es/select/index';
import {selectAffix} from '../actions';
import Button from 'antd/es/button/button';

import setData from '../assets/json/equip_set.json';
import enhancePropData from '../assets/json/enhance_props.json';
import jiangxinRatioData from '../assets/json/jiangxin_percentage.json';
import longzhuPropData from '../assets/json/longzhu.json';
import taozhuangPropData from '../assets/json/taozhuang.json';
import affixData from '../assets/json/affix.json';
import menpai from '../assets/json/menpai.json';

import './css/img_emu_panel.css';
import {getEquipData} from '../utils/load_equip_data';
import {ICON_URL_PREFIX} from '../utils/consts';
import {renderPropList} from '../utils/img_render';
import {calcSingleEquip} from "../utils/calc_props";

class ImgEmuPanelContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {

    };

  }


  render() {
    let equipLevels = this.props.equipData[this.props.currentPos];
    let equipPosType = setData[this.props.currentPos].type;
    let menpaiId = this.props.menpaiId;
    let equipId = equipLevels.id;
    if(equipId) {
      let equip = getEquipData(equipPosType, equipId);

      console.log('图片模拟数据', equipLevels, equip);
      // 获取基本属性数据

      // 获取珑铸数据
      let longzhuLevel = equipLevels.longzhuLV;
      let longzhuProp, longzhuTexiao;
      if(longzhuLevel > 0) {
        longzhuProp = longzhuPropData[menpaiId][equipPosType][longzhuLevel];
        longzhuTexiao = longzhuPropData[menpaiId][equipPosType][9].texiao;
      }
      // 获取精工数据
      let enhanceLevel = equipLevels.enhanceLV;
      let enhanceProp = enhancePropData[equipPosType][enhanceLevel];
      // 获取琢磨数据
      let jiangxinLevel = equipLevels.jiangxinLV;
      let jiangxinData = jiangxinRatioData[jiangxinLevel];
      // 获取词缀数据
      let affix = equipLevels.affix;
      let affixShowData = ['词缀一', '词缀二'].map((affixPosName, affixPos) => {
        let data = affix[affixPos];
        if(data) {
          let {type, level} = data;
          let d = affixData[equipPosType][affixPosName][type][level];
          let neededJiangxin = d.jiangxin;
          if(affixPos === 1) {
            try {
              neededJiangxin += affixData[equipPosType]['词缀一'][affix[0].type][affix[0].level].jiangxin;
            } catch (ignored) {}
          }
          let color = d.color === 1 ? '#fff' : '#ae78ae';
          return (
            <div key={affixPos}>
              <span style={{color}}>({d.pinji}品)</span>{' '}
              <span style={{color}}>{d.desc}</span>{' '}
              <span style={{color: '#84e6a3'}}>需要匠心值: {neededJiangxin}</span>
            </div>
          );
        } else {
          return null;
        }
      });
      // 计算套装属性
      let tzName, tzList, tzCount = 0, propShowList;
      if(equip.taozhuangId) {
        let taozhuang = taozhuangPropData[equip.taozhuangId];
        console.log(taozhuang);
        tzName = taozhuang.name;
        tzList = ['e1', 'e2', 'e3', 'e4', 'e5'].map((id) => {
          if(taozhuang[id] !== null) {
            // 用第一个装备获取名称
            let firstEquip = getEquipData(null, taozhuang[id][0]);
            // 遍历判断是否有该装备
            let hasEquip = false;
            Object.keys(this.props.equipData).forEach((pos) => {
              if (this.props.equipData[pos].id === taozhuang[id][0]) {
                hasEquip = true;
              }
            });
            if(hasEquip) tzCount++;
            return (
              <span key={id}
                styleName="taozhuang-list"
                style={{color: hasEquip ? '#d2c26c' : '#8f8f8f'}}
              >
                {firstEquip.name}
              </span>
            );
          } else {
            return null;
          }
        }).filter(o => o !== null);
        // 属性显示面板
        propShowList = Object.keys(taozhuang.property).map((num) => {
          return (
            <div key={num} style={{color: tzCount >= num ? '#84e6a3' : '#8f8f8f'}}>
              <span>{num}件: </span>
              <span>{taozhuang.property[num].propDes}</span>
            </div>
          );
        });
      }

      // 计算功力战力 todo
      const {props, gongliOrigin, gongliAddition, gongliOffset, zhanliOrigin, zhanliAddition, zhanliOffset} = calcSingleEquip(equipPosType, equip, equipLevels);

      return (
        <div>
          <div styleName="img-emu">
            <img styleName="icon" src={`${ICON_URL_PREFIX}${equip.icon}.png`}/>
            <div styleName="name">{equip.name}</div>
            <div styleName="bangding">已绑定</div>
            <div styleName="evaluation-lv"><span>品质等级:</span><span style={{color: '#fff'}}>{equip.evaluationLV}</span></div>
            <div styleName="main-list">
              <div styleName="header-list">
                <div styleName="header-item"><span>需要等级:</span><span>{equip.limitLVMin}</span></div>
                <div styleName="header-item"><span>耐久:</span><span>{equip.durable/10}/{equip.durable/10}</span></div>
                <div styleName="header-item"><span>部位:</span><span>{setData[this.props.currentPos].showName}</span></div>
                <div styleName="header-item"><span>门派:</span><span>{menpai[equip.menpai]}</span></div>
                <div styleName="header-item"><span>功力:</span><span>{+gongliOrigin.toFixed(2)}+{+gongliAddition.toFixed(2)}+{+gongliOffset.toFixed(2)}</span></div>
                <div styleName="header-item"><span>战力:</span><span>{+zhanliOrigin.toFixed(2)}+{+zhanliAddition.toFixed(2)}</span></div>
              </div>
              <hr styleName="hr"/>
              <div styleName="prop-list">
                {renderPropList(equip, enhanceProp)}
              </div>
              {longzhuLevel !== 0 &&
              <div styleName="additional-block">
                <div styleName="first-line"><span>珑铸属性: </span><span style={{color: '#ddeb73'}}>{longzhuProp.props.split('：')[0]} {longzhuLevel}级</span></div>
                <div styleName="remain-lines">
                  <div style={{color: '#ddeb73'}}>{longzhuProp.props.split('：')[1]}</div>
                  <div style={{color: '#ddeb73'}}>{longzhuProp.deco}</div>
                  <div style={{color: '#84e6a3'}}>(全身装备琢磨等级需:{longzhuProp.jiangxinLV} 已激活)</div>
                  <div style={{color: longzhuLevel < 9 ? '#8f8f8f' : '#ddeb73'}}><span style={{display: longzhuLevel < 9 ? 'initial' : 'none'}}>升级至最高级:</span>{longzhuTexiao}</div>
                </div>
              </div>
              }
              <div styleName="additional-block">
                <div styleName="first-line"><span>精工等级: </span><span>{enhanceLevel} / {'*'}</span></div>
              </div>
              {jiangxinLevel > 0 &&
              <div styleName="additional-block">
                <div styleName="first-line"><span>琢磨等级: {jiangxinLevel}</span><span></span></div>
                <div styleName="remain-lines">
                  <div style={{color: '#ddeb73'}}>装备能力: +{+(jiangxinData.ratio * 100).toFixed(8)}%</div>
                  <div style={{color: '#ddeb73'}}>匠心值: {jiangxinLevel + equip.jiangxin}</div>{/* 最终匠心为琢磨后匠心+装备初始匠心 */}
                </div>
              </div>
              }
              {affix[0] !== null &&
              <div styleName="additional-block">
                <div styleName="first-line"><span>词缀属性</span></div>
                <div styleName="remain-lines">
                  {affixShowData}
                  <div style={{color: '#fafe92'}}>词缀装: 交易后绑定</div>
                </div>
              </div>
              }
              {equip.taozhuangId > 0 &&
              <div styleName="additional-block">
                <div styleName="first-line"><span>{tzName}({tzCount}/{tzList.length})</span></div>
                {tzList}
                {propShowList}
              </div>
              }
              {/*基本描述*/}
              {equip.desc !== null &&
              <div style={{color: '#84e6a3'}}>
                {equip.desc.split(/<br\s*\/?>|\\n/).map((s, i) => <div key={i}>{s}</div>)}
              </div>
              }
              {/*背景描述*/}
              {equip.bgDesc !== null &&
              <div style={{color: '#d2c26c'}}>
                {equip.bgDesc.split(/<br\s*\/?>|\\n/).map((s, i) => <div key={i}>{s}</div>)}
              </div>
              }
              <hr styleName="hr"/>
              <div style={{fontSize: 14}}><span style={{color: '#c29925', width: 160, display: 'inline-block'}}>售价(碎银)</span><span>0 铜</span></div>
            </div>
          </div>
          <div>
            注：由于装备精工上限数据暂时无法统计，故本模拟器中精工上限请参照游戏内数据，本模拟器计算属性时不考虑上限情况。
          </div>
        </div>
      );
    } else {
      return '请先选择一件装备';
    }
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
  // selectLongzhu
})(ImgEmuPanelContainer);