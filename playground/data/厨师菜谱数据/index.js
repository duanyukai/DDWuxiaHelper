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

  let result = [];

  bookList.forEach(({iRecipeId,szRecipeName,szRecipeDescInf,enRecipeType,map,iRecipeLevel,iUnlockProf,shulianCount,enMaterialUseTypeArray,iMaterialIDArray,iMaterialNumArray,iMainFoodLimit,iMeatLimit,iVegetableLimit,iFishLimit,iAquaticLimit,iEggLimit,iFruitLimit,iSpecialLimit,iCostVitality,iProductId,iProductNum,fCriticalRate,iCriticalProductId,iCriticalProductNum,z1}) => {

    // 查询食材名称
    let mList = iMaterialIDArray.trim().split('$$').map(parseFloat).map((id) => {
      let m = materialList.find((m) => m.iMaterialID === id);
      let mItem = itemList.find((i) => i.iId === id);
      return {
        id: m.iMaterialID,
        name: m.szMaterialName,
        level: m.iUnlockLevel,
        icon: mItem.szTIPS2D.replace(/_64$/, '_128'),
        // 其他数据暂时不用
      };
    });

    // 查询属性与图标
    let p1 = itemList.find((i) => i.iId === iProductId);

    // 查询暴击产物描述、属性与图标
    let p2 = null;
    if (iCriticalProductId !== 0)
      p2 = itemList.find((i) => i.iId === iCriticalProductId);


    result.push( {
      recipeId: iRecipeId,
      productId: iProductId,
      name: szRecipeName,
      des: szRecipeDescInf.replace(/\\n/g, '<br>'),
      propDes: p1.szExplain.replace(/\\n/g, '<br>'),
      icon: p1.szTIPS2D.replace(/_64$/, '_128'),
      map: map,
      level: iRecipeLevel,
      unlockLevel: iUnlockProf,
      shulianCount: shulianCount,
      materialTypes: enMaterialUseTypeArray.split('$$').map(parseFloat),
      materials: mList,
      limits: [iMainFoodLimit,iMeatLimit,iVegetableLimit,iFishLimit,iAquaticLimit,iEggLimit,iFruitLimit,iSpecialLimit],
      huoli: iCostVitality,
      criticalName: p2 === null ? '': p2.stItemInfo,
      criticalRate: fCriticalRate,
      criticalProductId: iCriticalProductId,
      criticalDes: p2 === null ? '': p2.szBackground.replace(/\\n/g, '<br>'),
      criticalPropDes: p2 === null ? '': p2.szExplain.replace(/\\n/g, '<br>'),
      criticalIcon: p2 === null ? '': p2.szTIPS2D.replace(/_64$/, '_128')
    },);
  });


  // 写入文件
  fs.writeFileSync('./output/cookbook.json', JSON.stringify(result, null, 4));
}



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
    materials: [
      {
        id: 1001,
        name: '米',
        level: 4
      }
    ],
    limits: [0,0,0,0,0,0,0,0],   // iMainFoodLimit,iMeatLimit,iVegetableLimit,iFishLimit,iAquaticLimit,iEggLimit,iFruitLimit,iSpecialLimit
    huoli: 130,
    criticalRate: 0.07,
    criticalProductId: 1000111
  },
];