const csv = require('csvtojson');
const fs = require('fs');

let tejiList =[];
let skillDecoList = [];
let additionalList = [];
let texiaoList = [];

let files = [
  'EquipTeJiTable.csv', 'EquipAdditionalTableLongZhu.csv' ,'SkillDecoTable_Retail.csv', 'EquipTeJiBehaviorDecoTable_Retail.csv'
];

let promises = files.map((key) => {
  return csv({checkType: true}).fromFile(`./input/${key}`);
});

Promise.all(promises).then(gen);

function gen(data) {
  tejiList = data[0];
  skillDecoList = data[2];
  additionalList = data[1];
  additionalList = data[1];
  texiaoList = data[3];
  let result = 'id,name,level,jiangxinLV,yelinglong,suiyin,props,deco,texiao\n';  // todo 表头
  // 特技表中
  tejiList.forEach(({id, name, level, zuomoLevel, attrId, decoId, behaviorDecoId, yelinglongNum, suiyin}) => {
    // attrId、decoId解析，都是只有0、1个属性id
    let attr = attrId[0];
    console.log(attr);
    if(attr) {
      let attrObj = additionalList.filter(o => o.id == attr)[0];
      attr = attrObj.name + '：' + attrObj.desc;
    } else {
      attr = '空';
    }
    let deco = decoId[0];
    console.log(deco);
    if(!isNaN(deco)) {
      try {
        deco = skillDecoList.filter(o => o.id == deco)[0].desc;
      } catch (e) {
        deco = '出错';
      }
    } else {
      deco = '空';
    }

    // 特效解析(如9级苍龙特效)behaviorDecoId
    let behaviorDeco = behaviorDecoId[0];
    if(!isNaN(behaviorDeco)) {
      try {
        console.log('behaviorDeco', behaviorDeco);
        behaviorDeco = texiaoList.filter(o => o.id == behaviorDeco)[0].desc;
      } catch (e) {
        console.log(e);
        behaviorDeco = '出错';
      }
    } else {
      behaviorDeco = '空';
    }


    result += `${id}, ${name}, ${level}, ${zuomoLevel}, ${yelinglongNum}, ${suiyin}, ${attr}, ${deco}, ${behaviorDeco}\n`;
  });

  fs.writeFile('./output/out.csv', result , function(err) {
    if(err) {
      console.log(err);
    }
  });
}