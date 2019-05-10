import shenbingData from '../assets/json/shenbing.json';
import {zeroProps} from '../../../_commons/property_calc/player_props_calc';
import {mulProps, sumProps} from '../../../_commons/property_calc/player_props_calc';

// 获取单个质料数据
export function getZhiliaoById(zlId) {
  return shenbingData[(zlId-zlId%100)/100].zhiliaoList[zlId%100-1];
}

// 获取单个神兵数据
export function getShenbingById(sbId) {
  return shenbingData[sbId];
}

// 获取单个质料等级属性
export function getZhiliaoLevelProps(zlId, level) {
  let zl = getZhiliaoById(zlId);

  return zl.levels[level].props;
}

// 获取单个技能（章节）等级属性
export function getSkillLevelProps(sbId, level) {
  let sb = getShenbingById(sbId);
  // 基本属性
  let base = sb.skillLevels[level].props;
  // 章节额外属性
  let extra = {};
  // 累加和，如技能16级，即额外4个，4级即额外1个，除以4即可
  for (let i = 1; i <= level / 4; i++) {
    extra = sumProps(extra, sb.chapters[i].props);
  }
  return sumProps(base, extra);
}

// 获取单个神兵的总体属性，质料等级简单传进来
export function getSingleShenbingProps(sbId, zhiliaoLevelList, skillLevel) {
  // 三个质料属性，技能属性求和
  let zlSum = sumProps(
    getZhiliaoLevelProps(sbId * 100 + 1, zhiliaoLevelList[0]),
    getZhiliaoLevelProps(sbId * 100 + 2, zhiliaoLevelList[1]),
    getZhiliaoLevelProps(sbId * 100 + 3, zhiliaoLevelList[2]),
  );
  let skillProps = getSkillLevelProps(sbId, skillLevel);

  return sumProps(zlSum, skillProps);
}