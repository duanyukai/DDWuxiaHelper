import React, { Component } from 'react';
import {connect} from "react-redux";
import {Button, ButtonGroup, Tab, Table, Tabs} from "react-bootstrap";

import PropsTable from '../components/props_table';

import WuxiaPanel from '../../tiandao_ui/panel';

import './css/xinfa_props.css';

import {calcXinfaProps, calcGongli, calcZhanli, calcSchoolProps} from '../utils/calcProps';

class XinfaProps extends Component {
  constructor(props) {
    super(props);

    this.state = {
      xinfaProps: {
        xiuwei: 0,
        stones: [],
        stoneExp: 0,
        ld: 0, gg: 0, qj: 0, dc: 0, sf: 0,
        wg: 0, ng: 0, wf: 0, nf: 0,
        mz: 0, gd: 0, hx: 0, rj: 0, hs: 0, qx: 0,
        gongliOffset: 0
      },
      xinfaSchoolProps: {
        xiuwei: 0,
        stones: [],
        stoneExp: 0,
        ld: 0, gg: 0, qj: 0, dc: 0, sf: 0,
        wg: 0, ng: 0, wf: 0, nf: 0,
        mz: 0, gd: 0, hx: 0, rj: 0, hs: 0, qx: 0,
        gongliOffset: 0
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.xinfaData.name) {
      // this.calc(nextProps);
      let props = calcXinfaProps(nextProps.xinfaData, nextProps.brkthruData);
      let schoolProps = calcSchoolProps(props, 'TB');
      this.setState({
        xinfaProps: props,
        xinfaSchoolProps: schoolProps
      });
    }
  }

  render() {
    return(
      <WuxiaPanel title='心法概况'>
        <div>
          本心法属性：
          <Tabs defaultActiveKey={1} id='xinfa-props-tabs' styleName='xinfa-props-tabs'>
            <Tab eventKey={1} title='裸属性'>
              <PropsTable xinfaProps={this.state.xinfaProps} />
            </Tab>
            <Tab eventKey={2} title='门派加成属性'>
              制作中……（需要有门派、上赛季论剑、本赛季论剑、名望等级、神兵等设置）
              {/*放在设置里，只标记说明？还是可以选择？ 神兵*/}
              <ButtonGroup>
                <Button>太白</Button>
                <Button>真武</Button>
                <Button>天香</Button>
                <Button>唐门</Button>
                <Button>神威</Button>
                <Button>五毒</Button>
                <Button>丐帮</Button>
                <Button>神刀</Button>
              </ButtonGroup>
              太白加成：
              <PropsTable xinfaProps={this.state.xinfaSchoolProps} />
            </Tab>
          </Tabs>
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