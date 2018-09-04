
// 读取out.json，处理
const affix = require('./output/out.json');

console.log(affix);

// 分类型，每个类型不同不为的数据，每一列是每一个部位
const posMap = {
  ZhuWuQi: '主武器',
  FuWuQi: '副武器',
  AnQi: '暗器',
  ShouZhuo: '手镯',
  JieZhi: '戒指',
  XiangLian: '项链',
  TouShi: '头饰',
  HuWan: '护腕',
  ShangYi: '上衣',
  NeiChen: '内衬',
  YaoDai: '衣带',
  XieZi: '下装',
};

const affixTypeList = [
  '淬力',
  '益气',
  '慧观',
  '开碑',
  '含锋',
  '无漏',
  '盾拒',
  '项王',
  '武圣',
  '黄巾',
  '诸葛',
  '聚神',
  '秦皇',
  '彭祖',
  '飞将',
  '纳敏',
  '倒海',
  '厚德',
  '常山',
  '子房',
  '易水',
  '淮南',
  '赵客',
  '养髓',
  '蓄雷',
  '超诣',
  '青莲',
  '柔缠',
  '愚公',
  '龙城',
  '旷息',
];

let map = {};
let resultMap = {};

Object.keys(affix).map((posKey) => {
  Object.keys(affix[posKey]).map((affixIndex) => {
    Object.keys(affix[posKey][affixIndex]).map((affixType) => {
      let list = affix[posKey][affixIndex][affixType];
      map[affixType] = list[Object.keys(list)[0]].desc;

      // 根据词缀类型选择result


      //
    });
  });
});

console.log(map);