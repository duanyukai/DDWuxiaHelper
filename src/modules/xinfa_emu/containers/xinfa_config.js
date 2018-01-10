import React, { Component } from 'react';
import {connect} from "react-redux";
import onClickOutside from "react-onclickoutside";
import {
  Button, ButtonGroup, Col, ControlLabel, DropdownButton, FormControl, FormGroup, MenuItem, Row,
  Table
} from "react-bootstrap";

import { selectXinfa, changeXinfaConfig } from "../actions/index";

import WuxiaPanel from '../../tiandao_ui/panel';

import './css/xinfa_config.css';

import xinfaImg from '../assets/imgs/xinfa_icon/悲回风.png';

class XinfaConfig extends Component {
  constructor(props) {
    super(props);


  }

  switchConfig(id) {
    this.props.selectXinfa(null); // 切换至空白心法
    this.props.changeXinfaConfig(id);
  }

  renderConfig() {
    return [
      [0, "壹"],
      [1, "贰"],
      [2, "叁"],
      [3, "肆"],
      [4, "伍"]
    ].map((arr) => {

      return (
        <Button
          key={arr[0]}
          styleName='view-btn-regular'
          onClick={this.switchConfig.bind(this, arr[0])}
          style={{
            background: arr[0] === this.props.brkthruData.current ? "#175887" : null
          }}
        >
          {arr[1]}
        </Button>
      )
    });
  }

  render() {
    return(
      <WuxiaPanel title='心法配置'>
        切换配置：
        <div style={{textAlign: "center"}}>
          <ButtonGroup styleName='switch-button-group'>
            {this.renderConfig()}
          </ButtonGroup>
        </div>
        <div style={{textAlign: "center"}}>
          <div>心法槽</div>
          <div style={{display: "inline-block", background: "#000", width: "20%", maxWidth: 100}}>
            <img src={xinfaImg} />
          </div>
          <div style={{display: "inline-block", background: "#000", width: "20%", maxWidth: 100}}>
            <img src={xinfaImg} />
          </div>
          <div style={{display: "inline-block", background: "#000", width: "20%", maxWidth: 100}}>
            <img src={xinfaImg} />
          </div>
          <div style={{display: "inline-block", background: "#000", width: "20%", maxWidth: 100}}>
            <img src={xinfaImg} />
          </div>
        </div>
        复制配置：
        <div style={{textAlign: "center"}}>
          从：
          <FormControl componentClass="select" placeholder="select" style={{display: "inline-block", width: "auto"}}>
            <option value='0'>壹</option>
            <option value='1'>贰</option>
            <option value='2'>叁</option>
            <option value='3'>肆</option>
            <option value='4'>伍</option>
          </FormControl>
          &nbsp;到：
          <FormControl componentClass="select" placeholder="select" style={{display: "inline", width: "auto"}}>
            <option value='0'>壹</option>
            <option value='1'>贰</option>
            <option value='2'>叁</option>
            <option value='3'>肆</option>
            <option value='4'>伍</option>
          </FormControl>
          &nbsp;
          <Button>复制</Button>
        </div>
        比较心法配置属性：
        <div style={{textAlign: "center"}}>
          壹：
          <FormControl componentClass="select" placeholder="select" style={{display: "inline-block", width: "auto"}}>
            <option value='0'>壹</option>
            <option value='1'>贰</option>
            <option value='2'>叁</option>
            <option value='3'>肆</option>
            <option value='4'>伍</option>
          </FormControl>
          &nbsp;贰：
          <FormControl componentClass="select" placeholder="select" style={{display: "inline", width: "auto"}}>
            <option value='0'>壹</option>
            <option value='1'>贰</option>
            <option value='2'>叁</option>
            <option value='3'>肆</option>
            <option value='4'>伍</option>
          </FormControl>
          &nbsp;
          <Button>比较</Button>
        </div>
      </WuxiaPanel>
    );
  }
}


function mapStateToProps(state) {
  return { brkthruData: state.brkthruData };
}

export default connect(mapStateToProps, {
  selectXinfa,
  changeXinfaConfig
})(XinfaConfig);