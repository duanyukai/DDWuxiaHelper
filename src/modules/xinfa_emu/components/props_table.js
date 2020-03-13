import React, {Suspense} from 'react';
import {calcGongli, calcZhanli} from '../utils/calcProps';

import './css/props_table.css';
import { useTranslation } from 'react-i18next';
import {Tooltip} from 'antd';

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

const PropsTable = (props) => {
  const { t, i18n } = useTranslation('translation');
  let p = props.xinfaProps;
  // console.log(p);
  // 功力计算单独使用原始属性
  let gongli;
  let zhanli;
  if(props.gongliUsedProps) {
    gongli = calcGongli(props.gongliUsedProps);
    zhanli = calcZhanli(props.gongliUsedProps);
  } else {
    gongli = calcGongli(props.xinfaProps);
    zhanli = calcZhanli(props.xinfaProps);
  }
  return (
    <Suspense fallback="loading">
      <table styleName='prop-table'>
        <colgroup>
          <col className="prop-table-name" />
          <col className="prop-table-data" />
          <col className="prop-table-name" />
          <col className="prop-table-data" />
        </colgroup>
        <tbody>
          <tr>
            <td>
              <Tooltip title="指根据五维、战斗属性计算出的理论功力值">
                <span>{t('props.gongli-luo')}</span>
              </Tooltip>
            </td><td><DataFormat data={gongli} /></td>
            <td>{t('props.lidao')}</td><td><DataFormat data={p.ld} /></td></tr>
          <tr>
            <td style={{color: '#f66'}}>
              <Tooltip title="指在裸功力基础上，对各心法功力值作出平衡后得到的值，与游戏内显示相同（例如考虑五本炼武满重功力数值相同）">
                <span>{t('props.gongli-xian')}</span>
              </Tooltip>
            </td><td><DataFormat data={gongli + p.gongliOffset} /></td>
            <td>{t('props.gengu')}</td><td><DataFormat data={p.gg} /></td></tr>
          <tr>
            <td >
              <Tooltip title="指根据五维、战斗属性计算出的理论战力值">
                <span>{t('props.zhanli-luo')}</span>
              </Tooltip>
            </td><td><DataFormat data={zhanli} /></td>
            <td>{t('props.qijin')}</td><td><DataFormat data={p.qj} /></td></tr>
          <tr>
            <td style={{color: '#f66'}}>
              <Tooltip title="指在裸战力基础上，对各心法战力值作出平衡后得到的值，与游戏内显示相同（例如修罗和灵素显示战力明显较高，即激素号的由来）">
                <span>{t('props.zhanli-xian')}</span>
              </Tooltip>
            </td><td><DataFormat data={zhanli + p.zhanliOffset} /></td>
            <td>{t('props.dongcha')}</td><td><DataFormat data={p.dc} /></td></tr>
          <tr>
            <td>{t('props.qixue')}</td><td><DataFormat data={p.qx} /></td>
            <td>{t('props.shenfa')}</td><td><DataFormat data={p.sf} /></td></tr>

          <tr>
            <td>{t('props.waigong')}</td><td><DataFormat data={p.wg} /></td>
            <td>{t('props.waifang')}</td><td><DataFormat data={p.wf} /></td>
          </tr>
          <tr>
            <td>{t('props.neigong')}</td><td><DataFormat data={p.ng} /></td>
            <td>{t('props.neifang')}</td><td><DataFormat data={p.nf} /></td>
          </tr>

          <tr>
            <td>{t('props.mingzhong')}</td><td><DataFormat data={p.mz} digit={2} /></td>
            <td>{t('props.gedang')}</td><td><DataFormat data={p.gd} digit={2} /></td>
          </tr>
          <tr>
            <td>{t('props.huixin')}</td><td><DataFormat data={p.hx} digit={2} /></td>
            <td>{t('props.renjin')}</td><td><DataFormat data={p.rj} digit={2} /></td>
          </tr>
          <tr>
            <td>{t('props.huishang')}</td><td><DataFormat data={p.hs} digit={2} /></td>
            <td/><td/>
          </tr>
        </tbody>
      </table>
    </Suspense>
  );
};

export default PropsTable;