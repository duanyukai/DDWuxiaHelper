const fs = require('fs');
const xml2js = require('xml2js');
const csv = require('csvtojson');
const iconv = require('iconv-lite');

let inputDir = 'E:\\Default Documents\\项目-活动-竞赛\\天涯明月刀\\00.各种助手\\91.客户端解包\\output\\sfc\\common';
let outputDir = 'E:\\Default Documents\\项目-活动-竞赛\\天涯明月刀\\00.各种助手\\91.客户端解包\\output\\sfc\\common_to_name';

let mapIdMap = {
  10001: 'JH',
  10002: 'DY',
  10003: 'JINGH',
  10004: 'YY',
  10005: 'BS',
  10006: 'YD',
  10007: 'XZ',
  // 10008: '',
  10009: 'QC',
  10010: 'HZ',
  10011: 'JN',
  10012: 'KF',
  10013: 'XH',
  10021: 'HHZ'

};

// 读取npc表和entity表
let npcTable =[];
let entityTable = [];

csv().fromFile('./npc.csv')
  .on('json',(jsonObj)=>{ npcTable.push(jsonObj); })
  .on('done',(error)=> {
    csv().fromFile('./entity.csv')
      .on('json',(jsonObj)=>{ entityTable.push(jsonObj); })
      .on('done',(error)=> {
        gen();
      });
  });

function gen() {
  let parser = new xml2js.Parser();

  const allFiles = fs.readdirSync(inputDir);

  allFiles.forEach((fileName) => {
    // 处理xml文件
    if(fileName.split('.')[1] === 'xml') {
      let data = fs.readFileSync(`${inputDir}\\${fileName}`);
      let fileString = iconv.decode(data, 'gbk');
      // 去掉xml的左右方括号
      fileString = fileString.replace(/[\[\]]/g, '');

      parser.parseString(fileString, function (err, result) {
        if(fileString.includes('ResRespawnPointCfg')) {
        //   // npc或实体生成坐标
        //   try {
        //     let curFileResult = '';
        //     result['ResRespawnPointCfg']['PointCfg'][0]['PointCfg'].forEach(({$}) => {
        //       let name;
        //       if($.mIsEntity) {
        //         name = entityTable.filter((o) => o.entityId == $.TypeId)[0].entityName;
        //       } else {
        //         name = npcTable.filter((o) => o.npcId == $.TypeId)[0].npcName;
        //
        //       }
        //       // console.log(name, $.TypeId,  $.PosX / 100, $.PosY / 100);
        //       curFileResult += `${name}, ${$.TypeId}, ${$.PosX / 100}, ${$.PosY / 100}`;
        //       // fs.writeFile(`${outputDir}\\${fileName}.csv`, curFileResult);
        //     });
        //
        //   } catch(e) {
        //     // 大量0长度文件
        //     // console.log(e);
        //     // console.log(fileString);
        //   }

        } else if(fileString.includes('SeqPathPointTable')) {

        } else if(fileString.includes('DesignerStats')) {
          // 设计
          try {
            let curFileResult = '';
            result['DesignerStats']['DesignerItem'].forEach(({$}) => {
              let name;
              name = npcTable.filter((o) => o.npcId == $.NPCID)[0].npcName;
              console.log(name, $.NPCID,  $.PosX / 100, $.PosY / 100);
              curFileResult += `${name}, ${$.NPCID}, ${$.PosX / 100}, ${$.PosY / 100}, ${mapIdMap[$.MapID] || ('未知' + $.MapID)}\r\n`;
              fs.writeFileSync(`${outputDir}\\DesignerStats\\${fileName.split('.')[0]}.txt`, curFileResult);
            });
          } catch(e) {}

        } else if(fileString.includes('ResRespawnGroupCfg')) {

        } else if(fileString.includes('ResRespawnFlockCfg')) {

        } else if(fileString.includes('ResAreaCfg')) {

        } else if(fileString.includes('SeqPathFlockTable')) {

        } else if(fileString.includes('ResAreaFuncCfg')) {

        } else if(fileString.includes('DragonJumpPointTable')) {

        } else if(fileString.includes('DragonJumpFlockTable')) {

        } else if(fileString.includes('ShaderDef')) {

        } else {
          // console.log('未知格式', fileString.substring(0, 30));
        }
      });
    } else {
      // console.log('忽略', fileName);
    }
  });
}





// fs.readFile('./input.xml', function(err, data) {
//
//
//   parser.parseString(data, function (err, result) {
//     result['NewObj']['MapUiAreaNameTable'][0]['m_vecAreaNames'][0]['m_vecAreaNames'].forEach(({ $ }) => {
//       let topLevel = Math.min(...$['szType'].split(';'));
//
//       let o = {
//         x: parseInt($['nPosX']) * 2,
//         y: parseInt($['nPosY']) * 2,
//         name: $['szName'],
//         des: $['szDesc'],
//         level: topLevel
//       };
//       let mapId = $['nMapID'];
//       if(!r.hasOwnProperty(mapIdMap[mapId]))
//         r[mapIdMap[mapId]] = [];
//       r[mapIdMap[mapId]].push(o);
//     });
//   });
//
//   fs.writeFile('./output/location_name.json', JSON.stringify(r, null, 4));
// });