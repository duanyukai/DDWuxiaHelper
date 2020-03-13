import L from 'leaflet';
import {Promise} from 'bluebird';
import ReactDOM from 'react-dom';
import mapsProps from '../assets/json/maps_props.json';
import markerCategoryList from '../assets/json/marker_types.json';
import {dataToPosList} from './data_to_pos';
import {gamePosToImgPos, imgPosToGamePos} from './pos_conv';
import {dataToPopup} from './data_to_popup';

const mapPosPath = require.context('../assets/json/positions', true);
const iconPath = require.context('../assets/imgs/icons', true);

// 绘制主要canvas瓦片图层，包含所有坐标点、范围、路径轨迹
export function createCanvasTiles(self, mapId) {
  let mapProps = mapsProps[mapId];

  // 保存引用，延迟删除用以防闪烁
  let oldMarkerCanvasLayer = self.markerCanvasLayer;
  if(self.markerCanvasLayer)
    self.lfMap.removeLayer(self.markerCanvasLayer);

  // 更新坐标canvas图层
  self.markerCanvasLayer = new L.GridLayer({
    tileSize: 1024,  // todo 图层大小
    pane: 'canvas-marker-pane'
  });

  // 创建一个瓦片绘制过程
  self.markerCanvasLayer.createTile = function(coords, done) {
    // 创建浏览画布和点击画布
    let tile = L.DomUtil.create('canvas', 'leaflet-tile');
    let hitTile = L.DomUtil.create('canvas', 'hit-tile');

    let tileSize = this.getTileSize();
    tile.width = tileSize.x; tile.height = tileSize.y;
    hitTile.width = tileSize.x; hitTile.height = tileSize.y;

    let ctx = tile.getContext('2d');
    let hitCtx = hitTile.getContext('2d');

    // 初始化hitCtx
    hitCtx.fillStyle = 'rgb(255,255,255)';
    hitCtx.fillRect(0, 0, tileSize.x, tileSize.y);

    // 该tile左上角的像素坐标（与zoom有关）
    let nwPoint = coords.scaleBy(tileSize);
    let sePoint = {
      x: nwPoint.x + tileSize.x,
      y: nwPoint.y + tileSize.y
    };
    // 放缩等级系数
    let factor = Math.pow(2, mapProps.maxZoom - coords.z);
    // 缩放至原始图片的像素坐标
    nwPoint.x *= factor; nwPoint.y *= factor;
    sePoint.x *= factor; sePoint.y *= factor;

    // 测试用
    // ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    // ctx.beginPath();ctx.moveTo(0, 0);ctx.lineTo(tileSize.x-1, 0);ctx.lineTo(tileSize.x-1, tileSize.y-1);ctx.lineTo(0, tileSize.y-1);ctx.closePath();ctx.stroke();

    // 绘制底部水印，无论tile大小，按256像素间隔绘制，tile应设置256倍数最好
    for (let i = 0; i < tileSize.x / 256; i++) {
      for (let j = 0; j < tileSize.y / 256; j++) {
        ctx.save();
        ctx.translate(128 + i * 256, 128 + j * 256);
        ctx.rotate(-Math.PI/4);
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font='14px Microsoft Yahei';
        ctx.fillText('段段天刀地图助手', 0, -10);
        ctx.fillText('wuxiatools.com', 0, 10);
        ctx.restore();
      }
    }

    // 坐标数据
    let tileData = [];  // 所有标注数据
    let drawPromises = [];
    // let markerIndex = 0;

    // 遍历所有标注数据类型，拿到所有绘制数据后，先进行排序
    markerCategoryList.forEach(({id, name, data}) => {
      let markerCategory = id;
      // 根据是否显示择情获取
      if (!self.props.showState[id].show)
        return;
      // 获取数据
      let posData = mapPosPath('./' + data, true);
      // 遍历标注数据
      dataToPosList(id, posData, mapId).forEach((posData) => {
        let xy = gamePosToImgPos(mapId, [posData.x, posData.y]);
        // 三类数据，点坐标、区域标记、路径，为了确定点击事件，全部手绘
        if (posData.type === 'circle') {
          // 圆形区域，计算面积
          // 判断是否在本tile中
          if(true) {
            let relX = (xy.x - nwPoint.x) / factor;
            let relY = (xy.y - nwPoint.y) / factor;
            let relR = posData.range / factor / 2;
            tileData.push({
              markerCategory,
              relX, relY, relR,
              imgX: xy.x, imgY: xy.y,
              posData: posData,
              sort: posData.range
            });
          }

        } else if (posData.type === 'rect') {
          // 矩形区域，计算面积
          // 判断是否在本tile中 todo
          let relX = (xy.x - nwPoint.x) / factor;
          let relY = (xy.y - nwPoint.y) / factor;
          tileData.push({
            markerCategory,
            relX, relY,
            imgX: xy.x, imgY: xy.y,
            posData: posData,
            sort: 2
          });
        } else if (posData.type === 'path') {
          // 路径，计算长度
          let relX = (xy.x - nwPoint.x) / factor;
          let relY = (xy.y - nwPoint.y) / factor;
          tileData.push({
            markerCategory,
            relX, relY,
            imgX: xy.x, imgY: xy.y,
            posData: posData,
            sort: 2
          });
        } else {
          // 点，
          // 判断是否在本tile中，以实际点的位置，上下左右溢出75、20
          if(xy.x >= nwPoint.x - 75 && xy.x <= sePoint.x + 75 && xy.y >= nwPoint.y - 75 && xy.y <= sePoint.y + 75) {
            let relX = (xy.x - nwPoint.x) / factor;
            let relY = (xy.y - nwPoint.y) / factor;
            tileData.push({
              markerCategory,
              relX, relY,
              imgX: xy.x, imgY: xy.y,
              posData: posData,
              sort: 1
            });
          }
        }
      });
    });

    // 排序绘制顺序 todo
    tileData = tileData.sort((a, b) => {
      return b.sort - a.sort;
    });

    // 准备所有icon
    let allIconPromises = {};
    markerCategoryList.forEach(({id, name, data}) => {
      let markerCategory = id;
      // 根据是否显示择情获取
      if (!self.props.showState[id].show)
        return;
      // 获取数据
      let posData = mapPosPath('./' + data, true);
      // 获取所有需要的icon
      allIconPromises[markerCategory] = getIcons(posData); // promise.all
    });

    // 遍历排序好的绘制数据，进行绘制
    Promise.props(allIconPromises).then(allIcons => {
      for (let markerIndex = 0; markerIndex < tileData.length; markerIndex++) {
        let mark = tileData[markerIndex];
        if (mark.posData.type === 'circle') {
          // 圆形区域
          // 判断是否渲染起点坐标

          // 绘制路径
          ctx.beginPath();
          ctx.arc(mark.relX, mark.relY, mark.relR, 0, 2 * Math.PI);
          ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
          ctx.fill();
          ctx.lineWidth = 3;
          ctx.strokeStyle = '#003300';
          ctx.stroke();


        } else if (mark.posData.type === 'rect') {
          // 矩形区域
          // 绘制路径
          // let xy = gamePosToImgPos(mapId, [mark.posData.]);
          ctx.beginPath();
          // ctx.rect(
          //   mark.relX - mark.posData.width / factor / 2, mark.relY - mark.posData.height / factor / 2,
          //   mark.posData.width / factor, mark.posData.height / factor
          // );
          // todo 临时对调，需要从原始数据修正
          ctx.rect(
            mark.relX - mark.posData.height / factor / 2,mark.relY - mark.posData.width / factor / 2,
            mark.posData.height / factor, mark.posData.width / factor
          );
          ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
          ctx.fill();
          ctx.lineWidth = 3;
          ctx.strokeStyle = '#003300';
          ctx.stroke();
          // 判断是否渲染起点坐标 todo

        } else if (mark.posData.type === 'path') {
          // 路径数据
          // 绘制路径
          ctx.beginPath();
          hitCtx.beginPath();
          let path = mark.posData.path;
          for (let i = 0; i < path.length; i++) {
            let xy = gamePosToImgPos(mapId, [path[i].x, path[i].y]);
            let relX = (xy.x - nwPoint.x) / factor;
            let relY = (xy.y - nwPoint.y) / factor;
            if (i === 0) {
              ctx.moveTo(relX, relY);
              hitCtx.moveTo(relX, relY);
            } else {
              ctx.lineTo(relX, relY);
              hitCtx.lineTo(relX, relY);
            }
          }
          // 绘制显示路径
          ctx.lineWidth = 5;
          ctx.strokeStyle = 'black';
          ctx.stroke();
          ctx.lineWidth = 3;
          ctx.strokeStyle = 'white';
          ctx.stroke();
          // 绘制路径点击画布
          hitCtx.lineWidth = 8;
          hitCtx.strokeStyle = `#${('000000' + Number(markerIndex).toString(16)).slice(-6)}`;
          hitCtx.stroke();
          // 绘制起始点坐标
          if (!mark.posData.hideIcon) {
            let iconData =  allIcons[mark.markerCategory][mark.posData.icon];
            ctx.drawImage(iconData.img, mark.relX - iconData.anchorX, mark.relY - iconData.anchorY, iconData.x, iconData.y);
            // 绘制起始点点击画布
            hitCtx.fillStyle = `#${('000000' + Number(markerIndex).toString(16)).slice(-6)}`;
            hitCtx.fillRect(mark.relX - iconData.anchorX, mark.relY - iconData.anchorY, iconData.x, iconData.y);
          }

        } else {
          // 点
          // 绘制logo
          // 继续
          let iconData =  allIcons[mark.markerCategory][mark.posData.icon];
          ctx.drawImage(iconData.img, mark.relX - iconData.anchorX, mark.relY - iconData.anchorY, iconData.x, iconData.y);
          hitCtx.fillStyle = `#${('000000' + Number(markerIndex).toString(16)).slice(-6)}`;
          hitCtx.fillRect(mark.relX - iconData.anchorX, mark.relY - iconData.anchorY, iconData.x, iconData.y);
        }
      }
    });

    // let colors = ['#D5D8DB', '#E8E8E8', '#C3ECB2', '#AADAFF', '#FFF2AF', '#F6CF65'];

    // 增加点击事件
    tile.addEventListener('click', (e) => {
      let x = e.offsetX;
      let y = e.offsetY;
      // 判断位置
      let pixel = hitCtx.getImageData(x, y, 1, 1).data;
      let index = (pixel[0] * 256 + pixel[1]) * 256 + pixel[2];  // 使用rgb颜色值代替点击事件id
      if(index !== 256 * 256 * 256 - 1) {
        // 点击添加一个临时无大小marker
        let myIcon = L.divIcon({className: 'marker-div-icon', html: ''});
        // todo zoom
        let marker = L.marker(self.lfMap.unproject([tileData[index].imgX, tileData[index].imgY], mapProps.maxZoom), {icon: myIcon}).addTo(self.lfMap);
        // popup内容
        let popupDOM = dataToPopup(tileData[index]);
        let popupDOMWrapper = document.createElement('div');
        ReactDOM.render(popupDOM, popupDOMWrapper);
        marker.bindPopup(popupDOMWrapper, {
          className: 'popup-content'
        });
        // 保存marker，以便在切换地图时删除
        self.openedMarker = marker;
        // todo trick 打开marker
        setTimeout(()=> {
          marker.openPopup();
        }, 0);
      }
    });

    // 增加鼠标移动事件，更新指针样式
    tile.addEventListener('mousemove', (e) => {
      let x = e.offsetX;
      let y = e.offsetY;
      // console.log('鼠标移动tile', imgPosToGamePos(mapId, [nwPoint.x + x * factor, nwPoint.y + y * factor]));
      self.setState({cursorPos: imgPosToGamePos(mapId, [nwPoint.x + x * factor, nwPoint.y + y * factor])});
      const pixel = hitCtx.getImageData(x, y, 1, 1).data;
      if(pixel[0] === 255 && pixel[1] === 255 && pixel[2] === 255) {
        tile.style.cursor = 'inherit';
      } else {
        tile.style.cursor = 'pointer';
      }
    });

    // 所有绘制结束后，通知leaflet已完成
    Promise.all(drawPromises).then(() => {
      done(null, tile);
    });
    return tile;
  };
  // 添加新图层
  self.lfMap.addLayer(self.markerCanvasLayer);

  // 最后移除存在的图层，防闪烁
  setTimeout(() => {
    if(oldMarkerCanvasLayer)
      self.lfMap.removeLayer(oldMarkerCanvasLayer);
  }, 100);

}

// 获取需要的标注图标图片，返回Promise数组
function getIcons(posData) {
  let iconPromiseList = [];
  posData['icons'].forEach((icon) => {
    let {type, content, fileName, x, y, anchorX, anchorY} = icon;
    let img = new Image();
    if (type === 'text') {
      // 使用默认菱形填充文字，todo 配置大小
      let canvas    = document.createElement('canvas');
      if (!icon.width)
        icon.width = 32;
      if (!icon.height)
        icon.height = 32;
      canvas.width  = icon['width'] || 32; // 这里因为有hidpi trick，不能用canvas的属性
      canvas.height = icon['height'] || 32;
      let ctx   = canvas.getContext('2d');
      ctx.fillStyle = '#232621';
      ctx.strokeStyle =icon.color || '#f0f300';  // 自定义边框颜色
      ctx.lineWidth = 2;
      // 支持多种边框样式
      switch (icon.shape) {
      case 'rect':
        // 绘制方形边框
        ctx.beginPath();
        ctx.moveTo(1, 1);
        ctx.lineTo(1, icon.height - 1);
        ctx.lineTo(icon.width - 1, icon.height - 1);
        ctx.lineTo(icon.width - 1, 1);
        ctx.lineTo(1, 1);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        // 填充文字
        ctx.fillStyle = icon.color || '#f0f300';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowOffsetX = 1; ctx.shadowOffsetY = 1;
        ctx.shadowBlur = 4;ctx.shadowColor = 'rgba(0,0,0,1)';
        ctx.font = (Math.min(icon.height, icon.width) - 3) + 'px 微软雅黑';
        ctx.fillText(content, icon.width / 2, icon.height / 2 + 2);
        break;
      case 'circle':
        // 绘制圆形边框
        ctx.beginPath();
        ctx.ellipse(icon.width / 2, icon.height / 2, icon.width / 2 - 1, icon.height / 2 - 1, 0, 0,2 * Math.PI);
        ctx.stroke();
        ctx.fill();
        // 填充文字
        ctx.fillStyle = icon.color || '#f0f300';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowOffsetX = 1;ctx.shadowOffsetY = 1;
        ctx.shadowBlur = 4;ctx.shadowColor = 'rgba(0,0,0,1)';
        ctx.font = +(Math.min(icon.height, icon.width) / 1.4).toFixed(0) + 'px 微软雅黑';
        ctx.fillText(content, icon.width / 2, icon.height / 2 + 2);
        break;
      case 'diamond':
      default:
        // 绘制菱形边框
        ctx.beginPath();
        ctx.moveTo(icon.width / 2, 1);
        ctx.lineTo(1, icon.height / 2);
        ctx.lineTo(icon.width / 2, icon.height - 1);
        ctx.lineTo(icon.width - 1, icon.height / 2);
        ctx.lineTo(icon.width / 2, 1);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        // 填充文字
        ctx.fillStyle = icon.color || '#f0f300';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowOffsetX = 1;ctx.shadowOffsetY = 1;
        ctx.shadowBlur = 4;ctx.shadowColor = 'rgba(0,0,0,1)';ctx.font = Math.min(icon.height, icon.width) / 2 + 'px 微软雅黑';
        ctx.fillText(content, icon.width / 2, icon.height / 2 + 2);
      }

      img.src = canvas.toDataURL();
      iconPromiseList.push(new Promise(function (resolve) {
        img.addEventListener('load', function() {
          resolve({
            img, x, y, anchorX, anchorY
          });
        }, false);
      }));
      anchorX = icon.width / 2;
      anchorY = icon.height / 2;
      x = icon.width;
      y = icon.height;
    } else {
      // 使用配置的自定义图片
      img.src = iconPath(`./${fileName}`, true);
      iconPromiseList.push(new Promise(function (resolve) {
        img.addEventListener('load', function() {
          resolve({
            img, x, y, anchorX, anchorY
          });
        }, false);
      }));
    }
  });
  return Promise.all(iconPromiseList);
}