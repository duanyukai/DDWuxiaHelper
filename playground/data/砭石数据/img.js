const Long = require('long');
const csv = require('csvtojson');
const fs = require('fs');

// 文件名Hash函数
function getHash(str) {
  let dwHash = new Long(0x4D2960DB, 0x1712E27F, true); // 低位，高位，无符号
  str = str.toUpperCase();
  str = str.replace(/\//g, '\\');
  for (let i = 0; i < str.length; i++) {
    dwHash = dwHash.mul(67).add(str.charCodeAt(i));
  }
  return ('0000000000000000' + dwHash.toString(16)).slice(-16);
}

// console.log(getHash('DATA\\IMAGESETS\\ICONS\\ITEMTIPSICON\\ICON_64_BIANSHI_ATK_HUIXINLVMINGZHONG_QUALITY_1.TGA'));

let gemList = [];
let hashFolder = 'E:\\Default Documents\\项目-活动-竞赛\\天涯明月刀\\00.各种助手\\94.SFC解包重打包\\PySFCExtractor\\output\\imagesets\\';
let outputFolder = './img_output/';

csv().fromFile('./input/AcupointGemTable_Retail.csv')
  .on('json',(jsonObj)=>{ gemList.push(jsonObj); })
  .on('done',(error)=> {
    gen();
  });

function gen() {
  gemList.forEach(({gemName, imgName}) => {
    // 替换63、64
    imgName = imgName.replace('63', '40');
    imgName = imgName.replace('64', '40');

    // 计算hash
    let hash = getHash(`DATA\\IMAGESETS\\ICONS\\ITEM\\${imgName}.TGA`);
    // 复制对应hash的文件，改名为砭石名称
    console.log(gemName, imgName);
    fs.createReadStream(`${hashFolder}${hash}.tga`).pipe(fs.createWriteStream(`${outputFolder}${gemName}.tga`));
  });
}