import React from 'react';
import {Table, Well} from "react-bootstrap";

import '../components/css/map.css';

export function dataToPopup(data) {
  switch(data.markerType) {
    // 墨宝
    case 'mobao':
      let mobaoData = data.posData;
      return(
        <div>
          <h3>{mobaoData.name}</h3>
          <h3>{mobaoData.x.toFixed(0)}, {mobaoData.y.toFixed(0)}</h3>
          <Table styleName='mobao-table' striped condensed hover>
            <tbody>
              <tr><td>墨宝名称</td><td>{mobaoData.data.mobaoName}</td></tr>
              <tr><td>墨宝描述</td><td>{mobaoData.data.des}</td></tr>
              <tr><td>墨宝条件统称</td><td>{mobaoData.data.conditionGroupType}{mobaoData.data.conditionGroupDes}</td></tr>
              <tr><td>时间要求</td><td>{mobaoData.data.time}</td></tr>
              <tr><td>天气要求</td><td>{mobaoData.data.weather}</td></tr>
              <tr><td>角色等级</td><td>{mobaoData.data.roleLevel}</td></tr>
              <tr><td>制造等级</td><td>{mobaoData.data.craftLevel}</td></tr>
              <tr><td>画纸种类</td><td>{mobaoData.data.paperType}</td></tr>
              <tr><td>纸张数量</td><td>{mobaoData.data.paperNum}</td></tr>
              <tr><td>获熟练度</td><td>{mobaoData.data.shulian}</td></tr>
              <tr><td>收藏修为</td><td>{mobaoData.data.xiuwei}</td></tr>
              <tr><td>收藏碎银</td><td>{mobaoData.data.suiyin}</td></tr>
            </tbody>
          </Table>
        </div>
      );
    // 家园
    case 'house':
      let houseData = data.posData;
      console.log(houseData);
      return(
        <div>
          <h3>{houseData.name}</h3>
          <h3>{houseData.x.toFixed(0)}, {houseData.y.toFixed(0)}</h3>
          <p>{houseData.data.des}</p>
        </div>
      );
    // 航海图鉴
    case 'sea_collect':
      let seaCollectData = data.posData;
      return(
        <div>
          <h3>{seaCollectData.name}</h3>
          <h3>{seaCollectData.x.toFixed(0)}, {seaCollectData.y.toFixed(0)}</h3>
          <Table styleName='sea-collect-table' striped condensed hover>
            <tbody>
            <tr><td>图鉴星级</td><td>{seaCollectData.data.star}</td></tr>
            <tr><td>图鉴类型</td><td>{seaCollectData.data.type}</td></tr>
            <tr><td>获取前描述</td><td>{seaCollectData.data.preDes}</td></tr>
            <tr><td>解锁后描述</td><td>{seaCollectData.data.afterDes}</td></tr>
            <tr><td>需航海等级</td><td>{seaCollectData.data.neededSeaLevel}</td></tr>
            <tr><td>需岛屿投资</td><td>{seaCollectData.data.neededInvest}</td></tr>
            <tr><td>奖励绝智轩点</td><td>{seaCollectData.data.jzxPoint}</td></tr>
            <tr><td>奖励宋钱</td><td>{seaCollectData.data.songqian}</td></tr>
            </tbody>
          </Table>
        </div>
      );
    default:
      return <div>无数据</div>;
  }
}