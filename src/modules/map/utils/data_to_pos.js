export function dataToPosList(type, data, mapId) {
  switch(type) {
    // 墨宝
    case 'mobao':
      let mobaoList = [];
      if(data['positions'][mapId]) {
        data['positions'][mapId].forEach(({condition}) => {
          return condition.forEach(({location}) => {
            location.forEach(({name, x, y}) => {
              mobaoList.push({
                x, y,
                des: name,
                icon: 0,
                data: null
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
            des: name,
            icon: size - 1,
            data: {
              des: des
            }
          });
        });
      }
      return houseList;
    default:
      return [];
  }
}