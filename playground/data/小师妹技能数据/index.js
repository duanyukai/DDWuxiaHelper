/**
 * 小师妹技能数据提取
 * 普通属性直接通过字符串提取
 * 功力偏移数据通过EquipAdditionalTable提取
 *
 *
 *
 * ********需要完善的：
 * 没有虚战力，可视化需要非0属性的key反查名字，需要新增收藏度属性（同时正确计算功力）
 * 计算师妹五维功力，直接20%+信任度？%计算即可
 * 计算技能功力，技能正常计算等级属性+收藏度属性，天人合一需要调用师妹基础五维，转换成新五维存储即可
 * 属性求和需要设计一下
 *
 * 隐藏金色技能手动合成搞一波
 *
 * 图标在ChildSkillGroup表里，直接手动拿出来方便
 */

require = require('@std/esm')(module,{'esm':'js'});
const csv = require('csvtojson');
const fs = require('fs');
const { propsExtract, extractPropsByEquipAddition, genTextByPlayerProps } = require('../../../src/modules/_commons/property_calc/player_props_extract_and_gen');

let fileList = ['ChildSkillTable', 'EquipAdditionalTableShiMei'];

let promises = fileList.map((key) => {
  let data = fs.readFileSync(`./input/${key}.csv`);
  return csv({checkType: true}).fromString(data.toString());
});

Promise.all(promises).then(gen);

function gen(lists) {
  let skillList = lists[0];
  let additionList = lists[1];

  let result = {};

  let skillIdMap = {
    101: {name: '怒梅·喋血', icon: 'SKILLL_TB_SMHJ_02', typeId: 'diexue'},  // 用太白的代替
    201: {name: '青梅·外攻', icon: 'icon_SM_BDlan_waigongGJ', typeId: 'wg'},
    202: {name: '青梅·内攻', icon: 'icon_SM_BDlan_neigongGJ', typeId: 'ng'},
    203: {name: '青梅·外防', icon: 'icon_SM_BDlan_waigongFY', typeId: 'wf'},
    204: {name: '青梅·内防', icon: 'icon_SM_BDlan_neigongFY', typeId: 'nf'},
    205: {name: '青梅·气血', icon: 'icon_SM_BDlan_qixue', typeId: 'qx'},
    301: {name: '青梅·镇', icon: 'icon_SM_BDzi_FY', typeId: 'zhen'},
    302: {name: '青梅·破', icon: 'icon_SM_BDzi_GJ', typeId: 'po'},
    303: {name: '青梅·伤', icon: 'icon_SM_BDzi_daBOSS', typeId: 'shang'},
    304: {name: '青梅·威', icon: 'icon_SM_BDzi_xueruoGJ', typeId: 'wei'},
    305: {name: '青梅·怒', icon: 'icon_SM_BDzi_xueruoFY', typeId: 'nu'},
    306: {name: '青梅·卸', icon: 'icon_SM_BDzi_Xie', typeId: 'xie'},
    401: {name: '青梅·天人合一', icon: 'icon_SM_BDjin_GX', typeId: 'trhy'},
    402: {name: '青梅·镇如五岳', icon: 'icon_SM_BDjin_ZhenRuWuYue', typeId: 'zrwy'},
    // 901: {name: '青梅·势如破竹', icon: '', typeId: 'srpz'},  // 隐藏的先用9开头
    // 902: {name: '青梅·威如天狱', icon: '', typeId: 'wrty'},
    // 903: {name: '青梅·怒如山火', typeId: 'nrsh'},
  };

  skillList.forEach(s => {
    let skillTypeId = parseInt(s.childSkillId.toString().slice(0, 3));
    let skillLevel = parseInt(s.childSkillId.toString().slice(3, 5));
    console.log(skillTypeId, skillLevel);
    if(skillTypeId === 101 || skillTypeId >= 200) {
      if (!result.hasOwnProperty(skillTypeId)) {
        result[skillTypeId] = {
          name: skillIdMap[skillTypeId].name,
          typeId: skillIdMap[skillTypeId].typeId,
          // icon: s.icon,
          icon: skillIdMap[skillTypeId].icon,
          canSelect: true,  // 排除不能选的合击技技能
          levels: []
        };
      }
      // 当前等级属性数据 @deprecated
      // let props = propsExtract(s.des);
      // 从equip addition提取属性
      let additionRow = additionList.find(o => o.additionalId === s.equipAddId);
      let props = {};
      if(additionRow)
        props = extractPropsByEquipAddition(additionRow);
      // 当前功力偏移，已经包含在属性中
      // let gongliOffset = additionList.find(o => o.additionalId === s.equipAddId).gongliOffset;

      // des天人合一保留，其他遗弃
      let des = s.des;
      if(skillTypeId !== 401)
        des = genTextByPlayerProps(props);
      result[skillTypeId].levels[skillLevel] = {
        times: s.times,
        suiyin: s.suiyin,
        canye: s.count1,
        meirui: parseInt(s.count2) || 0,
        collectLevel: s.collectLevel,
        // des: s.des.replace(/<br>/g, ' '),  // 要不要可能无所谓了，现在可以通过props合成
        // des: genTextByPlayerProps(props),  // 通过props合成更短的
        des: des,
        sm5dPct: s.percent,
        props: props,
        // isProp: Object.keys(props).length !== 0  // 没用了
      };
    }
  });

  // 修正合击技描述
  result[101].canSelect = false;
  for (let i = 1; i <= 30; i++) {
    result[101].levels[i].des = `小师妹合击技，该级伤害提升${(i-1)*10}%`;
  }

  // 通过金色镇如五岳的消耗，构造其他三本金色心法，只需要替换属性，其他的完全一样（目前没有虚功力）
  // todo
  let hiddenSkills = {
    403: {name: '青梅·势如破竹', icon: 'icon_SM_BDjin_ShiRuPoZhu', typeId: 'srpz', baseAddId: 88040301},  // 猜测880*403*01中间是技能id
    404: {name: '青梅·威如天狱', icon: 'icon_SM_BDjin_WeiRuTianYu', typeId: 'wrty', baseAddId: 88040401},
    405: {name: '青梅·怒如山火', icon: 'icon_SM_BDjin_NuRuShanHuo', typeId: 'nrsh', baseAddId: 88040501},
  };

  Object.keys(hiddenSkills).forEach(key => {
    result = {
      ...result,
      [key]: {
        ...JSON.parse(JSON.stringify(result[402])),
        name: hiddenSkills[key].name,
        typeId: hiddenSkills[key].typeId,
        icon: hiddenSkills[key].icon,
        canSelect: true
      }
    };
    // 修改levels
    for (let i = 0; i < result[key].levels.length; i++) {
      console.log(key, i);
      if(i === 0) continue;
      let actualProps = extractPropsByEquipAddition(additionList.find(o => o.additionalId === hiddenSkills[key].baseAddId + i - 1));
      result[key].levels[i].props = actualProps;
      result[key].levels[i].des = genTextByPlayerProps(actualProps);
    }
  });

  // 修正所有0级技能
  let keys = Object.keys(result);
  for (let i = 0; i < keys.length; i++) {
    result[keys[i]].levels[0] = {
      'times': 0,
      'suiyin': 0,
      'canye': 0,
      'meirui': 0,
      'collectLevel': 0,
      'des': '需使用整本技能解锁',
      'sm5dPct': 0,
      'props': {}
    };
  }

  // 修正青梅卸拆招无功力
  for (let i = 0; i <= 30; i++) {
    result[306].levels[i].props.chaizhaoNC = result[306].levels[i].props.chaizhao;
    delete result[306].levels[i].props.chaizhao;
  }

  // 写入文件
  fs.writeFileSync('./output/child_skill.json', JSON.stringify(result, null, 4));
}


// result 结构
let rrr = {
  201: {
    name: '青梅外攻',
    levels: [
      {
        times: 5,
        canye: 10,
        meirui: 0,
        collectLevel: 2,
        des: '提升',
        gOffset: 11,
        props: {
          wg: 10
        }
      },
      {

      }
    ]
  }
};