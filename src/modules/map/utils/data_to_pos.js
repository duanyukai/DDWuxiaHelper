export function dataToPosList(type, data, mapId) {
  switch(type) {
    // 墨宝
    case 'mobao':
      let mobaoList = [];
      if(data['positions'][mapId]) {
        data['positions'][mapId].forEach((mobao) => {
          // 每个地图的数据
          return mobao.conditionGroups.forEach((conditionGroup) => {
            conditionGroup.conditions.forEach(({x, y, fullName}) => {
              mobaoList.push({
                x, y,
                name: fullName.split('：')[1],
                icon: 0,
                data: {
                  conditionGroupType: conditionGroup.type,
                  conditionGroupDes: conditionGroup.totalContent,
                  mobaoName: mobao.mobaoName,
                  des: mobao.des,
                  time: mobao.time,
                  weather: mobao.weather,
                  roleLevel: mobao.roleLevel,
                  craftLevel: mobao.craftLevel,
                  paperType: mobao.paperType,
                  paperNum: mobao.paperNum,
                  shulian: mobao.shulian,
                  xiuwei: mobao.xiuwei,
                  suiyin: mobao.suiyin,
                  // 可以添加互相引用
                }
              });
            });
          });
        });
      }
      return mobaoList;
    // 家园
    case 'house':
      let houseList = [];
      if(data['positions'][mapId]) {
        data['positions'][mapId].forEach(({size, x, y, name, des}) => {
          houseList.push({
            x, y,
            name,
            icon: size - 1,
            data: {
              // name,
              // x, y,
              des
            }
          });
        });
      }
      return houseList;
    // 航海图鉴
    case 'sea_collect':
      let collectList = [];
      if(data['positions'][mapId]) {
        data['positions'][mapId].forEach(({x, y, name, preDes, afterDes, type, star, neededSeaLevel, neededInvest, jzxPoint, songqian}) => {
          collectList.push({
            x, y,
            name,
            icon: 0,
            data: {
              des: afterDes,
              preDes, afterDes, type, star, neededSeaLevel, neededInvest, jzxPoint, songqian
            }
          });
        });
      }
      return collectList;
    // 海河州宝箱
    case 'hhz_baoxiang':
      if(mapId === 'HHZ') {
        return data['positions']['HHZ'].map(({name, x, y}) => {
          return {
            x, y, name, icon: 0
          };
        });
      } else {
        return [];
      }
    // 帮战物资
    case 'hhz_wuzi':
      if(mapId === 'HHZ') {
        return data['positions']['HHZ'].map(({name, x, y}) => {
          return {
            x, y, name, icon: 0
          };
        });
      } else {
        return [];
      }
    // 一代宗师
    case 'dataosha':
      if(mapId === 'YDZS') {
        return data['positions']['YDZS'].map(({name, x, y, icon}) => {
          return {
            x, y, name, icon
          };
        });
      } else {
        return [];
      }
    default:
      return [];
  }
}