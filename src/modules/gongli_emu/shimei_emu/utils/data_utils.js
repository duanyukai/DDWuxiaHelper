import skillData from '../assets/json/child_skill.json';
import {zeroProps} from '../../../_commons/property_calc/player_props_calc';
import {mulProps, sumProps} from '../../../_commons/property_calc/player_props_calc';

export function getAllSkills() {
  return skillData;
}

export function getSkillById(id) {
  return skillData[id];
}

// 获取师妹纯五维加信任度折算后玩家属性，信任度直接传等级（百分之一即1）
export function getPlayerRealShimei5dPropsWithXinren(shimei5dProps, xinrenPct) {
  let convertedPlayer5dProps = {...shimei5dProps};
  let ratio = 0.2 + xinrenPct;
  convertedPlayer5dProps = mulProps(convertedPlayer5dProps, ratio);
  return convertedPlayer5dProps;
}

// 获取单本技能的收集点属性（五维）
export function getSingleSkillCollectPoints(id, level) {
  let sum = 0;
  for (let i = 0; i <= level; i++) {
    sum += skillData[id].levels[i].collectLevel;
  }
  return  sum;
}

// 获取全部技能的收集点属性（五维）
export function getAllSkillCollectPoints(idLevelMap) {
  return Object.keys(idLevelMap).reduce((sum, key) => {
    return sum + getSingleSkillCollectPoints(key, idLevelMap[key]);
  }, 0);
}

// 获取单本技能指定等级的角色属性对象(不含收集点)
export function getSingleSkillProps(id, level, shimei5dProps) {
  // 天人合一单独计算
  if(id === 401) {
    return Object.assign(
      {
        ...skillData[id].levels[level].props
      },
      mulProps({...shimei5dProps}, skillData[id].levels[level].sm5dPct)
    );
  }
  
  // 其他等级
  try {
    // return Object.assign({...zeroProps}, skillData[id].levels[level].props);
    return {...skillData[id].levels[level].props};  // 没必要弄全
  } catch (e) {
    return {...zeroProps};
  }
}

// 获取整套技能的属性和
export function getAllSkillProps(idLevelMap, shimei5dProps) {
  let skills = Object.keys(idLevelMap).map(key => {
    return getSingleSkillProps(key, idLevelMap[key], shimei5dProps);
  });
  console.log(skills);
  return sumProps(...Object.keys(idLevelMap).map(key => {
    return getSingleSkillProps(key, idLevelMap[key], shimei5dProps);
  }));
}