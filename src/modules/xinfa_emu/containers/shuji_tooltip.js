import React, { Component } from 'react';
import {connect} from "react-redux";
import onClickOutside from "react-onclickoutside";
import {Button, Col, Row, Table} from "react-bootstrap";

import { chongxue } from "../actions/index";

import propsMap from '../assets/json/propAbbrMapName.json';


import './css/shuji_tooltip.css';

class ShujiTooltip extends Component {

  constructor(props) {
    super(props);

    this.state = {

    }
  }

  handleClickOutside(event) {
    this.props.changeVisibility(false);
  }

  renderLevels() {
    let allChongxueData = this.props.brkthruData.chongxue[this.props.brkthruData.current];
    let chongxueData = allChongxueData[this.props.xinfaData.name];
    let levelList = [];

    this.props.shuji.levels.reduce((a, b, i) => {
      levelList[i] = (
        <tr key={i}>
          <td>{i + 1}</td>
          <td>{b.xiuwei}</td>
          <td>{a + parseInt(b.xiuwei)}</td>

          <td>{b.props[0]}</td>
          {this.props.shuji.types.length === 2 ?
            <td>{b.props[1]}</td>
            : null
          }

          <td>
            <Button
              onClick={() => this.props.chongxue(
                this.props.xinfaData.name,
                this.props.curLevel,
                this.props.shujiId,
                i + 1
                )}
              disabled={false}
              bsSize="xsmall"
              styleName="chongxue-btn"
            >
              点
            </Button>
          </td>
          <td>
            <Button
              // onClick={}
              bsSize="xsmall"
              styleName="chongxue-btn"
            >
              清
            </Button>
          </td>
        </tr>
      );
      return a + parseInt(b.xiuwei);
    }, 0);

    console.log(levelList);
    return levelList;
  }

  render() {
    if(this.props.shuji.types) {
      return (
        <div>
          <div styleName='tooltip' style={{
            top: this.props.top - 20,
            visibility: this.props.visibility
          }}>
            <Row xs={12}>
              <Col xs={12} sm={8}>
                <Table bordered condensed>
                  <thead>
                  <tr>
                    <th>重</th>
                    <th>单重修为</th>
                    <th>累计修为</th>
                    <th>{propsMap[this.props.shuji.types[0]]}</th>
                    {this.props.shuji.types.length === 2 ?
                      <th>{propsMap[this.props.shuji.types[1]]}</th>
                      : null
                    }
                    <th>点至</th>
                    <th>清至</th>
                  </tr>
                  </thead>
                  <tbody>
                  {this.renderLevels()}
                  </tbody>
                </Table>
              </Col>
              <Col xs={12} sm={4}>
                <p>
                  当前{1}重
                </p>
                <p>
                  本枢机已消耗修为： aa
                </p>
                <Button>
                  快速点满此枢机及其前方枢机
                </Button>
                <Button>
                  快速清空此枢机及其后方枢机
                </Button>
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
    }else{
      return null;
    }
  }
}



function mapStateToProps(state) {
  return {
    xinfaData: state.xinfaData,
    brkthruData: state.brkthruData
  };
}

export default connect(mapStateToProps, {
  chongxue
})(onClickOutside(ShujiTooltip));