import React from 'react';
import {calcGongli, calcZhanli} from "../utils/calcProps";
import {Table} from "react-bootstrap";

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
        <td></td><td></td>
        <td>力道</td><td><DataFormat data={p.ld} /></td></tr>
      <tr>
        <td>功力</td><td><DataFormat data={calcGongli(props.xinfaProps)} /></td>
        <td>根骨</td><td><DataFormat data={p.gg} /></td></tr>
      <tr>
        <td>战力</td><td><DataFormat data={calcZhanli(props.xinfaProps)} /></td>
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