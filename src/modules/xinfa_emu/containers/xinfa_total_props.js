import React, { Component } from 'react';
import {connect} from 'react-redux';
import {
  Button, ButtonGroup, Dropdown, Glyphicon, DropdownItem, Modal, Tab, Tabs
} from 'react-bootstrap';

import './css/xinfa_config.css';

import { selectXinfa, changeXinfaConfig, placeXinfaSlot, copyConfig, removeAllLocalData } from '../actions';

import WuxiaPanel from '../../tiandao_ui/panel';
import PropsTable from '../components/props_table';

import {
  calcAdditionProps,
  calcConfigProps, calcGongli, calcXinfaProps, calcZhanli, xinfaPropsMultiply,
  xinfaPropsPlus
} from '../utils/calcProps';

class XinfaConfig extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showCurConfigModal: false,
      curConfigFinish: false,

      showConfigDiffModal: false,
      configDiffFinish: false,

      showSchoolConfigModal: false,

      xinfaConfigProps: {},
      configDiffProps: {},

      configDiffFrom: 0,
      configDiffTo: 0,
      configCopyFrom: 0,
      configCopyTo: 0
    };

    this.calcCurConfigProps = this.calcCurConfigProps.bind(this);
  }

  componentDidMount() {
    this.updateXinfaTotalProps(this.props.brkthruData.current);
  }

  componentWillReceiveProps(newProps) {
    if(
      this.props.brkthruData.current !== newProps.brkthruData.current
    ) {
      this.updateXinfaTotalProps(newProps.brkthruData.current);
    }
    console.log("心法槽数据", this.props.slotsData, newProps.brkthruData.slots[newProps.brkthruData.current]);

    for(let i = 0; i < 4; i++) { // todo 心法槽数量
      if(this.props.slotsData[i] !== newProps.slotsData[i]) {
        this.updateXinfaTotalProps(newProps.brkthruData.current);
        break;
      }
    }
  }

  updateXinfaTotalProps(id) {
    this.calcCurConfigProps(id);
  }

  getConfigXinfaDataListPromise(configIndex) {
    let slotsData = this.props.brkthruData.slots[configIndex];

    let xinfaPromises = [];
    // 获取基本数据
    for(let i = 0; i < 4; i++) {
      if(slotsData[i]) {
        let xinfaName = slotsData[i];
        xinfaPromises[i] = import(`../assets/json/xinfa/${xinfaName}.json`);
      } else {
        xinfaPromises[i] = null;
      }
    }
    return Promise.all(xinfaPromises);
  }

  calcCurConfigProps(id) {
    let self = this;

    // this.getConfigXinfaDataListPromise(this.props.brkthruData.current)
    this.getConfigXinfaDataListPromise(id)
      .then((xinfaDataList) => {
      // 计算属性
      let xinfaProps = calcConfigProps(xinfaDataList, this.props.brkthruData);

      self.setState({
        xinfaConfigProps: xinfaProps,
        curConfigFinish: true
      });
    });
  }

  render() {
    return(
      <WuxiaPanel title='心法总属性'>
        <span>当前4本心法总属性：</span>
        <div>
          <Tabs defaultActiveKey={1} id='xinfa-props-tabs' styleName='xinfa-props-tabs'>
            <Tab eventKey={1} title='裸属性'>
              <PropsTable xinfaProps={this.state.xinfaConfigProps}/>
            </Tab>
            <Tab eventKey={2} title='门派加成属性'>
              <PropsTable
                gongliUsedProps={this.state.xinfaConfigProps}
                xinfaProps={calcAdditionProps(this.state.xinfaConfigProps, this.props.brkthruData)}
              />
            </Tab>
          </Tabs>
        </div>
      </WuxiaPanel>
    );
  }
}


function mapStateToProps(state) {
  // let curConfigData = state.brkthruData.chongxue[state.brkthruData.current];
  let slotsData = {...state.brkthruData.slots[state.brkthruData.current]};
  return {
    brkthruData: state.brkthruData,
    slotsData: slotsData
  };
}

export default connect(mapStateToProps, {
  selectXinfa,
  changeXinfaConfig,
  placeXinfaSlot,
  copyConfig,
  removeAllLocalData
})(XinfaConfig);