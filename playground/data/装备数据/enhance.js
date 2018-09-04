const csv = require('csvtojson');
const fs = require('fs');

// 分部位精工增加属性

let files = [
  'ZhuWuQi', 'FuWuQi' ,'AnQi',
  'JieZhi', 'ShouZhuo' ,'XiangLian',
  'TouShi', 'ShangYi' ,'NeiChen', 'HuWan', 'YiDai', 'XiaZhuang'
];

// 分部位精工等级属性表
let promises = files.map((key) => {
  return csv({checkType: true}).fromFile(`./input/enhance/EquipEnhanceLevelTable${key}.csv`);
});

Promise.all(promises).then((data) => {
  let result = {};
  data.forEach((posData, i) => {
    let type = files[i];
    // 统一用词
    switch (type) {
    case 'YiDai':
      type = 'YaoDai';
      break;
    case 'XiaZhuang':
      type = 'XieZi';
      break;
    }
    if(!result.hasOwnProperty(type))
      result[type] = [];
    // 添加0级数据
    result[type][0] = {
      level: 0, wgMin: 0, wgMax: 0, ngMin: 0, ngMax: 0, wf: 0, qx: 0, mp: 0
    };
    posData.forEach(({level, position, waigongMin, waigongMax, neigongMin, neigongMax, waifang, hp, mp}, j) => {
      result[type][level] = {
        level, wgMin: waigongMin, wgMax: waigongMax, ngMin: neigongMin, ngMax: neigongMax, wf: waifang, qx: hp, mp
      };
    });
  });

  fs.writeFileSync('./output/enhance_props.json', JSON.stringify(result, null, 4));
});

// 精工等级经验表
csv({checkType: true}).fromFile('./input/enhance/EquipEnhanceExpTable.csv').then(data => {
  let result = [];

  result[0] = {
    exp: 0, money: 0
  };

  data.forEach(({level, exp, money}) => {
    result[level] = {
      exp, money
    };
  });

  fs.writeFileSync('./output/enhance_cost.json', JSON.stringify(result, null, 4));
});