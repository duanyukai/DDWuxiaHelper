import React, {Component} from 'react';
import {connect} from 'react-redux';

import {setXinren} from '../actions';
import Icon from 'antd/es/icon/index';
import Radio from 'antd/es/radio/index';
import Tooltip from 'antd/es/tooltip/index';

import './css/shimei_5d_config.css';

class ShimeiXinrenduContainer extends Component {

  render() {
    return (
      <div>
        <h3>师妹信任度设置
          <Tooltip title="三档信任度">
            <Icon type="question-circle" />
          </Tooltip>
        </h3>
        <div>
          <Radio.Group
            defaultValue={this.props.xinrenPercent}
            buttonStyle="solid"
            onChange={(e) => this.props.setXinren(e.target.value)}
          >
            <Radio.Button value={0}>
              0-99{' '}
              <Tooltip title="无增益">
                <Icon type="question-circle" />
              </Tooltip>
            </Radio.Button>
            <Radio.Button value={1}>
              100-149{' '}
              <Tooltip title="师妹协战五维百分比+1%">
                <Icon type="question-circle" />
              </Tooltip>
            </Radio.Button>
            <Radio.Button value={2}>
            150+{' '}
              <Tooltip title="师妹协战五维百分比+2%">
                <Icon type="question-circle" />
              </Tooltip>
            </Radio.Button>
          </Radio.Group>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  state = state.shimeiEmu;
  return {
    xinrenPercent: state.shimeiData.sets[state.shimeiData.current].xinren
  };
}

export default connect(mapStateToProps, {
  setXinren
})(ShimeiXinrenduContainer);