import React, { Component } from 'react';
import {connect} from 'react-redux';
import range from 'lodash/range';
import {
  Button, ButtonGroup, Dropdown, Glyphicon, MenuItem, Modal, Row, Tab, Tabs
} from 'react-bootstrap';

import './css/xinfa_config.css';

import { selectXinfa, changeXinfaConfig, placeXinfaSlot, copyConfig, removeAllLocalData } from '../actions';

import WuxiaPanel from '../../tiandao_ui/panel';
import PropsTable from '../components/props_table';
import AdditionConfig from './addition_config';


import xinfaBgBlank from '../assets/imgs/ui/xinfa_bg_blank.png';
const xinfaPicPath = require.context('../assets/imgs/xinfa_icon', true);

import {
  calcAdditionProps,
  calcConfigProps, calcGongli, calcXinfaProps, calcZhanli, xinfaPropsMultiply,
  xinfaPropsPlus
} from '../utils/calcProps';

const ConfigSelector = (props) => {
  let digits = ['壹', '贰', '叁', '肆', '伍'];
  return(
    <span>
      <Dropdown id='config-selector'>
        <Dropdown.Toggle bsStyle='primary' bsSize='small'>{digits[props.index]}</Dropdown.Toggle>
        <Dropdown.Menu styleName='config-selector-menu'>
          {
            digits.map((name, i) => (
              <MenuItem
                eventKey={i}
                key={i}
                onSelect={(e) => props.setIndex(i)}
              >{name}</MenuItem>
            ))
          }
        </Dropdown.Menu>
      </Dropdown>{' '}
    </span>
  );
};

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

    this.handleCurConfigShow = this.handleCurConfigShow.bind(this);
    this.handleCurConfigClose = this.handleCurConfigClose.bind(this);
    this.calcCurConfigProps = this.calcCurConfigProps.bind(this);
    this.handleConfigCopy = this.handleConfigCopy.bind(this);

    this.handleConfigDiff = this.handleConfigDiff.bind(this);
    this.handleConfigDiffShow = this.handleConfigDiffShow.bind(this);
    this.handleConfigDiffClose = this.handleConfigDiffClose.bind(this);

    this.handleSchoolConfigShow = this.handleSchoolConfigShow.bind(this);
    this.handleSchoolConfigClose = this.handleSchoolConfigClose.bind(this);

    this.handleRemoveAll = this.handleRemoveAll.bind(this);
  }

  switchConfig(id) {
    this.props.selectXinfa(null); // 切换至空白心法
    this.props.changeXinfaConfig(id);
  }

  renderConfig() {
    return [
      [0, '壹'],
      [1, '贰'],
      [2, '叁'],
      [3, '肆'],
      [4, '伍']
    ].map((arr) => {

      return (
        <Button
          key={arr[0]}
          styleName='view-btn-regular'
          onClick={this.switchConfig.bind(this, arr[0])}
          style={{
            background: arr[0] === this.props.brkthruData.current ? '#337ab7' : null
          }}
        >
          {arr[1]}
        </Button>
      )
    });
  }

  renderSlots() {
    return range(4).map((index) => {
      return(
        <div key={index} styleName='xinfa-slots'>
          <img
            styleName='xinfa-slot-img'
            src={
              this.props.slotsData[index] ? xinfaPicPath('./' + this.props.slotsData[index] + '.png', true) : xinfaBgBlank
            }
            onClick={() => this.props.selectXinfa(this.props.slotsData[index])}
          />
          <span styleName='xinfa-slot-name'>{this.props.slotsData[index] || '空'}</span>
          <span
            styleName='xinfa-slot-close'
            onClick={() => this.props.placeXinfaSlot(index, null)}
          >
            <Glyphicon glyph='remove' />
          </span>
        </div>
      );
    })
  }

  getConfigXinfaDataListPromise(configIndex) {
    let slotsData = this.props.brkthruData.slots[configIndex];

    let xinfaPromises = [];
    // 获取基本数据
    for(let i = 0; i < 4; i++) {
      if(slotsData[i]) {
        let xinfaName = slotsData[i];
        let xinfaDataPromise = import(`../assets/json/xinfa/${xinfaName}.json`);
        xinfaPromises.push(xinfaDataPromise);
      }
    }

    return Promise.all(xinfaPromises);
  }

  calcCurConfigProps() {
    let self = this;

    this.getConfigXinfaDataListPromise(this.props.brkthruData.current)
      .then((xinfaDataList) => {
      // 计算属性
      let xinfaProps = calcConfigProps(xinfaDataList, this.props.brkthruData);

      self.setState({
        xinfaConfigProps: xinfaProps,
        curConfigFinish: true
      });
    });
  }

  handleConfigCopy() {
    if(confirm('是否确认复制配置？这将复制该配置所有心法枢机、技能、潜修等数据。')) {
      // 复制配置
      this.props.copyConfig(this.state.configCopyFrom, this.state.configCopyTo);
    }
  }

  handleConfigDiff() {
    // 先显示框
    this.handleConfigDiffShow();
    let self = this;
    // 获取两个配置的8本心法
    let promises = [];
    promises[0] = this.getConfigXinfaDataListPromise(this.state.configDiffFrom);
    promises[1] = this.getConfigXinfaDataListPromise(this.state.configDiffTo);
    Promise.all(promises).then((xinfaDataLists) => {
      let propsFrom = calcConfigProps(xinfaDataLists[0], self.props.brkthruData, self.state.configDiffFrom);
      let propsTo = calcConfigProps(xinfaDataLists[1], self.props.brkthruData, self.state.configDiffTo);
      let propsDiff = xinfaPropsPlus(propsFrom, xinfaPropsMultiply(propsTo, -1));

      self.setState({
        configDiffProps: propsDiff,
        configDiffFinish: true
      });
    });
  }

  handleCurConfigShow() {
    this.setState({showCurConfigModal: true});
    // 计算综合属性
    this.calcCurConfigProps();

  }

  handleCurConfigClose() {
    this.setState({
      showCurConfigModal: false,
      curConfigFinish: false
    });
  }

  renderCurConfigModal() {
    let xinfaProps = this.state.xinfaConfigProps;
    return (
      <div>
        <Modal show={this.state.showCurConfigModal} onHide={this.handleCurConfigClose}
               styleName='wuxia-modal-wrapper'>
          <Modal.Body styleName='wuxia-modal'>
            <WuxiaPanel title='心法配置属性' closeBtn onClose={this.handleCurConfigClose}>
              <Tabs defaultActiveKey={1} id='xinfa-props-tabs' styleName='xinfa-props-tabs'>
                <Tab eventKey={1} title='裸属性'>
                  {
                    this.state.curConfigFinish ?
                      <PropsTable xinfaProps={xinfaProps}/> : '加载中'
                  }
                </Tab>
                <Tab eventKey={2} title='门派加成属性'>
                  {
                    this.state.curConfigFinish ?
                      <PropsTable
                        gongliUsedProps={xinfaProps}
                        xinfaProps={calcAdditionProps(xinfaProps, this.props.brkthruData)}
                      /> : '加载中'
                  }
                </Tab>
              </Tabs>
            </WuxiaPanel>
          </Modal.Body>
        </Modal>
      </div>
    );
  }

  handleConfigDiffShow() {
    this.setState({showConfigDiffModal: true});
    // 计算综合属性
    this.calcCurConfigProps();
  }

  handleConfigDiffClose() {
    this.setState({
      showConfigDiffModal: false,
      configDiffFinish: false
    });
  }

  renderConfigDiffModal() {
    let xinfaProps = this.state.configDiffProps;
    return (
      <div>
        <Modal show={this.state.showConfigDiffModal} onHide={this.handleConfigDiffClose}
               styleName='wuxia-modal-wrapper'>
          <Modal.Body styleName='wuxia-modal'>
            <WuxiaPanel title='心法配置比较' closeBtn onClose={this.handleConfigDiffClose}>
              <Tabs defaultActiveKey={1} id='xinfa-props-tabs' styleName='xinfa-props-tabs'>
                <Tab eventKey={1} title='裸属性'>
                  {
                    this.state.configDiffFinish ?
                      <PropsTable xinfaProps={xinfaProps}/> : '加载中'
                  }
                </Tab>
                <Tab eventKey={2} title='门派加成属性'>
                  {
                    this.state.configDiffFinish ?
                      <PropsTable
                        gongliUsedProps={xinfaProps}
                        xinfaProps={calcAdditionProps(xinfaProps, this.props.brkthruData)}
                      /> : '加载中'
                  }
                </Tab>
              </Tabs>
            </WuxiaPanel>
          </Modal.Body>
        </Modal>
      </div>
    );
  }

  handleSchoolConfigShow() {
    this.setState({showSchoolConfigModal: true});
  }

  handleSchoolConfigClose() {
    this.setState({showSchoolConfigModal: false});
  }

  renderSchoolConfigModal() {
    return (
      <div>
        <Modal show={this.state.showSchoolConfigModal} onHide={this.handleSchoolConfigClose}
               styleName='wuxia-modal-wrapper'>
          <Modal.Body styleName='wuxia-modal'>
            <WuxiaPanel title='角色加成配置' closeBtn onClose={this.handleSchoolConfigClose}>
              <div>
                <AdditionConfig />
              </div>
            </WuxiaPanel>
          </Modal.Body>
        </Modal>
      </div>
    );
  }

  handleRemoveAll() {
    if(confirm('您确认清除本地存储的所有数据吗？（数据出现异常时可使用）')){
      this.props.removeAllLocalData();
      alert('清除成功！');
    }
  }

  render() {
    return(
      <WuxiaPanel title='心法配置'>
        切换配置：
        <div style={{textAlign: 'center'}}>
          <ButtonGroup styleName='switch-button-group'>
            {this.renderConfig()}
          </ButtonGroup>
        </div>
        <div style={{textAlign: 'center'}}>
          <div>心法槽</div>
          <div styleName='xinfa-slots-wrapper'>
            {this.renderSlots()}
          </div>
        </div>
        <div styleName='school-config-btn'>
          <Button
            bsStyle='primary' bsSize='small'
            onClick={this.handleCurConfigShow}
          >
            当前心法槽属性
          </Button>{' '}
          <Button
            bsStyle='primary' bsSize='small'
            onClick={this.handleSchoolConfigShow}
          >
            门派等加成设置
          </Button>
        </div>
        { this.state.showCurConfigModal && this.renderCurConfigModal() }
        { this.state.showConfigDiffModal && this.renderConfigDiffModal() }
        { this.state.showSchoolConfigModal && this.renderSchoolConfigModal() }

        复制心法冲穴配置：
        <div style={{textAlign: 'center'}}>
          从：
          <ConfigSelector
            index={this.state.configCopyFrom}
            setIndex={(i) => this.setState({configCopyFrom: i})}
          />
          到：
          <ConfigSelector
            index={this.state.configCopyTo}
            setIndex={(i) => this.setState({configCopyTo: i})}
          />
          <Button bsStyle='success' bsSize='small' onClick={this.handleConfigCopy}>复制</Button>
        </div>
        比较心法配置属性：
        <div style={{textAlign: 'center'}}>
          壹：
          <ConfigSelector
            index={this.state.configDiffFrom}
            setIndex={(i) => this.setState({configDiffFrom: i})}
          />
          贰：
          <ConfigSelector
            index={this.state.configDiffTo}
            setIndex={(i) => this.setState({configDiffTo: i})}
          />
          <Button bsStyle='success' bsSize='small' onClick={this.handleConfigDiff}>比较</Button>
        </div>
        <div styleName='remove-data-div'>
          {/*其他功能*/}
          <Button bsStyle='danger' bsSize='xsmall'
            onClick={this.handleRemoveAll}
          >
            清空本地所有数据
          </Button>
        </div>
        <div styleName='site-info'>
          <hr />
          <p>作者：段段</p>
          <p style={{fontSize: '14px'}}>目前尚为测试版，恳请您加群反馈</p>
          <p style={{fontSize: '14px'}}>交流群：660695387<a target="_blank" href="//shang.qq.com/wpa/qunwpa?idkey=9b2aeed4e33ce89f62f35e6d009b9a6cbf8f6aac9090387cf841d3deb5bdcc58"><img border="0" src="//pub.idqqimg.com/wpa/images/group.png" alt="天刀助手交流wuxia.tools " title="天刀助手交流wuxia.tools " /></a></p>
        </div>
      </WuxiaPanel>
    );
  }
}


function mapStateToProps(state) {
  // let curConfigData = state.brkthruData.chongxue[state.brkthruData.current];
  let slotsData = state.brkthruData.slots[state.brkthruData.current];
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