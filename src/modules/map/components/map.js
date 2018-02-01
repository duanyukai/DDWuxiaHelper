import 'hidpi-canvas/dist/hidpi-canvas.min';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import L from 'leaflet';
import './css/map.css';

// todo
import mobaoData from '../assets/json/positions/mobao.json';

import mapsProps from '../assets/json/mapsProps.json';
import {gamePosToImgPos} from "../utils/pos_conv";

import mobaoIcon from '../assets/imgs/ui/mobao.png';
import {Table, Well} from "react-bootstrap";

class WuxiaLeafletMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: 0,
      lng: 0,
      zoom: 4,
    };
  }

  componentWillReceiveProps(newProps) {
    if(this.props.currentMapId !== newProps.currentMapId) {
      this.changeMap(newProps.currentMapId);
    }
  }

  componentDidMount() {
    this.lfMap = L.map(this.lfMapDOM, {
      maxZoom: 2, // todo
      minZoom: 5,
      crs: L.CRS.Simple,
      zoomControl: false,
      attributionControl: false,
      detectRetina: true
    });

    let _mapBounds = new L.LatLngBounds([0,0], [0, 0]);
    this.lfMap.setMaxBounds(_mapBounds);
    // 地图中心视角
    let _mapCenter = this.lfMap.unproject([0, 0], 1);
    this.lfMap.setView(_mapCenter, 1);

    this.changeMap(this.props.currentMapId);

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
    this.lfMap.setMaxBounds(_mapBounds);
    // 地图缩放
    this.lfMap.setMinZoom(2);
    this.lfMap.setMaxZoom(mapProps.maxZoom + 3);
    // 地图中心视角
    let _mapCenter = this.lfMap.unproject([mapProps.initView[0], mapProps.initView[1]], mapProps.maxZoom);
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

    // 更新坐标图层
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
      ctx.strokeStyle = 'red';
      ctx.beginPath();ctx.moveTo(0, 0);ctx.lineTo(tileSize.x-1, 0);ctx.lineTo(tileSize.x-1, tileSize.y-1);ctx.lineTo(0, tileSize.y-1);ctx.closePath();ctx.stroke();

      // 测试墨宝坐标
      let tileData = [];
      let promiseList = [];
      let markerIndex = 0;
      // todo 各种坐标
      // todo 获取坐标方法
      mobaoData[mapId].forEach((pos) => {
        let xy = gamePosToImgPos(mapId, [pos.x, pos.y]);
        // 判断是否在本tile中，四个方向扩大20px（右侧显示标记，左侧检测扩大75px）
        if(xy.x >= nwPoint.x - 75 && xy.x <= sePoint.x + 20 && xy.y >= nwPoint.y - 20 && xy.y <= sePoint.y + 20) {
          let relX = (xy.x - nwPoint.x) / factor;
          let relY = (xy.y - nwPoint.y) / factor;

          let img = new Image();
          // 异步绘制防止随机性丢失
          ((markerIndex) => {
            promiseList.push(new Promise(function (resolve) {
              img.addEventListener('load', function() {
                // 绘制logo
                let ratio = self.getPixelRatio(ctx);
                ctx.drawImage(img, (relX - 16) * ratio, (relY - 16) * ratio, 32 * ratio, 32 * ratio); // todo logoSize

                hitCtx.fillStyle = `#${('000000' + Number(markerIndex).toString(16)).slice(-6)}`;
                hitCtx.fillRect(relX - 16, relY - 16, 32, 32);
                resolve();
              }, false);
            }));
          })(markerIndex);

          img.src = mobaoIcon; // todo logo

          // 地图放大级别高时，绘制详细信息 //todo zoom, logoSize
          if(coords.z >= 4) {
            // 双行数据
            let text1 = `${pos.des}`;
            let text2 = `${pos.x},${pos.y}`;
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

          tileData.push({
            relX, relY,
            imgX: xy.x, imgY: xy.y,
            data: pos
          });
          markerIndex++;
        }
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
          // 点击添加一个临时marker
          let myIcon = L.divIcon({className: 'marker-div-icon', html: ''});
          // // todo 5
          let marker = L.marker(self.lfMap.unproject([tileData[index].imgX, tileData[index].imgY], mapProps.maxZoom), {icon: myIcon}).addTo(self.lfMap);
          let popupDOM = <div>
            <Well styleName='popup-well'>
              {tileData[index].data.des}
              <Table>
                <tr><td>23</td><td>23</td><td>23</td><td>23</td></tr>
                <tr><td>23</td><td>23</td><td>23</td><td>23</td></tr>
              </Table>
            </Well>
            </div>;
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

      Promise.all(promiseList).then(() => {
        done(null, tile);
      });
      return tile;
    };
    this.lfMap.addLayer(this.markerCanvasLayer);
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