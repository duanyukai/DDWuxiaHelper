import React, {Component} from 'react';
import {connect} from 'react-redux';

import {setMenpai} from '../actions';

import Radio from 'antd/es/radio/index';

import menpaiData from '../../../_commons/common_data/menpai.json';

import './css/all_settings.css';

class AllSettingsContainer extends Component {

  render() {
    return (
      <div>
        {/*简单hack一下，两排门派*/}
        <h4>门派选择</h4>
        <Radio.Group
          styleName="menpai-selection"
          buttonStyle="solid"
          value={this.props.menpaiId}
          onChange={(e) => this.props.setMenpai(e.target.value)}
        >
          {
            menpaiData.slice(0,5).map(({name, available}, i) => (
              <Radio.Button key={i} value={i} disabled={!available}>
                {name}
              </Radio.Button>
            ))
          }
        </Radio.Group>
        <Radio.Group
          styleName="menpai-selection"
          buttonStyle="solid"
          value={this.props.menpaiId}
          onChange={(e) => this.props.setMenpai(e.target.value)}
        >
          {
            menpaiData.slice(5,10).map(({name, available}, i) => (
              <Radio.Button key={i+5} value={i+5} disabled={!available}>
                {name}
              </Radio.Button>
            ))
          }
        </Radio.Group>
      </div>
    );
  }
}

function mapStateToProps(state) {
  state = state.generalSettings;
  return {
    menpaiId: state.menpaiId
  };
}

export default connect(mapStateToProps, {
  setMenpai
})(AllSettingsContainer);