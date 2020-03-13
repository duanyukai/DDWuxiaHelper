// 地图城市行政区划json，可以点击切换地图的
import L from 'leaflet';
import polylabel from 'polylabel';
import mapsProps from '../assets/json/maps_props.json';
import {gamePosToImgPos} from './pos_conv';

// geo点击区域
const geoClickJson = require.context('../assets/json/click_geojson', true);
// 城市icon图片
const cityIcons = require.context('../assets/imgs/city_icons', true);

// 绘制地图行政区划底层图
export function renderMapGeoClick(self, mapId) {
  try {
    let mapProps = mapsProps[mapId];
    let clickGeo = geoClickJson(`./geojson_${mapId}.json`, true);
    let geoClickMarkers = [];
    self.clickGeo = L.geoJson(clickGeo, {
      // interactive: false,
      pane: 'geo-click-pane',
      style: {
        weight: 3,
        opacity: 1,
        color: '#fff79d',
        // dashArray: '3',
        fillColor: '#000',
        fillOpacity: 0
      },
      coordsToLatLng: function(coords) {
        // 坐标转换，对中原和东海坐标需特殊处理
        if (mapId === 'ZY')
          return self.lfMap.unproject([coords[0] * 4, coords[1] * 4], mapProps.maxZoom);
        else if (mapId === 'DH')
          return self.lfMap.unproject(gamePosToImgPos(mapId, [coords[0], coords[1]]), mapProps.maxZoom);
        else
          return self.lfMap.unproject([coords[0] * 4 + 1024, coords[1] * 4], mapProps.maxZoom);
      },
      onEachFeature: function(feature, layer) {
        function highlightFeature(e) {
          let layer = e.target;
          layer.setStyle({weight: 6});
        }
        function resetHighlight(e) {
          let layer = e.target;
          layer.setStyle({weight: 3});
        }
        function changeMap(e) {
          // console.log('区域被点击', feature.properties.regionId);
          self.props.changeMap(feature.properties.regionId);
        }
        layer.on({
          mouseover: highlightFeature,
          mouseout: resetHighlight,
          click: changeMap
        });

        // 计算不可达极坐标，放置标签（中心放置地标）
        let coordsList = feature.geometry.coordinates;
        // console.log(feature.properties.regionName, coordsList);
        let coords = polylabel(coordsList, 1.0);
        // console.log(coords);
        // 增加文字标签，需对中原和东海特殊处理
        let markerPosition;
        if (mapId === 'ZY') {
          markerPosition = self.lfMap.unproject([coords[0] * 4, coords[1] * 4], mapProps.maxZoom);
        } else if (mapId === 'DH') {
          markerPosition = self.lfMap.unproject(gamePosToImgPos(mapId, [coords[0], coords[1]]), mapProps.maxZoom);
        } else {
          markerPosition = self.lfMap.unproject([coords[0] * 4 + 1024, coords[1] * 4], mapProps.maxZoom);
        }
        let geoClickMarker = L.marker(markerPosition, {
          pane: 'geo-click-pane',  // 放在最上面，加上点击事件
          // pane: 'marker-bottom-pane', // 放在最底层，简化点击事件
          icon: L.divIcon({
            // className: 'geojson-marker-text',
            // className: 'pos-name-marker',
            className: 'click-pos-name-marker',
            html: `<div>
              <span>${feature.properties.regionName}</span>
              <img src="${cityIcons('./' + feature.properties.regionId + '.png', true)}" />
            </div>` || '',
            iconSize: [100, 16],  // todo
            iconAnchor: [25, 25]
          })
        });
        // 地标名点击事件
        geoClickMarker.addEventListener('click', function () {
          self.props.changeMap(feature.properties.regionId);
        });
        geoClickMarkers.push(geoClickMarker);
        // todo 地图图片
        // let cityIcon = L.icon({
        //   iconUrl: 'leaf-green.png',
        //   iconSize:     [38, 95], // size of the icon
        //   shadowSize:   [50, 64], // size of the shadow
        //   iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
        //   shadowAnchor: [4, 62],  // the same for the shadow
        //   popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
        // });
      }
    });
    self.clickGeo.addTo(self.lfMap);
    self.geoClickLayer = L.layerGroup(geoClickMarkers);
    self.geoClickLayer.addTo(self.lfMap);
  } catch(e) {
    // console.log(e);
    console.log(`地图ID：${mapId}，暂无地区可点击geo数据`);
  }
}