import React, { Component } from 'react';
import {connect} from "react-redux";
import onClickOutside from "react-onclickoutside";
import range from 'lodash/range';
import {Button, Col, Row, Table} from "react-bootstrap";

import { chongxue, fastBrkthruShuji } from "../actions/index";

import propsMap from '../assets/json/propAbbrMapName.json';

const shujiPicPath = require.context('../assets/imgs/shuji_icon/compressed', true);
const gemPngPicPath = require.context('../assets/imgs/gem_icon_png', true);

import './css/shuji_tooltip.css';

class ShujiTooltip extends Component {

  constructor(props) {
    super(props);

    this.state = {
      canBreak: false,
      canSingleBreak: false,
      canSingleCancelAll: false,
      canFastBreak: false,
      canFastCancel: false
    };

    this.singleBreak = this.singleBreak.bind(this);
    this.singleCancel = this.singleCancel.bind(this);
    this.fastBreak = this.fastBreak.bind(this);
    this.fastCancel = this.fastCancel.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if(newProps.xinfaData.name) {
      // 根据枢机位置数据判断枢机类型、判断冲穴类型
      let shujiMap = newProps.xinfaData.brkthruLevels[newProps.curLevel].shujiMap;
      let shujiId;
      if(!shujiMap.hasOwnProperty(newProps.shujiId))
        shujiId = 0;
      else
        shujiId = newProps.shujiId;
      let shujiData = shujiMap[shujiId];

      // console.log(newProps.xinfaData.brkthruLevels);

      let parentShuji = shujiData.parent;
      let childrenShujis = shujiData.children;

      let canBreak = false;
      let selfBreaked = false;
      let hasChildBreaked = false;
      let hasParentBreaked = false;

      if(newProps.curLevel <= newProps.fulfilledLevel) {
        // 当前层已完全填满，不允许任何操作
        canBreak = false;
      } else if(newProps.curLevel > newProps.fulfilledLevel + 1) {
        // 当前层仍未冲穴，不允许任何操作
        canBreak = false;
      } else if(newProps.curLevel === newProps.fulfilledLevel + 1) {
        // 正在冲穴的层，支持各种操作
        // 判断自身是否已经冲穴
        selfBreaked = !!newProps.curLevelBrkthruData[shujiId];
        // 判断是否有父子节点，确定当前枢机普通冲穴形式
        let parentShujiBrkthruData = newProps.curLevelBrkthruData[parentShuji];
        if(parentShujiBrkthruData) {
          // 父节点存在且已冲穴，当前枢机可能可以随意冲穴
          canBreak = true;
          hasParentBreaked = true;
        } else {
          // 父节点未冲穴，当前枢机不可冲穴
          // 可以快速点满此枢机（含）及其前方枢机（每个穴位点一重），父节点未点即可
          // 可以快速点满此枢机（含）及其前方枢机（每个穴位点满），父节点未点即可
          canBreak = true;
          hasParentBreaked = false;
        }
        let isChildrenBreaked = childrenShujis.length !== 0 && childrenShujis.some((childId) => {
          let level = newProps.curLevelBrkthruData[childId]; // undefined 或 0 或 有
          return !!level;
        });

        if(!isChildrenBreaked) {
          // 子节点没有点，当前枢机可以完全清空
          canBreak = true;
          hasChildBreaked = false;
        } else {
          // 子节点点过，当前枢机不能清空至0
          // 可以快速清空此枢机（不含）后方所有枢机，此枢机子节点点过即可
          canBreak = true;
          hasChildBreaked = true;
        }
      }

      // 最后判断一元穴，不允许单枢机任何操作
      let isYiyuan = false;
      if(shujiId === 0)
        isYiyuan = true;

      // 更新状态
      this.setState({
        canBreak: canBreak,
        canSingleBreak: hasParentBreaked && !isYiyuan,
        canSingleCancelAll: hasParentBreaked && !hasChildBreaked && selfBreaked && !isYiyuan,
        canFastBreak: !hasParentBreaked && !isYiyuan,
        canFastCancel: hasChildBreaked || isYiyuan
      });
    }
  }

  handleClickOutside(event) {
    this.props.changeVisibility(false);
  }

  singleBreak(level) {
    this.props.chongxue(
      this.props.xinfaData.name,
      this.props.curLevel,
      this.props.shujiId,
      level
    );
  }

  singleCancel() {
    this.props.chongxue(
      this.props.xinfaData.name,
      this.props.curLevel,
      this.props.shujiId,
      0
    );
  }

  fastBreak(levels) {
    // 直接溯源遍历构建一个数组
    let shujiIdLevelList = [];
    let breakData = this.props.curLevelBrkthruData;
    let shujiList = this.props.xinfaData.brkthruLevels[this.props.curLevel].shujiMap;

    let curShujiId = this.props.shujiId;
    while(true) {
      if(!breakData[curShujiId]) {
        let level;
        if(levels > 0) {
          // 每个枢机点levels重
          level = 1;
        } else if(levels === -1) {
          // 全部点满
          level = shujiList[curShujiId].levels.length;
        }
        shujiIdLevelList.push({
          shujiId: curShujiId,
          shujiLevel: level
        });
        // 溯源
        curShujiId = shujiList[curShujiId].parent;
      } else {
        break;
      }
    }
    this.props.fastBrkthruShuji(
      this.props.xinfaData.name,
      this.props.curLevel,
      shujiIdLevelList
    );
  }

  fastCancel() {
    // 深度优先遍历构建一个数组，不需要判断是否已冲穴
    let shujiIdLevelList = [];
    let shujiList = this.props.xinfaData.brkthruLevels[this.props.curLevel].shujiMap;

    function dfs(shujiId) {
      shujiIdLevelList.push({
        shujiId: shujiId,
        shujiLevel: 0
      });
      shujiList[shujiId].children.forEach((childId) => {
        dfs(childId);
      })
    }
    dfs(this.props.shujiId);
    // 去除数组第一个元素
    shujiIdLevelList = shujiIdLevelList.slice(1);

    console.log("list",shujiIdLevelList);

    this.props.fastBrkthruShuji(
      this.props.xinfaData.name,
      this.props.curLevel,
      shujiIdLevelList
    );
  }

  renderLevels() {
    let allChongxueData = this.props.brkthruData.chongxue[this.props.brkthruData.current];
    let chongxueData = allChongxueData[this.props.xinfaData.name];
    let levelList = [];

    this.props.shuji.levels.reduce((a, b, i) => {
      levelList[i] = (
        <tr
          key={i}
          styleName={i + 1 === this.props.curLevelBrkthruData[this.props.shujiId] ? 'level-table-current' : 'level-table-others'}
        >
          {/*当前层*/}
          <td>{i + 1}</td>
          {/*当前修为*/}
          <td>{b.xiuwei}</td>
          {/*累计修为*/}
          <td>{a + parseInt(b.xiuwei)}</td>
          {/*属性值*/}
          <td>{b.props[0]}</td>
          {this.props.shuji.types.length >= 2 ?
            <td>{b.props[1]}</td>
            : null
          }
          {this.props.shuji.types.length >= 3 ?
            <td>{b.props[2]}</td>
            : null
          }
          {/*单枢机点穴、取消*/}
          { this.state.canBreak && this.state.canSingleBreak &&
            <td key='点'>
              <Button
                onClick={(e) => this.singleBreak(i + 1, e)}
                disabled={false}
                bsSize="xsmall"
                bsStyle='primary'
                styleName="chongxue-btn"
              >
                点
              </Button>
            </td>
          }
        </tr>
      );
      return a + parseInt(b.xiuwei);
    }, 0);

    // console.log(levelList);
    return levelList;
  }

  render() {
    if(this.props.shuji.types) {
      switch(this.props.type) {
        case 'shuji':
          return (
            <div>
              <div styleName='tooltip' style={{
                top: this.props.top - 20,
                visibility: this.props.visibility
              }}>
                <Row xs={12}>
                  <Col xs={12} sm={4}>
                    <div styleName='tooltip-basic-info'>
                      {/*基本信息*/}
                      <h3>{this.props.shuji.name}</h3>
                      {
                        this.props.shuji.isGemShuji ?
                          <img styleName='shuji-info-img' src={gemPngPicPath('./' + this.props.shuji.levels[0].gem.name + '.png', true)} />
                          :
                          <img styleName='shuji-info-img' src={shujiPicPath('./' + this.props.shuji.types[0] + '.svg', true)} />
                      }
                      <p>
                        当前点满 {this.props.curLevelBrkthruData[this.props.shujiId] || 0} 重
                      </p>
                    </div>
                  </Col>
                  <Col xs={12} sm={8}>
                    <Table bordered condensed>
                      <thead>
                      <tr>
                        <th>重</th>
                        <th>单重修为</th>
                        <th>累计修为</th>
                        {/*该枢机的属性*/}
                        {range(this.props.shuji.types.length).map((index) => {
                          return <th key={index}>{propsMap[this.props.shuji.types[index]]}</th>
                        })}
                        { this.state.canBreak && this.state.canSingleBreak &&
                          <th>点至(含)</th>
                        }
                      </tr>
                      </thead>
                      <tbody>
                      {this.renderLevels()}
                      </tbody>
                    </Table>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    { this.state.canBreak && this.state.canSingleCancelAll &&
                    <Button
                      bsStyle='primary'
                      bsSize='xsmall'
                      onClick={this.singleCancel}
                    >
                      清空此枢机
                    </Button>
                    }{' '}
                    { this.state.canBreak && this.state.canFastBreak &&
                    <Button bsSize='xsmall' bsStyle='primary'
                            onClick={(e) => this.fastBreak(1, e)}
                    >
                      点满此枢机（含）及前方枢机（各穴位点一重）
                    </Button>
                    }{' '}
                    { this.state.canBreak && this.state.canFastBreak &&
                    <Button bsSize='xsmall' bsStyle='primary'
                      onClick={(e) => this.fastBreak(-1, e)}
                    >
                      点满此枢机（含）及前方枢机（各穴位全点满）
                    </Button>
                    }{' '}
                    { this.state.canBreak && this.state.canFastCancel &&
                    <Button bsSize='xsmall' bsStyle='primary'
                      onClick={this.fastCancel}
                    >
                      清空此枢机（不含）及后方枢机
                    </Button>
                    }{' '}

                  </Col>
                </Row>
              </div>
              <div styleName='tooltip-arrow'
                   style={{
                     top: this.props.top - 20,
                     left: this.props.left - 10,
                     visibility: this.props.visibility
                   }}
              />
            </div>
          );
        case 'stone':
          return (
            <div>石头</div>
          );
      }
    }else{
      return null;
    }
  }
}



function mapStateToProps(state) {
  let allXinfaBrkthruData = state.brkthruData.chongxue[state.brkthruData.current];
  let fulfilledLevel = null;
  let curLevelBrkthruData = null;

  if(state.xinfaData.name){
    fulfilledLevel = allXinfaBrkthruData[state.xinfaData.name].fulfilledLevel;
    curLevelBrkthruData = allXinfaBrkthruData[state.xinfaData.name].curLevelCX;
  }

  return {
    xinfaData: state.xinfaData,
    brkthruData: state.brkthruData, // todo
    fulfilledLevel,
    curLevelBrkthruData: curLevelBrkthruData
  };


  // return {
  //   xinfaData: state.xinfaData,
  //   brkthruData: state.brkthruData
  // };
}

export default connect(mapStateToProps, {
  chongxue,
  fastBrkthruShuji

})(onClickOutside(ShujiTooltip));