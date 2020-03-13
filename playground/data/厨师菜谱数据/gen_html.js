const cookbook = require('./output/cookbook.json');
const template = require('./template/template');
const fs = require('fs');

cookbook.forEach(f => {
  let result = (' ' + template).slice(1);

  function t(name, data) {
    // 写死
    result = result.replace(new RegExp('{{' + name + '}}', 'g'), data);
  }

  function levelToName(levelId) {
    switch (levelId) {
    case 0:
      return '初级';
    case 1:
      return '中级';
    case 2:
      return '高级';
    }
  }

  function materialTypeToName(typeId) {
    switch (typeId) {
    case 0:
      return '专属';
    case 1:
      return '可替代';
    case 2:
      return '推荐';
    }
  }

  function mapToName(mapId) {
    let list = ['秦川', '东越', '巴蜀', '江南', '燕云', '荆湖', '移花', '襄州', '云滇', '开封', '徐海', '其他', '普通'];
    return list[mapId];
  }

  t('name', f.name);
  t('level', levelToName(f.level));
  t('smallLevel', f.unlockLevel);
  t('icon', f.icon.toUpperCase());
  t('propDes', f.propDes);
  t('des', f.des);
  t('map', mapToName(f.map));
  t('huoli', f.huoli);
  t('shulianCount', f.shulianCount);
  t('m1t', materialTypeToName(f.materialTypes[0]));
  t('m1',     f.materials[0].name);
  t('m1l',    f.materials[0].level);
  console.log(f.materials);
  t('m1icon', f.materials[0].icon.toUpperCase());
  t('m2t', materialTypeToName(f.materialTypes[1]));
  t('m2', f.materials[1].name);
  t('m2l', f.materials[1].level);
  t('m2icon', f.materials[1].icon.toUpperCase());
  t('m3t', materialTypeToName(f.materialTypes[2]));
  t('m3', f.materials[2].name);
  t('m3l', f.materials[2].level);
  t('m3icon', f.materials[2].icon.toUpperCase());
  t('m4t', materialTypeToName(f.materialTypes[3]));
  t('m4', f.materials[3].name);
  t('m4l', f.materials[3].level);
  t('m4icon', f.materials[3].icon.toUpperCase());

  t('critName', f.criticalName);
  t('critIcon', f.criticalIcon.toUpperCase());
  t('critRate', +(f.criticalRate * 100).toFixed(2) + '%');
  t('critPropDes', f.criticalPropDes);
  t('critDes', f.criticalDes);

  t('critDisplay', f.criticalName === '' ? 'none' : '');

  t('limit1', f.limits[0]);
  t('limit2', f.limits[1]);
  t('limit3', f.limits[2]);
  t('limit4', f.limits[3]);
  t('limit5', f.limits[4]);
  t('limit6', f.limits[5]);
  t('limit7', f.limits[6]);
  t('limit8', f.limits[7]);

  // 写入文件
  fs.writeFileSync('./template/html_output/' + f.recipeId + '.html', result);
});