import React, {Component} from 'react';
import {connect} from 'react-redux';
import InputNumber from 'antd/es/input-number/index';
import range from 'lodash/range';

import VSliderSingle from '../../../_commons/vertical_slider/vertical_slider_single';
import VSliderRange from '../../../_commons/vertical_slider/vertical_slider_range';
import {calcGongli, calcZhanli, minusProps} from '../../../_commons/property_calc/player_props_calc';
import {suiyinFormatText} from '../../../_commons/common_utils/suiyin_format';
import {getSingleSkillProps, getSkillById} from '../utils/data_utils';


import './css/main_table.css';
import Row from 'antd/es/grid/row';
import Col from 'antd/es/grid/col';
import {DataFormat} from '../../../_commons/property_table/prop_table';
import BarChart from '../components/bar_chart';
import {setSkillLevel} from '../actions';

import propsDesList from '../../../_commons/common_data/props_des_list.json';
import {genTextByPlayerProps} from '../../../_commons/property_calc/player_props_extract_and_gen';

class MainTable extends Component {
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

  renderVisualization() {
    const {curSkillTypeId, curSkillLevel, smBase5d} = this.props;
    const {startLevel, endLevel} = this.state;
    let levelCount = getSkillById(curSkillTypeId).levels.length;  // 含0级，即21、31等
    // 使用1级属性，判断非0属性
    let props = getSkillById(curSkillTypeId).levels[1].props;
    let keys = Object.keys(props).map(key => [key, props[key]]).filter(t => t[1] !== 0).map(t => t[0]);
    let suiyinData = [], canyeData = [], gongliData = [], zhanliData = [], dataCollection = {};
    // 批量提取数据
    range(1, levelCount).forEach(level => {
      let s = getSkillById(this.props.curSkillTypeId).levels[level];
      // 碎银
      suiyinData[level] = s.suiyin;
      // 残页
      canyeData[level] = s.canye * s.times;
      // 功力战力
      let curLevelProps = getSingleSkillProps(curSkillTypeId ,level, smBase5d);
      gongliData[level] = calcGongli(curLevelProps);
      zhanliData[level] = calcZhanli(curLevelProps);
      // 非空属性
      keys.forEach(key => {
        if(!dataCollection.hasOwnProperty(key))
          dataCollection[key] = [];
        dataCollection[key][level] = s.props[key];
      });
    });

    return <div style={{textAlign: 'left'}}>
      <h3>数据可视化</h3>
      <Row>
        <Col xs={24} md={12}>
          <h4>碎银消耗</h4>
          <BarChart
            data={suiyinData}
            color='#64cc64'
            hightlightRange={[startLevel,endLevel]}
            unit='铜碎银'
            log={false}
            format={(x) => x}
          />
        </Col>
        <Col xs={24} md={12}>
          <h4>残页消耗</h4>
          <BarChart
            data={canyeData}
            color='#64cc64'
            hightlightRange={[startLevel,endLevel]}
            unit='残页'
            log={false}
            format={(x) => x}
          />
        </Col>
        <Col xs={24} md={12}>
          <h4>功力增长趋势</h4>
          <BarChart
            data={gongliData}
            color='#64cc64'
            hightlightRange={[startLevel,endLevel]}
            unit='功力'
            log={false}
            format={(x) => x}
          />
        </Col>
        <Col xs={24} md={12}>
          <h4>战力增长趋势</h4>
          <BarChart
            data={zhanliData}
            color='#64cc64'
            hightlightRange={[startLevel,endLevel]}
            unit='战力'
            log={false}
            format={(x) => x}
          />
        </Col>
      </Row>
      <Row>
        {
          Object.keys(dataCollection).map(key => {
            return <Col key={key} xs={24} md={12}>
              <h4>{propsDesList[key].longName}属性增长趋势</h4>
              <BarChart
                data={dataCollection[key]}
                title={propsDesList[key].longName}
                color='#64cc64'
                hightlightRange={[startLevel,endLevel]}
                unit={propsDesList[key].longName}
                log={false}
                format={(x) => x}
              />
            </Col>;
          })
        }
      </Row>
    </div>;
  }

  render() {
    let self = this;
    const {curSkillTypeId, curSkillLevel, setSkillLevel, smBase5d} = this.props;
    let levelCount = getSkillById(curSkillTypeId).levels.length;  // 含0级，即21、31等
    let marks = {};
    for (let i = 0; i < levelCount; i++) {
      marks[i] = i;
    }

    // 当前级别属性
    let currentLevelDes = getSkillById(curSkillTypeId).levels[curSkillLevel].des;
    let currentLevelGongli = calcGongli(getSingleSkillProps(curSkillTypeId ,curSkillLevel, smBase5d));
    let currentLevelZhanli = calcZhanli(getSingleSkillProps(curSkillTypeId ,curSkillLevel, smBase5d));

    // 计算属性差值
    let startLevelProps = getSingleSkillProps(curSkillTypeId, this.state.startLevel, smBase5d);
    let endLevelProps = getSingleSkillProps(curSkillTypeId, this.state.endLevel, smBase5d);
    let propsDiff = minusProps(endLevelProps, startLevelProps);
    let diffText = genTextByPlayerProps(propsDiff);
    // 计算消耗差值
    let suiyinTotal = 0, canyeTotal = 0, meiruiTotal = 0;
    for (let i = this.state.startLevel; i < this.state.endLevel; i++) {
      let l = getSkillById(curSkillTypeId).levels[i];
      suiyinTotal += l.times * l.suiyin;
      canyeTotal += l.times * l.canye;
      meiruiTotal += l.meirui;
    }
    return (
      <div style={{textAlign: 'center'}}>
        <h3>当前技能：{getSkillById(curSkillTypeId).name}</h3>
        <div styleName="level-input-group">
          <table className="dd-table">
            <tbody>
              <tr><td colSpan={2} className="dark"><h4>当前等级属性</h4></td></tr>
              <tr><td className="dark">当前等级</td><td className="light">
                <InputNumber
                  min={0} max={levelCount-1}
                  value={curSkillLevel}
                  onChange={n => setSkillLevel(curSkillTypeId, Math.min(n, levelCount - 1))}
                />
              </td></tr>
              <tr><td className="dark">当前属性</td><td className="light">{currentLevelDes}，{currentLevelGongli}功力，{currentLevelZhanli}战力</td></tr>
              <tr><td colSpan={2} className="dark"><h4>属性、消耗差值计算器</h4></td></tr>
              <tr><td className="dark">起止等级</td><td className="light">
                <InputNumber
                  min={0} max={levelCount-1}
                  value={this.state.startLevel}
                  onChange={n => self.changeCalcLevel(-1, n, levelCount)}
                />
                <InputNumber
                  min={1} max={levelCount-1}
                  value={this.state.endLevel}
                  onChange={n => self.changeCalcLevel(1, n, levelCount)}
                />
              </td></tr>
              <tr><td className="dark">属性差值</td><td className="light">{diffText}</td></tr>
              <tr><td className="dark">消耗差值</td><td className="light">碎银消耗{suiyinFormatText(suiyinTotal)}；残页最多消耗{canyeTotal}页，一般约{(canyeTotal/2).toFixed(0)}页；梅蕊之卷消耗{meiruiTotal}个</td></tr>
            </tbody>
          </table>
        </div>
        <table styleName="shimei-skill-level-table" className="dd-table">
          <thead>
            <tr>
              <th>等级</th><th>等级选择</th><th>差值计算</th>
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
  state = state.shimeiEmu;
  return {
    curSkillTypeId: state.curSkillType,
    curSkillLevel: state.shimeiData.sets[state.shimeiData.current].levels[state.curSkillType] || 0,
    smBase5d: state.shimeiData.sets[state.shimeiData.current].base5d
  };
}

export default connect(mapStateToProps, {
  setSkillLevel
})(MainTable);