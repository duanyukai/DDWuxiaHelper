const Long = require('long');
const csv = require('csvtojson');
const fs = require('fs');

// 处理装备基础数据（ID！、名称、ICON、属性、部位、精工琢磨上限）
// T套装数据
// 镇派衣服套装属性
// 分部位精工增加属性等级
// 分部位琢磨增加属性百分比
// 珑铸数据（有了）
// 词缀数据（有了）

let imgSrcPath = 'E:\\Default Documents\\项目-活动-竞赛\\天涯明月刀\\00.各种助手\\94.SFC解包重打包\\PySFCExtractor\\output\\imagesets_1201\\';
let imgDesPath = './img_output/';

let files = [
  'ZhuWuQi', 'FuWuQi' ,'AnQi',
  'JieZhi', 'ShouZhuo' ,'XiangLian',
  'TouShi', 'ShangYi' ,'NeiChen', 'HuWan', 'YaoDai', 'XieZi'
];

let promises = files.map((key) => {
  return csv({checkType: true}).fromFile(`./input20190126/equip/EquipmentTable${key}.csv`);
});

let preservedPropsMap = {
  iId: 'id', enumQuality: 'quality', stItemInfo: 'name', nValueLV: 'evaluationLV', nLimitLVMin: 'limitLVMin', nLimitLVMax: 'limitLVMax', szMartialArtDemandArray: 'menpai', szExplain: 'desc', szBackground: 'bgDesc', nJiangXinValue: 'jiangxin', bEnhanceAble: 'enhanceAble', bJiangXinAble: 'jiangxinAble', bTejiAble: 'tejiAble', nEnhanceLevelMax: '???', nDurableValue: 'durable',
  nATKWaigongMin: 'wgMin', nATKWaigongMax: 'wgMax', nATKNeigongMin: 'ngMin', nATKNeigongMax: 'ngMax', nDEFWaigong: 'wf', nDEFNeigong: 'nf', nATKDingli: 'dingliATK', nDEFDingli: 'dingliDEF', nSTR: 'ld', nSPI: 'qj', nSTA: 'gg', nINS: 'dc', nDEX: 'sf', nRENJIN: 'rj', nGLI: 'gongli', nJianxin: 'zhanliOffset', nDingliMax: 'dingli', nHpMax: 'qx',
  fHitPCT: 'mz', fDodgePCT: 'gd', fCritPCT: 'hx', fCritDamage: 'hs', nWaigongAvoid: '???', nWaigongAvoidLv: 'chaizhao', nNeigongAvoid: '???', nNeigongAvoidLv: 'yushang', nWaigongAtkWeakVal: '???', nNeigongAtkWeakVal: '???', nWaigongDefWeakVal: '???', nNeigongDefWeakVal: '???', nDmgEnhanceLv: 'poshang',
  nCureEffect: 'liaoshang'/*疗伤效果*/, nRepairCost: 'repairCost', szTIPS2D: 'icon',szAvatar3D_b: 'xxx3d_str', ddCatDesc: 'catDesc', dwSetID: 'taozhuangId', eEquipType: 'equipType'
};

// 系数修正，全部按百分比值计算，前几种乘100，韧劲除以100
let newPropsCoefficient = {
  'mz': 100,
  'gd': 100,
  'hx': 100,
  'hs': 100,
  'rj': 0.01
};

Promise.all(promises).then((data) => {
  // 处理装备数据
  let result = {};
  let resultTotal = [];
  let csvResult = '';
  // 每个部位的文件
  data.forEach((list, i) => {
    let posMap = {};
    list.forEach((equip, j) => {
      let newEquip = {};
      // 如果是第一行，额外处理一下表头，i也得等于0，只要一个头就够了
      if(j === 0 && i === 0) {
        Object.keys(preservedPropsMap).forEach((origin) => {
          let newProp = preservedPropsMap[origin];
          if(newProp !== '???') {
            csvResult += `${newProp},`;
          }
        });
        // 行末增加类别
        csvResult += 'equipPos';
        csvResult += '\n';
      }

      // 根据对照表替换数据
      Object.keys(preservedPropsMap).forEach((origin) => {
        // 处理json对象的
        let newProp = preservedPropsMap[origin];
        if(newProp === 'menpai') {
          // 处理门派数据，去掉数组  todo 混乱了
          // newEquip[newProp] = equip[origin][0];
          newEquip[newProp] = equip[origin];
          // csvResult += `${equip[origin][0]},`;
          csvResult += `${equip[origin]},`;
        } else if(newProp !== '???') {
          // 忽略未使用的列剩下的
          if(newPropsCoefficient.hasOwnProperty(newProp)) {
            newEquip[newProp] = parseFloat(equip[origin]) * newPropsCoefficient[newProp];
          } else {
            newEquip[newProp] = equip[origin];
          }
          // 处理csv的
          csvResult += `${newEquip[newProp]},`;
        } else {
          // 跳过
        }
      });
      newEquip['equipPos'] = files[i];
      posMap[equip['iId']] = newEquip;
      resultTotal.push(newEquip); // 保存到总的，下面查表用
      // 行末增加类别
      csvResult += files[i];
      csvResult += '\n';

      // 处理图片提取，拷贝图片到img_output todo
      let filename = newEquip['icon'];

      let hash = getHash(`DATA\\IMAGESETS\\ICONS\\ITEMTIPSICON\\${filename}.TGA`);
      let fullPath = `${imgSrcPath}${hash}.tga`;
      if(fs.existsSync(fullPath)) {
        // todo 复制图片(仅新图片存在时)
        let newPath = `${imgDesPath}${filename}.tga`;
        if(!fs.existsSync(newPath)) {
          fs.createReadStream(fullPath).pipe(fs.createWriteStream(newPath));
          console.log('新文件', filename);
        }
      } else {
        console.log('文件不存在：', filename, hash);
      }

    });

    result[files[i]] = posMap;
  });

  // 处理套装生成，只用做pvp t1-t7，pve t1-t7即可。105品级以下的没细看，先放着吧。
  // 注意t1-t4暗器不分天泽金；t5-t7暗器分天泽金，内衬仍一个。
  // t1-t3衣服五件套是分天泽金的，t4-t7衣服是分门派的。
  // 天泽金装备与门派装分开成套就完了，t1-t3门派套只有主辅武器，t4-t7门派套是主辅武器+5件套衣服，暗器和内衬放在门派套里一起得了；天泽金套t1-t3是首饰+5件套，t4是首饰套，t5-t7是首饰+暗器套。
  // 套装结构：
  let example = [{
    name: '神威PVPT7',
    menpai: 1,
    list: [11122,11123,11136,11635]
  }];
  let menpaiSetResult = [];
  let tianzejinSetResult = [];
  // 根据品级生成：
  let pjTier = [135, 130, 125, 120, 115, 110, 105, 100];  // t8 - t1，115品多了另类雪鸦套？和废弃的暗器内衬泽兰金刚；110品的pve衣服不分门派分天泽金，暗器内衬多废弃泽金；105品依旧暗内废泽金；
  let pjZhenPai = [142, 137, 132, 127, 122]; // 4,3,2,1级镇派，127品有额外衣服和首饰散件，122品有额外清音厉魄套
  let pjSanjian = [127, 122, 117, 112]; // 117品雪鸦通明套，112伏龙凤雏套，todo 禁夜
  // 其他：109品前缀伏龙凤雏套+pve散件（移花的压根没做，废弃了）；107品乱世孤魂套+pve废弃散件；
  // 门派对应： -1：所有，0：真武，1：太白，2：神威，3：丐帮，4：唐门，5：五毒，6：无（少林？），7：天香，8：神刀，9：移花
  let menpaiMap = { '-1': '所有', 0: '真武', 1: '太白', 2: '神威', 3: '丐帮', 4: '唐门', 5: '五毒', 6: '无（少林？）', 7: '天香', 8: '神刀', 9: '移花'};
  pjTier.forEach((pinji, i) => {
    // 处理门派套
    [0, 1, 2, 3, 4, 5, 7, 8, 9].forEach((menpaiId) => {
      // 先处理PVP，每个品级的门派筛选后，补充暗器首饰内衬6件套
      let pvpSet = resultTotal.filter((equip) =>
        equip.menpai === menpaiId && equip.evaluationLV === pinji && equip.equipType === 2 // pvp
      ).concat(
        resultTotal.filter((equip) =>
          equip.evaluationLV === pinji && equip.equipType === 2 && ['AnQi', 'ShouZhuo', 'XiangLian', 'JieZhi', 'NeiChen'].includes(equip.equipPos)
        )
      );
      menpaiSetResult.push({
        id: menpaiSetResult.length,
        name: `${menpaiMap[menpaiId]}PVP T${8-i}套装+通用暗器首饰全套`,
        equipType: 2,
        menpaiId: menpaiId,
        list: pvpSet.map((equip) => equip.id)
      });

      // 处理门派的PVE
      let pveSet = resultTotal.filter((equip) =>
        equip.menpai === menpaiId && equip.evaluationLV === pinji && equip.equipType === 1 // pve
      );
      let addedPveSet = [];
      let tongyongDesc = '';
      if(pinji <= 110) {
        // t1-t3的只有主辅武器，补充暗器、内衬
        addedPveSet = resultTotal.filter((equip) =>
          equip.evaluationLV === pinji && equip.equipType === 1 && ['AnQi', 'NeiChen'].includes(equip.equipPos)  && !['天火', '泽兰', '金刚'].includes(equip.name.slice(0,2))
        );
        tongyongDesc = '主辅武+通用暗器、内衬';
      } else if(pinji <= 115) {
        // t4有了装备2件，衣服5件套，补充暗器内衬
        addedPveSet = resultTotal.filter((equip) =>
          equip.evaluationLV === pinji && equip.equipType === 1 && ['AnQi', 'NeiChen'].includes(equip.equipPos) && !['天火', '泽兰', '金刚'].includes(equip.name.slice(0,2))
        );
        tongyongDesc = '主辅武、衣服5件套+通用暗器、内衬';
      } else {
        // t5，仅补充内衬
        addedPveSet = resultTotal.filter((equip) =>
          equip.evaluationLV === pinji && equip.equipType === 1 && ['NeiChen'].includes(equip.equipPos) && !['天火', '泽兰', '金刚'].includes(equip.name.slice(0,2))
        );
        tongyongDesc = '主辅武、衣服5件套+通用内衬';

      }
      pveSet = pveSet.concat(addedPveSet);

      menpaiSetResult.push({
        id: menpaiSetResult.length,
        name: `${menpaiMap[menpaiId]}PVE T${8-i}${tongyongDesc}`,
        equipType: 1,
        menpaiId: menpaiId,
        list: pveSet.map((equip) => equip.id)
      });

      // 处理天泽金套，白名单模式（除掉没用的部位）
      ['天火', '泽兰', '金刚'].forEach((tzjStr) => {
        let tzjSet;
        if(pinji <= 110) {
          // t1-t3 首饰4件套、衣服5件套
          tzjSet = resultTotal.filter((equip) =>
            equip.name.startsWith(tzjStr) && equip.evaluationLV === pinji && equip.equipType === 1 && ['ShouZhuo', 'XiangLian', 'JieZhi', 'TouShi', 'ShangYi', 'YaoDai', 'XieZi', 'HuWan'].includes(equip.equipPos)
          );
        } else if(pinji <= 115) {
          // t4 首饰4件套
          tzjSet = resultTotal.filter((equip) =>
            equip.name.startsWith(tzjStr) && equip.evaluationLV === pinji && equip.equipType === 1 && ['ShouZhuo', 'XiangLian', 'JieZhi'].includes(equip.equipPos)
          );
        } else {
          // t5-t8 首饰4件套+暗器
          tzjSet = resultTotal.filter((equip) =>
            equip.name.startsWith(tzjStr) && equip.evaluationLV === pinji && equip.equipType === 1 && ['ShouZhuo', 'XiangLian', 'JieZhi', 'AnQi'].includes(equip.equipPos)
          );
        }
        tianzejinSetResult.push({
          id: tianzejinSetResult.length,
          name: `通用PVE T${8-i} ${tzjStr}套装`,
          equipType: 1,
          type: tzjStr,
          list: tzjSet.map((equip) => equip.id)
        });
      });



    });


  });


  fs.writeFileSync('./output/equip.json', JSON.stringify(result, null, 4));
  fs.writeFileSync('./output/equip.csv', csvResult);

  fs.writeFileSync('./output/menpai_set.json', JSON.stringify(menpaiSetResult, null, 4));
  fs.writeFileSync('./output/tzj_set.json', JSON.stringify(tianzejinSetResult, null, 4));

});



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