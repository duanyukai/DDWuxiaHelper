const csv = require('csvtojson');
const fs = require('fs');

let seaCollectList =[];
let positionList = [];

csv().fromFile('./sea_collect.csv')
  .on('json',(jsonObj)=>{ seaCollectList.push(jsonObj); })
  .on('done',(error)=> {
    csv().fromFile('./pos.csv')
      .on('json',(jsonObj)=>{ positionList.push(jsonObj); })
      .on('done',(error)=> {
        // console.log(seaCollectList);
        // console.log(positionList);

        gen();
      });
  });

function gen() {
  let seaData = {};
  let mapMap = {
    '钱塘港': 'QTG',
    '江洋港': 'JYG',
    '泉州港': 'QZG',
    '望海岬': 'WHJ',
    '灵鹿岛': 'LLD',
    '天涯盐场': 'TYYC',
    '沧浪岛': 'CLD',
    '幽灵岛': 'YLD',
    '宝矿山': 'BKS',
    '琅嬛福地': 'LHFD',
    '大沧海': 'DCH',
    '东海玉涡': 'DHYW',
  };

  let typeMap = {
    '港口志': 	1,
    '地理志': 	2,
    '草木志': 	3,
    '博物志': 	6,
    '水产志': 	7,
    '鸟兽志': 	4,
    '人文志': 	5
  };

  seaCollectList.forEach(({ id, type, advPoint, star, name, image, preDes, afterDes, levelAndInvest, jzxPoint, songqian }) => {
    // 根据name找坐标
    let posList = positionList.filter((o) => o.name === name);
    if(posList.length === 1) {
      let posStr = posList[0]['pos1'];
      let posArr = posStr.split(/[\(\)\$]/);
      console.log(posArr);
      let mapName = posArr[0];
      let x = parseInt(posArr[1]);
      let y = parseInt(posArr[2]);
      let mapId = mapMap[mapName];

      let levelAndInvestSplit = levelAndInvest.split(/[\[\]\$\$]/);
      let neededSeaLevel = parseInt(levelAndInvestSplit[1]);
      let neededInvest = parseInt(levelAndInvestSplit[3]);

      if(!seaData[mapId])
        seaData[mapId] = [];

      seaData[mapId].push({
        name, x, y,
        type: parseInt(type),
        star: parseInt(star),
        preDes, afterDes,
        neededSeaLevel, neededInvest,
        jzxPoint: parseInt(jzxPoint),
        songqian: parseInt(songqian)
      });
    } else {
      console.log("暂时没有", name);
    }
  });

  fs.writeFile(`./output/sea_collect.json`, JSON.stringify(seaData, null, 4) , function(err) {
    if(err) {
      console.log(err);
    }
  });
}