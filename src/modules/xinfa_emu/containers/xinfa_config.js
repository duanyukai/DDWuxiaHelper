import React, { Component } from 'react';
import WuxiaPanel from '../../tiandao_ui/panel';
import {Button, Dropdown, MenuItem, Modal, Tab, Tabs} from "react-bootstrap";
import {changeXinfaConfig, copyConfig, placeXinfaSlot, removeAllLocalData, selectXinfa} from "../actions";
import {connect} from "react-redux";
import i18next from 'i18next';
import {calcAdditionProps, calcConfigProps, xinfaPropsMultiply, xinfaPropsPlus} from "../utils/calcProps";
import AdditionConfig from './addition_config';
import PropsTable from '../components/props_table';

import './css/xinfa_config.css';

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
                onSelect={() => props.setIndex(i)}
              >{name}</MenuItem>
            ))
          }
        </Dropdown.Menu>
      </Dropdown>{' '}
    </span>
  );
};

class XinfaConfigPanel extends Component {
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

    this.handleConfigCopy = this.handleConfigCopy.bind(this);

    this.handleConfigDiff = this.handleConfigDiff.bind(this);
    this.handleConfigDiffShow = this.handleConfigDiffShow.bind(this);
    this.handleConfigDiffClose = this.handleConfigDiffClose.bind(this);

    this.handleSchoolConfigShow = this.handleSchoolConfigShow.bind(this);
    this.handleSchoolConfigClose = this.handleSchoolConfigClose.bind(this);

    this.handleRemoveAll = this.handleRemoveAll.bind(this);
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

  handleConfigDiffShow() {
    this.setState({showConfigDiffModal: true});
    // 计算综合属性
    this.calcCurConfigProps();
    // todo
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
      <div>
      {/*<WuxiaPanel title='心法配置'>*/}
        {/*语言选择*/}
        <div style={{margin: '4px'}}>
          <Dropdown id='config-selector' pullRight>
            <Dropdown.Toggle bsStyle='danger' bsSize='small'>Change Language</Dropdown.Toggle>
            <Dropdown.Menu>
              {
                [
                  {name: 'Chinese(简体中文)', id: 'zh'},
                  {name: 'Korean(한국어)', id: 'kr'},
                  {name: 'English', id: 'en'},
                ].map(({name, id}, i) => (
                  <MenuItem
                    eventKey={i}
                    key={i}
                    onSelect={() => i18next.changeLanguage(id)}
                  >{name}</MenuItem>
                ))
              }
            </Dropdown.Menu>
          </Dropdown>
          (under development)
        </div>
        <div styleName='school-config-btn'>
          <Button
            bsStyle='primary' block
            onClick={this.handleSchoolConfigShow}
          >
            门派、加成设置
          </Button>
          <Button
            bsStyle='primary' block
            onClick={this.handleSchoolConfigShow}
          >
            裸基础面板设置(敬请期待)
          </Button>
        </div>

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
          <Button bsStyle='danger' bsSize='xsmall'
                  onClick={this.handleRemoveAll}
          >
            清空本地所有数据
          </Button>
        </div>
      {/*</WuxiaPanel>*/}
      </div>
    );
  }
}


function mapStateToProps(state) {
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
})(XinfaConfigPanel);