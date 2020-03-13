import React, { Component } from 'react';
import {connect} from 'react-redux';
import range from 'lodash/range';

import WuxiaPanel from '../../tiandao_ui/panel';
import ShujiTooltip from './shuji_tooltip';

import shujiBg from '../assets/imgs/ui/shuji_bg.svg';
import {Button, ButtonGroup, Dropdown, DropdownItem, OverlayTrigger, Tooltip} from 'react-bootstrap';

import { fastFulFillLevels, fastBrkthruShuji, chongxue } from '../actions/index';

import './css/xinfa_shuji.css';

const xinfaPicPath = require.context('../assets/imgs/xinfa_icon', true);
const shujiPicPath = require.context('../assets/imgs/shuji_icon/compressed', true);
const gemPngPicPath = require.context('../assets/imgs/gem_icon_png', true);
const skillPicPath = require.context('../assets/imgs/skill_icon', true);

import qianxiuPropsBase from '../assets/json/qianxiu/qianxiu_props_base.json';
import qianxiuPointList from '../assets/json/qianxiu/qianxiu_123.json';
import {selectQianxiuLevel, selectSkillLevel} from '../actions';

// 枢机在SVG中的坐标，每一行是一层，中心第0层
let shujiPos = [
  [0, 0],
  [0, -153], [108, -108], [153, 0], [108, 108], [0, 153], [-108, 108], [-153, 0], [-108, -108],
  [0, -307], [217, -217], [307, 0], [217, 217], [0, 307], [-217, 217], [-307, 0], [-217, -217],
  [0, -460], [325, -325], [460, 0], [325, 325], [0, 460], [-325, 325], [-460, 0], [-325, -325]
];

class XinfaShuji extends Component {
  constructor(props) {
    super(props);

    this.state = {
      curLevel: 0,
      selectedShujiId: 0,
      selectedShuji: {},
      // 枢机弹框
      toolTipLoc: [0, 0],
      toolTipType: 'shuji',
      toolTipVisibility: false,
      // 潜修
      // qianxiuLevels: {
      //   'ld': 0,
      //   'qj': 0,
      //   'gg': 0,
      //   'dc': 0,
      //   'sf': 0
      // }
    };

    this.changeToolTipVisibility = this.changeToolTipVisibility.bind(this);
    this.fastBrkthruShuji = this.fastBrkthruShuji.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.xinfaData.name && this.props.xinfaData.name !== nextProps.xinfaData.name) {
      // 心法改变时，更新当前显示的层
      this.setState({
        curLevel: nextProps.brkthruData.chongxue[nextProps.brkthruData.current][nextProps.xinfaData.name].fulfilledLevel + 1
      });
    }
  }

  onShujiClick(shujiId, data) {
    let svgDOM = this.refs['shuji-svg'];
    let left = svgDOM.offsetLeft;
    let top = svgDOM.offsetTop;
    let svgWidth = svgDOM.clientWidth;
    let svgHeight = svgDOM.clientHeight;

    this.setState({
      selectedShujiId: shujiId,
      selectedShuji: data,
      toolTipVisibility: !this.state.toolTipVisibility,
      toolTipLoc: [
        left + (shujiPos[shujiId][0] + 512) / 1024 * svgWidth,
        top + (shujiPos[shujiId][1] + 512) / 1024 * svgHeight
      ]
    });
  }

  changeToolTipVisibility(v) {
    this.setState({
      toolTipVisibility: v
    });
  }

  renderReinforce() {
    let reinforce = this.props.xinfaData.reinforce;
    // console.log(reinforce);
    if(reinforce) {
      return reinforce.map(({name, des}) => {
        let tooltip = <Tooltip id='tooltip'>{name}：{des}</Tooltip>;
        return(
          <OverlayTrigger key={name} placement='top' overlay={tooltip}>
            <img
              styleName='reinforce-img'
              src={xinfaPicPath('./' + name + '.png', true)}
            />
          </OverlayTrigger>
        );
      });
    } else {
      return null;
    }
  }

  // renderLevelName() {
  //   if(this.state.curLevel === 9) {
  //     return '高阶突破层';
  //   } else if(this.state.curLevel < 9) {
  //     return `第${this.state.curLevel}重`;
  //   } else {
  //     return `第${this.state.curLevel - 1}重`;
  //   }
  // }

  renderShuji() {
    const shujiList = this.props.xinfaData.brkthruLevels[this.state.curLevel].shujiMap;

    const chongxueData = this.props.brkthruData.chongxue[this.props.brkthruData.current][this.props.xinfaData.name];
    const fulfilledLevel = chongxueData.fulfilledLevel;
    const curLevelData = chongxueData.curLevelCX;
    let allGlow = false, halfGLow = false;
    if(fulfilledLevel >= this.state.curLevel) {
      // 本层已全部填满
      allGlow = true;
    } else if(fulfilledLevel === this.state.curLevel - 1) {
      // 本层正在填充
      halfGLow = true;
    }

    const shujis = Object.keys(shujiList).map((shujiId) => {
      shujiId = parseInt(shujiId);
      let shujiClick = this.onShujiClick.bind(this, shujiId, shujiList[shujiId]);
      // 计算枢机最高等级与当前等级
      let curShujiLevel;
      let maxShujiLevel = this.props.xinfaData.brkthruLevels[this.state.curLevel].shujiMap[shujiId].levels.length;
      // 计算是否高亮
      if(this.props.fulfilledLevel < this.state.curLevel - 1) {
        curShujiLevel = 0;
      }else if(this.props.fulfilledLevel > this.state.curLevel - 1) {
        curShujiLevel = maxShujiLevel;
      }else {
        curShujiLevel = curLevelData[shujiId] ? curLevelData[shujiId] : 0;
      }
      let glow = allGlow || (halfGLow && curLevelData[shujiId] > 0);
      // 计算枢机类型，是否砭石枢机
      let imgHref;
      let isGemShuji = shujiList[shujiId].isGemShuji;
      if(!isGemShuji) {
        imgHref = shujiPicPath('./' + shujiList[shujiId].types[0] + '.svg', true);
      } else {
        imgHref = gemPngPicPath('./' + shujiList[shujiId].levels[0].gem.name + '.png', true);
      }

      return (
        <g key={shujiId} onClick={shujiClick} styleName='shuji'>
          <circle
            cx={shujiPos[shujiId][0]}
            cy={shujiPos[shujiId][1]}
            r='41'
            styleName={glow ? 'shuji-circle' : 'shuji-circle-dark'}
          />
          <image
            xlinkHref={imgHref}
            x={shujiPos[shujiId][0] - 37}
            y={shujiPos[shujiId][1] - 37}
            width='75'
            height='75'
            styleName='shuji-image'
            style={{
              opacity: allGlow || (halfGLow && curLevelData[shujiId])  ? 1 : 0.4
            }}
          />
          <text
            x={shujiPos[shujiId][0] + 40}
            y={shujiPos[shujiId][1] - 18}
            styleName={maxShujiLevel === curShujiLevel ? 'shuji-level-text-green' : 'shuji-level-text-red'}
          >
            {maxShujiLevel}
          </text>
          <text
            x={shujiPos[shujiId][0] + 40}
            y={shujiPos[shujiId][1] + 36}
            styleName={curShujiLevel !== 0 ? 'shuji-level-text-green' : 'shuji-level-text-red'}
          >
            {curShujiLevel}
          </text>
        </g>
      );
    }
    );
    // console.log(shujis);
    return shujis;
  }

  renderLines() {
    const shujiList = this.props.xinfaData.brkthruLevels[this.state.curLevel].shujiMap;

    const chongxueData = this.props.brkthruData.chongxue[this.props.brkthruData.current][this.props.xinfaData.name];
    const fulfilledLevel = chongxueData.fulfilledLevel;
    const curLevelData = chongxueData.curLevelCX;
    let allFilled = false, halfFilled = false;
    if(fulfilledLevel >= this.state.curLevel) {
      // 本层已全部填满
      allFilled = true;
    } else if(fulfilledLevel === this.state.curLevel - 1) {
      // 本层正在填充
      halfFilled = true;
    }

    const lines =  Object.keys(shujiList).map((shujiId) => {
      shujiId = parseInt(shujiId);
      return shujiList[shujiId].children.map((childId) => {
        childId = parseInt(childId);
        // 判断特殊折线情况（id相差2或6），其余直接直线相连
        let centerId = -1;
        if(shujiId !== 0) {
          let diff = Math.abs(shujiId - childId);
          // console.log('diff', diff);
          if(diff === 2) {
            centerId = (shujiId + childId) / 2;
          } else if(diff === 6) {
            if ([8, 16, 24].includes(shujiId) || [8, 16, 24].includes(childId)) {
              centerId = (shujiId + childId - 8) / 2;
            } else {
              centerId = (shujiId + childId + 8) / 2;
            }
          }
        }

        // console.log('center', centerId);
        // console.log('连接', shujiId, centerId, childId);

        let glow = false;
        if(allFilled || halfFilled && (curLevelData[shujiId] || curLevelData[childId]))
          glow = true;

        if(centerId === -1) {
          // 直接连
          // 当线段垂直或水平时，改用矩形代替
          if(shujiPos[shujiId][0] === shujiPos[childId][0]) {
            // 垂直
            let y = Math.min(shujiPos[shujiId][1], shujiPos[childId][1]);
            let height = Math.abs(shujiPos[shujiId][1] - shujiPos[childId][1]);
            return(
              <rect
                key={`${shujiId}-${childId}`}
                x={shujiPos[shujiId][0] - 2} y={y} width={4} height={height}
                styleName={glow ? 'shuji-line' : 'shuji-line-dark'}
              />
            );
          } else if(shujiPos[shujiId][1] === shujiPos[childId][1]) {
            // 水平
            let x = Math.min(shujiPos[shujiId][0], shujiPos[childId][0]);
            let width = Math.abs(shujiPos[shujiId][0] - shujiPos[childId][0]);
            return(
              <rect
                key={`${shujiId}-${childId}`}
                x={x} y={shujiPos[shujiId][1] -2} width={width} height={4}
                styleName={glow ? 'shuji-line' : 'shuji-line-dark'}
              />
            );
          } else {
            return(
              <line
                key={`${shujiId}-${childId}`}
                x1={shujiPos[shujiId][0]} y1={shujiPos[shujiId][1]}
                x2={shujiPos[childId][0]} y2={shujiPos[childId][1]}
                styleName={glow ? 'shuji-line' : 'shuji-line-dark'}
              />
            );
          }
        } else {
          // 多一个中间节点
          return(
            <g
              key={`${shujiId}-${childId}`}
              styleName={glow ? 'shuji-line' : 'shuji-line-dark'}
            >
              <line x1={shujiPos[shujiId][0]} y1={shujiPos[shujiId][1]}
                x2={shujiPos[centerId][0]} y2={shujiPos[centerId][1]}

              />
              <line x1={shujiPos[centerId][0]} y1={shujiPos[centerId][1]}
                x2={shujiPos[childId][0]} y2={shujiPos[childId][1]}
              />
            </g>
          );
        }
      });
    });
    // console.log([].concat.apply([], lines));

    return [].concat.apply([], lines);
  }

  renderShujiSVG() {
    if(this.props.xinfaData.name) {
      return (
        <svg width='100%' viewBox='0 0 1024 1024'>
          <defs>
            <filter id='glow' height='120%' width='120%' x='-10%' y='-10%'>
              <feMorphology operator='dilate' radius='2' in='SourceAlpha' result='thicken' />
              <feGaussianBlur in='thicken' stdDeviation='5' result='blurred' />
              <feFlood floodColor='#3a83b5' result='glowColor' />
              <feComposite in='glowColor' in2='blurred' operator='in' result='softGlow_colored' />
              <feMerge>
                <feMergeNode in='softGlow_colored'/>
                <feMergeNode in='SourceGraphic'/>
              </feMerge>
            </filter>
            <filter id='inset-shadow' x='-10%' y='-10%' width='120%' height='120%'>
              {/* filterUnits='userSpaceOnUse' 不可使用，手机版有负担*/}
              <feMorphology operator='erode' radius='10' />
              <feFlood floodColor='black'/>
              <feComposite operator='out' in2='SourceGraphic'/>
              <feGaussianBlur stdDeviation='2'/>
              <feComposite operator='atop' in2='SourceGraphic'/>
            </filter>
          </defs>

          <g id='line-group' transform='translate(512,512)'>
            {this.renderLines()}
          </g>
          <g id='shuji-group' transform='translate(512,512)'>
            {this.renderShuji()}
          </g>
        </svg>
      );
    } else {
      return <div><br/>请从上方选取一本心法</div>;
    }
  }

  renderSkills() {
    if(this.props.xinfaData.skills) {
      return this.props.xinfaData.skills.map((skill) => {
        let xinfaName = this.props.xinfaData.name;
        let skillName = skill.name;
        return(
          <div key={skill.name} styleName='xinfa-skill'>
            <img src={skillPicPath('./' + skill.name + '.jpg', true)} styleName='xinfa-skill-img'/>
            <span>{skill.name}</span>
            <Dropdown size='sm' id={`${skill.name}-dropdown`} drop="up">
              <Dropdown.Toggle variant='primary'>{this.props.skillLevelsData[skillName] || 0}重</Dropdown.Toggle>
              <Dropdown.Menu styleName='skill-dropdown-menu'>
                {
                  skill.levels.map((level, i) => (
                    <DropdownItem eventKey={i} key={i}
                      onSelect={(e) => this.props.selectSkillLevel(xinfaName, skillName, i)}
                    >
                      <div>第{i}重</div>
                      <div styleName='skill-dropdown-item-des'>
                        <div>{level.des.split('###')[0]}</div>
                        <div>当前层修为：{level.xiuwei}</div>
                        <div>总消耗修为：{level.xiuweiSum || 0}</div>
                        { level.shayi && <div>消耗杀意：{level.shayi}</div>}
                      </div>
                    </DropdownItem>
                  )).reverse()
                }
              </Dropdown.Menu>
            </Dropdown>{' '}
          </div>
        );
      });
    } else {
      return null;
    }
  }

  fastBrkthruShuji(level) {
    if(window.confirm('确认快速点满至此重（含）么？这将覆盖您当前心法已冲穴配置。')) {
      console.log('快速冲穴', level);
      // 判断是否为最高重，最高重特殊处理
      if(level === this.props.xinfaData.brkthruLevels.length - 1) {
        console.log('全部充满');
        // 先充下层的穴
        this.props.fastFulFillLevels(this.props.xinfaData.name, level - 1);
        // 再充满当前层的穴，深度优先遍历所有节点
        let shujiIdLevelList = [];
        let shujiList = this.props.xinfaData.brkthruLevels[level].shujiMap;

        function dfs(shujiId) {
          shujiIdLevelList.push({
            shujiId: shujiId,
            shujiLevel: shujiList[shujiId].levels.length
          });
          shujiList[shujiId].children.forEach((childId) => {
            dfs(childId);
          });
        }
        dfs(0);
        this.props.fastBrkthruShuji(
          this.props.xinfaData.name,
          level,
          shujiIdLevelList
        );
      } else {
        // 正常情况直接快速冲穴
        this.props.fastFulFillLevels(this.props.xinfaData.name, level);
      }
      this.setState({
        curLevel: level
      });
    }
  }

  renderViewButtons(type) {
    let buttons;
    let levels = this.props.xinfaData.brkthruLevels.length;

    let onClick;
    if(type === 'chongxue') {
      onClick = this.fastBrkthruShuji;
    } else if(type === 'view') {
      onClick = (level) => this.setState({curLevel: level});
    }

    buttons = range(levels).map((level) => {
      let theOnClick = onClick.bind(this, level);
      // 计算高亮显示属性
      let highlight = 0;
      switch (type) {
      case 'chongxue':
        if(level <= this.props.fulfilledLevel) {
          highlight = 2;
        } else if(level === this.props.fulfilledLevel + 1) {
          highlight = 1;
        }
        break;
      case 'view':
        if(level === this.state.curLevel) {
          highlight = 3;
        }
        break;
      }
      let color;
      switch (highlight) {
      case 1:
        color = '#196194';
        break;
      case 2:
        color = '#2180c4';
        break;
      case 3:
        color = '#439edf';
        break;
      default:
        color = '';
        break;
      }
      return (
        <Button key={level} onClick={theOnClick} styleName='view-btn-regular' style={{
          background: color
        }}>{this.props.xinfaData.brkthruLevels[level].shortName}</Button>
      );
    });
    return buttons;
  }

  renderQianxiu() {
    let maxLevel = 25;
    if(this.props.xinfaData.name.startsWith('炼武'))  // todo 更优雅的方式
      maxLevel = 10;
    return [
      {name: '力道', id: 'ld'},
      {name: '气劲', id: 'qj'},
      {name: '根骨', id: 'gg'},
      {name: '洞察', id: 'dc'},
      {name: '身法', id: 'sf'}
    ].map(({name, id: dimId}, i) => {
      let curLevel = this.props.qianxiuData[dimId];
      let xinfaName = this.props.xinfaData.name;
      let qianxiuBaseProp = qianxiuPropsBase[xinfaName][i];
      return(
        <span key={dimId}>
          <span>{name}</span>{' '}
          <Dropdown
            style={{display: 'inline-block'}}
            id={`${dimId}-dropdown`}
          >
            <Dropdown.Toggle variant='primary' size="sm">
              {`lv${curLevel}, +${curLevel * qianxiuBaseProp}`}
            </Dropdown.Toggle>
            <Dropdown.Menu styleName='qianxiu-dropdown-menu'>
              {
                range(maxLevel + 1).map((level) => (
                  <DropdownItem
                    eventKey={level}
                    key={level}
                    onSelect={(e) => this.props.selectQianxiuLevel(xinfaName, dimId, level)}
                  >
                      lv {String('00' + level).slice(-2)},
                    {name}+{String('000' + qianxiuBaseProp * level).slice(-3)},
                      累计 {String('00000' + qianxiuPointList[level][1]).slice(-5)} 潜修点
                  </DropdownItem>
                )).reverse()
              }
            </Dropdown.Menu>
          </Dropdown>{' '}
        </span>
      );
    });
  }

  render() {
    // console.log(this.props.xinfaData);

    return (
      <WuxiaPanel title='心法枢机'>
        {
          this.props.xinfaData.name  &&
            <div>
              <div styleName='xinfa-reinforce'>
                <span styleName='reinforce-title'>相生</span>
                <div styleName='reinforce-img-wrapper'>
                  {this.renderReinforce()}
                </div>
              </div>
              <div styleName='xinfa-level'>
                <span>{this.props.xinfaData.brkthruLevels[this.state.curLevel].levelName}</span>
              </div>
              <div styleName='xinfa-name'>
                {this.props.xinfaData.name}
              </div>
            </div>
        }
        <div ref='shuji-svg' styleName='shuji-div'>
          <img src={shujiBg} styleName='shuji-bg-svg'/>
          <div styleName='shuji-fg'>
            {this.renderShujiSVG()}
          </div>
          { this.props.xinfaData.name &&
            <div>
              <div styleName='xinfa-skills'>
                <span styleName='xinfa-skills-title'>技能</span>
                <div styleName='xinfa-skills-wrapper'>
                  {this.renderSkills()}
                </div>
              </div>
              <div styleName='xinfa-description'>
                {
                  // this.props.xinfaData.simpleDes.split('\\n').map((item, key) => {
                  // return <span key={key}>{item}<br/></span>
                  // })
                  // 仅显示心法概述
                  this.props.xinfaData.simpleDes.split('\\n')[0].replace('。', '。$').split('\$').map((item, key) => {
                    return <span key={key}>{item}<br/></span>;
                  })
                }
              </div>
            </div>
          }
        </div>
        { this.props.xinfaData.name &&
          <div>
            <ShujiTooltip
              curLevel={this.state.curLevel}
              shujiId={this.state.selectedShujiId}
              shuji={this.state.selectedShuji}
              type={this.state.toolTipType}
              top={this.state.toolTipLoc[1]}
              left={this.state.toolTipLoc[0]}
              visibility={this.state.toolTipVisibility ? 'visible' : 'hidden'}
              changeVisibility={this.changeToolTipVisibility}
            />
            <div styleName='level-button-group'>
              <ButtonGroup>
                <Button disabled styleName='view-btn-regular'>快速浏览第</Button>
                {this.renderViewButtons('view')}
                <Button disabled styleName='view-btn-regular'>重</Button>
              </ButtonGroup>
            </div>
            <div styleName='level-button-group'>
              <ButtonGroup>
                <Button styleName='view-btn-regular-with-hover'>
                  <span className='normal'>快速点满前</span>
                  <span className='hover'>清空本心法</span>
                </Button>
                {this.renderViewButtons('chongxue')}
                <Button disabled styleName='view-btn-regular'>重</Button>
              </ButtonGroup>
            </div>
            <div>
              <p>潜修</p>
              <div styleName='qianxiu-wrapper'>
                {this.renderQianxiu()}
              </div>
            </div>
          </div>
        }
      </WuxiaPanel>
    );
  }
}

function mapStateToProps(state) {

  let fulfilledLevel;
  let curLevelBrkthruData;
  let qianxiuData;
  let skillLevelsData;
  let allXinfaBrkthruData = state.brkthruData.chongxue[state.brkthruData.current];

  if(state.xinfaData.name){
    // todo
    console.log(state.xinfaData);
    console.log(allXinfaBrkthruData);
    console.log(state.brkthruData);
    fulfilledLevel = allXinfaBrkthruData[state.xinfaData.name].fulfilledLevel;
    curLevelBrkthruData = allXinfaBrkthruData[state.xinfaData.name].curLevelCX;
    qianxiuData = allXinfaBrkthruData[state.xinfaData.name].qianxiuLevels;
    skillLevelsData = allXinfaBrkthruData[state.xinfaData.name].skillLevels;
  }

  return {
    xinfaData: state.xinfaData,
    brkthruData: state.brkthruData,
    fulfilledLevel,
    curLevelBrkthruData,
    qianxiuData,
    skillLevelsData
  };
}

export default connect(mapStateToProps, {
  fastFulFillLevels,
  fastBrkthruShuji,
  chongxue,
  selectQianxiuLevel,
  selectSkillLevel
})(XinfaShuji);