import React, {Component} from 'react';
import Button from 'antd/es/button/index';
import Checkbox from 'antd/es/checkbox/index';
import message from 'antd/es/message/index';

import './css/skill_select_sub.css';
import {connect} from 'react-redux';
import {setCurSkillType, setSkillTypes} from '../actions';
import {getSkillById} from '../utils/data_utils';

class SkillSelectSubContainer extends Component {

  constructor(props) {
    super(props);
    this.restrainSelect = this.restrainSelect.bind(this);
  }

  restrainSelect(skillTypeId, action) {
    if(action < 0) {
      // 移除
      this.props.selectedSet.delete(skillTypeId);
    } else if (action > 0) {
      // 增加
      if (this.props.selectedSet.size >= 5) {
        // 错误提示
        message.config({
          top: 100,
          duration: 1.5,
          maxCount: 3,
        });
        message.error('最多只能选择5个技能，请移除不需要的技能后再勾选');
        return;
      } else {
        this.props.selectedSet.add(skillTypeId);
      }
    }
    // 提交修改
    this.props.setSkillTypes([...this.props.selectedSet]);
  }

  render() {

    const {skillIdList} = this.props;
    return (
      <div style={{width: '100%'}}>
        {
          skillIdList.map((skillTypeId) => {
            let s = getSkillById(skillTypeId);
            return <div key={skillTypeId} styleName="checkbox-btn-group-item">
              <Checkbox
                value={skillTypeId}
                checked={this.props.selectedSet.has(skillTypeId)}
                onChange={(e) => {
                  this.restrainSelect(skillTypeId, e.target.checked ? 1 : -1);
                }}
                disabled={!s.canSelect}
              />
              <span style={{width: 48}}><img src={`https://wuxia-tools-assets-1251080372.file.myqcloud.com/imagesets/ICONS/SKILL/${s.icon.toUpperCase()}.PNG`} /></span>
              <span style={{width: 100}}>{s.name} </span>
              <span style={{width: 30}}>{this.props.levels[skillTypeId] || 0}级</span>
              <Button type="primary" onClick={() => {
                this.props.setCurSkillType(skillTypeId);
              }} >调整</Button>
            </div>;
          })
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  state = state.shimeiEmu;
  return {
    levels: state.shimeiData.sets[state.shimeiData.current].levels
  };
}

export default connect(mapStateToProps, {
  setCurSkillType, setSkillTypes
})(SkillSelectSubContainer);