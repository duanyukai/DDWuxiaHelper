const csv = require('csvtojson');
const fs = require('fs');

let affixList =[];
let additionalList = [];

// let equipMap = {
//   0: '主武器',
//   1: '辅武器',
//   2: '暗器',
//   3: '头饰',
//   4: '上衣',
//   5: '护腕', // x
//   6: '腰带', // x
//   7: '下装', // x
//   8: '内衬', // x
//   9: '项链',
//   10: '戒指',
//   11: '手镯'
// };

let equipMap = {
  0: 'ZhuWuQi',
  1: 'FuWuQi',
  2: 'AnQi',
  3: 'TouShi',
  4: 'ShangYi',
  5: 'YaoDai',
  6: 'HuWan',
  7: 'NeiChen', // todo 和鞋子反了
  8: 'XieZi',
  9: 'XiangLian',
  10: 'JieZhi',
  12: 'ShouZhuo'
};


let files = [
  'AffixTable.csv', 'EquipAdditionalTableZhiZao.csv'
];

let promises = files.map((key) => {
  return csv({checkType: false}).fromFile(`./input/${key}`);  // todo 关闭类型检查
});

Promise.all(promises).then(gen);

function gen(data) {
  affixList = data[0];
  additionalList = data[1];


  let rResult = {};
  let listResult = [];

  let affixIdChosenMap = {};

  affixList.forEach((affix) => {
    // 判断装备类型
    let equipType = parseInt(affix['equipType']);
    // 名称
    let equipName = equipMap[equipType];
    // 取affixId
    let affixId = parseInt(affix['affixId']);
    let affixName = affix['affixName'];
    // todo partType，偶数为上词缀，奇数为下词缀，暂时不用了
    let isFirst = parseInt(affix['partType']) % 2 === 0;
    // 判断是否为紫薯
    let isZishu = parseInt(affix['resetQualityClient']) > 0;
    // 判断是否已经处理过该组词缀
    if(!affixIdChosenMap.hasOwnProperty(affixId)) {
      // 未处理该组词缀，如2001，表示淬力
      affixIdChosenMap[affixId] = true;
      // 读取additionIds取第一个结果即可，用于查询add表，如1001011
      let additionalId = affix['additionIds'].split('$$')[0].replace(/[\[\]]/g, '');
      console.log(additionalId);
      // 倒数第2位是起始的品级
      let startPinji = Math.floor((additionalId % 100) / 10);
      console.log('开始品级：', startPinji);
      // 移除末3位，查询additional表，得到一个列表
      let groupId =  Math.floor(parseInt(additionalId) / 1000);
      let groupList =  additionalList.filter(({affixGroup}) => {
        return affixGroup == groupId;
      });
      // 处理groupList转为map
      let groupMap = {};
      groupList.forEach(({additionalId, name, pinji2, affixGroup, color, gongliOffset, propsDesc, jiangxin}) => {
        groupMap[additionalId] = {name, pinji2, affixGroup, color, gongliOffset, propsDesc, jiangxin};
      });

      // console.log("该组数据", groupMap);
      function addData(obj, newId, objKey) {
        obj[objKey] = {
          desc: groupMap[newId].propsDesc,
          props: [],
          color: parseInt(groupMap[newId].color),
          pinji: parseInt(groupMap[newId].pinji2),
          jiangxin: parseInt(groupMap[newId].jiangxin),
          gO: parseInt(groupMap[newId].gongliOffset),
          special: groupMap[newId].name,
        };
      }

      if(!isZishu) {
        // 白薯
        // 从group里读取：
        // 上词缀：1/2-7低、中，8洗炼。
        // 下词缀：1/2-6低、中，5-6升级
        // 构造id，如9006 + 01（1级）+2（中级，升级3，洗炼4）
        if(!rResult.hasOwnProperty(equipName))
          rResult[equipName] = {'词缀一': {}, '词缀二': {}};
        if(isFirst) {
          // 上词缀 todo
          let first = {};
          for (let i = startPinji; i <= 7; i++) {
            // 低级
            let newId = groupId + '0' + i + '1';
            console.log(newId);
            addData(first, newId, i + '-1');
            // 中级
            newId = groupId + '0' + i + '2';
            console.log(newId);
            addData(first, newId, i + '-2');
          }
          // 8洗炼
          let newId = groupId + '084';
          console.log(newId);
          addData(first, newId, '8-4');

          rResult[equipName]['词缀一'][affixName] = first;
        } else {
          // 下词缀 todo，5可以标注一下稀有
          let second = {};
          for (let i = startPinji; i <= 5; i++) {
            // 低级
            let newId = groupId + '0' + i + '1';
            console.log(newId);
            addData(second, newId, i + '-1');
            newId = groupId + '0' + i + '2';
            console.log(newId);
            // 中级
            addData(second, newId, i + '-2');
          }
          // 5、6升级
          for (let i = 5; i <= 6; i++) {
            // 升级
            let newId = groupId + '0' + i + '3';
            addData(second, newId, i + '-3');
          }
          rResult[equipName]['词缀二'][affixName] = second;
        }
      } else {
        // 紫薯
        // 下词缀：4、5、6低级（分别对应9、10、11品）
        let second = {};
        for(let i = 4; i <= 6; i++) {
          // 低级
          let newId = groupId + '0' + i + '1';
          addData(second, newId, i + '-1');
        }
        rResult[equipName]['词缀二'][affixName] = second;
      }

    } else {
      // 无需处理
    }
  });

  fs.writeFile('./output/out.json', JSON.stringify(rResult, null, 4) , function(err) {
    if(err) {
      console.log(err);
    }
  });
}