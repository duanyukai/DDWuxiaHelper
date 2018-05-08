import React, { Component } from 'react';
import {Button, ButtonGroup, Checkbox, Col, Grid, Panel, Row, Tab, Table, Tabs} from "react-bootstrap";
import Slider from 'rc-slider';
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);
import BarChart from './bar_chart';

import 'rc-slider/assets/index.css';
import appCss from './css/app.css';

import techData from '../assets/json/family_tech.json';
import {Helmet} from "react-helmet";

class FamilySkillEmuApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      curSkillId: 3,
      range: [0, 100],
      maxLevel: 150,
      log: false
    };
  }

  renderSkillBtnGroup() {
    return(
      <div>
        <Tabs defaultActiveKey={2} id='toolbar-tabs' styleName='appCss.skill-tabs'>
          <Tab eventKey={0} title='综合能力'>
            <div>{this.renderSkillBtn(1)}</div>
          </Tab>
          <Tab eventKey={1} title='生产效率'>
            <div>{this.renderSkillBtn(2)}</div>
          </Tab>
          <Tab eventKey={2} title='战斗能力'>
            <div>{this.renderSkillBtn(3)}</div>
          </Tab>
          <Tab eventKey={3} title='帮派能力'>
            <div>{this.renderSkillBtn(4)}</div>
          </Tab>
        </Tabs>
      </div>
    );
  }

  renderSkillBtn(i) {
    let buttons = techData.filter((t) => t.skillType === i).map(({skillId, skillName}) => {
      return(
        <Button
          key={skillId}
          styleName='appCss.skill-btn'
          bsStyle={this.state.curSkillId === skillId ? 'primary' : 'default'}
          onClick={() => {
            let maxLength = techData.filter((t) => t.skillId === skillId)[0].levels.length;
            let range = this.state.range;
            if(maxLength < this.state.range[1])
              range[1] = maxLength - 1;
            if(range[0] >= range[1])
              range[0] = range[1] - 1;
            this.setState({curSkillId: skillId, range, maxLevel: maxLength - 1});
          }}
        >
          {skillName}
        </Button>
      );
    });
    return(
      <ButtonGroup>
        {buttons}
      </ButtonGroup>
    );
  }

  renderRangeSelection() {
    return(
      <Range
        styleName='appCss.slider'
        min={0}
        max={this.state.maxLevel}
        step={1}
        pushable
        onAfterChange={(range) => this.setState({range})}
        defaultValue={this.state.range}
      />
    );
  }

  render() {
    let curSkill = techData.filter((t) => t.skillId === this.state.curSkillId)[0];
    if(curSkill) {
      let curData = curSkill.levels;
      let range = this.state.range;
      let selectionData = curData.slice(range[0] + 1, range[1] + 1);

      let firstPropData = curData.map((level) => {
        try {
          return parseFloat(level.props[0]);
        } catch(e) {
          return 0;
        }
      });

      let curXiuweiData = curData.map((level) => level.xiuwei);
      let curSuiyinData = curData.map((level) => level.suiyin);
      let curBanggongData = curData.map((level) => level.banggong);

      let sumXiuwei = selectionData.reduce((sum, {xiuwei}) => sum + xiuwei, 0);
      let sumSuiyin = selectionData.reduce((sum, {suiyin}) => sum + suiyin, 0);
      let sumBanggong = selectionData.reduce((sum, {banggong}) => sum + banggong, 0);

      let propsUp = curData[range[1]].props.map((x, i) => {
        if(x) {
          let start;
          try {
            start = parseFloat(curData[range[0]].props[i]) || 0;
          } catch(e) {
            start = 0;
          }
          let end = parseFloat(x);
          if(x.charAt(x.length - 1) === '%')
            return (end - start).toFixed(2) + '%';
          return end - start;
        }
        return 0;
      }).join(', ');
      return (
        <div styleName="appCss.container">
          <Helmet>
            <meta charSet="utf-8" />
            <title>天刀帮派技能模拟器，碎银帮贡修为消耗模拟 | 段段天刀综合助手</title>
            <meta name="keywords" content="天刀帮派技能消耗,天刀帮派技能模拟" />
            <meta name="description" content="天刀帮派技能模拟器是一个富交互的帮派技能属性、消耗模拟器。针对不同技能以可视化形式展现属性提升及资源消耗。" />
          </Helmet>
          <Grid>
            <Row>
              <Col md={12} lg={10} lgOffset={1}>
                <Panel header="帮派技能模拟器" bsStyle="success">
                  <h3>说明</h3>
                  <p>
                    有模拟器问题或游戏内容问题都欢迎加QQ群（660695387）讨论 <a target="_blank" href="//shang.qq.com/wpa/qunwpa?idkey=09cd891efd94c6a9077cb7c517241fa747ee131a8e20502bd89a3152e4a43370"><img src="//pub.idqqimg.com/wpa/images/group.png" /></a>。
                  </p>
                  {this.renderSkillBtnGroup()}
                  <h3>选择始末等级 <small>{range[0]}级开始，{range[1]}级结束</small></h3>
                  {this.renderRangeSelection()}
                  <h3>提升属性及消耗</h3>
                  <Table styleName='appCss.props-table' bordered condensed striped hover responsive>
                    <tbody>
                      <tr><td>技能名称</td><td>{curSkill.skillName}</td></tr>
                      <tr><td>说明</td><td>{curSkill.mainDes}</td></tr>
                      <tr><td>起始等级说明</td><td>{curData[range[0]].des || '无'}</td></tr>
                      <tr><td>结束等级说明</td><td>{selectionData[selectionData.length - 1].des}</td></tr>
                      <tr><td>属性升级差值</td><td>{propsUp}</td></tr>
                      <tr>
                        <td>需修为</td><td>{sumXiuwei.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                      </tr>
                      <tr>
                        <td>需碎银</td><td>{Math.floor(sumSuiyin / 10000)}金{Math.floor(sumSuiyin % 10000 / 100)}银{(sumSuiyin % 100)}铜</td>
                      </tr>
                      <tr>
                        <td>需帮贡</td><td>{sumBanggong}</td>
                      </tr>
                    </tbody>
                  </Table>
                  <h2>可视化部分</h2>
                  <Checkbox
                    checked={this.state.log}
                    onChange={() => this.setState({log: !this.state.log})}
                  >
                    坐标对数化（属性、消耗数值变化巨大时可开启）
                  </Checkbox>
                  <h3>属性增长可视化<small>高亮为所选部分</small></h3>
                  <BarChart
                    data={firstPropData}
                    color='#cc6464'
                    hightlightRange={this.state.range}
                    unit='第一个属性'
                    log={this.state.log}
                    format={(x) => x}
                  />
                  <h3>等级消耗可视化<small>高亮为所选部分</small></h3>
                  <h4>修为消耗</h4>
                  <BarChart
                    data={curXiuweiData}
                    color='#6464cc'
                    hightlightRange={this.state.range}
                    unit='修为'
                    log={this.state.log}
                    format={(x) => x}
                  />
                  <h4>碎银消耗</h4>
                  <BarChart
                    data={curSuiyinData}
                    color='#cccc64'
                    hightlightRange={this.state.range}
                    unit='碎银'
                    log={this.state.log}
                    format={(x) => `${Math.floor(x / 10000)}金${Math.floor(x % 10000 / 100)}银${(x % 100)}铜`}
                  />
                  <h4>帮贡消耗</h4>
                  <BarChart
                    data={curBanggongData}
                    color='#64cc64'
                    hightlightRange={this.state.range}
                    unit='帮贡'
                    log={this.state.log}
                    format={(x) => x}
                  />
                </Panel>
              </Col>
            </Row>
          </Grid>
        </div>
      );
    } else {
      return <div>请选择一个技能</div>;
    }

  }
}



// export default withFauxDOM(FamilySkillEmuApp);
export default FamilySkillEmuApp;