import React, {Component} from 'react';
import {connect} from 'react-redux';

import {setSkillTypes} from '../actions';
import Row from 'antd/es/grid/row';
import Col from 'antd/es/grid/col';
import SkillSelectSubContainer from './skill_select_sub';

class SkillSelectContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedSet: new Set(this.props.slots)
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      selectedSet: new Set(nextProps.slots)
    });
  }

  render() {
    return (
      <div>
        <Row style={{textAlign: 'center', maxWidth: 880, margin: '0 auto 10px'}}>
          <Col xs={24} sm={12} md={12} lg={8}>
            <h3>蓝色技能</h3>
            <SkillSelectSubContainer
              skillIdList={[201,202,203,204,205]}
              selectedSet={this.state.selectedSet}
            />
          </Col>
          <Col xs={24} sm={12} md={12} lg={8}>
            <h3>紫色技能</h3>
            <SkillSelectSubContainer
              skillIdList={[101,301,302,303,304,305,306]}
              selectedSet={this.state.selectedSet}
            />
          </Col>
          <Col xs={24} sm={12} md={12} lg={8}>
            <h3>金色技能</h3>
            <SkillSelectSubContainer
              skillIdList={[401,402,403,404,405]}
              selectedSet={this.state.selectedSet}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

function mapStateToProps(state) {
  state = state.shimeiEmu;
  return {
    slots: state.shimeiData.sets[state.shimeiData.current].slots
  };
}

export default connect(mapStateToProps, {
  setSkillTypes
})(SkillSelectContainer);