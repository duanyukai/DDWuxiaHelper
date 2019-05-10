const csv = require('csvtojson');
const fs = require('fs');

let menpaiMap = {
  ZW: 'ZW',
  HS: 'TB',
  BD: 'SW',
  GB: 'GB',
  TM: 'TM',
  WD: 'WD',
  // SL
  TX: 'TX',
  SD: 'SD',
  YH: 'YH',

};

let promises = Object.keys(menpaiMap).map((key, i) => {
  let data = fs.readFileSync(`./input/SkillLogical${key}.csv`);
  return csv({checkType: true}).fromString(data.toString());
});

Promise.all(promises).then(gen);

function gen(lists) {
  let result = {};
  Object.keys(menpaiMap).forEach((originId, i) => {
    let curResult = [];
    let curMpSkills = lists[i];
    curMpSkills.forEach(({skillId, skillLevel, baseLevelId, roleLevel, addition1, addition2, comboList, baseSkillId, distance, cd, des, background, name, icon, type, consume, typeDes, last}) => {
      // 判断是否是新技能
      if(skillId === baseLevelId && skillId === baseSkillId && name !== '') {
        // 查找最高等级，仅保留最高级数据，寻找除了最后两位其他相同，最后两位最大的数
        let maxLevelData = curMpSkills.filter(o => Math.floor(o.skillId / 100) === Math.floor(skillId / 100) && o.name === name).sort((a, b) => b.skillId - a.skillId)[0];
        let maxLevel = maxLevelData.skillId % 100;

        // 获取最高机的技能加成系数列表
        let addition1List = maxLevelData.comboList.split('\$\$').map(parseFloat).filter(o => !isNaN(o)).map(id => {
          return curMpSkills.filter(o => o.skillId === id)[0].addition1;
        });
        // 一段伤害的
        if(addition1List.length === 0) {
          addition1List = [addition1];
        }


        curResult.push({
          skillId, name, icon,
          des: maxLevelData.des, background: maxLevelData.background,
          type, typeDes,
          distance: maxLevelData.distance, cd: maxLevelData.cd,
          consume: maxLevelData.consume,
          maxLevel,
          addition1List
        });
      }

    });

    result[menpaiMap[originId]] = curResult;

  });


  // 写入文件
  fs.writeFileSync('./output/skill.json', JSON.stringify(result, null, 4));
}