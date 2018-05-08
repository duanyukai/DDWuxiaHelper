const csv = require('csvtojson');
const fs = require('fs');

let atlasList =[];
let mobao4List = [];
let mobao1List = [];

csv().fromFile('./input/atlas.csv')
  .on('json',(jsonObj)=>{ atlasList.push(jsonObj); })
  .on('done',()=> {
    csv().fromFile('./input/mobao4.csv')
      .on('json',(jsonObj)=>{ mobao4List.push(jsonObj); })
      .on('done',()=> {
        csv().fromFile('./input/mobao1.csv')
          .on('json',(jsonObj)=>{ mobao1List.push(jsonObj); })
          .on('done',()=> {
            gen();
          });
      });
  });

function gen() {
  let result = {};

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
    10021: 'HHZ',
  };

  atlasList.forEach(({ id, mobaoName, mapId, pos, huajuan, timeAchiReqId, time, weatherAchiReq, weather, typeAAchiReq, typeAName, typeAContent, typeBAchiReq, typeBName, typeBContent, roleLevel, craftLevel, paperType, paper, shulian, des, xiuwei, suiyin256 }) => {

    // 找出对应的两个4组数据
    let A4 = mobao4List.filter((o) => o.reqId == typeAAchiReq);
    let B4 = mobao4List.filter((o) => o.reqId == typeBAchiReq);
    let conditionsA = [], conditionsB = [];
    if(A4.length === 1) {
      let idArray = [];
      idArray.push(A4[0]['id1']);
      idArray.push(A4[0]['id2']);
      idArray.push(A4[0]['id3']);
      idArray.push(A4[0]['id4']);
      idArray.forEach((id) => {
        if(id != '0') {
          // 查找该id的坐标
          let data = mobao1List.filter((o) => o.id == id)[0];
          if(data) {
            conditionsA.push({
              x: parseInt(data.x100) / 100,
              y: parseInt(data.y100) / 100,
              fullName: data.fullName
            });
          } else {
            console.log('找不到', typeAContent, id);
          }
        }
      });
    }

    if(B4.length === 1) {
      let idArray = [];
      idArray.push(B4[0]['id1']);
      idArray.push(B4[0]['id2']);
      idArray.push(B4[0]['id3']);
      idArray.push(B4[0]['id4']);
      idArray.forEach((id) => {
        if(id != '0') {
          // 查找该id的坐标
          let data = mobao1List.filter((o) => o.id == id)[0];
          if(data) {
            conditionsB.push({
              x: parseInt(data.x100) / 100,
              y: parseInt(data.y100) / 100,
              fullName: data.fullName
            });
          } else {
            console.log('找不到', typeBContent, id);
          }
        }
      });
    }

    let mobaoRecord = {
      mobaoName,
      des,
      time, weather,
      roleLevel: parseInt(roleLevel), craftLevel: parseInt(craftLevel),
      paperType: paperType == '40103052' ? '澄心纸' : '薛涛笺',
      paperNum: parseInt(paper), shulian: parseInt(shulian),
      xiuwei: parseInt(xiuwei),
      suiyin: Math.floor((parseInt(suiyin256) - 1) / 256),
      conditionGroups: [
        {
          type: typeAName,
          totalContent: typeAContent,
          conditions: conditionsA
        },
        {
          type: typeBName,
          totalContent: typeBContent,
          conditions: conditionsB
        }
      ]
    };

    let mapIdStr = mapIdMap[mapId];
    if(!result[mapIdStr])
      result[mapIdStr] = [];

    result[mapIdStr].push(mobaoRecord);

    // 保存
    fs.writeFile(`./output/mobao.json`, JSON.stringify(result, null, 4) , function(err) {
      if(err) {
        console.log(err);
      }
    });
  });
}


// 注意
/*
{
  "x": 2341.00,
  "y": 3883.00,
  "fullName": "拾趣：听雨密宝"
},
 */