const csv = require('csvtojson');
const fs = require('fs');

// 用门派表+00~09查询0-9级珑铸属性，通过01位的消耗确定部位（15,30,90,115,135）
let menpaiMap = {
  /*'真武'*/ 0: [36,37,38,39,60,61],
  /*'太白'*/ 1: [20,21,22,23,52,53],
  /*'神威'*/ 2: [24,25,26,27,54,55],
  /*'丐帮'*/ 3: [28,29,30,31,56,57],
  /*'唐门'*/ 4: [32,33,34,35,58,59],
  /*'五毒'*/ 5: [44,45,46,47,64,65],
  /*'天香'*/ 7: [40,41,42,43,62,63],
  /*'神刀'*/ 8: [48,49,50,51,66,67],
  /*'移花'*/ 9: [68,69,70,71,72,73],
};

let menpaiNameList = [
  '真武',
  '太白',
  '神威',
  '丐帮',
  '唐门',
  '五毒',
  '少林',
  '天香',
  '神刀',
  '移花'
];

let posMap = {
  15: 'HuWan',
  30: 'TouShi',
  90: 'XieZi',
  115: 'ShangYi',
  135: 'NeiChen',
  165: 'YaoDai',
};

csv({checkType: true}).fromFile(`./output/out.csv`).then((data) => {
  let result = {};

  Object.keys(menpaiMap).forEach((menpaiId) => {
    menpaiMap[menpaiId].forEach((id100) => {
      [0,1,2,3,4,5,6,7,8,9].forEach((level) => {
        let row = data.filter(o => o.id == id100 + '0' + level)[0];
        if(!result.hasOwnProperty(menpaiId))
          result[menpaiId] = {};
        let posRecRow = data.filter(o => o.id == id100 + '01')[0];
        let pos =  posMap[posRecRow.yelinglong];
        if(!result[menpaiId].hasOwnProperty(pos))
          result[menpaiId][pos] = [];
        result[menpaiId][pos][level] = {
          id: row.id,
          name: row.name,
          jiangxinLV: row.jiangxinLV,
          yelinglong: row.yelinglong,
          suiyin: row.suiyin,
          props: row.props,
          deco: row.deco,
          texiao: row.texiao == '空' ? null : row.texiao
        };
      });
    });
  });

  fs.writeFileSync('./output/longzhu.json', JSON.stringify(result, null, 4));
});