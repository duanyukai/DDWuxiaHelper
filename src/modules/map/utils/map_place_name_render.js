import L from 'leaflet';
import mapsProps from '../assets/json/maps_props.json';
import mapPosNameList from '../assets/json/positions/location_name.json';
import {gamePosToImgPos} from './pos_conv';

// 更新大地标marker(书卷样式)，根据地图显示级别
export function updatePosMarker(self, mapId) {
  let mapProps = mapsProps[mapId];
  let zoomLevel = self.lfMap.getZoom();
  // 更新dom marker
  let markers = [];
  if(mapPosNameList[mapId]) {
    mapPosNameList[mapId].forEach(({x, y, name, des, level}) => {
      let icon = L.divIcon({
        className: 'pos-name-marker',
        html: name,
        iconAnchor: [25, 25]
      });
      if(level < zoomLevel - 1) {
        let marker = L.marker(
          self.lfMap.unproject(gamePosToImgPos(mapId, [x, y]), mapProps.maxZoom)
          ,{
            pane: 'marker-top-pane',
            icon: icon
          });
        markers.push(marker);
      }
    });
    // 更新显示级别，需要移除旧marker
    if(self.posNameMarkerLayer)
      self.lfMap.removeLayer(self.posNameMarkerLayer);
    self.posNameMarkerLayer = L.layerGroup(markers);
    self.lfMap.addLayer(self.posNameMarkerLayer);
  }
}