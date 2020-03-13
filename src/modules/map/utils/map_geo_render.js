// 地图行政区划json
import L from 'leaflet';
import polylabel from 'polylabel';
import mapsProps from '../assets/json/maps_props.json';

const regionGeoJson = require.context('../assets/json/region_geojson', true);

// 绘制地图行政区划底层图
export function renderMapGeoJSON(self, mapId) {
  try {
    let mapProps = mapsProps[mapId];
    let regionGeo = regionGeoJson(`./geojson_${mapId}.json`, true);
    let geojsonMarkers = [];
    self.regionGeo = L.geoJson(regionGeo, {
      // interactive: false,
      style: {
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillColor: '#000',
        fillOpacity: 0
      },
      coordsToLatLng: function(coords) {
        // 坐标转换，对中原坐标需特殊处理
        if (mapId === 'ZY')
          return self.lfMap.unproject([coords[0] * 4, coords[1] * 4], mapProps.maxZoom);
        else
          return self.lfMap.unproject([coords[0] * 4 + 1024, coords[1] * 4], mapProps.maxZoom);
      },
      onEachFeature: function(feature, layer) {
        function highlightFeature(e) {
          let layer = e.target;
          layer.setStyle({weight: 5});
        }
        function resetHighlight(e) {
          let layer = e.target;
          layer.setStyle({weight: 2});
        }
        layer.on({
          mouseover: highlightFeature,
          mouseout: resetHighlight,
        });
        // 计算不可达极坐标，放置标签（中心放置地标）
        let coordsList = feature.geometry.coordinates;
        // console.log(feature.properties.regionName, coordsList);
        let coords = polylabel(coordsList, 1.0);
        // console.log(coords);
        // 增加文字标签，需对中原特殊处理
        let markerPosition;
        if (mapId === 'ZY') {
          markerPosition = self.lfMap.unproject([coords[0] * 4, coords[1] * 4], mapProps.maxZoom);
        } else {
          markerPosition = self.lfMap.unproject([coords[0] * 4 + 1024, coords[1] * 4], mapProps.maxZoom);
        }
        let geojsonMarker = L.marker(markerPosition, {
          pane: 'marker-bottom-pane',
          icon: L.divIcon({
            className: 'geojson-marker-text',
            html: feature.properties.regionName || '',
            iconSize: [100, 16],
          })
        });
        geojsonMarkers.push(geojsonMarker);
      }
    });
    self.regionGeo.addTo(self.lfMap);
    self.geojsonMarkersLayer = L.layerGroup(geojsonMarkers);
    self.geojsonMarkersLayer.addTo(self.lfMap);
  } catch(e) {
    console.log(`地图ID：${mapId}，暂无地区geo数据`);
  }
}