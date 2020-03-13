const csv = require('csvtojson');
const fs = require('fs');

let fileList = ['CookBookTable', 'CookMaterialTable', 'ItemTable_Retail'];

let promises = fileList.map((key) => {
  let data = fs.readFileSync(`./input/${key}.csv`);
  return csv({checkType: true}).fromString(data.toString());
});

Promise.all(promises).then(gen);

function gen(lists) {
  let bookList = lists[0];
  let materialList = lists[1];
  let itemList = lists[2];

  let bookResult = [];
  let materialResult = [];

  bookList.forEach(({iRecipeId,szRecipeName,szRecipeDescInf,enRecipeType,map,iRecipeLevel,iUnlockProf,shulianCount,enMaterialUseTypeArray,iMaterialIDArray,iMaterialNumArray,iMainFoodLimit,iMeatLimit,iVegetableLimit,iFishLimit,iAquaticLimit,iEggLimit,iFruitLimit,iSpecialLimit,iCostVitality,iProductId,iProductNum,fCriticalRate,iCriticalProductId,iCriticalProductNum,z1}) => {

    // 查询属性与图标
    let p1 = itemList.find((i) => i.iId === iProductId);

    // 查询暴击产物描述、属性与图标
    let p2 = null;
    if (iCriticalProductId !== 0)
      p2 = itemList.find((i) => i.iId === iCriticalProductId);

    bookResult.push( {
      productId: iProductId,
      name: szRecipeName,
      des: szRecipeDescInf.replace(/\\n/g, '<br>').replace(/(<br>\s*)+$/, ''),
      propDes: p1.szExplain.replace(/\\n/g, '<br>').replace(/(<br>\s*)+$/, ''),
      icon: p1.szTIPS2D.replace(/_64$/, '_128'),
      map: map,
      level: iRecipeLevel,
      unlockLevel: iUnlockProf,
      shulianCount: shulianCount,
      materialTypes: enMaterialUseTypeArray.split('$$').map(parseFloat),
      materials: iMaterialIDArray.trim().split('$$').map(parseFloat),
      limits: [iMainFoodLimit,iMeatLimit,iVegetableLimit,iFishLimit,iAquaticLimit,iEggLimit,iFruitLimit,iSpecialLimit],
      huoli: iCostVitality,
      criticalName: p2 === null ? '': p2.stItemInfo,
      criticalRate: fCriticalRate,
      criticalProductId: iCriticalProductId,
      criticalDes: p2 === null ? '': p2.szBackground.replace(/\\n/g, '<br>').replace(/(<br>\s*)+$/, ''),
      criticalPropDes: p2 === null ? '': p2.szExplain.replace(/\\n/g, '<br>').replace(/(<br>\s*)+$/, ''),
      criticalIcon: p2 === null ? '': p2.szTIPS2D.replace(/_64$/, '_128').replace(/(<br>\s*)+$/, ''),
      recipeId: iRecipeId
    },);
  });

  // 写入文件
  fs.writeFileSync('./output4web/cookbook.json', JSON.stringify(bookResult, null, 4));

  materialList.forEach(({iMaterialID, szMaterialName, enMaterialType, iMaterialTypeValue, szDescription, iUnlockLevel, iUnlockTalent, iUnlockTalentLevel, szSourceDesc, iSttID}) => {

    // 获取图标
    let mItem = itemList.find((i) => i.iId === iMaterialID);

    materialResult.push({
      materialId: iMaterialID,
      name: szMaterialName,
      type: enMaterialType,
      des: szDescription.replace(/\\n/g, '<br>').replace(/(<br>\s*)+$/, ''),
      level: iUnlockLevel,
      source: szSourceDesc.replace(/\\n/g, '<br>').replace(/(<br>\s*)+$/, ''),
      icon: mItem.szTIPS2D.replace(/_64$/, '_128')
    });

    // 写入文件
    fs.writeFileSync('./output4web/material.json', JSON.stringify(materialResult, null, 4));
  });
}


// 网页用的json的模板，食材另起一个表即可
let demo = [
  {
    recipeId: 1,
    productId: 10001100,
    name: '',
    des: '',
    propDes: '',
    icon: '',
    map: '',
    level: '',
    unlockLevel: '',
    shulianCount: 5,
    materialTypes: [0, 0, 0, 0],
    materials: [1001, 1002, 1003, 1004],
    limits: [0,0,0,0,0,0,0,0],   // iMainFoodLimit,iMeatLimit,iVegetableLimit,iFishLimit,iAquaticLimit,iEggLimit,iFruitLimit,iSpecialLimit
    huoli: 130,
    criticalRate: 0.07,
    criticalProductId: 1000111
  },
];

let material = [
  {
    materialId: 1,
    name: '青菜',
    type: 5,
    des: '好吃',
    level: 6,
    source: '九华',
    icon: 'icon_128'
  }
];