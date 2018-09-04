import equipCSV from 'raw-loader!../assets/csv/equip.csv';
import Papa from 'papaparse';

let equipData = null;
let splitData = null;

function loadEquipData() {
  let t0 = performance.now();
  let parseResult = Papa.parse(equipCSV, {
    header: true,
    fastMode: true,
    skipEmptyLines: true,
    dynamicTyping: true,
    trimHeaders: true
  });
  if(!parseResult.errors.length) {
    let t1 = performance.now();
    console.log('加载时间A：', t1 - t0, 'ms');
    console.log('数据A', parseResult.data);
    let theEquipData = {};
    equipData = parseResult.data.forEach((row) => {
      theEquipData[row['id']] = row;
    });
    equipData = theEquipData;
    // 继续解析，按部位分类
    let theSplitData = {};
    parseResult.data.forEach((row) => {
      if(!theSplitData.hasOwnProperty(row['equipPos']))
        theSplitData[row['equipPos']] = {};
      theSplitData[row['equipPos']][row['id']] = row;
    });
    let t2 = performance.now();
    console.log('加载时间B：', t2 - t1, 'ms');
    console.log('数据B', theSplitData);
    splitData = theSplitData;
  } else {
    console.log(parseResult.errors);
  }
}

export function getEquipData(equipPos, id) {
  if(!equipData)
    loadEquipData();
  if(equipPos && id) {
    // 同时提供两者
    return splitData[equipPos][id];
  } else if(!equipPos && id) {
    // 仅装备id，需要遍历所有数据
    return equipData[id];
  }
  // 否则返回所有拆分数据
  return splitData;
}