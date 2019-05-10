const Long = require('long');
const csv = require('csvtojson');
const fs = require('fs');

let imgSrcPath = '/mnt/dyk/Documents/Default Documents/项目-活动-竞赛/天涯明月刀/00.各种助手/94.SFC解包重打包/PySFCExtractor/output/ImageSetsMixed/';
let imgDesPath = './img_output/';

let files = [
  'FashionTable.csv', 'FashionSetTable.csv', 'EquipmentTableWaiZhuang.csv', 'AchievementRequestTable_glamour.csv', 'AchievementTable_glamour.csv', 'EquipmentTableZuoJi.csv',
];

let promises = files.map((key) => {
  let data = fs.readFileSync(`./input/${key}`);
  return csv({checkType: true}).fromString(data.toString().replace(/[\[\]]/g, ''));  // todo ???
});

let fashionTable, setTable, itemTable, achiReqTable, achiTable;

Promise.all(promises).then(gen);

function gen(data) {
  fashionTable = data[0];
  setTable = data[1];
  itemTable = data[2];
  achiReqTable = data[3];
  achiTable = data[4];
  // 新增坐骑
  itemTable = itemTable.concat(data[5]);

  // todo 是否可以染色

  let partRes = {};
  let setRes = {};
  let glamourRes = {};
  let dyeRes = {};
  let dyesumRes = {};


  // 以主表开始遍历
  fashionTable.forEach(part => {
    // 查item表提数据
    let item = itemTable.filter(o => o.iId === part.itemId)[0];
    // console.log(part.itemId, item.stItemInfo);
    // 反查完成的成就小id
    let achiReqList = achiReqTable.filter(o => o.fashionId === part.fashionId);  // todo 有空的

    // todo 保存6464小icon
    let hash = getHash(`DATA\\IMAGESETS\\ICONS\\ITEMTIPSICON\\${item.szTIPS2D}.TGA`);
    let fullPath = `${imgSrcPath}${hash}.tga`;
    if(fs.existsSync(fullPath)) {
      fs.createReadStream(fullPath).pipe(fs.createWriteStream(`${imgDesPath}${item.szTIPS2D}.tga`));
    } else {
      console.log('文件不存在：', item.szTIPS2D, hash);
    }


    partRes[part.fashionId] = {
      pos: part.position,  // 主表
      suiyin: part.suiyin,  // 主表
      weight: part.weight,  // 主表
      itemId: part.itemId, // 主表
      equipData: {
        name: item.stItemInfo,
        gender: (item.enumSexDemandArray + '').replace(/[\[\] ]/g, '').split('$$').map(parseFloat),
        menpai: item.JobDemandArray[0],  // todo UseCondition 还分门派！
        // 身份、盟会职务不关键，全部显示
        explain: item.szExplain,
        des: item.szBackground,
        icon: item.szTIPS2D,  // icon是只有男的 todo 不是！男女都有！
        type: item.ddCatDesc,
      },
      achiId: achiReqList.length === 1 ? achiReqList[0].achievementId : null,  // 反查achievement request表，收集了该物品可以达成的成就小Id
    };
  });

  // 构造套装表
  setTable.forEach(set => {
    // todo 保存三体型卡片
    [set.iconM, set.iconF, set.iconZ, set.cardM, set.cardF, set.cardZ].forEach(filename => {
      let hash = getHash(`DATA\\IMAGESETS\\ICONS\\FASHION\\${filename}.TGA`);
      let fullPath = `${imgSrcPath}${hash}.tga`;
      if(fs.existsSync(fullPath)) {
        fs.createReadStream(fullPath).pipe(fs.createWriteStream(`${imgDesPath}${filename}.tga`));
      } else {
        console.log('文件不存在：', filename, hash);
      }
    });
    // 保存数据
    setRes[set.setId] = {
      name: set.setName,
      idList: (set.idList + '').replace(/[\[\] ]/g, '').split('$$').map(parseFloat),
      origin: set.origin,  // 在表最右边
      originDes: set.originDes,
      card: [set.cardM, set.cardF, set.cardZ],
      weight: set.weight,  // 排序权重，最右边
    };
  });

  // 构造魅力值表
  achiTable.forEach(achi => {
    // 通用属性构建
    let res = {
      name: achi.name,  //条件名称
      originDes: achi.originDes,
      type: achi.type,  // 还有累计成就之类的
      typeIcon: achi.typeIcon,  // 看需求，就是花花Icon
      meili: achi.meili,
      logic: achi.logic ? 'or' : 'and',  // 成就条件逻辑，and或者or，全部完成还是一个就行
    };

    // 特殊属性构建
    if(achi.name.startsWith('万色')) {
      // 普通染色魅力值
      // 强行找出对应套装 todo
      let setName = achi.originDes.split('：')[0];
      let set = setTable.filter(o => (o.setName + '').includes(setName))[0];  // todo shuzi id
      let base = parseInt(achi.originDes.match(/基础(\d*)/)[1]);
      let advance;

      let matchRes = achi.originDes.match(/进阶(\d*)/);
      if(matchRes)
        advance = matchRes[1];
      else
        advance = null;

      res = {
        ...res,
        // 特殊判定
        setId: set.setId,  // 用于显示
        partList: (set.idList + '').replace(/[\[\] ]/g, '').split('$$').map(parseFloat),  // 需要达成的部位，直接遍历这个表的posList检查是否符合就行，构造时查set表拿id
        // 满足特殊属性
        isSpecial: false,
        base: base,  // 基础染色的值，根据字符串识别 todo
        advance: advance,
        specialType: null,
      };
      // 保存
      dyeRes[achi.achievementId] = res;
    } else if(achi.name.startsWith('一染')) {
      // 定制染色魅力值
      // 强行找出对应套装 todo
      let setName = achi.originDes.split('：')[0];
      let set = setTable.filter(o => (o.setName + '').includes(setName))[0];  // todo shuzi id

      let type = achi.originDes.match(/点染·(.*)/)[1];

      res = {
        ...res,
        // 特殊判定
        setId: set.setId,  // 用于显示
        partList: (set.idList + '').replace(/[\[\] ]/g, '').split('$$').map(parseFloat),  // 需要达成的部位，直接遍历这个表的posList检查是否符合就行，构造时查set表拿id
        // 满足特殊属性
        isSpecial: true,
        base: null,
        advance: null,
        specialType: type,
      };
      // 保存
      dyeRes[achi.achievementId] = res;
    } else if(achi.name.startsWith('丰彩染料累计')) {
      res = {
        ...res,
        // 特殊判定
        item: '丰彩',  // 消耗的物品种类，手动构建，丰彩染料、瑶光、绿、蓝、红、金、黑、白的原名
        // 满足特殊属性
        count: achi.count,  // 程序里特殊逻辑处理
      };
      dyesumRes[achi.achievementId] = res;
    } else if(achi.name.startsWith('瑶光颜料累计')) {
      res = {
        ...res,
        // 特殊判定
        item: '瑶光',  // 消耗的物品种类，手动构建，丰彩染料、瑶光、绿、蓝、红、金、黑、白的原名
        // 满足特殊属性
        count: achi.count,  // 程序里特殊逻辑处理
      };
      dyesumRes[achi.achievementId] = res;
    } else if(achi.name.startsWith('点染')) {
      let item;
      if(achi.name.includes('蓝瓷')) item = '蓝瓷';
      else if(achi.name.includes('竹青')) item = '蓝瓷';
      else if(achi.name.includes('红烬')) item = '红烬';
      else if(achi.name.includes('金莹')) item = '金莹';
      else if(achi.name.includes('雪练')) item = '雪练';
      else if(achi.name.includes('玄夜')) item = '玄夜';

      res = {
        ...res,
        // 特殊判定
        item: item,  // 消耗的物品种类，手动构建，丰彩染料、瑶光、绿、蓝、红、金、黑、白的原名
        // 满足特殊属性
        count: achi.count,  // 程序里特殊逻辑处理
      };
      dyesumRes[achi.achievementId] = res;
    } else {
      // 普通收集类型
      // 从aId1 到aId12
      let idList = [];
      for (let i = 1; i < 12; i++) {
        if(achi['aId' + i] > 0) {
          idList.push(achi['aId' + i]);
        }
      }
      res = {
        ...res,
        // 通用成就完成表
        achiIdList: idList,  // 需求Id
      };
      glamourRes[achi.achievementId] = res;
    }

  });

  console.log('1');

  // 写入文件
  fs.writeFileSync('./output/part.json', JSON.stringify(partRes, null, 4));
  fs.writeFileSync('./output/set.json', JSON.stringify(setRes, null, 4));
  fs.writeFileSync('./output/common_glamour.json', JSON.stringify(glamourRes, null, 4));
  fs.writeFileSync('./output/dye.json', JSON.stringify(dyeRes, null, 4));
  fs.writeFileSync('./output/dye_sum.json', JSON.stringify(dyesumRes, null, 4));
}







/************************************/
/***************数据分析**************/
/************************************/

// 全部散件（Fashion主表）
let exampleParts = {
  4037: {  // 心王影冠Fashion id
    pos: 'head',  // 主表
    suiyin: 0,  // 主表
    weight: 2227,  // 主表
    itemId: 6100920, // 主表
    equipData: {
      name: '心王·影冠',
      gender: [true, true, true],
      menpai: -1,
      // 身份、盟会职务不关键，全部显示
      explain: '使用后获得“心王·影冠”外装外形',
      des: '露凝香，玉笼烟。\\n谁共我，醉明月？',
      icon: 'ICON_60_equip_Head_M_M_TY_3103',  // icon是只有男的
      type: '外装',
    },
    achiId: 24749,  // 反查achievement request表，收集了该物品可以达成的成就小Id
  }
};

// 全部套装
let exampleSets = {
  328: {  // 心王影套装id
    name: 'setName',
    idList: [4037, 4038, 4039, 4040],
    origin: 'shop',  // 在表最右边
    originDes: '商城购买获得',
    card: ['ICON_64_equip_coat_M_M_TY_3103', 'ICON_64_equip_coat_F_F_TY_3103', 'ICON_64_equip_coat_Z_Z_TY_3103'],
    weight: 309,  // 排序权重，最右边
    // dyeAchievements: {
    //
    // },  // 染色成就表
  }
};

// // 染色 todo
// let exampleDye = {
//
// };

// 魅力对应
let exampleGlamour = {
  24749: {  // 魅力条件Id
    name: '心王·影',  //条件名称
    originDes: '商城购买获得',
    type: '外装',  // 还有累计成就之类的
    typeIcon: 'Icons/Achieve/ach_xinwang.png',  // 看需求，就是花花Icon
    meili: 50,
    logic: 'and',  // 成就条件逻辑，and或者or，全部完成还是一个就行

    // 通用成就完成表
    achiIdList: [24749, 24750, 24750, 24750],  // 需求Id

  }
};

// 遍历魅力表时，特殊的：万色、一染、丰彩染料累计、瑶光颜料累计、点染××累计
// 万色、一染。读描述的冒号前的内容，找对应套装，加到染色成就表里

// 染色魅力，todo 这里假设各个时装男女需求一样
let exampleDyeGlamour = {
  23716: { // 吹雪 金
    name: '一染·浮华盛锦',
    originDes: '吹雪霓裳：点染·金莹',
    type: '定制染色',
    typeIcon: 'Icons/Achieve/ach_xinwang.png',
    meili: 100,  // 魅力值
    logic: 'and',
    // 特殊判定
    setId: 328,  // 用于现实
    posList: [4037, 4038, 4039, 4040],  // 需要达成的部位，直接遍历这个表的posList检查是否符合就行，构造时查set表拿id, todo 与achiIdList互斥
    // 满足特殊属性
    isSpecial: true,
    base: null,  // 基础染色的值，根据字符串识别 todo
    advance: null,
    specialType: 'gold',  // 定制金染
  }
};

// 染色总计魅力
let exampleDyeSumGlamour = {
  23776: {  // id
    name: '点染·玄夜累计·8',
    originDes: '累计消耗：72个点染·玄夜',
    type: '累计成就',
    typeIcon: 'Icons/Achieve/ach_xinwang.png',
    meili: 100,  // 魅力值
    logic: 'none',
    // 特殊判定
    item: 'black',  // 消耗的物品种类，手动构建，丰彩染料、瑶光、绿、蓝、红、金、黑、白
    // 满足特殊属性
    count: 100,  // 程序里特殊逻辑处理
  }
};

// 存储浏览器的数据
let storage = {
  4037: {  // 影头，单件id
    own: true,
    dyeList: [
      {
        isSpecial: 'false',
        a: 100,
        b: 100,
      },
      {
        isSpecial: 'true',
        type: 'blue'
      },
    ]
  }
};


// 每当购买、染色变化时，重新计算拥有的套装、魅力值达成（放到state里缓存吧） todo
// 按已有未有、价格排序、按分类看（直接分好）
// 小界面显示密集的已购列表（右边off on按钮）
// 小界面现实已经达成的、未达成的魅力成就


// 收藏外装、散件、特定染色、累计染色消耗


// 文件名Hash函数
function getHash(str) {
  let dwHash = new Long(0x4D2960DB, 0x1712E27F, true); // 低位，高位，无符号
  str = str.toUpperCase();
  str = str.replace(/\//g, '\\');
  for (let i = 0; i < str.length; i++) {
    dwHash = dwHash.mul(67).add(str.charCodeAt(i));
  }
  return ('0000000000000000' + dwHash.toString(16)).slice(-16);
}