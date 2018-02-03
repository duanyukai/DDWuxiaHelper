import React from 'react';
import {calcGongli, calcZhanli} from "../utils/calcProps";
import {OverlayTrigger, Table, Tooltip} from "react-bootstrap";

import './css/props_table.css';

const DataFormat = (props) => {
  let data = props.data;
  let dataStr = '' + data.toFixed(3);
  let dataSplit = dataStr.split('.');
  return(
    <span>
      <span styleName='int'>{dataSplit[0]}.</span>
      <span styleName='frac'>{dataSplit[1]}</span>
    </span>
  );
};

export default (props) => {
  let p = props.xinfaProps;
  // 功力计算单独使用原始属性
  let gongli;
  if(props.gongliUsedProps) {
    gongli = calcGongli(props.gongliUsedProps);
  } else {
    gongli = calcGongli(props.xinfaProps);
  }
  return (
    <Table condensed styleName='prop-table'>
      <colgroup>
        <col className="prop-table-name" />
        <col className="prop-table-data" />
        <col className="prop-table-name" />
        <col className="prop-table-data" />
      </colgroup>
      <tbody>
      <tr>
        <td style={{color: '#f66'}}>
          <OverlayTrigger key={name} placement='top' overlay={<Tooltip id='tooltip'>指根据五维、战斗属性计算出的理论功力值</Tooltip>}>
            <span>裸功力</span>
          </OverlayTrigger>
        </td><td><DataFormat data={gongli} /></td>
        <td>力道</td><td><DataFormat data={p.ld} /></td></tr>
      <tr>
        <td style={{color: '#f66'}}>
          <OverlayTrigger key={name} placement='top' overlay={<Tooltip id='tooltip'>指在裸功力基础上，对各心法功力值作出平衡后得到的值，与游戏内显示相同（例如考虑五本炼武满重功力数值相同）</Tooltip>}>
            <span>显功力</span>
          </OverlayTrigger>
        </td><td><DataFormat data={gongli + p.gongliOffset} /></td>
        <td>根骨</td><td><DataFormat data={p.gg} /></td></tr>
      <tr>
        <td >战力</td><td><DataFormat data={calcZhanli(props.xinfaProps)} /></td>
        <td>气劲</td><td><DataFormat data={p.qj} /></td></tr>
      <tr>
        <td>气血</td><td><DataFormat data={p.qx} /></td>
        <td>洞察</td><td><DataFormat data={p.dc} /></td></tr>
      <tr>
        <td></td><td></td>
        <td>身法</td><td><DataFormat data={p.sf} /></td></tr>

      <tr>
        <td>外攻</td><td><DataFormat data={p.wg} /></td>
        <td>外防</td><td><DataFormat data={p.wf} /></td>
      </tr>
      <tr>
        <td>内攻</td><td><DataFormat data={p.ng} /></td>
        <td>内防</td><td><DataFormat data={p.nf} /></td>
      </tr>

      <tr>
        <td>命中</td><td><DataFormat data={p.mz} /></td>
        <td>格挡</td><td><DataFormat data={p.gd} /></td>
      </tr>
      <tr>
        <td>会心</td><td><DataFormat data={p.hx} /></td>
        <td>韧劲</td><td><DataFormat data={p.rj} /></td>
      </tr>
      <tr>
        <td>会伤</td><td><DataFormat data={p.hs} /></td>
        <td></td><td></td>
      </tr>
      </tbody>
    </Table>
  );
}