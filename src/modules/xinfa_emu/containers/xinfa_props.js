import React, { Component } from 'react';
import {connect} from "react-redux";
import {Table} from "react-bootstrap";

import WuxiaPanel from '../../tiandao_ui/panel';

import './css/xinfa_props.css';

class XinfaProps extends Component {
  constructor(props) {
    super(props);

    this.state = {
      xinfaProps: {
        xiuwei: 0,
        stones: [],
        stoneExp: 0,
        ld: 0,
        gg: 0,
        qj: 0,
        dc: 0,
        sf: 0,

        wg: 0,
        ng: 0,
        wf: 0,
        nf: 0,

        mz: 0,
        gd: 0,
        hx: 0,
        rj: 0,
        hs: 0,
        qx: 0
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.fulfilledLevel)
      this.calc(nextProps);
  }

  calcLevelTotalXiuwei(level) {
    let sum = 0;
    for(let i = 0; i < level; i++) {
      let shujiList = this.props.xinfaData.brkthruLevels[i].shujiMap;
      Object.keys(shujiList).forEach((shujiId) => {
        sum += shujiList[shujiId].levels.reduce((a, b) => {
          return a + parseInt(b.xiuwei)
        }, 0);
      });
    }
    return sum;
  }

  calcXiuwei() {
    let sum = 0;
    let xiuweiPreviousLevel = this.calcLevelTotalXiuwei(this.props.fulfilledLevel);

    console.log(this.props.curLevelBrkthruData);
    console.log(this.props.xinfaData);
    console.log(this.props.fulfilledLevel + 1);

    for(let shujiId in this.props.curLevelBrkthruData) {
      if(this.props.curLevelBrkthruData.hasOwnProperty(shujiId)) {
        let shujiLevel = this.props.curLevelBrkthruData[shujiId];
        for(let i = 0; i < shujiLevel; i++) {
          console.log("shujiid", shujiId);
          sum += parseInt(this.props.xinfaData.brkthruLevels[this.props.fulfilledLevel + 1].shujiMap[shujiId].levels[shujiLevel - 1].xiuwei);
          console.log(shujiLevel);
          console.log(this.props.xinfaData.brkthruLevels[this.props.fulfilledLevel + 1].shujiMap[shujiId].levels[shujiLevel - 1].xiuwei);
        }
      }
    }

    return sum + xiuweiPreviousLevel;
  }

  calc(nextProps) {
    let xinfaProps = {
      xiuwei: 0,
      stones: [],
      stoneExp: 0,
      ld: 0,
      gg: 0,
      qj: 0,
      dc: 0,
      sf: 0,

      wg: 0,
      ng: 0,
      wf: 0,
      nf: 0,

      mz: 0,
      gd: 0,
      hx: 0,
      rj: 0,
      hs: 0,
      qx: 0
    };

    let stoneData = [];

    // 添加前面已点满层数据
    for(let brkthruLevel = 0; brkthruLevel <= nextProps.fulfilledLevel; brkthruLevel++) {
      let shujiList = nextProps.xinfaData.brkthruLevels[brkthruLevel].shujiMap;
      Object.keys(shujiList).forEach((shujiId) => {
        //当前枢机
        let shujiTypes = shujiList[shujiId].types;
        let shujiLevels = shujiList[shujiId].levels;
        let topLevelProps = shujiLevels[shujiLevels.length - 1].props;

        // 计算修为总和
        shujiLevels.forEach((shujiLevel) => {
          xinfaProps["xiuwei"] += shujiLevel.xiuwei;
        });

        // 计算属性
        shujiTypes.forEach((type, i) => {
           switch(type) {
             case "5d":
                xinfaProps["ld"] += topLevelProps[i];
                xinfaProps["gg"] += topLevelProps[i];
                xinfaProps["qj"] += topLevelProps[i];
                xinfaProps["dc"] += topLevelProps[i];
                xinfaProps["sf"] += topLevelProps[i];
               break;
             case "nwf":
               xinfaProps["ng"] += topLevelProps[i];
               xinfaProps["wg"] += topLevelProps[i];
               break;
             default:
               xinfaProps[type] += topLevelProps[i];
           }
        });

        // 统计石头信息
        if(shujiLevels[0].gem) {
          stoneData.push({
            brkthruLevel: brkthruLevel,
            shujiId: shujiId,
            stoneName: shujiLevels[0].gem.name,
            stoneLevel: shujiLevels[0].gem.level
          });
        }

      });
    }
    // 当前层冲穴数据
    for(let shujiId in this.props.curLevelBrkthruData) {
      if(this.props.curLevelBrkthruData.hasOwnProperty(shujiId)) {
        console.log("vbbbbbbbb", this.props.xinfaData.brkthruLevels[this.props.fulfilledLevel + 1]);
        console.log("vbbbbbbbb", this.props.xinfaData.brkthruLevels);
        console.log("vbbbbbbbb", this.props.fulfilledLevel);

        let shujiList = this.props.xinfaData.brkthruLevels[this.props.fulfilledLevel + 1].shujiMap;
        let shujiTypes = shujiList[shujiId].types;
        let shujiCurTopLevel = this.props.curLevelBrkthruData[shujiId];
        let shujiLevels = shujiList[shujiId].levels;
        let curTopLevelProps = shujiLevels[shujiCurTopLevel - 1].props;

        // 计算修为
        for(let i = 0; i < shujiCurTopLevel; i++) {
          // todo 满级属性
          xinfaProps.xiuwei += parseInt(shujiList[shujiId].levels[i].xiuwei);
        }
        // 计算属性
        shujiTypes.forEach((type, i) => {
          switch(type) {
            case "5d":
              xinfaProps["ld"] += curTopLevelProps[i];
              xinfaProps["gg"] += curTopLevelProps[i];
              xinfaProps["qj"] += curTopLevelProps[i];
              xinfaProps["dc"] += curTopLevelProps[i];
              xinfaProps["sf"] += curTopLevelProps[i];
              break;
            case "nwf":
              xinfaProps["ng"] += curTopLevelProps[i];
              xinfaProps["wg"] += curTopLevelProps[i];
              break;
            default:
              xinfaProps[type] += curTopLevelProps[i];
          }
        });

        // 统计石头信息
        if(shujiLevels[0].stones) {
          stoneData.push({
            brkthruLevel: this.props.fulfilledLevel + 1,
            shujiId: shujiId,
            stoneName: shujiLevels[0].stones.name,
            stoneLevel: shujiLevels[0].stones.level
          });
        }
      }
    }

    xinfaProps.stones = stoneData;
    // todo 石头经验计算

    xinfaProps.stoneExp = 233;

    this.setState({
      xinfaProps: xinfaProps
    });
  }

  render() {
    return(
      <WuxiaPanel title='心法概况'>
        <div>
          本心法属性：
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
              <td>力道</td><td>{this.state.xinfaProps.ld}</td></tr>
            <tr>
              <td>功力</td><td>xxxxx</td>
              <td>根骨</td><td>{this.state.xinfaProps.gg}</td></tr>
            <tr>
              <td>战力</td><td>xxxxx</td>
              <td>气劲</td><td>{this.state.xinfaProps.qj}</td></tr>
            <tr>
              <td>气血</td><td>{this.state.xinfaProps.qx}</td>
              <td>洞察</td><td>{this.state.xinfaProps.dc}</td></tr>
            <tr>
              <td></td><td></td>
              <td>身法</td><td>{this.state.xinfaProps.sf}</td></tr>

            <tr>
              <td>外攻</td><td>{this.state.xinfaProps.wg}</td>
              <td>外防</td><td>{this.state.xinfaProps.wf}</td>
            </tr>
            <tr>
              <td>内攻</td><td>{this.state.xinfaProps.ng}</td>
              <td>内防</td><td>{this.state.xinfaProps.nf}</td>
            </tr>

            <tr>
              <td>命中</td><td>{this.state.xinfaProps.mz.toFixed(3)}</td>
              <td>格挡</td><td>{this.state.xinfaProps.gd.toFixed(3)}</td>
            </tr>
            <tr>
              <td>会心</td><td>{this.state.xinfaProps.hx.toFixed(3)}</td>
              <td>韧劲</td><td>{this.state.xinfaProps.rj.toFixed(3)}</td>
            </tr>
            <tr>
              <td>会伤</td><td>{this.state.xinfaProps.hs.toFixed(3)}</td>
              <td></td><td></td>
            </tr>
            </tbody>
          </Table>
        </div>

        <div>
          本心法所耗修为：
          { this.state.xinfaProps.xiuwei }
        </div>
        <div>
          本心法所需砭石（共{this.state.xinfaProps.stoneExp}经验）：
          { this.state.xinfaProps.stones &&
            this.state.xinfaProps.stones.map((stone) => {
              return (
                <div>{stone.stoneName}（{stone.stoneLevel}级，第{stone.brkthruLevel}重{stone.shujiId}号枢机）</div>
              )
            })
          }
        </div>

      </WuxiaPanel>
    );
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
    fulfilledLevel,
    curLevelBrkthruData: curLevelBrkthruData
  };
}

export default connect(mapStateToProps, {  })(XinfaProps);