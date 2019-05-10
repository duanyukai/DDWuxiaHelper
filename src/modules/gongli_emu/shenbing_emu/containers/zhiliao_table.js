import React, {Component} from 'react';
import {connect} from 'react-redux';
import InputNumber from 'antd/es/input-number/index';
import range from 'lodash/range';

import VSliderSingle from '../../../_commons/vertical_slider/vertical_slider_single';
import VSliderRange from '../../../_commons/vertical_slider/vertical_slider_range';

import {calcGongli, calcZhanli, minusProps} from '../../../_commons/property_calc/player_props_calc';
import {suiyinFormatText} from '../../../_commons/common_utils/suiyin_format';
import {getShenbingById, getZhiliaoById} from '../utils/data_utils';


import './css/zhiliao_table.css';

import {DataFormat} from '../../../_commons/property_table/prop_table';
import {setSingleZhiliaoLevel} from '../actions';

import {genTextByPlayerProps} from '../../../_commons/property_calc/player_props_extract_and_gen';

class ZhiliaoTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      startLevel: 5,
      endLevel: 10
    };

    this.changeCalcLevel = this.changeCalcLevel.bind(this);
    this.renderVisualization = this.renderVisualization.bind(this);
  }

  changeCalcLevel(type, n, levelCount) {
    if(type < 0) {
      this.setState({
        startLevel: Math.min(n, levelCount - 1),
        endLevel: Math.min(Math.max(n, this.state.endLevel), levelCount - 1)
      });
    } else if(type > 0) {
      this.setState({
        startLevel: Math.min(n, this.state.startLevel),
        endLevel: Math.min(n, levelCount - 1),
      });
    } else {
      // 同时设置
      this.setState({
        startLevel: n[0],
        endLevel: n[1]
      });
    }
  }

  render() {
    let self = this;
    const {curShenbingId, curZhiliaoId, zhiliaoLevelMap} = this.props;
    let zl = getZhiliaoById(curZhiliaoId);

    // // 当前级别属性
    // let currentLevelDes = getSkillById(curSkillTypeId).levels[curSkillLevel].des;
    // let currentLevelGongli = calcGongli(getSingleSkillProps(curSkillTypeId ,curSkillLevel, smBase5d));
    // let currentLevelZhanli = calcZhanli(getSingleSkillProps(curSkillTypeId ,curSkillLevel, smBase5d));
    //
    // // 计算属性差值
    // let startLevelProps = getSingleSkillProps(curSkillTypeId, this.state.startLevel, smBase5d);
    // let endLevelProps = getSingleSkillProps(curSkillTypeId, this.state.endLevel, smBase5d);
    // let propsDiff = minusProps(endLevelProps, startLevelProps);
    // let diffText = genTextByPlayerProps(propsDiff);
    // // 计算消耗差值
    // let suiyinTotal = 0, canyeTotal = 0, meiruiTotal = 0;
    // for (let i = this.state.startLevel; i < this.state.endLevel; i++) {
    //   let l = getSkillById(curSkillTypeId).levels[i];
    //   suiyinTotal += l.times * l.suiyin;
    //   canyeTotal += l.times * l.canye;
    //   meiruiTotal += l.meirui;
    // }

    return (
      <div style={{textAlign: 'center'}}>
        <h3>当前质料：{zl.name}</h3>
        <div styleName="level-input-group">
          <table className="dd-table">
            <tbody>
              <tr><td colSpan={2} className="dark"><h4>当前等级总体属性</h4></td></tr>
              {/*<tr><td className="dark">当前等级</td><td className="light">*/}
              {/*  <InputNumber*/}
              {/*    min={0} max={levelCount-1}*/}
              {/*    value={curSkillLevel}*/}
              {/*    onChange={n => setSkillLevel(curSkillTypeId, Math.min(n, levelCount - 1))}*/}
              {/*  />*/}
              {/*</td></tr>*/}
              {/*<tr><td className="dark">当前属性</td><td className="light">{currentLevelDes}，{currentLevelGongli}功力，{currentLevelZhanli}战力</td></tr>*/}
            </tbody>
          </table>
        </div>
        <table styleName="shimei-skill-level-table" className="dd-table">
          <thead>
            <tr>
              <th>章节</th><th></th><th>差值计算</th>
              <th>碎银</th><th>单次残页</th><th>升级次数</th><th>梅蕊之卷</th><th>收集点</th>
              <th>属性</th><th>总功力</th><th>总战力</th><th>虚功力</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>0级</td>
              <td rowSpan={levelCount}>
                <div style={{height: 26 * (levelCount - 1)}}>
                  <VSliderSingle
                    defaultValue={15} min={0} max={levelCount - 1}
                    value={curSkillLevel}
                    onChange={n => setSkillLevel(curSkillTypeId, n)}
                    marks={marks}
                  />
                </div>
              </td>
              <td rowSpan={levelCount}>
                <div style={{height: 26 * (levelCount - 1)}}>
                  <VSliderRange
                    defaultValue={[0, 10]} min={0} max={levelCount - 1}
                    value={[this.state.startLevel, this.state.endLevel]}
                    onChange={(a) => {
                      self.changeCalcLevel(0, a);
                    }}
                    marks={marks}
                  />
                  {/*这里从0开始，也就是包含解锁技能需要的1整本*/}
                  {/*总功力用侧边栏弹出的形式，还能设置是用第几个配置*/}
                </div>
              </td>
              <td>N/A</td><td>整本解锁</td><td>N/A</td><td>N/A</td><td>0</td><td>无</td><td>0</td><td>0</td><td>0</td>
            </tr>
            {

              range(1, levelCount).map(level => {
                let s = getSkillById(curSkillTypeId).levels[level];
                return <tr key={level}>
                  <td>{level}级</td>
                  <td>{suiyinFormatText(s.suiyin)}</td>
                  <td>{s.canye}</td>
                  <td>{s.times}</td>
                  <td>{s.meirui}</td>
                  <td>{s.collectLevel}</td>
                  <td>{s.des}</td>
                  <td><DataFormat data={calcGongli(getSingleSkillProps(curSkillTypeId ,level, smBase5d))} /></td>
                  <td><DataFormat data={calcZhanli(getSingleSkillProps(curSkillTypeId ,level, smBase5d))} /></td>
                  <td><DataFormat data={s.props.gongliOffset || 0} /></td>
                </tr>;
              })
            }
          </tbody>
        </table>
        {this.renderVisualization()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  state = state.shenbingEmu;
  return {
    curShenbingId: state.curShenbingId,
    curZhiliaoId: state.curZhiliaoId,
    zhiliaoLevelMap: state.shenbingData.sets[state.shenbingData.current].zhiliaolevels,
  };
}

export default connect(mapStateToProps, {
  setSingleZhiliaoLevel
})(ZhiliaoTable);