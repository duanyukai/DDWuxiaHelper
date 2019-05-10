import React, {Component} from 'react';
import {connect} from 'react-redux';

import {setCurShenbingId} from '../actions';
import Row from 'antd/es/grid/row';
import Col from 'antd/es/grid/col';
import ShenbingSelectSubContainer from './shenbing_select_sub';

class ShenbingSelectContainer extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Row style={{textAlign: 'center', maxWidth: 880, margin: '0 auto 10px'}}>
          <Col xs={24} sm={12} md={12} lg={8}>
            <h3>蓝色神兵</h3>
            <ShenbingSelectSubContainer
              shenbingIdList={[1,2,3,4,5]}
            />
          </Col>
          <Col xs={24} sm={12} md={12} lg={8}>
            <h3>紫色神兵</h3>
            <ShenbingSelectSubContainer
              shenbingIdList={[6,7,8,9,10,11,12]}
            />
          </Col>
          <Col xs={24} sm={12} md={12} lg={8}>
            <h3>金色神兵</h3>
            <ShenbingSelectSubContainer
              shenbingIdList={[13,14]}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

function mapStateToProps(state) {
  state = state.shenbingEmu;
  return {
    curShenbingId: state.shenbingData.curShenbingId
  };
}

export default connect(mapStateToProps, {
  setCurShenbingId
})(ShenbingSelectContainer);