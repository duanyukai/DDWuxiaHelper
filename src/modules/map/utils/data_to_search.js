import markerCategoryList from '../assets/json/marker_types.json';
import mapsProps from '../assets/json/maps_props.json';
import {dataToPosList} from './data_to_pos';
const mapPosPath = require.context('../assets/json/positions', true);

export function searchPos(mapId111, text) {
  // 只搜索有文本的内容
  if (text) {
    text = text.trim();
    let result = [];
    markerCategoryList.forEach(({id, name, data}) => {
      // 遍历每一类坐标
      // 获取数据
      let posData = mapPosPath('./' + data, true);
      // 遍历标注数据，使用生成后的数据
      // 遍历所有地图
      Object.keys(mapsProps).forEach(mapId => {
        dataToPosList(id, posData, mapId).forEach((posData) => {
          if (posData.name && posData.name.includes(text)) {
            result.push({
              mapId,
              mapName: mapsProps[mapId].chineseName,
              markerCategory: id, // 与创建tile保持一致，这里其实应该放在data to pos里预处理最好
              markerCategoryName: name, // 与创建tile保持一致，这里其实应该放在data to pos里预处理最好
              ...posData
            });
          }
        });
      });
    });
    console.log('搜索结果', result);
    return result;
  } else {
    return [];
  }
}