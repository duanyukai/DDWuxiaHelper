import React, { Component } from 'react';
import {connect} from "react-redux";
import {Button, Table} from "react-bootstrap";

import PropsTable from '../components/props_table';

import WuxiaPanel from '../../tiandao_ui/panel';

import './css/xinfa_props.css';

import { calcXinfaProps, calcGongli, calcZhanli } from '../utils/calcProps';

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
    if(nextProps.xinfaData.name) {
      // this.calc(nextProps);
      let props = calcXinfaProps(nextProps.xinfaData, nextProps.brkthruData);
      this.setState({
        xinfaProps: props
      });
    }
  }

  render() {
    return(
      <WuxiaPanel title='心法概况'>
        <div>
          本心法属性：
          <div>
            {/*{JSON.stringify(this.props.curLevelBrkthruData)}*/}
          </div>
          <PropsTable xinfaProps={this.state.xinfaProps} />
        </div>

        <div>
          本心法所耗修为：
          <span style={{fontSize: '16px'}}>{ this.state.xinfaProps.xiuwei }</span>
        </div>
        <div>
          <Button block bsStyle='primary'>显示所需砭石（UI更新制作中）</Button>
        </div>
        <div>
          本心法所需砭石（共{this.state.xinfaProps.stoneExp}经验）（UI将改动）：
          { this.state.xinfaProps.stones &&
            this.state.xinfaProps.stones.map((stone, i) => {
              return (
                <div key={i}>{stone.stoneName}（{stone.stoneLevel}级，第{stone.brkthruLevel}重{stone.shujiId}号枢机）</div>
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
  let fulfilledLevel;
  let curLevelBrkthruData;
  let qianxiuData;

  if(state.xinfaData.name){
    fulfilledLevel = allXinfaBrkthruData[state.xinfaData.name].fulfilledLevel;
    curLevelBrkthruData = allXinfaBrkthruData[state.xinfaData.name].curLevelCX;
    qianxiuData = allXinfaBrkthruData[state.xinfaData.name].qianxiuLevels;
  }

  return {
    xinfaData: state.xinfaData,
    brkthruData: state.brkthruData,
    fulfilledLevel,
    curLevelBrkthruData,
    qianxiuData
  };
}

export default connect(mapStateToProps, {  })(XinfaProps);