import mapsProps from '../assets/json/maps_props.json';

// 游戏内坐标转为地图图片坐标
export function gamePosToImgPos(mapId, pos) {
  let corresponds = mapsProps[mapId].correspond;
  let gw = corresponds[0].gamePosX - corresponds[1].gamePosX;
  let gh = corresponds[0].gamePosY - corresponds[1].gamePosY;
  let iw = corresponds[0].imgPosX -  corresponds[1].imgPosX;
  let ih = corresponds[0].imgPosY -  corresponds[1].imgPosY;

  let x = (pos[0] - corresponds[0].gamePosX) / gw * iw + corresponds[0].imgPosX;
  let y = (pos[1] - corresponds[0].gamePosY) / gh * ih + corresponds[0].imgPosY;

  return {x, y};
}

// 地图图片坐标转为游戏内坐标
export function imgPosToGamePos(mapId, pos) {
  let corresponds = mapsProps[mapId].correspond;
  let gw = corresponds[0].gamePosX - corresponds[1].gamePosX;
  let gh = corresponds[0].gamePosY - corresponds[1].gamePosY;
  let iw = corresponds[0].imgPosX -  corresponds[1].imgPosX;
  let ih = corresponds[0].imgPosY -  corresponds[1].imgPosY;

  let x = (pos[0] - corresponds[0].imgPosX) / iw * gw + corresponds[0].gamePosX;
  let y = (pos[1] - corresponds[0].imgPosY) / ih * gh + corresponds[0].gamePosY;

  return {x, y};
}