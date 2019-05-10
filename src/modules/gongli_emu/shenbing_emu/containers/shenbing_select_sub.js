import React, {Component} from 'react';
import Button from 'antd/es/button/index';

import './css/shenbing_select_sub.css';

import {connect} from 'react-redux';
import {setCurShenbingId} from '../actions';
import {getShenbingById} from '../utils/data_utils';

class ShenbingSelectSubContainer extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    const {shenbingIdList, setCurShenbingId} = this.props;
    return (
      <div style={{width: '100%'}} styleName="shenbing-btn-wrapper">
        {
          shenbingIdList.map((sbId) => {
            let sb = getShenbingById(sbId);
            return <Button
              styleName="shenbing-btn"
              key={sbId}
              type={this.props.curShenbingId === sbId ? 'primary' : 'default'}
              onClick={() => setCurShenbingId(sbId)}
            >
              <img src={`https://wuxia-tools-assets-1251080372.file.myqcloud.com/shenbing/icon/${sbId}.png`} />
              <div>
                <b>{sb.name}</b>，技能 16 级
              </div>
              <div>
                质料 13, 10, 13 级
              </div>
            </Button>;
          })
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  state = state.shenbingEmu;
  return {
    curShenbingId: state.curShenbingId,
    levels: state.shenbingData.sets[state.shenbingData.current].levels
  };
}

export default connect(mapStateToProps, {
  setCurShenbingId
})(ShenbingSelectSubContainer);