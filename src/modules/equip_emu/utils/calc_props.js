import setData from '../assets/json/equip_set.json';
import enhancePropData from '../assets/json/enhance_props.json';
import jiangxinRatioData from '../assets/json/jiangxin_percentage.json';
import longzhuPropData from '../assets/json/longzhu.json';
import taozhuangPropData from '../assets/json/taozhuang.json';
import affixData from '../assets/json/affix.json';
import totalJiangxinLevelPropData from '../assets/json/total_jiangxin_level_props.json';
import menpai from '../assets/json/menpai.json';
import menpaiProps from '../assets/json/school_props.json';

import React from 'react';
import {getEquipData} from './load_equip_data';

let zeroProps = {
  ld: 0, gg: 0, qj: 0, dc: 0, sf: 0,
  wgMin: 0, wgMax: 0, ngMin: 0, ngMax: 0, wf: 0, nf: 0,
  mz: 0, gd: 0, hx: 0, rj: 0, hs: 0,
  poshang: 0, chaizhao: 0, yushang: 0, liaoshang: 0,
  qx: 0, nx: 0, // 内息
  gongliOffset: 0,
  zhanliOffset: 0,
};


export function calcAllEquip(equipsData) {
  let totalProps = {...zeroProps};
  // 属性简单求和
  Object.keys(setData).map((equipPos) => {
    let equipPosType = setData[equipPos].type;
    let equipData = equipsData[equipPos];
    if(equipData.id) {
      // console.log('有部位', equipPos, equipData);
      totalProps = sumProps(totalProps, calcSingleEquip(equipPosType, getEquipData(equipPosType, equipData.id), equipData).total.props);
    } else {
      // console.log('没有部位', equipPos);
    }
  });
  // 直接功力计算，偏移计算 todo 哪些数值
  // let gongli = calcGongli(totalProps);
  // 直接战力计算，偏移计算
  // let zhanli = calcZhanli(totalProps);
  // 套装属性计算，首先遍历每个装备位置
  let taozhuangMap = {};  // 存储套装达成状态
  Object.keys(setData).map((equipPos) => {
    let equipPosType = setData[equipPos].type;
    let equipData = equipsData[equipPos];
    if(equipData.id) {
      // 查找套装id
      let equip = getEquipData(equipPosType, equipData.id);
      if(equip.taozhuangId > 0) {
        let taozhuangId = equip.taozhuangId;
        let taozhuang = taozhuangPropData[taozhuangId];
        if (!taozhuangMap.hasOwnProperty(taozhuangId))
          taozhuangMap[taozhuangId] = [false, false, false, false, false];
        // 判断当前装备满足哪个需求位
        ['e1', 'e2', 'e3', 'e4', 'e5'].forEach((pos, i) => {
          if (taozhuang[pos] !==null && taozhuang[pos].includes(equipData.id)) {
            taozhuangMap[taozhuangId][i] = true;
          }
        });
      }
    }
  });
  // 根据套装达成的等级（2件套、4件套）计算属性
  let taozhuangProps = {...zeroProps};
  let taozhuangDesc = [];
  Object.keys(taozhuangMap).forEach((taozhuangId) => {
    let count = taozhuangMap[taozhuangId].filter(o => o).length;
    let taozhuang = taozhuangPropData[taozhuangId];
    // 遍历所有满足的条件
    for(let i = 1; i <= count; i++) {
      if(taozhuang.property.hasOwnProperty(i)) {
        // 内外攻hack
        let props = taozhuang.property[i];
        props['wgMin'] = props['wg'];
        props['wgMax'] = props['wg'];
        props['ngMin'] = props['ng'];
        props['ngMax'] = props['ng'];
        taozhuangProps = sumProps(taozhuangProps, Object.assign({...zeroProps}, props));
        taozhuangDesc.push(<p key={i}>{taozhuang.name}({taozhuang.typeName}) {i}件: <br />{taozhuang.property[i].propDes}</p>);  //todo jsx
      }
    }
  });

  // 全身琢磨等级属性计算
  let maxTotalJiangxin = 50;
  Object.keys(setData).map((equipPos) => {
    let equipData = equipsData[equipPos];
    if(equipData.id) {
      if(equipData.jiangxinLV < maxTotalJiangxin)
        maxTotalJiangxin = equipData.jiangxinLV;
    } else {
      maxTotalJiangxin = 0;
    }
  });
  let maxTotalJiangxinProps = {...zeroProps};
  let maxTotalJiangxinDesList = [];
  for(let i = 1; i <= maxTotalJiangxin; i++) {
    if(totalJiangxinLevelPropData[i]) {
      maxTotalJiangxinProps = sumProps(maxTotalJiangxinProps, Object.assign({...zeroProps}, totalJiangxinLevelPropData[i].props));
      maxTotalJiangxinDesList.push(<p key={i}>{totalJiangxinLevelPropData[i].des}</p>);
    }
  }

  // console.log('最终所有装备', totalProps);
  return {
    props: sumProps(totalProps, taozhuangProps, maxTotalJiangxinProps),
    gongli: calcGongli(sumProps(totalProps, taozhuangProps, maxTotalJiangxinProps)),
    zhanli: calcZhanli(sumProps(totalProps, taozhuangProps, maxTotalJiangxinProps)),
    taozhuangDesList: taozhuangDesc,
    maxTotalJiangxin,
    maxTotalJiangxinDesList
  };
}

export function calcSingleEquip(equipPosType, equip, levels) {  // todo 参数有点冗余
  // console.log('计算参数', arguments);
  // 分别计算功力、战力的原始、加成值，以及全部面板属性结果
  let originProps = {...zeroProps};
  let isPVE = equip.equipType === 1;
  // 复制equip中已存在的属性数据，计算原始功力
  Object.keys(originProps).forEach(key => {
    if(equip.hasOwnProperty(key))
      originProps[key] += equip[key];
  });
  let originGongli = calcGongli(originProps);
  let originZhanli = calcZhanli(originProps);
  // 根据精工等级，增加对应属性，计算功力 todo 无判断精工上限
  let enhanceLevel = levels.enhanceLV;
  if(isPVE) enhanceLevel = 0;
  let enhanceProps = Object.assign({...zeroProps}, enhancePropData[equipPosType][enhanceLevel]);
  let enhanceGongli = calcEnhanceGongli(enhanceProps);
  let enhanceZhanli = calcEnhanceZhanli(enhanceProps);
  // 根据琢磨等级，在equip基础上增加百分比
  let jiangxinLevel = levels.jiangxinLV;
  if(isPVE) jiangxinLevel = 0;
  let jiangxinRatio = jiangxinRatioData[jiangxinLevel].ratio;
  let jiangxinProps = multiplyProps(originProps, jiangxinRatio);
  let jiangxinGongli = calcGongli(jiangxinProps);
  let jiangxinZhanli = calcZhanli(jiangxinProps);
  // 根据珑铸，文本提取属性值
  let longzhuLevel = levels.longzhuLV;
  // 珑铸属性不需要门派ID，直接用真武的
  let longzhuPropsStr = '空';
  try {
    longzhuPropsStr = longzhuPropData[0][equipPosType][longzhuLevel].props;
  } catch(e) {
    // 该部位无珑铸
    longzhuPropsStr = '空';
  }
  let longzhuProps = longzhuTextToProps(longzhuPropsStr);
  let longzhuGongli = calcGongli(longzhuProps);
  let longzhuZhanli = calcZhanli(longzhuProps);
  // 根据词缀，判断匠心值，提取属性值
  let affix = levels.affix;
  let affixPropsList = ['词缀一', '词缀二'].map((affixPosName, affixPos) => {
    let data = affix[affixPos];
    if(data) {
      let {type, level} = data;
      let d = affixData[equipPosType][affixPosName][type][level];
      let neededJiangxin = d.jiangxin;
      // 计算匠心值和
      if(affixPos === 1) {
        try {
          neededJiangxin += affixData[equipPosType]['词缀一'][affix[0].type][affix[0].level].jiangxin;
        } catch (ignored){}
      }
      if(neededJiangxin <= equip.jiangxin + jiangxinLevel || isPVE) {
        // 匠心值符合要求，或者为PVE
        // 内外攻最大最小值hack
        let props = d.props;
        if(d.props.wg > 0) {
          props['wgMin'] = props.wg;
          props['wgMax'] = props.wg;
          delete props.wg;
        }
        if(d.props.ng > 0) {
          props['ngMin'] = props.ng;
          props['ngMax'] = props.ng;
          delete props.ng;
        }
        return Object.assign({...zeroProps}, props);
      } else {
        // 匠心值不符合要求
        return null;
      }
    } else {
      return null;
    }
  });
  let affixPropsSum = affixPropsList.reduce((prev, curr) => sumProps(prev, curr), {...zeroProps});
  let affixGongli = calcGongli(affixPropsSum);
  let affixZhanli = calcZhanli(affixPropsSum);

  // 返回值
  return {
    total: {
      gongli: originGongli + enhanceGongli + jiangxinGongli + longzhuGongli + affixGongli,
      zhanli: originZhanli + enhanceZhanli + jiangxinZhanli + longzhuZhanli + affixZhanli,
      props: sumProps(originProps, enhanceProps, jiangxinProps, longzhuProps, affixPropsSum)
    },
    origin: {
      gongli: originGongli,
      zhanli: originZhanli,
      props: originProps
    },
    addition : {
      gongli: enhanceGongli + jiangxinGongli + longzhuGongli + affixGongli,
      zhanli: enhanceZhanli + jiangxinZhanli + longzhuZhanli + affixZhanli,
      props: originProps
    },
    enhance: {
      gongli: enhanceGongli,
      zhanli: enhanceZhanli,
      props: enhanceProps
    },
    jiangxin: {
      gongli: jiangxinGongli,
      zhanli: jiangxinZhanli,
      props: jiangxinProps
    },
    longzhu: {
      gongli: longzhuGongli,
      zhanli: longzhuZhanli,
      props: longzhuProps
    },
    affix: {
      gongli: affixGongli,
      zhanli: affixZhanli,
      props: affixPropsSum
    }
  };
}

export function sumProps(...propsList) {
  // 对应项相加即可
  return propsList.reduce((prev, curr) => {
    if(curr) {
      Object.keys(prev).forEach(key => {
        prev[key] += curr[key];
      });
    }
    return prev;
  }, {...zeroProps});
}

export function subtractProps(from, to) {
  // 对应项相加即可
  let result = {...from};
  Object.keys(from).forEach(key => {
    result[key] -= (to[key] || 0);
  });
  return result;
}


function multiplyProps(props, ratio) {
  let newProps = {...props};
  Object.keys(props).forEach(key => {
    newProps[key] = props[key] * ratio;
  });
  return newProps;
}

export function calcMenpaiProps(props, menpaiId) {
  let id2Code = ['ZW', 'TB', 'SW', 'GB', 'TM', 'WD', 'SL', 'TX', 'SD', 'YH'];  // todo 偷懒旧数据直接用了
  let coefficient = menpaiProps[id2Code[menpaiId]];
  // props里根据每一项，折算计算，内外功特殊计算
  let result = {...props};
  Object.keys(coefficient).forEach((primaryKey) => {
    let co = coefficient[primaryKey];
    Object.keys(co).forEach((secondaryKey) => {
      let c = co[secondaryKey];
      switch(secondaryKey) {
      case 'wg':
        result['wgMin'] += result[primaryKey] * c;
        result['wgMax'] += result[primaryKey] * c;
        break;
      case 'ng':
        result['ngMin'] += result[primaryKey] * c;
        result['ngMax'] += result[primaryKey] * c;
        break;
      default:
        result[secondaryKey] += result[primaryKey] * c;
      }
    });
  });
  return result;
}


export function calcGongli(props) {
  // 五维系数0.8，1命中=5 1格挡=5 1会心=10 1韧劲=9 1外攻=1 1内功=1.6 内外防=0.5 1气血=0.1 会心伤害=4
  // 破伤0，1拆招=2，1愈伤=0，1疗伤效果=？
  let sum = 0;
  sum += (props.ld + props.gg + props.qj + props.sf + props.dc) * 0.8;
  sum += props.mz * 5;
  sum += props.gd * 5;
  sum += props.hx * 10;
  sum += props.rj * 9;
  sum += (props.wgMin + props.wgMax) / 2;
  sum += (props.ngMin + props.ngMax) / 2 * 1.6;
  sum += props.wf * 0.5;
  sum += props.nf * 0.5;
  sum += props.qx / 10;
  sum += props.hs * 4;
  sum += props.chaizhao * 2;
  // 最后加上功力偏移
  sum += props.gongliOffset;
  return sum;
}

export function calcZhanli(props) {
  // 新测试系数：五维系数0.18 1命中=3 1格挡=3 1会心=12 1韧劲=0.3 1外攻=0.84 1内功=1.05 内外防=0.18 1气血=0.03 会心伤害=12
  // 1破伤=10，1拆招=1？，1愈伤=5？，1疗伤效果=？
  // 解析出结果：（内外功实际上是最小值最大值分别乘系数算出来的，0.42和0.54）
  // 五维系数0.18 1命中=3 1格挡=3 1会心=12 1韧劲=0.3 1外攻=0.84! 1内功=1.08! 内外防=0.18 1气血=0.03 会心伤害=12
  // 1破伤=10，1拆招=0，1愈伤=5，1疗伤效果=0.2
  let sum = 0;
  sum += (props.ld + props.gg + props.qj + props.sf + props.dc) * 0.18;
  sum += props.mz * 3;
  sum += props.gd * 3;
  sum += props.hx * 12;
  sum += props.rj * 0.3;
  sum += (props.wgMin + props.wgMax) / 2 * 0.84;
  sum += (props.ngMin + props.ngMax) / 2 * 1.08;
  sum += props.wf * 0.18;
  sum += props.nf * 0.18;
  sum += props.qx * 0.03;
  sum += props.hs * 12;
  sum += props.poshang * 10;
  sum += props.yushang * 5;
  sum += props.liaoshang * 0.2;
  // 最后加上战力偏移
  sum += props.zhanliOffset;
  return sum;
}

function calcEnhanceGongli(props) {
  let sum = 0;
  sum += (props.wgMin + props.wgMax) / 2;
  sum += (props.ngMin + props.ngMax) / 2 * 1.6;
  sum += props.wf * 0.5;
  sum += props.qx * 0.1;
  return sum;
}

function calcEnhanceZhanli(props) {
  let sum = 0;
  sum += (props.wgMin + props.wgMax) / 2 * 0.84; // todo 系数
  sum += (props.ngMin + props.ngMax) / 2 * 1.08; // todo
  sum += props.wf * 0.18;
  sum += props.qx * 0.03;
  return sum;
}

function longzhuTextToProps(str) {
  let props = {...zeroProps};
  // 目前一共就六种
  let cats = [
    { name: '空', type: 'null'},
    { name: '屏月：格挡', type: 'gd'},
    { name: '专情：命中', type: 'mz'},
    { name: '长鸿：韧劲', type: 'rj'},
    { name: '犀照：会心率', type: 'hx'},
    { name: '秋水：气血上限', type: 'qx'},
    { name: '贯日：外功攻击',type: 'wg'}
  ];
  for(let cat of cats) {
    if(str.includes(cat.name)) {
      if(cat.name === '空')
        return props;
      let num = parseFloat(str.split('+')[1]);
      if(cat.type === 'wg') {
        // 外攻特殊处理
        props['wgMin'] = num;
        props['wgMax'] = num;
      } else {
        props[cat.type] = num;
        break;
      }
    }
  }
  return props;
}

// function affixTextToProps(text) {
//   let props = {...zeroProps};
//   if(!text) return props;
//   let str = text.desc;
//   props.gongliOffset = text.gO;
//
//   let cats = [
//     {name: '力道', type: 'ld'},
//     {name: '根骨', type: 'gg'},
//     {name: '洞察', type: 'dc'},
//     {name: '身法', type: 'sf'},
//     {name: '气劲', type: 'qj'},
//
//     {name: '外功攻击', type: 'wg'},
//     {name: '外功防御', type: 'ng'},
//     {name: '内功攻击', type: 'wf'},
//     {name: '内功防御', type: 'nf'},
//
//     {name: '命中', type: 'mz'},
//     {name: '格挡', type: 'gd'},
//     {name: '会心', type: 'hx'},
//     {name: '会心率', type: 'hx'},
//     {name: '韧劲', type: 'rj'},
//     {name: '会心伤害', type: 'hs'},
//
//     {name: '气血', type: 'qx'},
//     {name: '气血上限', type: 'qx'},
//     {name: '内息上限', type: 'nx'},
//   ];
//
//   try {
//     str.split('：')[1].split(' ').forEach(propStr => {
//       console.log(propStr);
//       for(let cat of cats) {
//         if(propStr.includes(cat.name)) {
//           let num = parseFloat(propStr.split('+')[1]);
//           if(cat.type === 'wg') {
//             // 外攻特殊处理
//             props['wgMin'] = num;
//             props['wgMax'] = num;
//           } else if(cat.type === 'ng') {
//             // 内攻特殊处理
//             props['ngMin'] = num;
//             props['ngMax'] = num;
//           } else {
//             props[cat.type] = num;
//           }
//         }
//       }
//     });
//   } catch(e) {
//     // 词缀数据有误
//     console.log(e);
//   }
//   return props;
// }