import React, {Component} from 'react';
import {connect} from 'react-redux';

import Icon from 'antd/es/icon/index';
import Tooltip from 'antd/es/tooltip/index';
import InputNumber from 'antd/es/input-number/index';

import {set5dItemProp} from '../actions';

import './css/shimei_5d_config.css';

class Shimei5dConfigContainer extends Component {

  render() {

    const {base5d} = this.props;
    return (
      <div>
        <h3>师妹基础五维设置 <Tooltip title="蓝紫金三类技能，总共最多选择五项">
          <Icon type="question-circle" />
        </Tooltip> </h3>
        <div styleName="shimei-5d-input">
          {
            [
              {name: '力道', id: 'ld'},
              {name: '洞察', id: 'dc'},
              {name: '气劲', id: 'qj'},
              {name: '根骨', id: 'gg'},
              {name: '身法', id: 'sf'}
            ].map(({name, id}) => {
              return <div key={id} styleName="shimei-5d-item">
                <b>{name}</b>{' '}
                <InputNumber min={0} max={4120} value={base5d[id]} onChange={(n) => {
                  this.props.set5dItemProp(id, n);
                }} />
              </div>;
            })
          }
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  state = state.shimeiEmu;
  return {
    base5d: state.shimeiData.sets[state.shimeiData.current].base5d
  };
}

export default connect(mapStateToProps, {
  set5dItemProp
})(Shimei5dConfigContainer);