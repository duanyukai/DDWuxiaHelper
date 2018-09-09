import React from 'react';
import {Table, Well} from 'react-bootstrap';

import '../components/css/map.css';

function mouseEnterFocus(e) {
  e.target.focus();
  e.target.select();
}

export function dataToPopup(data) {
  switch(data.markerType) {
  // 墨宝
  case 'mobao':
    let mobaoData = data.posData;
    return(
      <div>
        <h3>{mobaoData.name}</h3>
        <h3 styleName="loc-copy-wrapper">
          <input type="text" defaultValue={mobaoData.x.toFixed(0)} onMouseEnter={mouseEnterFocus} style={{width: 60}}/>,{' '}
          <input type="text" defaultValue={mobaoData.y.toFixed(0)} onMouseEnter={mouseEnterFocus} style={{width: 60}}/>
        </h3>
        <Table styleName='mobao-table' striped condensed hover>
          <tbody>
            <tr><th>墨宝名称</th><td colSpan={3}>{mobaoData.data.mobaoName}</td></tr>
            <tr><th>墨宝描述</th><td colSpan={3}>{mobaoData.data.des}</td></tr>
            <tr><th>墨宝条件统称</th><td colSpan={3}>{mobaoData.data.conditionGroupType}{mobaoData.data.conditionGroupDes}</td></tr>
            <tr><th>时间要求</th><td>{mobaoData.data.time}</td></tr>
            <tr><th>天气要求</th><td>{mobaoData.data.weather}</td><th>纸张数量</th><td>{mobaoData.data.paperNum}</td></tr>
            <tr><th>角色等级</th><td>{mobaoData.data.roleLevel}</td><th>获熟练度</th><td>{mobaoData.data.shulian}</td></tr>
            <tr><th>制造等级</th><td>{mobaoData.data.craftLevel}</td><th>收藏修为</th><td>{mobaoData.data.xiuwei}</td></tr>
            <tr><th>画纸种类</th><td>{mobaoData.data.paperType}</td><th>收藏碎银</th><td>{mobaoData.data.suiyin}</td></tr>
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
        <h3 styleName="loc-copy-wrapper">
          <input type="text" defaultValue={houseData.x.toFixed(0)} onMouseEnter={mouseEnterFocus} style={{width: 60}}/>,{' '}
          <input type="text" defaultValue={houseData.y.toFixed(0)} onMouseEnter={mouseEnterFocus} style={{width: 60}}/>
        </h3>
        <p>{houseData.data.des}</p>
      </div>
    );
    // 航海图鉴
  case 'sea_collect':
    let seaCollectData = data.posData;
    return(
      <div>
        <h3>{seaCollectData.name}</h3>
        <h3 styleName="loc-copy-wrapper">
          <input type="text" defaultValue={seaCollectData.x.toFixed(0)} onMouseEnter={mouseEnterFocus} style={{width: 70}}/>,{' '}
          <input type="text" defaultValue={seaCollectData.y.toFixed(0)} onMouseEnter={mouseEnterFocus} style={{width: 70}}/>
        </h3>
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
  case 'hhz_baoxiang':
    let baoxiangData = data.posData;
    return (
      <div>
        <h3>{baoxiangData.name}</h3>
        <h3 styleName="loc-copy-wrapper">
          <input type="text" defaultValue={baoxiangData.x.toFixed(0)} onMouseEnter={mouseEnterFocus} style={{width: 60}}/>,{' '}
          <input type="text" defaultValue={baoxiangData.y.toFixed(0)} onMouseEnter={mouseEnterFocus} style={{width: 60}}/>
        </h3>
      </div>
    );
  case 'hhz_wuzi':
    let wuziData = data.posData;
    return (
      <div>
        <h3>{wuziData.name}</h3>
        <h3 styleName="loc-copy-wrapper">
          <input type="text" defaultValue={wuziData.x.toFixed(0)} onMouseEnter={mouseEnterFocus} style={{width: 60}}/>,{' '}
          <input type="text" defaultValue={wuziData.y.toFixed(0)} onMouseEnter={mouseEnterFocus} style={{width: 60}}/>
        </h3>
      </div>
    );
  case 'dataosha':
    let dataoshaData = data.posData;
    return (
      <div>
        <h3>{dataoshaData.name}</h3>
        <h3 styleName="loc-copy-wrapper">
          <input type="text" defaultValue={dataoshaData.x.toFixed(0)} onMouseEnter={mouseEnterFocus} style={{width: 60}}/>,{' '}
          <input type="text" defaultValue={dataoshaData.y.toFixed(0)} onMouseEnter={mouseEnterFocus} style={{width: 60}}/>
        </h3>
      </div>
    );
  default:
    return <div>无数据</div>;
  }
}