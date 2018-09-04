import qianxiuBaseProps from '../assets/json/qianxiu/qianxiu_props_base.json';
import schoolPropsList from '../assets/json/school_props.json';
import additionPercentageTable from '../assets/json/addition_percentage_table.json';
import chenghaoList from '../assets/json/addition_id_list.json';

export function calcXinfaProps(xinfaData, brkthruData, configIndex) {
  // 属性格式
  let xinfaProps = {
    xiuwei: 0,
    stones: [],
    stoneExp: 0,
    ld: 0,
    gg: 0,
    qj: 0,
    dc: 0,
    sf: 0,

    wg: 0,
    ng: 0,
    wf: 0,
    nf: 0,

    mz: 0,
    gd: 0,
    hx: 0,
    rj: 0,
    hs: 0,
    qx: 0,

    gongliOffset: 0,
    zhanliOffset: 0
  };

  let fulfilledLevel, curLevelBrkthruData, qianxiuData, skillLevelsData, allXinfaBrkthruData;
  if(configIndex === 0 || configIndex) {
    allXinfaBrkthruData = brkthruData.chongxue[configIndex];
  } else {
    allXinfaBrkthruData = brkthruData.chongxue[brkthruData.current];
  }

  console.log('配置',configIndex, allXinfaBrkthruData, xinfaData.name);

  fulfilledLevel = allXinfaBrkthruData[xinfaData.name].fulfilledLevel;
  curLevelBrkthruData = allXinfaBrkthruData[xinfaData.name].curLevelCX;
  qianxiuData = allXinfaBrkthruData[xinfaData.name].qianxiuLevels;
  skillLevelsData = allXinfaBrkthruData[xinfaData.name].skillLevels;

  let stoneData = [];

  // 添加前面已点满层数据
  for(let brkthruLevel = 0; brkthruLevel <= fulfilledLevel; brkthruLevel++) {
    let shujiList = xinfaData.brkthruLevels[brkthruLevel].shujiMap;
    Object.keys(shujiList).forEach((shujiId) => {
      //当前枢机
      let shujiTypes = shujiList[shujiId].types;
      let shujiLevels = shujiList[shujiId].levels;
      let topLevelProps = shujiLevels[shujiLevels.length - 1].props;

      // 计算修为总和
      shujiLevels.forEach((shujiLevel) => {
        xinfaProps['xiuwei'] += shujiLevel.xiuwei;
      });

      // 计算功力修正（最高一重的数据）
      xinfaProps['gongliOffset'] += shujiLevels[shujiLevels.length - 1].gongliOffset;
      xinfaProps['zhanliOffset'] += shujiLevels[shujiLevels.length - 1].zhanliOffset;

      // 计算属性
      // console.log(shujiList[shujiId]);

      shujiTypes.forEach((type, i) => {
        switch(type) {
        case '5d':
          xinfaProps['ld'] += topLevelProps[i];
          xinfaProps['gg'] += topLevelProps[i];
          xinfaProps['qj'] += topLevelProps[i];
          xinfaProps['dc'] += topLevelProps[i];
          xinfaProps['sf'] += topLevelProps[i];
          break;
        case 'nwf':
          xinfaProps['nf'] += topLevelProps[i];
          xinfaProps['wf'] += topLevelProps[i];
          break;
        default:
          xinfaProps[type] += topLevelProps[i];
        }
      });


      // 统计石头信息
      if(shujiLevels[0].gem) {
        stoneData.push({
          // brkthruLevel: brkthruLevel,
          brkthruLevel: xinfaData.brkthruLevels[brkthruLevel].shortName,
          shujiId: shujiId,
          stoneName: shujiLevels[0].gem.name,
          stoneLevel: shujiLevels[0].gem.level
        });
      }

    });
  }
  // 当前层冲穴数据
  for(let shujiId in curLevelBrkthruData) {
    if(curLevelBrkthruData.hasOwnProperty(shujiId)) {

      let shujiList = xinfaData.brkthruLevels[fulfilledLevel + 1].shujiMap;
      let shujiTypes = shujiList[shujiId].types;
      let shujiCurTopLevel = curLevelBrkthruData[shujiId];
      let shujiLevels = shujiList[shujiId].levels;

      let curTopLevelProps;
      // = shujiLevels[shujiCurTopLevel - 1].props;  //todo

      if(shujiCurTopLevel > 0)
        curTopLevelProps = shujiLevels[shujiCurTopLevel - 1].props;
      else
        curTopLevelProps = [0, 0, 0, 0, 0]; // 当存储了0重数据时，单项数据都为0 //todo 多维数据，可能3维以上

      // 计算修为
      for(let i = 0; i < shujiCurTopLevel; i++) {
        // todo 满级属性？
        xinfaProps.xiuwei += shujiList[shujiId].levels[i].xiuwei;
      }

      // 计算功力偏移
      if(shujiCurTopLevel > 0) {
        xinfaProps.gongliOffset += shujiList[shujiId].levels[shujiCurTopLevel - 1].gongliOffset;
        xinfaProps.zhanliOffset += shujiList[shujiId].levels[shujiCurTopLevel - 1].zhanliOffset;
      }


      // 计算属性
      shujiTypes.forEach((type, i) => {
        switch(type) {
        case '5d':
          xinfaProps['ld'] += curTopLevelProps[i];
          xinfaProps['gg'] += curTopLevelProps[i];
          xinfaProps['qj'] += curTopLevelProps[i];
          xinfaProps['dc'] += curTopLevelProps[i];
          xinfaProps['sf'] += curTopLevelProps[i];
          break;
        case 'nwf':
          xinfaProps['nf'] += curTopLevelProps[i];
          xinfaProps['wf'] += curTopLevelProps[i];
          break;
        default:
          xinfaProps[type] += curTopLevelProps[i];
        }
      });

      // 统计石头信息
      if(shujiLevels[0].gem) {
        stoneData.push({
          brkthruLevel: xinfaData.brkthruLevels[fulfilledLevel + 1].shortName,
          shujiId: shujiId,
          stoneName: shujiLevels[0].gem.name,
          stoneLevel: shujiLevels[0].gem.level
        });
      }
    }
  }

  xinfaProps.stones = stoneData;
  // todo 石头经验计算

  xinfaProps.stoneExp = 0;

  // 计算潜修数据
  ['ld', 'qj', 'gg', 'dc', 'sf'].forEach((dimId, i) => {
    xinfaProps[dimId] += qianxiuBaseProps[xinfaData.name][i] * qianxiuData[dimId];
  });

  // 计算技能消耗修为
  for(let skillName in skillLevelsData) {
    if(skillLevelsData.hasOwnProperty(skillName)) {
      let curSkillXiuwei;
      try {
        curSkillXiuwei = xinfaData.skills
          .filter((skillData) => skillData.name === skillName)[0]
          .levels[skillLevelsData[skillName]].xiuweiSum || 0;
      } catch(e) {
        curSkillXiuwei = 0;
      }

      xinfaProps.xiuwei += curSkillXiuwei;
    }
  }

  return xinfaProps;
}

export function calcGongli(props) {
  // todo
  // 五维系数0.8，1命中=5 1格挡=5 1会心=10 1韧劲=9 1外攻=1 1内功=1.6 内外防=0.5 10气血=1 会心伤害=4
  // 更新 1韧劲=9， 1内功=1.6
  let sum = 0;
  sum += (props.ld + props.gg + props.qj + props.sf + props.dc) * 0.8;
  sum += props.mz * 5;
  sum += props.gd * 5;
  sum += props.hx * 10;
  sum += props.rj * 9;
  sum += props.wg;
  sum += props.ng * 1.6;
  sum += props.wf * 0.5;
  sum += props.nf * 0.5;
  sum += props.qx / 10;
  sum += props.hs * 4;
  return sum;
}

export function calcZhanli(props) {
  // 旧版本
  // 五维系数0.3 1命中=5 1格挡=5 1会心=20 1韧劲=0.3 1外攻=1.4 1内功=1.8 内外防=0.3 20气血=1 会心伤害=20
  // 段段实测
  // 新测试系数：五维系数0.3 1命中=3 1格挡=3 1会心=12 1韧劲=0.3 1外攻=0.85 1内功=1.05 内外防=0.18 1气血=0.03 会心伤害=12
  // 1破伤=10
  let sum = 0;
  sum += (props.ld + props.gg + props.qj + props.sf + props.dc) * 0.18;
  sum += props.mz * 3;
  sum += props.gd * 3;
  sum += props.hx * 12;
  sum += props.rj * 0.3;
  sum += props.wg * 0.85;
  sum += props.ng * 1.05; // 有待继续测试
  sum += props.wf * 0.18;
  sum += props.nf * 0.18;
  sum += props.qx * 0.03;
  sum += props.hs * 12;
  return sum;
}

export function calcConfigProps(xinfaDataList, brkthruData, configIndex) {
  // 计算综合属性
  let percentage = [1, 0.6, 0.3, 0.1];
  let typeMap = {
    lidao: 'ld',
    qijin: 'qj',
    gengu: 'gg',
    dongcha: 'dc',
    shenfa: 'sf'
  };

  let xinfaPropsList = [];
  let reinforceList = [];
  // 获取基本数据
  for(let i = 0; i < 4; i++) {
    if(xinfaDataList[i]) {
      let xinfaData = xinfaDataList[i];
      reinforceList[i] = xinfaData.reinforce;
      if(configIndex === 0 || configIndex) {
        xinfaPropsList[i] = xinfaPropsMultiply(calcXinfaProps(xinfaData, brkthruData, configIndex), percentage[i]);
      } else {
        xinfaPropsList[i] = xinfaPropsMultiply(calcXinfaProps(xinfaData, brkthruData), percentage[i]);
      }
    }
  }

  // 计算相生
  // 四本心法的相生加成百分比表，需先计算总加成的系数，再乘以原数据
  let additionTable = [
    {'ld': 0, 'gg': 0, 'qj': 0, 'dc': 0, 'sf': 0},
    {'ld': 0, 'gg': 0, 'qj': 0, 'dc': 0, 'sf': 0},
    {'ld': 0, 'gg': 0, 'qj': 0, 'dc': 0, 'sf': 0},
    {'ld': 0, 'gg': 0, 'qj': 0, 'dc': 0, 'sf': 0}
  ];
  for(let i = 0; i < 4; i++) { // 第i本心法
    if(xinfaDataList[i]) {
      // 遍历该心法所有相生心法
      for (let j = 0; j < reinforceList[i].length; j++) { // 第j本相生心法
        let reinforce = reinforceList[i][j];
        // 遍历是否有该心法
        for (let k = 0; k < 4; k++) {
          if(xinfaDataList[k]) {
            if (reinforce.name === xinfaDataList[k].name) {
              // 存在该对应心法，为自身提升属性
              // 遍历各五维属性
              for (let l = 0; l < reinforce.reinforce.length; l++) {
                let type = reinforce.reinforce[l].type; // 增加的五维类型
                type = typeMap[type];
                let coefficient = reinforce.reinforce[l].coefficient; // 相生提升的系数
                // 心法相生百分比一起计算
                // xinfaPropsList[i][type] *= 1 + coefficient; // 有误
                additionTable[i][type] += coefficient;
              }
            }
          }
        }
      }
    }
  }

  // 最后乘系数
  additionTable.forEach(({ld, gg, qj, dc, sf}, i) => {
    if(xinfaDataList[i]) {
      xinfaPropsList[i]['ld'] *= 1 + ld;
      xinfaPropsList[i]['gg'] *= 1 + gg;
      xinfaPropsList[i]['qj'] *= 1 + qj;
      xinfaPropsList[i]['dc'] *= 1 + dc;
      xinfaPropsList[i]['sf'] *= 1 + sf;
    }
  });

  // 四本心法相生后求和
  let fourXinfaProps = xinfaPropsPlus(
    xinfaPropsPlus(xinfaPropsList[0], xinfaPropsList[1]),
    xinfaPropsPlus(xinfaPropsList[2], xinfaPropsList[3])
  );
  // console.log(xinfaProps);
  return fourXinfaProps;
}

export function xinfaPropsMultiply(p, percentage) {
  return {
    xiuwei: p.xiuwei,
    stones: [], // 石头信息不再需要
    stoneExp: p.stoneExp,
    ld: p.ld * percentage,
    gg: p.gg * percentage,
    qj: p.qj * percentage,
    dc: p.dc * percentage,
    sf: p.sf * percentage,

    wg: p.wg * percentage,
    ng: p.ng * percentage,
    wf: p.wf * percentage,
    nf: p.nf * percentage,

    mz: p.mz * percentage,
    gd: p.gd * percentage,
    hx: p.hx * percentage,
    rj: p.rj * percentage,
    hs: p.hs * percentage,
    qx: p.qx * percentage,

    gongliOffset: p.gongliOffset * percentage,
    zhanliOffset: p.zhanliOffset * percentage
  };
}

export function xinfaPropsPlus(a, b) {
  if(!a) a = {};
  if(!b) b = {};
  return {
    xiuwei: a.xiuwei || 0 + b.xiuwei || 0,
    stones: [], // 不再需要
    stoneExp: a.stoneExp || 0 + b.stoneExp || 0,
    ld: (a.ld || 0) + (b.ld || 0),
    gg: (a.gg || 0) + (b.gg || 0),
    qj: (a.qj || 0) + (b.qj || 0),
    dc: (a.dc || 0) + (b.dc || 0),
    sf: (a.sf || 0) + (b.sf || 0),
    wg: (a.wg || 0) + (b.wg || 0),
    ng: (a.ng || 0) + (b.ng || 0),
    wf: (a.wf || 0) + (b.wf || 0),
    nf: (a.nf || 0) + (b.nf || 0),
    mz: (a.mz || 0) + (b.mz || 0),
    gd: (a.gd || 0) + (b.gd || 0),
    hx: (a.hx || 0) + (b.hx || 0),
    rj: (a.rj || 0) + (b.rj || 0),
    hs: (a.hs || 0) + (b.hs || 0),
    qx: (a.qx || 0) + (b.qx || 0),
    gongliOffset: (a.gongliOffset || 0) + (b.gongliOffset || 0),
    zhanliOffset: (a.zhanliOffset || 0) + (b.zhanliOffset || 0)
  };
}

// export function calcSchoolProps(props, schoolId) {
//   let schoolProps = schoolPropsList[schoolId];
//   let newProps = {... props};
//   ['ld', 'gg', 'qj', 'dc', 'sf'].forEach((dimId) => {
//     Object.keys(schoolProps[dimId]).forEach((fightPropId) => {
//       newProps[fightPropId] += newProps[dimId] * schoolProps[dimId][fightPropId];
//     });
//   });
//   return newProps;
// }

export function calcAdditionProps(oldProps, brkthruData) {
  let props = {... oldProps};
  let additionConfig = brkthruData.additionConfig || {};
  let dimList = ['ld', 'gg', 'qj', 'dc', 'sf'];
  // 计算五维百分比加成
  let dimAdditionPercentages = dimList.map((dimId) => {
    let level;
    try {
      level = additionConfig.shenbingLevels[dimId] || 0;
    } catch(e) {
      level = 0;
    }
    // 单独计算神兵属性
    let sum = additionPercentageTable['shenbing'][dimId][level][dimId];
    // 计算其他称号属性
    chenghaoList.forEach(({dataId, stateId}) => {
      let curLevel;
      try {
        curLevel = additionConfig[stateId] || 0;
      } catch(e) {
        curLevel = 0;
      }
      sum += additionPercentageTable[dataId][curLevel]['all'];
    });
    return sum;
  });

  dimList.forEach((dim, i) => {
    props[dim] *= 1 + dimAdditionPercentages[i];
  });

  // 计算门派加成
  let schoolId;
  try {
    schoolId = additionConfig.schoolId || 'TB';
  } catch(e) {
    schoolId = 'TB';
  }

  let schoolProps = schoolPropsList[schoolId];
  ['ld', 'gg', 'qj', 'dc', 'sf'].forEach((dimId) => {
    Object.keys(schoolProps[dimId]).forEach((fightPropId) => {
      props[fightPropId] += props[dimId] * schoolProps[dimId][fightPropId];
    });
  });
  return props;
}

// calcLevelTotalXiuwei(level) {
//   let sum = 0;
//   for(let i = 0; i < level; i++) {
//     let shujiList = this.props.xinfaData.brkthruLevels[i].shujiMap;
//     Object.keys(shujiList).forEach((shujiId) => {
//       sum += shujiList[shujiId].levels.reduce((a, b) => {
//         return a + parseInt(b.xiuwei)
//       }, 0);
//     });
//   }
//   return sum;
// }

// calcXiuwei() {
//   let sum = 0;
//   let xiuweiPreviousLevel = this.calcLevelTotalXiuwei(this.props.fulfilledLevel);
//
//   console.log(this.props.curLevelBrkthruData);
//   console.log(this.props.xinfaData);
//   console.log(this.props.fulfilledLevel + 1);
//
//   for(let shujiId in this.props.curLevelBrkthruData) {
//     if(this.props.curLevelBrkthruData.hasOwnProperty(shujiId)) {
//       let shujiLevel = this.props.curLevelBrkthruData[shujiId];
//       for(let i = 0; i < shujiLevel; i++) {
//         console.log("shujiid", shujiId);
//         sum += parseInt(this.props.xinfaData.brkthruLevels[this.props.fulfilledLevel + 1].shujiMap[shujiId].levels[shujiLevel - 1].xiuwei);
//         console.log(shujiLevel);
//         console.log(this.props.xinfaData.brkthruLevels[this.props.fulfilledLevel + 1].shujiMap[shujiId].levels[shujiLevel - 1].xiuwei);
//       }
//     }
//   }
//
//   return sum + xiuweiPreviousLevel;
// }