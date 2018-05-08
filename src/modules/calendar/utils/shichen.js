const shichenNameList = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const shichenLengthList = [2, 3, 4, 10, 17, 10, 3, 6, 19, 14, 8, 4];
// 例子
// 144秒是一份
// 如戌时从17:36:00开始（含） 准的一匹
// console.log(new Date(new Date(2018,1,1,17,36,0).getTime() - 42 * 144 * 1000)); // 午时开始
// console.log(new Date(new Date(2018,1,1,17,36,0).getTime() - 39 * 144 * 1000)); // 午时结束（变）
// console.log(new Date(new Date(2018,1,1,17,36,0).getTime() - 14 * 144 * 1000)); // 午时结束（变）

// 第一个子时开始时间（精确到秒）
const baseTime = new Date(1970, 0, 1, 2, 4, 48);
const onePieceTime = 1000 * 144;
const oneHour = 1000 * 60 * 60;
const twoHours = 1000 * 60 * 60 * 2;
const fourHours = 1000 * 60 * 60 * 4;
export function dateToShichenId(date) {
  let miliDiff = date.getTime() - baseTime.getTime();
  let ratioInADay = miliDiff % fourHours / fourHours;
  let shichenId = 0;
  let lengthSum = 0;
  for(let i = 0; i < 12; i++) {
    lengthSum += shichenLengthList[i];
    if(lengthSum > ratioInADay * 100) {
      shichenId = i;
      break;
    }
  }
  return shichenId;
}

export function dateToShichenDetail(date) {
  let milisecDiff = date.getTime() - baseTime.getTime();
  let ratioInADay = milisecDiff % fourHours / fourHours;
  let shichenId = 0;
  let lengthSum = 0;
  let milisecBeyond = 0;
  for(let i = 0; i < 12; i++) {
    lengthSum += shichenLengthList[i];
    if(lengthSum > ratioInADay * 100) {
      milisecBeyond = (shichenLengthList[i] - (lengthSum - ratioInADay * 100)) / shichenLengthList[i] * twoHours;
      shichenId = i;
      break;
    }
  }
  let midNight = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  let gameTime = new Date(midNight.getTime() - oneHour + shichenId * twoHours + milisecBeyond);
  gameTime.setDate(date.getDate());
  return gameTime;
}

export function genShichenData(start, end) {
  let startRatio = (start.getTime() - baseTime.getTime()) % fourHours / fourHours;
  let shichenList = [];
  let lengthSum = 0;
  // 找到开始点和现实时间
  let startShichenId = 0;
  for(let i = 0; i < 12; i++) {
    if(lengthSum + shichenLengthList[i] > startRatio * 100) {
      startShichenId = i;
      break;
    }
    lengthSum += shichenLengthList[i];
  }
  let startRealTime = new Date(baseTime.getTime() +
    Math.floor((start.getTime() - baseTime.getTime()) / fourHours) * fourHours + lengthSum / 100 * fourHours);
  let currentShichenId = startShichenId;
  let realTime = new Date(startRealTime.getTime());
  // 顺序push每个时间段
  while(true) {
    shichenList.push({
      start: new Date(realTime.getTime()),
      end: new Date(realTime.getTime() + shichenLengthList[currentShichenId] / 100 * fourHours - 1000),
      shichenId: currentShichenId
    });
    realTime = new Date(realTime.getTime() + shichenLengthList[currentShichenId] / 100 * fourHours);
    currentShichenId = (currentShichenId + 1) % 12;
    if(realTime > end)
      break;
  }
  return shichenList;
}

export function shichenToColor(shichenId) {
  const colorList = [
    // '#161515', '#3F3943', '#535B71', '#639E92', '#74CB69', '#F9F566',
    // '#F9F566', '#74CB69', '#639E92', '#535B71', '#3F3943', '#161515'
    // '#000000', '#29290B', '#525217', '#7B7B22', '#A4A42E', '#CDCD39',
    // '#F7F745', '#CDCD39', '#A4A42E', '#7B7B22', '#525217', '#29290B',
    '#000000',
    '#24030A', '#490614', '#6E0A1E', '#920D28', '#B71032',
    '#DC143C',
    '#B71032', '#920D28', '#6E0A1E', '#490614', '#24030A'
  ];
  return colorList[shichenId];
}

export function getShichenName(shichenId) {
  return shichenNameList[shichenId];
}

export function genDataForRealClock() {
  let data = [];
  for(let i = 0; i < 12 * 3; i++) {
    data.push({
      name: `${shichenNameList[i % 12]}时`,
      shortName: shichenNameList[i % 12],
      value: shichenLengthList[i % 12],
      color: shichenToColor(i % 12)
    });
  }
  return {
    startAngle: - 36 / 225 * 2 * Math.PI,
    data: data
  }
}

export function genDataForGameClock() {
  let data = [];
  for(let i = 0; i < 12; i++) {
    data.push({
      name: `${shichenNameList[i]}时`,
      shortName: shichenNameList[i],
      value: 2,
      shichenId: i,
      color: shichenToColor(i)
    });
  }
  return {
    startAngle: -Math.PI / 6,
    data: data
  }
}
