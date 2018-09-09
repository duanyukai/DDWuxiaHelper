const csv = require('csvtojson');
const fs = require('fs');

let file = fs.readFileSync('./input/taozhuang/EquipSetTable.csv', 'utf8');
file = file.replace(/[\[\]]/g, '');

let files = [
  './input/taozhuang/EquipSetTable.csv',
  './input/taozhuang/EquipAdditionalTableTaoZhuang.csv'
];

let promises = files.map((filename) => {
  let file = fs.readFileSync(filename, 'utf8');
  file = file.replace(/[\[\]]/g, '');
  return csv({checkType: true}).fromString(file);
});

function pick(obj, keysMap, coefficient) {
  return Object.keys(keysMap).map(k => k in obj ? {
    [keysMap[k]]: typeof obj[k] === 'number' ? (obj[k] * (coefficient[k] || 1)) : obj[k]
  } : {})
    .reduce((res, o) => Object.assign(res, o), {});
}

Promise.all(promises).then((data) => {
  let taozhuangList = data[0];
  let propList = data[1];

  // 暂时只最多取5件套，2种属性
  let result = taozhuangList.map(({iId, stEquipSetInfo, szTypeName, SetGroupID, SetLevel, szEquips1Array,szEquips2Array,szEquips3Array,szEquips4Array,szEquips5Array, nCond_1, Property_1, nCond_2, Property_2}) => {
    // 查找Property_1&2属性
    let p1 = propList.filter((row) => row.id === Property_1)[0];
    let p2 = propList.filter((row) => row.id === Property_2)[0];
    let preservedMap = {
      id: 'id', name: 'name',
      wg: 'wg', ng: 'ng',
      ld: 'ld', qj: 'qj', gg: 'gg', dc: 'dc', sf: 'sf',
      qx: 'qx', mz: 'mz', hx: 'hx', hs: 'hs',
      poshang: 'poshang', propDes: 'propDes'
    };
    let newPropCoefficient = {
      mz: 100,
      hx: 100,
      hs: 100
    };
    if(p1) {
      p1 = pick(p1, preservedMap, newPropCoefficient);
    } else {
      p1 = {};
    }
    if(p2) {
      p2 = pick(p2, preservedMap, newPropCoefficient);
    } else {
      p2 = {};
    }
    let property;
    if(nCond_2) {
      property = {
        [nCond_1]: p1,
        [nCond_2]: p2
      };
    } else {
      property = {
        [nCond_1]: p1
      };
    }

    let eM = function (str) {
      if(str)
        return ('' + str).split('$$').map(parseFloat);
      else
        return null;
    };

    return {
      id: iId,
      name: stEquipSetInfo,
      typeName: szTypeName,
      groupId: SetGroupID,
      level: SetLevel,
      e1: eM(szEquips1Array),
      e2: eM(szEquips2Array),
      e3: eM(szEquips3Array),
      e4: eM(szEquips4Array),
      e5: eM(szEquips5Array),
      property: property
    };
  }).reduce((res, row) => {
    return Object.assign(res, {
      [row.id]: row
    });
  }, {});

  fs.writeFileSync('./output/taozhuang.json', JSON.stringify(result, null, 4));
});