import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Radio } from 'antd';

import {setCurShenbingId} from '../actions';
import {getShenbingById} from '../utils/data_utils';

import './css/zhiliao_select.css';

class ShenbingSelectContainer extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {curShenbingId} = this.props;
    let sb = getShenbingById(curShenbingId);
    return (
      <div styleName="zhiliao-select-btn-wrapper">
        <h3>质料选择</h3>
        <Radio.Group defaultValue={0} buttonStyle="solid">
          {
            sb.zhiliaoList.map((zl, i) => {
              return <Radio.Button
                value={i}
                key={i}
              >
                <img src={`https://wuxia-tools-assets-1251080372.file.myqcloud.com/imagesets/ICONS/ITEMTIPSICON/${zl.icon.toUpperCase()}.png`} />
                <div>{zl.name}</div>
              </Radio.Button>;
            })
          }
        </Radio.Group>
      </div>
    );
  }
}

function mapStateToProps(state) {
  state = state.shenbingEmu;
  return {
    curShenbingId: state.curShenbingId
  };
}

export default connect(mapStateToProps, {
  setCurShenbingId
})(ShenbingSelectContainer);