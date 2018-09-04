const csv = require('csvtojson');
const fs = require('fs');

let gemList =[];

csv().fromFile('./input/AcupointGemTable_Retail.csv')
  .on('json',(jsonObj)=>{ gemList.push(jsonObj); })
  .on('done',(error)=> {
    gen();
  });

function gen() {
  let result = {};

  gemList.forEach(({gemIdWithLevel, gemName, gemRootId, gemLevel, usageDes, propDes, imgName, gemNeedExp}) => {
    // 根据末尾汉字确定砭石等级
    let lastChar = gemName[gemName.length - 1];
    let levelName = lastChar + "级砭石";
    if(!result.hasOwnProperty(levelName)) {
      result[levelName] = {};
    }
    // 存储砭石数据
    if(!result[levelName].hasOwnProperty(gemName)) {
      result[levelName][gemName] = {
        img: imgName,
        usageDes,
        levels: {}
      };
    }
    result[levelName][gemName].levels[gemLevel] = {
      propDes,
      exp: parseInt(gemNeedExp)
    }
  });

  console.log(result);

  fs.writeFile('./output/output.json', JSON.stringify(result, null, 4));
}