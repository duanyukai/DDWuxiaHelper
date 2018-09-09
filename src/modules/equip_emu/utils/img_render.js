import React from 'react';

import propType from '../assets/json/prop_type.json';
export function renderPropList(equip, enhanceAdded) {
  let usedPropMap = [
    'wf', 'nf', 'chaizhao', 'yushang', 'poshang', 'qx', 'ld', 'qj', 'gg', 'dc', 'sf', 'rj', 'mz', 'gd', 'hx', 'hs', 'cureEffect'
  ];
  // 精工可能增加的属性：wgMinMax, ngMinMax, wf, qx, mp
  let enhanceProbProp = ['wgMin', 'wgMax', 'ngMin', 'ngMax', 'wf', 'qx'];

  let jsxArr = [];

  if(equip['wgMax'] > 0) {
    if(enhanceAdded['wgMax'] > 0) {
      jsxArr.push(<div key="wg"><span>外功攻击:</span><span style={{color: '#d5dc7d'}}>{equip['wgMin'] + enhanceAdded['wgMin']} - {equip['wgMax'] + enhanceAdded['wgMax']} (原始:{equip['wgMin']} - {equip['wgMax']}, 精工:{enhanceAdded['wgMin']} - {enhanceAdded['wgMax']})</span></div>);
    } else {
      jsxArr.push(<div key="wg"><span>外功攻击:</span><span>{equip['wgMin']} - {equip['wgMax']}</span></div>);
    }
  }
  if(equip['ngMax'] > 0) {
    if(enhanceAdded['ngMax'] > 0) {
      jsxArr.push(<div key="ng"><span>内功攻击:</span><span style={{color: '#d5dc7d'}}>{equip['ngMin'] + enhanceAdded['ngMin']} - {equip['ngMax'] + enhanceAdded['ngMax']} (原始:{equip['ngMin']} - {equip['ngMax']}, 其中精工:{enhanceAdded['ngMin']} - {enhanceAdded['ngMax']})</span></div>);
    } else {
      jsxArr.push(<div key="ng"><span>内功攻击:</span><span>{equip['ngMin']} - {equip['ngMax']}</span></div>);
    }
  }

  jsxArr = jsxArr.concat(usedPropMap.map((prop) => {
    // console.log(equip[prop]);
    if(equip[prop] > 0 || enhanceProbProp.includes(prop) && enhanceAdded[prop] > 0) {
      if(enhanceProbProp.includes(prop) && enhanceAdded[prop] > 0) {
        return (
          <div key={prop}><span>{propType[prop].fullDes}:</span><span style={{color: '#d5dc7d'}}>{equip[prop] + enhanceAdded[prop]} (原始:{equip[prop]}, 精工:{enhanceAdded[prop]})</span></div>
        );
      } else {
        return (
          <div key={prop}><span>{propType[prop].fullDes}:</span><span>{+equip[prop].toFixed(2)}</span></div>
        );
      }
    } else {
      return null;
    }
  }));

  jsxArr = jsxArr.filter(o => o !== null);
  return jsxArr;
}