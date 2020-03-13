const csv = require('csvtojson');
const fs = require('fs');

let fileList = ['area', 'point'];

let promises = fileList.map((key) => {
  let data = fs.readFileSync(`./input/${key}.csv`);
  return csv({checkType: true}).fromString(data.toString());
});

Promise.all(promises).then(gen);

function gen(lists) {
  let areaList = lists[0];
  let pointList = lists[1];

  let result = {
    'icons': [
      {type: 'text', content: '糯', borderColor: '#FF0000'},
      {type: 'text', content: '牛', borderColor: '#FF0000'},
      {type: 'text', content: '排', borderColor: '#FF0000'},
      {type: 'text', content: '菇', borderColor: '#FF0000'},
      {type: 'text', content: '冬', borderColor: '#FF0000'},
      {type: 'text', content: '笋', borderColor: '#FF0000'},
      {type: 'text', content: '菜', borderColor: '#FF0000'},
      {type: 'text', content: '豉', borderColor: '#FF0000'},
      {type: 'text', content: '果', borderColor: '#FF0000'},
      {type: 'text', content: '茶', borderColor: '#FF0000'},
      {type: 'text', content: '芋', borderColor: '#FF0000'},
      {type: 'text', content: '菇', borderColor: '#FF0000'},
      {type: 'text', content: '笋', borderColor: '#FF0000'},
      {type: 'text', content: '菜', borderColor: '#FF0000'},
      {type: 'text', content: '薯', borderColor: '#FF0000'},
      {type: 'text', content: '货', borderColor: '#FF0000'},
      {type: 'text', content: '补', borderColor: '#FF0000'},
      {type: 'text', content: '面', borderColor: '#FF0000'},
      {type: 'text', content: '调', borderColor: '#FF0000'},
    ],
    'positions': {}
  };

  let positions = {};

  let cityMap = {
    '001JH': 'JH', '002DY': 'DY', '003HX': 'JINGH',
    '004YY': 'YY', '005BS': 'BS', '006JJ': 'YD',
    '007ZW': 'XZ', '009GZ': 'QC', '010HZ': 'HZ',
    '011JN': 'JN', '012KF': 'KF', '013XH': 'XH', '015YH': 'YH',

    '21HHZ': 'HHZ'
  };

  areaList.forEach(({map, mapId, areaId, x, y, z, range, width, height, type}) => {
    let city = cityMap[map];
    if (!positions.hasOwnProperty(city))
      positions[city] = [];
    let t = '';
    switch (type) {
    case 'AREA_SHAPE_CIRCLE':
      t = 'circle';
      break;
    case 'AREA_SHAPE_RECTANGLE':
      t = 'rect';
      break;
    }
    positions[city].push({
      type: t,
      mapId,
      areaId,
      x, y, z, range, width, height
    });
  });

  let nameMap = {
    '一袋糯米': 0,
    '一袋牛肉': 1,
    '一袋排骨': 2,
    '一袋香菇': 3,
    '一袋冬瓜': 4,
    '一袋竹笋': 5,
    '一袋青菜': 6,
    '一袋豆豉': 7,
    '一袋鲜果': 8,
    '一袋茶叶': 9,
    '芋头': 10,
    '香菇': 11,
    '竹笋': 12,
    '青菜': 13,
    '土豆': 14,
    '沉没的货物': 15,
    '遗落的补给物资': 16,
    '一袋面粉': 17,
    '一袋调料': 18
  };

  pointList.forEach(({map, itemName, x, y}) => {
    let city = cityMap[map];
    if (!positions.hasOwnProperty(city))
      positions[city] = [];
    positions[city].push({
      type: 'point',
      icon: nameMap[itemName],
      name: itemName, x, y
    });
  });

  result.positions = positions;

  fs.writeFile('./output/cook.json', JSON.stringify(result, null, 4) , function(err) {
    if(err) {
      console.log(err);
    }
  });
}