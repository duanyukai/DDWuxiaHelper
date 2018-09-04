const csv = require('csvtojson');
const fs = require('fs');

let slotList =[];

csv().fromFile('./slot.csv')
  .on('json',(jsonObj)=>{ slotList.push(jsonObj); })
  .on('done',(error)=> {
    gen();
  });

function gen() {
  let slotData = {};
  let mapMap = {
    '杭州': 'HZ',
    '江南': 'JN',
    '东越': 'DY',
    '九华': 'JH',
    '徐海': 'XH',
    '开封': 'KF',
    '秦川': 'QC',
    '燕云': 'YY',
    '巴蜀': 'BS',
    '襄州': 'XZ',
    '荆湖': 'JINGH',
    '云滇': 'YD'
  };
  slotList.forEach(({houseId,size,x,y,z,fee,name,community,des}) => {
    let mapName = name.substring(0,2);
    let mapId = mapMap[mapName];
    if(!slotData.hasOwnProperty(mapId))
      slotData[mapId] = [];
    slotData[mapId].push({
      houseId: parseInt(houseId),
      size: parseInt(size),
      x: parseFloat(x) / 100,
      y: parseFloat(y) / 100,
      z: parseFloat(z) / 100,
      name: name.substring(3),
      community,
      des
    });
  });

  fs.writeFile(`./output/house_slot.json`, JSON.stringify(slotData, null, 4) , function(err) {
    if(err) {
      console.log(err);
    }
  });
}