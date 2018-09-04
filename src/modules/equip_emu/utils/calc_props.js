import setData from '../assets/json/equip_set.json';
import enhancePropData from '../assets/json/enhance_props.json';
import jiangxinRatioData from '../assets/json/jiangxin_percentage.json';
import longzhuPropData from '../assets/json/longzhu.json';
import taozhuangPropData from '../assets/json/taozhuang.json';
import affixData from '../assets/json/affix.json';
import menpai from '../assets/json/menpai.json';
import React from 'react';

let zeroProps = {
  ld: 0, gg: 0, qj: 0, dc: 0, sf: 0,
  wgMin: 0, wgMax: 0, ngMin: 0, ngMax: 0, wf: 0, nf: 0,
  mz: 0, gd: 0, hx: 0, rj: 0, hs: 0,
  poshang: 0, chaizhao: 0, yushang: 0, liaoshang: 0,
  qx: 0, nx: 0, // 内息
  gongliOffset: 0,
  zhanliOffset: 0
};

export function calcSingleEquip(equipPosType, equip, levels) {
  console.log('计算参数', arguments);
  // 分别计算功力、战力的原始、加成值，以及全部面板属性结果
  let originProps = {...zeroProps};

  // 复制equip中已存在的属性数据，计算原始功力
  Object.keys(originProps).forEach(key => {
    originProps[key] += equip[key];
  });
  let gongliOrigin = calcGongli(originProps);
  let zhanliOrigin = calcZhanli(originProps);
  // 根据精工等级，增加对应属性，计算功力 todo 无判断精工上限
  let enhanceLevel = levels.enhanceLV;
  let enhanceProps = enhancePropData[equipPosType][enhanceLevel];
  let enhanceGongli = calcEnhanceGongli(enhanceProps);
  let enhanceZhanli = calcEnhanceZhanli(enhanceProps);
  // 根据琢磨等级，在equip基础上增加百分比
  let jiangxinLevel = levels.jiangxinLV;
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
  // 根据词缀，判断匠心值，文本提取属性值并计算 todo
  let affix = levels.affix;
  let affixPropsList = ['词缀一', '词缀二'].map((affixPosName, affixPos) => {
    let data = affix[affixPos];
    if(data) {
      let {type, level} = data;
      let d = affixData[equipPosType][affixPosName][type][level];
      let neededJiangxin = d.jiangxin;
      let gongliOffset = d.gO;
      if(affixPos === 1) {
        try {
          neededJiangxin += affixData[equipPosType]['词缀一'][affix[0].type][affix[0].level].jiangxin;
        } catch (ignored){}
      }
      if(neededJiangxin <= equip.jiangxin + jiangxinLevel) {
        return {desc: d.desc, gO: gongliOffset};
      } else {
        // 匠心值不符合要求
        return null;
      }
    } else {
      return null;
    }
  }).map(affixTextToProps);
  let affixPropsSum = affixPropsList.reduce((prev, curr) => sumProps(prev, curr), {...zeroProps});
  let affixGongli = calcGongli(affixPropsSum);
  let affixZhanli = calcZhanli(affixPropsSum);
  let affixGongliOffsetSum = affixPropsList.reduce(sumGongliOffset);
  return {
    props: sumProps(originProps, enhanceProps, jiangxinProps, longzhuProps, affixPropsSum), // 原始+四种额外属性
    gongliOrigin,
    gongliAddition: enhanceGongli + jiangxinGongli + longzhuGongli + affixGongli,
    gongliOffset: affixGongliOffsetSum,
    zhanliOrigin,
    zhanliAddition: enhanceZhanli + jiangxinZhanli + longzhuZhanli + affixZhanli,
    zhanliOffset: 0 // 目前无战力平衡 todo
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

export function sumGongliOffset(...propsList) {
  return propsList.reduce((prev, curr) => {
    if(curr) {
      return prev + curr.gongliOffset;
    }
    return prev;
  }, 0);
}

function multiplyProps(props, ratio) {
  let newProps = {...props};
  Object.keys(props).forEach(key => {
    newProps[key] = props[key] * ratio;
  });
  return newProps;
}

export function calcMenpaiProps(props, menpaiId) {

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
  sum += (props.wgMin + props.wgMax) / 2 * 0.85;
  sum += (props.ngMin + props.ngMax) / 2 * 1.05;
  sum += props.wf * 0.18;
  sum += props.qx * 0.03;
  return sum;
}

function longzhuTextToProps(str) {
  console.log('珑铸str', str);
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
      }
    } else {
      break;
    }
  }
  return props;
}

function affixTextToProps(text) {
  let props = {...zeroProps};
  if(!text) return props;
  let str = text.desc;
  props.gongliOffset = text.gO;

  let cats = [
    {name: '力道', type: 'ld'},
    {name: '根骨', type: 'gg'},
    {name: '洞察', type: 'dc'},
    {name: '身法', type: 'sf'},
    {name: '气劲', type: 'qj'},

    {name: '外功攻击', type: 'wg'},
    {name: '外功防御', type: 'ng'},
    {name: '内功攻击', type: 'wf'},
    {name: '内功防御', type: 'nf'},

    {name: '命中', type: 'mz'},
    {name: '格挡', type: 'gd'},
    {name: '会心', type: 'hx'},
    {name: '会心率', type: 'hx'},
    {name: '韧劲', type: 'rj'},
    {name: '会心伤害', type: 'hs'},

    {name: '气血', type: 'qx'},
    {name: '气血上限', type: 'qx'},
    {name: '内息上限', type: 'nx'},
  ];

  try {
    str.split('：')[1].split(' ').forEach(propStr => {
      console.log(propStr);
      for(let cat of cats) {
        if(propStr.includes(cat.name)) {
          let num = parseFloat(propStr.split('+')[1]);
          if(cat.type === 'wg') {
            // 外攻特殊处理
            props['wgMin'] = num;
            props['wgMax'] = num;
          } else if(cat.type === 'ng') {
            // 内攻特殊处理
            props['ngMin'] = num;
            props['ngMax'] = num;
          } else {
            props[cat.type] = num;
          }
        }
      }
    });
  } catch(e) {
    // 词缀数据有误
    console.log(e);
  }
  return props;
}