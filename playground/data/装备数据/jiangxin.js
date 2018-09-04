const csv = require('csvtojson');
const fs = require('fs');

// 琢磨百分比加成表
csv({checkType: true}).fromFile('./input/jiangxin/EquipJiangXinLevelTableZhuWuQi.csv').then(data => {
  let result = [];

  result[0] = {
    exp: 0, money: 0
  };

  data.forEach(({level, percent}) => {
    result[level] = {
      ratio: percent
    };
  });

  fs.writeFileSync('./output/jiangxin_percentage.json', JSON.stringify(result, null, 4));
});

// 琢磨等级经验表
csv({checkType: true}).fromFile('./input/jiangxin/EquipJiangXinExpTable.csv').then(data => {
  let result = [];

  result[0] = {
    ratio: 0
  };

  data.forEach(({level, exp, money}) => {
    result[level] = {
      exp, money
    };
  });

  fs.writeFileSync('./output/jiangxin_cost.json', JSON.stringify(result, null, 4));
});