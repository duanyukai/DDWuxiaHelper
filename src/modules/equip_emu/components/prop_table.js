import React, { Component } from 'react';

import './css/prop_table.css';

const DataFormat = (props) => {
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
    p = {};
    return(
      <div>
        <table styleName="prop-table">
          <tbody>
            <tr>
              <td>
                裸功力
              </td><td><DataFormat data={11111} /></td>
              <td>力道</td><td><DataFormat data={p.ld} /></td></tr>
            <tr>
              <td style={{color: '#f66'}}>
                显功力
              </td><td><DataFormat data={111 + p.gongliOffset} /></td>
              <td>根骨</td><td><DataFormat data={p.gg} /></td></tr>
            <tr>
              <td >
                裸战力
              </td><td><DataFormat data={111} /></td>
              <td>气劲</td><td><DataFormat data={p.qj} /></td></tr>
            <tr>
              <td style={{color: '#f66'}}>
                显战力
              </td><td><DataFormat data={111 + p.zhanliOffset} /></td>
              <td>洞察</td><td><DataFormat data={p.dc} /></td></tr>
            <tr>
              <td>气血</td><td><DataFormat data={p.qx} /></td>
              <td>身法</td><td><DataFormat data={p.sf} /></td></tr>

            <tr>
              <td>外攻</td><td><DataFormat data={p.wg} /></td>
              <td>外防</td><td><DataFormat data={p.wf} /></td>
            </tr>
            <tr>
              <td>内功</td><td><DataFormat data={p.ng} /></td>
              <td>内防</td><td><DataFormat data={p.nf} /></td>
            </tr>

            <tr>
              <td>命中</td><td><DataFormat data={p.mz} digit={2} /></td>
              <td>格挡</td><td><DataFormat data={p.gd} digit={2} /></td>
            </tr>
            <tr>
              <td>会心</td><td><DataFormat data={p.hx} digit={2} /></td>
              <td>韧劲</td><td><DataFormat data={p.rj} digit={2} /></td>
            </tr>
            <tr>
              <td>会伤</td><td><DataFormat data={p.hs} digit={2} /></td>
              <td>拆招</td><td>111</td>
            </tr>
            <tr>
              <td>破伤</td><td><DataFormat data={p.hs} digit={2} /></td>
              <td>愈伤</td><td>111</td>
            </tr>
            <tr>
              <td></td><td></td>
              <td>疗伤</td><td>111</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default PropTable;