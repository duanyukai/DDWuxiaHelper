// import 'hidpi-canvas/dist/hidpi-canvas.min';
import {canvasHiDPIPolyfill, canvasHiDPIRestore} from '../../../utils/canvas-hidpi-polyfill/canvas_hidpi_polyfill'

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import L from 'leaflet';
import './css/map.css';

import mapsProps from '../assets/json/maps_props.json';
import {gamePosToImgPos} from "../utils/pos_conv";

import {dataToPosList} from '../utils/data_to_pos';
import {dataToPopup} from "../utils/data_to_popup";
import markerTypeList from '../assets/json/marker_types.json';

const mapPosPath = require.context('../assets/json/positions', true);
const iconPath = require.context('../assets/imgs/icons', true);

// 地图标志json
import mapPosNameList from '../assets/json/positions/location_name.json';

class WuxiaLeafletMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: 0,
      lng: 0,
      zoom: 4,
    };

    this.updatePosMarker = this.updatePosMarker.bind(this);
  }

  componentWillReceiveProps(newProps) {
    let  self = this;
    // 地图切换
    if(this.props.currentMapId !== newProps.currentMapId) {
      let mapId = newProps.currentMapId;
      // 改变地图
      this.changeMap(mapId);
    }
    // 标志显示切换
    if(this.props.showState !== newProps.showState) {
      // this.createCanvasTiles();
      this.markerCanvasLayer.redraw();
    }

  }


  componentDidMount() {
    // 开启高分屏适配
    canvasHiDPIPolyfill();
    // 初始化地图
    this.lfMap = L.map(this.lfMapDOM, {
      maxZoom: 2, // todo
      minZoom: 5,
      crs: L.CRS.Simple,
      zoomControl: false,
      attributionControl: false,
      detectRetina: true,
      // fadeAnimation: false
    });
    // 初始化地图属性
    let _mapBounds = new L.LatLngBounds([0,0], [0, 0]);
    this.lfMap.setMaxBounds(_mapBounds);
    // 地图中心视角
    let _mapCenter = this.lfMap.unproject([0, 0], 1);
    this.lfMap.setView(_mapCenter, 1);


    // 初始化第一张地图
    this.changeMap(this.props.currentMapId);
  }

  componentWillUnmount() {
    canvasHiDPIRestore();
  }

  getPixelRatio(context) {
    let backingStore = context.backingStorePixelRatio ||
      context.webkitBackingStorePixelRatio ||
      context.mozBackingStorePixelRatio ||
      context.msBackingStorePixelRatio ||
      context.oBackingStorePixelRatio ||
      context.backingStorePixelRatio || 1;

    return (window.devicePixelRatio || 1) / backingStore;
  }

  changeMap(mapId) {
    let self = this;
    let mapProps = mapsProps[mapId];
    // 计算地图基本属性
    // todo

    // 删除旧图层
    if(this.posNameMarkerLayer) {
      this.lfMap.removeLayer(this.posNameMarkerLayer);
    }
    if(this.tileLayer) {
      this.lfMap.removeLayer(this.tileLayer);
    }

    if(this.markerCanvasLayer) {
      this.lfMap.removeLayer(this.markerCanvasLayer);
    }

    // 更新地图图层
    // 地图边缘
    let _mapBounds = new L.LatLngBounds(
      this.lfMap.unproject([0, mapProps.imgSize[1]], mapProps.maxZoom),
      this.lfMap.unproject([mapProps.imgSize[0], 0], mapProps.maxZoom));
    // this.lfMap.setMaxBounds(_mapBounds);
    this.lfMap.setMaxBounds(null);  // todo marker越界
    // 地图缩放
    this.lfMap.setMinZoom(2);
    this.lfMap.setMaxZoom(mapProps.maxZoom + 3);
    // 地图中心视角
    // let _mapCenter = this.lfMap.unproject(gamePosToImgPos(mapId, mapProps.initView), mapProps.maxZoom);
    let _mapCenter = this.lfMap.unproject(gamePosToImgPos(mapId, [
      (mapProps.correspond[0].gamePosX + mapProps.correspond[1].gamePosX) / 2,
      (mapProps.correspond[0].gamePosY + mapProps.correspond[1].gamePosY) / 2
    ]), mapProps.maxZoom); // todo 更好的初始展现
    this.lfMap.setView(_mapCenter, 3); // todo zoom
    // 地图图层
    this.tileLayer = L.tileLayer(
      `http://tiles.wuxia.tools/${mapId}/{z}/{x}/{y}.png`, {
        minZoom: 2,
        maxNativeZoom: mapProps.maxZoom,
        maxZoom: mapProps.maxZoom + 3,
        bounds: _mapBounds,
        continuousWorld: true,
        noWrap: true,
        tileSize: 256,
        crs: L.CRS.Simple,
        detectRetina:false
      }).addTo(this.lfMap);

    // 切换矢量坐标名称事件监听器
    // 移除已经存在的事件监听器
    if(this.posMarkerHandler)
      this.lfMap.off('zoomend', this.posMarkerHandler);
    this.posMarkerHandler = function () {
      self.updatePosMarker(mapId)
    };
    this.lfMap.on('zoomend', this.posMarkerHandler);
    // 初始调用
    this.posMarkerHandler();

    // canvas图层
    this.createCanvasTiles(mapId);
  }

  updatePosMarker(mapId) {
    let mapProps = mapsProps[mapId];
    let zoomLevel = this.lfMap.getZoom();
    // 更新dom marker
    let markers = [];
    if(mapPosNameList[mapId]) {
      mapPosNameList[mapId].forEach(({x, y, name, des, level}) => {
        let icon = L.divIcon({className: 'pos-name-marker', html: name, iconAnchor: [25, 25]});
        if(level < zoomLevel - 1) {
          markers.push(L.marker(this.lfMap.unproject(gamePosToImgPos(mapId, [x, y]), mapProps.maxZoom),{icon: icon}));
        }
      });
      if(this.posNameMarkerLayer)
        this.lfMap.removeLayer(this.posNameMarkerLayer);
      this.posNameMarkerLayer = L.layerGroup(markers);
      this.lfMap.addLayer(this.posNameMarkerLayer);
    }
  }

  createCanvasTiles(mapId) {
    let self = this;
    let mapProps = mapsProps[mapId];

    // 保存引用，延迟删除用以防闪烁
    let oldMarkerCanvasLayer = this.markerCanvasLayer;
    if(this.markerCanvasLayer)
      this.lfMap.removeLayer(this.markerCanvasLayer);

    // 更新坐标canvas图层
    this.markerCanvasLayer = new L.GridLayer({tileSize: 256});

    this.markerCanvasLayer.createTile = function(coords, done) {
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
      let factor = Math.pow(2, mapProps.maxZoom - coords.z);
      // 缩放至原始图片的像素坐标
      nwPoint.x *= factor; nwPoint.y *= factor;
      sePoint.x *= factor; sePoint.y *= factor;

      // 测试用
      // ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      // ctx.beginPath();ctx.moveTo(0, 0);ctx.lineTo(tileSize.x-1, 0);ctx.lineTo(tileSize.x-1, tileSize.y-1);ctx.lineTo(0, tileSize.y-1);ctx.closePath();ctx.stroke();

      // 底部水印
      ctx.save();
      ctx.translate(128, 128);
      ctx.rotate(-Math.PI/4);
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.font='14px Microsoft Yahei';
      ctx.fillText('段段天刀地图助手', 0, -10);
      ctx.fillText('www.wuxia.tools', 0, 10);
      ctx.restore();

      // 测试墨宝坐标
      let tileData = [];
      let drawPromises = [];
      let markerIndex = 0;

      markerTypeList.forEach(({id, name, data}) => {
        let markerType = id;
        // 根据是否显示择情获取
        if(!self.props.showState[id].show)
          return;
        // 获取数据
        let posData = mapPosPath('./' + data, true);
        // 获取所有需要的icon
        let iconPromiseList = [];
        let iconList = posData['icons'].map(({fileName, x, y, anchorX, anchorY}) => {
          let img = new Image();
          img.src = iconPath(`./${fileName}`, true);
          iconPromiseList.push(new Promise(function (resolve) {
            img.addEventListener('load', function() {
              resolve();
            }, false);
          }));
          return {
            img,
            x, y,
            anchorX, anchorY
          };
        });

        // icon全部加载完毕后执行
        drawPromises.push(Promise.all(iconPromiseList).then(() => {
          // 显示所有marker
          dataToPosList(id, posData, mapId).forEach((posData) => {
            let xy = gamePosToImgPos(mapId, [posData.x, posData.y]);

            // 判断是否在本tile中，四个方向扩大20px（右侧显示标记，左侧检测扩大75px）
            if(xy.x >= nwPoint.x - 75 && xy.x <= sePoint.x + 20 && xy.y >= nwPoint.y - 20 && xy.y <= sePoint.y + 20) {
              let relX = (xy.x - nwPoint.x) / factor;
              let relY = (xy.y - nwPoint.y) / factor;

              // 地图放大级别高时，绘制详细信息 //todo zoom, logoSize
              if(coords.z >= 4 && self.props.showState[id].showDetail) {
                // 双行数据
                let text1 = `${posData.name}`;
                let text2 = `${Math.floor(posData.x)},${Math.floor(posData.y)}`;
                let textWidth = Math.max(ctx.measureText(text1).width, ctx.measureText(text2).width);
                textWidth = 70; // todo 检测宽度有bug
                ctx.fillStyle = 'rgba(0,0,0,0.6)';
                ctx.fillRect(relX, relY - 16, textWidth + 16, 32);
                ctx.textBaseline = 'middle';
                ctx.fillStyle = '#fff';
                ctx.font='14px Microsoft Yahei';
                ctx.fillText(text1, relX + 16, relY - 8);
                ctx.fillText(text2, relX + 16, relY + 8);

                // 增加点击检测
                hitCtx.fillStyle = `#${('000000' + Number(markerIndex).toString(16)).slice(-6)}`;
                hitCtx.fillRect(relX, relY - 16, textWidth + 16, 32);
              }

              // 绘制logo
              let ratio = self.getPixelRatio(ctx);
              let iconData =  iconList[posData.icon];
              ctx.drawImage(iconData.img, (relX - iconData.anchorX) * ratio, (relY - iconData.anchorY) * ratio, iconData.x * ratio, iconData.y * ratio);

              hitCtx.fillStyle = `#${('000000' + Number(markerIndex).toString(16)).slice(-6)}`;
              hitCtx.fillRect(relX - iconData.anchorX, relY - iconData.anchorY, iconData.x, iconData.y);


              // todo 数据在data里
              tileData.push({
                markerType,
                relX, relY,
                imgX: xy.x, imgY: xy.y,
                posData: posData
              });
              markerIndex++;
            }
          })
        }));
      });

      // 增加点击事件
      tile.addEventListener('click', (e) => {
        // 判断位置
        let ratio = self.getPixelRatio(ctx);
        let x = e.offsetX * ratio;
        let y = e.offsetY * ratio;

        let pixel = hitCtx.getImageData(x, y, 1, 1).data;
        let index = (pixel[0] * 256 + pixel[1]) * 256 + pixel[2];
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
          // todo hack
          setTimeout(()=> {
            marker.openPopup();
          }, 0);

        }
      });

      // 增加鼠标移动事件，更新指针样式
      tile.addEventListener('mousemove', (e) => {
        let ratio = self.getPixelRatio(ctx);
        let x = e.offsetX * ratio;
        let y = e.offsetY * ratio;
        const pixel = hitCtx.getImageData(x, y, 1, 1).data;
        if(pixel[0] === 255 && pixel[1] === 255 && pixel[2] === 255) {
          tile.style.cursor = 'inherit';
        } else {
          tile.style.cursor = 'pointer';
        }
      });

      Promise.all(drawPromises).then(() => {
        done(null, tile);
      });
      return tile;
    };
    // 添加新图层
    this.lfMap.addLayer(this.markerCanvasLayer);

    // 最后移除存在的图层，防闪烁
    setTimeout(() => {
      if(oldMarkerCanvasLayer)
        self.lfMap.removeLayer(oldMarkerCanvasLayer);
    }, 100);

  }

  render() {
    return(
      <div>
        <div
          styleName = 'map-wrapper'
          ref={(m) => this.lfMapDOM = m}
        />
      </div>
    );
  }
}

export default WuxiaLeafletMap;