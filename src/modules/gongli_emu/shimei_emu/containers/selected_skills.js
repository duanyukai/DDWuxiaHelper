import React, {Component} from 'react';
import {connect} from 'react-redux';

import {setCurSkillType} from '../actions';
import Icon from 'antd/es/icon/index';
import Tooltip from 'antd/es/tooltip/index';

import './css/selected_skills.css';
import {getAllSkillCollectPoints, getSkillById} from "../utils/data_utils";

class SelectedSkillsContainer extends Component {

  render() {
    return (
      <div>
        <h3>已选择技能 <Tooltip title="蓝紫金三类技能，总共最多选择五项">
          <Icon type="question-circle" />
        </Tooltip> </h3>
        <div style={{height: 44}}>
          {
            this.props.slots.map(skillTypeId => {
              return <div key={skillTypeId} style={{display: 'inline-block'}}>
                <Tooltip key={skillTypeId} title={getSkillById(skillTypeId)['name']}>
                  <img width={44} styleName="skill-icon" src={`https://wuxia-tools-assets-1251080372.file.myqcloud.com/imagesets/ICONS/SKILL/${getSkillById(skillTypeId)['icon'].toUpperCase()}.PNG`} />
                </Tooltip>
              </div>;
            })
          }
        </div>
        <h3>技能收集点 <Tooltip title="蓝紫金三类技能，总共最多选择五项">
          <Icon type="question-circle" />
        </Tooltip> </h3>
        <div style={{fontSize: 18}}>{getAllSkillCollectPoints({...this.props.levels})}</div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  state = state.shimeiEmu;
  return {
    slots: state.shimeiData.sets[state.shimeiData.current].slots,
    levels: state.shimeiData.sets[state.shimeiData.current].levels
  };
}

export default connect(mapStateToProps, {
  setCurSkillType
})(SelectedSkillsContainer);