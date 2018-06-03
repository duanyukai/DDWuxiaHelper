const csv = require('csvtojson');
const fs = require('fs');

let zongshiList =[];

let entityMap = {
  20400000: "蓝装备箱",
  20400001: "蓝道具箱",
  20400002: "蓝技能箱废弃",
  20400003: "紫装备箱",
  20400004: "紫道具箱",
  20400005: "紫技能箱",
  20400006: "金装备箱",
  20400007: "金道具箱废弃",
  20400008: "金技能箱",
  20400009: "物品箱",
  20400010: "丢弃的小箱子-抛起(新)",
  20400011: "丢弃的小箱子-地面(新)",
  20400012: "丢弃的小箱子-打开(新)",
  20400013: "丢弃的小箱子-抛起(新)",
  20400014: "丢弃的小箱子-地面(新)",
  20400015: "丢弃的小箱子-打开(新)",
  20400016: "丢弃的小箱子-抛起(新)",
  20400017: "丢弃的小箱子-地面(新)",
  20400018: "丢弃的小箱子-打开(新)",


  20200001: "",
  20200002: "归玄",
  20200050: "试炼导师",
  20200100: "小灰马",
  20200101: "陷阱",
  20200102: "秘藏守护",
  20200103: "青叶驹",
  20200104: "空雪·白公子",
  20200110: "野外黄鼠狼",
  20200111: "黑尾鼠",
  20200112: "母鸡",
  20200113: "狼",
  20200114: "猫",
  20200115: "幼年赤狐",
  20200116: "野外兔子",
  20200117: "小黄鸡",
  20200118: "花花",
  20200119: "幼年灰背野猪"

};

let mapMap = {

};

csv().fromFile('./data20180522.csv')
  .on('json',(jsonObj)=>{ zongshiList.push(jsonObj); })
  .on('done',(error)=> {
    gen();
  });

function gen() {
  let zongshiData = { XH: []};
  zongshiList.forEach(({x,y,type,name,id}) => {
    // todo 直接转换
    let theName = entityMap[parseInt(name)];
    if(!theName)
      console.warn(name);
    let iconType = 0; // 0-2 蓝紫金 3：马，4：动物
    switch(type) {
      case 'MonsterPoint':
        if(theName === '小灰马' || theName === '空雪·白公子' || theName === '青叶驹') {
          iconType = 3;
        } else {
          iconType = 4;
        }
          break;
      case 'EntityPoint':
        if(theName.includes('蓝')) {
          iconType = 0;
        } else if(theName.includes('紫')) {
          iconType = 1;
        } else if(theName.includes('金')) {
          iconType = 2;
        }
        break;
    }

    zongshiData["XH"].push({
      x: parseFloat(x) / 100,
      y: parseFloat(y) / 100,
      name: theName,
      icon: iconType
    });
  });

  zongshiData["XH"].sort((a, b) => {
    let keyA = a.icon % 4, // 让动物最后
        keyB = b.icon % 4;

    if(keyA < keyB) return -1;
    if(keyA > keyB) return 1;
    return 0;
  });

  fs.writeFile(`./dataosha.json`, JSON.stringify(zongshiData, null, 4) , function(err) {
    if(err) {
      console.log(err);
    }
  });
}