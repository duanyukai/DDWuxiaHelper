export function dataToPosList(type, data, mapId) {
  switch(type) {
  // 墨宝
  case 'mobao':
    let mobaoList = [];
    if(data['positions'][mapId]) {
      data['positions'][mapId].forEach((mobao, i) => {
        // 每个地图的数据
        return mobao.conditionGroups.forEach((conditionGroup, j) => {
          conditionGroup.conditions.forEach(({x, y, fullName}, k) => {
            mobaoList.push({
              id: i *10000 + j * 100 + k, // 这个id比较特殊，随意用个形式生成一下
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
      data['positions'][mapId].forEach(({size, x, y, name, des}, i) => {
        houseList.push({
          id: i,
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
      data['positions'][mapId].forEach(({x, y, name, preDes, afterDes, type, star, neededSeaLevel, neededInvest, jzxPoint, songqian}, i) => {
        collectList.push({
          id: i,
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
      return data['positions']['HHZ'].map(({name, x, y}, i) => {
        return {
          id: i,
          x, y, name, icon: 0
        };
      });
    } else {
      return [];
    }
  // 帮战物资
  case 'hhz_wuzi':
    if(mapId === 'HHZ') {
      return data['positions']['HHZ'].map(({name, x, y}, i) => {
        return {
          id: i,
          x, y, name, icon: 0
        };
      });
    } else {
      return [];
    }
  // 一代宗师
  case 'dataosha':
    if(mapId === 'YDZS') {
      return data['positions']['YDZS'].map(({name, x, y, icon}, i) => {
        return {
          id: i,
          x, y, name, icon
        };
      });
    } else {
      return [];
    }
  // 厨师食材
  case 'cook':
    let foodList = [];
    if(data['positions'][mapId]) {
      data['positions'][mapId].forEach(({type, areaId, range, icon, x, y, name, width, height}, i) => {
        foodList.push({
          id: i,
          type,
          areaId,
          range,
          width, height,
          x, y,
          name: name,
          icon,
          data: {}
        });
      });
    }
    return foodList;
  // 雅集答题
  case 'yaji':
    let yajiList = [];
    if(data['positions'][mapId]) {
      data['positions'][mapId].forEach(({name, x, y, icon, type, path}, i) => {
        yajiList.push({
          id: i,
          name, x, y, icon, type, path
        });
      });
    }
    return yajiList;
  // // 传送点
  // case 'teleport':
  //   return (data['positions'][mapId] || []);
  // // 传送点
  // case 'shiguangjianying':
  //   return (data['positions'][mapId] || []);
  // // 传送点
  // case 'hanghaitujian_all':
  //   return (data['positions'][mapId] || []);
  // // 传送点
  // case 'home_teleport':
  //   return (data['positions'][mapId] || []);
  default:
    return (data['positions'][mapId] || []).map((pos, i) => ({id: i, ...pos}));
  }
}