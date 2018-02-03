import React, { Component } from 'react';
import {connect} from "react-redux";
import {Button, ButtonGroup, Modal, Tab, Table, Tabs} from "react-bootstrap";

import PropsTable from '../components/props_table';
import WuxiaPanel from '../../tiandao_ui/panel';
import './css/xinfa_props.css';
import {calcXinfaProps, calcGongli, calcZhanli, calcSchoolProps, calcAdditionProps} from '../utils/calcProps';

const gemPngPicPath = require.context('../assets/imgs/gem_icon_png', true);


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
      },

      showGemModal: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.xinfaData.name) {
      // this.calc(nextProps);
      let props = calcXinfaProps(nextProps.xinfaData, nextProps.brkthruData);
      let schoolProps = calcAdditionProps(props, nextProps.brkthruData);
      this.setState({
        xinfaProps: props,
        xinfaSchoolProps: schoolProps
      });
    }
  }

  renderGemModal() {
    return (
      <div>
        <Modal show={this.state.showGemModal} onHide={() => this.setState({showGemModal: false})}
               styleName='wuxia-modal-wrapper'>
          <Modal.Body styleName='wuxia-modal'>
            <WuxiaPanel title='砭石需求' closeBtn onClose={() => this.setState({showGemModal: false})}>
              <div styleName='gem-panel'>
                { this.state.xinfaProps.stones ?
                  this.state.xinfaProps.stones.map((stone, i) => {
                    let colorTable = ['#fff', '#61ff61', '#5757ff', '#ff4dff', '#ffff4d'];
                    let colorId;
                    if(stone.stoneName.includes('一'))
                      colorId = 0;
                    else if(stone.stoneName.includes('二'))
                      colorId = 1;
                    else if(stone.stoneName.includes('三'))
                      colorId = 2;
                    else if(stone.stoneName.includes('四'))
                      colorId = 3;
                    else if(stone.stoneName.includes('五'))
                      colorId = 4;
                    return (
                      <div key={i}>
                        <img src={gemPngPicPath(`./${stone.stoneName}.png`, true)} />
                        <span
                          styleName='gem-name'
                          style={{
                            color: colorTable[colorId]
                          }}
                        >{stone.stoneName}</span>
                        <span styleName='gem-des'>（{stone.stoneLevel}级，第{stone.brkthruLevel}重{stone.shujiId}号枢机）</span>
                      </div>
                    )
                  }) :
                  '无砭石需求'
                }
                {this.state.xinfaProps.stones && this.state.xinfaProps.stones.length === 0 && '无砭石需求'}
              </div>
            </WuxiaPanel>
          </Modal.Body>
        </Modal>
      </div>
    );
  }

  render() {
    return(
      <WuxiaPanel title='心法概况'>
        <div>
          本心法属性（门派等配置在上方面板）：
          <Tabs defaultActiveKey={1} id='xinfa-props-tabs' styleName='xinfa-props-tabs'>
            <Tab eventKey={1} title='裸属性'>
              <PropsTable xinfaProps={this.state.xinfaProps} />
            </Tab>
            <Tab eventKey={2} title='门派加成属性'>
              <PropsTable
                gongliUsedProps={this.state.xinfaProps}
                xinfaProps={this.state.xinfaSchoolProps}
              />
            </Tab>
          </Tabs>
        </div>

        <div>
          本心法所耗修为：
          <span style={{fontSize: '16px'}}>{ this.state.xinfaProps.xiuwei }</span>
        </div>
        <div>
          <Button
            block bsStyle='primary'
            onClick={() => {this.setState({showGemModal: true})}}
          >
            显示所需砭石
          </Button>
          {this.state.showGemModal && this.renderGemModal()}
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