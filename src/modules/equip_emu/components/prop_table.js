import React, { Component } from 'react';

import './css/prop_table.css';

export const DataFormat = (props) => {
  let data = props.data || 0;
  let digit = props.digit || 0;
  let dataStr = '' + data.toFixed(3);
  let dataSplit = dataStr.split('.');
  return(
    <span>
      <span styleName='int'>{dataSplit[0]}.</span>
      <span styleName='int'>{dataSplit[1].slice(0, digit)}</span>
      <span styleName='frac'>{dataSplit[1].slice(digit)}</span>
    </span>
  );
};


class PropTable extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {

    let p = this.props.equipProps;
    let gongli = this.props.gongli;
    let zhanli = this.props.zhanli;
    return(
      <div>
        <table styleName="prop-table">
          <tbody>
            <tr>
              <th>
                总功力
              </th><td><DataFormat data={gongli} /></td>
              <th>力道</th><td><DataFormat data={p.ld} /></td></tr>
            <tr>
              <th style={{color: '#f66'}}>
                虚功力
              </th><td><DataFormat data={p.gongliOffset} /></td>
              <th>根骨</th><td><DataFormat data={p.gg} /></td></tr>
            <tr>
              <th>
                总战力
              </th><td><DataFormat data={zhanli} /></td>
              <th>气劲</th><td><DataFormat data={p.qj} /></td></tr>
            <tr>
              <th style={{color: '#f66'}}>
                虚战力
              </th><td><DataFormat data={p.zhanliOffset} /></td>
              <th>洞察</th><td><DataFormat data={p.dc} /></td></tr>
            <tr>
              <th>气血</th><td><DataFormat data={p.qx} /></td>
              <th>身法</th><td><DataFormat data={p.sf} /></td></tr>

            <tr>
              <th>外攻</th><td><DataFormat data={p.wgMin} /><br /> ~ <DataFormat data={p.wgMax} /></td>
              <th>外防</th><td><DataFormat data={p.wf} /></td>
            </tr>
            <tr>
              <th>内功</th><td><DataFormat data={p.ngMin} /><br /> ~ <DataFormat data={p.ngMax} /></td>
              <th>内防</th><td><DataFormat data={p.nf} /></td>
            </tr>

            <tr>
              <th>命中</th><td><DataFormat data={p.mz} digit={2} /></td>
              <th>格挡</th><td><DataFormat data={p.gd} digit={2} /></td>
            </tr>
            <tr>
              <th>会心</th><td><DataFormat data={p.hx} digit={2} /></td>
              <th>韧劲</th><td><DataFormat data={p.rj} digit={2} /></td>
            </tr>
            <tr>
              <th>会伤</th><td><DataFormat data={p.hs} digit={2} /></td>
              <th>拆招</th><td><DataFormat data={p.chaizhao} digit={0} /></td>
            </tr>
            <tr>
              <th>破伤</th><td><DataFormat data={p.poshang} digit={0} /></td>
              <th>愈伤</th><td><DataFormat data={p.yushang} digit={0} /></td>
            </tr>
            <tr>
              <td></td><td></td>
              <th>疗伤</th><td><DataFormat data={p.liaoshang} digit={0} /></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default PropTable;