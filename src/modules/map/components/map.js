import {canvasHiDPIPolyfill, canvasHiDPIRestore} from '../../../utils/canvas-hidpi-polyfill/canvas_hidpi_polyfill';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import L from 'leaflet';
import './css/map.css';

import mapsProps from '../assets/json/maps_props.json';
import {gamePosToImgPos, imgPosToGamePos} from '../utils/pos_conv';

// 地图标志json
import {renderMapGeoJSON} from '../utils/map_geo_render';
import {updatePosMarker} from '../utils/map_place_name_render';
import {createCanvasTiles} from '../utils/map_tile_render';
import {renderMapGeoClick} from '../utils/map_geo_click_render';
import {dataToPopup} from '../utils/data_to_popup';

// // 地图行政区划json ddd todo
// const regionGeoJson = require.context('../assets/json/region_geojson', true);

class WuxiaLeafletMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: 0,
      lng: 0,
      zoom: 4,
      cursorPos: {x: 0, y: 0}
    };
  }

  componentWillReceiveProps(newProps) {
    console.log(newProps);
    let mapId = newProps.currentMapId;
    let {x, y, zoom} = newProps;
    // 地图、坐标、marker切换相关
    if(this.props.currentMapId !== newProps.currentMapId) {
      // 切换了大地图
      // 改变地图
      this.changeMap(mapId, x, y, zoom);
      console.log('切换大地图');
    } else {
      // 地图没变，但是坐标、marker相关变动
      // 坐标变动
      if (this.props.x !== newProps.x || this.props.y !== newProps.y || this.props.zoom !== newProps.zoom) {
        // 没切换大地图，仅切换坐标或缩放
        let _mapCenter = this.lfMap.unproject(gamePosToImgPos(mapId, [x || 2048, y || 2048]), mapsProps[mapId].maxZoom);
        this.lfMap.setView(_mapCenter, zoom);
        console.log('切换视角');
      }
    }
    // 开启显示的marker变动
    if (newProps.markerData && this.props.markerData !== newProps.markerData) {
      // 首先关闭当前marker并删除
      if (this.openedMarker) {
        this.openedMarker.closePopup();
      }
      // 然后直接根据marker内容，新建marker并打开
      // // 直接模拟发送点击事件即可 todo 这样不行因为有遮挡，触发不到准确的marker
      // let clickLatLng = this.lfMap.unproject(gamePosToImgPos(mapId, [x || 2048, y || 2048]), mapsProps[mapId].maxZoom);
      // this.tileLayer.fireEvent('click', {
      //   latlng: clickLatLng
      // });
      // 老实新建marker
      // 点击添加一个临时无大小marker
      let myIcon = L.divIcon({className: 'marker-div-icon', html: ''});
      let center = this.lfMap.unproject(gamePosToImgPos(mapId, [x || 2048, y || 2048]), mapsProps[mapId].maxZoom);
      let marker = L.marker(center, {icon: myIcon}).addTo(this.lfMap);
      // popup内容
      let popupDOM = dataToPopup({
        markerCategory: newProps.markerData.markerCategory,
        posData: newProps.markerData
      }); // todo 包的这一层现在处理的比较乱
      let popupDOMWrapper = document.createElement('div');
      ReactDOM.render(popupDOM, popupDOMWrapper);
      marker.bindPopup(popupDOMWrapper, {
        className: 'popup-content'
      });
      // 保存marker，以便在切换地图时删除
      this.openedMarker = marker;
      // todo trick 打开marker
      setTimeout(()=> {
        marker.openPopup();
      }, 0);
    }

    // 标志显示切换
    if(this.props.showState !== newProps.showState) {
      this.markerCanvasLayer.redraw();
    }
    // 大地标显示切换
    if(this.props.showPosMarker !== newProps.showPosMarker) {
      this.lfMap.getPane('marker-top-pane').style.display = newProps.showPosMarker ? '' : 'none';
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
      detectRetina: false,
      // renderer: L.canvas(), // todo 优先使用canvas，开启后和高分屏适配冲突，暂时不开
      // fadeAnimation: false
    });
    // 初始化地图属性
    let _mapBounds = new L.LatLngBounds([0,0], [0, 0]);
    this.lfMap.setMaxBounds(_mapBounds);
    // 地图中心视角
    let _mapCenter = this.lfMap.unproject([0, 0], 1);
    this.lfMap.setView(_mapCenter, 1);
    // 初始化地图canvas用的pane
    this.lfMap.createPane('canvas-marker-pane');
    this.lfMap.getPane('canvas-marker-pane').style.zIndex = '450';
    // 初始化地名用底部marker pane，此pane放置geoJsonLayer，以及可点击区域的地名
    this.lfMap.createPane('marker-bottom-pane');
    this.lfMap.getPane('marker-bottom-pane').style.zIndex = '350';
    // 初始化大地标marker pane
    this.lfMap.createPane('marker-top-pane');
    this.lfMap.getPane('marker-top-pane').style.zIndex = '455';
    // 初始化可点击区域用pane，此pane放置geoClickLayer
    this.lfMap.createPane('geo-click-pane');
    this.lfMap.getPane('geo-click-pane').style.zIndex = '460';

    // 初始化第一张地图
    this.changeMap(this.props.currentMapId, this.props.x, this.props.y, this.props.zoom);
  }

  componentWillUnmount() {
    canvasHiDPIRestore();
  }

  // // 获取屏幕像素比例，用于适配高分屏图片绘制错位问题
  // getPixelRatio(context) {
  //   let backingStore = context.backingStorePixelRatio ||
  //     context.webkitBackingStorePixelRatio ||
  //     context.mozBackingStorePixelRatio ||
  //     context.msBackingStorePixelRatio ||
  //     context.oBackingStorePixelRatio ||
  //     context.backingStorePixelRatio || 1;
  //
  //   return (window.devicePixelRatio || 1) / backingStore;
  // }

  // 切换地图，需要更新所有图层
  changeMap(mapId, x, y, zoom) {
    let self = this;
    let mapProps = mapsProps[mapId];
    // 调用父级切换地图函数，同步地图数据 todo
    this.props.changeMap(mapId);

    // 删除所有旧图层
    if(this.posNameMarkerLayer)
      this.lfMap.removeLayer(this.posNameMarkerLayer);
    if(this.tileLayer)
      this.lfMap.removeLayer(this.tileLayer);
    if(this.markerCanvasLayer)
      this.lfMap.removeLayer(this.markerCanvasLayer);
    if(this.regionGeo)
      this.lfMap.removeLayer(this.regionGeo);
    if(this.clickGeo) {
      this.lfMap.removeLayer(this.clickGeo);
    }
    if(this.geojsonMarkersLayer)
      this.lfMap.removeLayer(this.geojsonMarkersLayer);
    if(this.geoClickLayer) {
      this.lfMap.removeLayer(this.geoClickLayer);
    }
    // 关闭已经打开的marker
    if (this.openedMarker)
      this.openedMarker.closePopup();

    // 更新地图图层
    // 更新地图边缘
    let _mapBounds = new L.LatLngBounds(
      this.lfMap.unproject([0, mapProps.imgSize[1]], mapProps.maxZoom),
      this.lfMap.unproject([mapProps.imgSize[0], 0], mapProps.maxZoom));
    // this.lfMap.setMaxBounds(_mapBounds);
    this.lfMap.setMaxBounds(null);  // todo marker越界暂不处理，防止popup越界
    // 地图缩放
    this.lfMap.setMinZoom(2);
    this.lfMap.setMaxZoom(mapProps.maxZoom + 3);
    // 地图中心视角，根据初始参数自动放缩
    // let _mapCenter = this.lfMap.unproject(gamePosToImgPos(mapId, mapProps.initView), mapProps.maxZoom);
    let _mapCenter;
    if (x && y && zoom) {
      // 切换到指定视角
      console.log('changemap 切换到指定视角');
      _mapCenter = this.lfMap.unproject(gamePosToImgPos(mapId, [x, y]), mapProps.maxZoom);
      this.lfMap.setView(_mapCenter, zoom);
    } else {
      _mapCenter = this.lfMap.unproject(gamePosToImgPos(mapId, [
        (mapProps.correspond[0].gamePosX + mapProps.correspond[1].gamePosX) / 2,
        (mapProps.correspond[0].gamePosY + mapProps.correspond[1].gamePosY) / 2
      ]), mapProps.maxZoom);
      this.lfMap.setView(_mapCenter, 3);
    }

    // 添加行政区划geojson，属不动图层需置于最底层，切换地图时加载一次即可
    renderMapGeoJSON(self, mapId);
    // 添加地图城市geojson，可点击切换地图，需置于最顶层
    renderMapGeoClick(self, mapId);

    // 添加地图瓦片图层
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

    // 添加地图移动结束监听，修改网址中的hash
    if (this.moveEndHandler)
      this.lfMap.off('moveend', this.moveEndHandler);
    this.moveEndHandler = function() {
      let imgPos = self.lfMap.project(self.lfMap.getCenter(), mapProps.maxZoom);
      let gamePos = imgPosToGamePos(mapId, [imgPos.x, imgPos.y]);
      // // 直接修改，不再使用
      // window.location.hash = `#${mapId}(${gamePos.x},${gamePos.y},${self.lfMap.getZoom()})`;
      // 修改父控件的x和y，在外面修改
      self.props.changePos(gamePos.x, gamePos.y, self.lfMap.getZoom());
    };
    this.lfMap.on('moveend', this.moveEndHandler);

    // 添加地图指针移动监听，用于显示当前所指位置
    if (this.mouseMoveHandler)
      this.lfMap.off('mousemove', this.mouseMoveHandler);
    this.mouseMoveHandler = function (e) {
      let imgPos = self.lfMap.project(e.latlng, mapProps.maxZoom);
      let gamePos = imgPosToGamePos(mapId, [imgPos.x, imgPos.y]);
      console.log('鼠标指针坐标', gamePos);
    };
    this.lfMap.on('mousemove', this.mouseMoveHandler);

    // 切换矢量大地标坐标名称事件监听器，用于更新显示细节层级
    // 移除已经存在的事件监听器
    if(this.posMarkerHandler)
      this.lfMap.off('zoomend', this.posMarkerHandler);
    this.posMarkerHandler = function () {
      updatePosMarker(self, mapId);
    };
    this.lfMap.on('zoomend', this.posMarkerHandler);
    // 初始调用渲染大地标
    this.posMarkerHandler();

    // canvas图层
    createCanvasTiles(self, mapId);

    // // 更新地图时更新hash
    // let imgPos = self.lfMap.project(self.lfMap.getCenter(), 4);  // todo zoom 4是正好对应原图像素
    // let gamePos = imgPosToGamePos(mapId, [imgPos.x, imgPos.y]);
    // window.location.hash = `#${mapId}(${gamePos.x},${gamePos.y},${self.lfMap.getZoom()})`;
  }

  render() {
    return(
      <div>
        <div
          styleName = 'map-wrapper'
          ref={(m) => this.lfMapDOM = m}
        />
        <div style={{position: 'fixed', bottom: '0', left: '0', width: '100%', height: '30px', background: 'white', zIndex: '1000'}}>
          {this.state.cursorPos.x}, {this.state.cursorPos.y}
        </div>
      </div>
    );
  }
}

export default WuxiaLeafletMap;