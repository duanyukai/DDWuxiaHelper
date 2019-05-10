import React, {Component} from 'react';
import {connect} from 'react-redux';

import MultiplePropsTableComponent from '../../../_commons/property_table/multiple_prop_tables';

class WholePropTableContainer extends Component {

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
        <MultiplePropsTableComponent
          currentSetId={this.props.currentSetId}
          propsSet={this.props.propsSet}
          menpaiId={this.props.menpaiId}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  // 先hardcode一下省事 todo
  let propsSet = {
    0: state.shenbingEmu.shenbingData.sets[0].props,
    1: state.shenbingEmu.shenbingData.sets[1].props,
    2: state.shenbingEmu.shenbingData.sets[2].props,
    3: state.shenbingEmu.shenbingData.sets[3].props,
    4: state.shenbingEmu.shenbingData.sets[4].props,
  };

  return {
    slots: state.shenbingEmu.shenbingData.sets[state.shenbingEmu.shenbingData.current].slots,
    currentSetId: state.shenbingEmu.shenbingData.current,
    propsSet: propsSet,
    menpaiId: state.generalSettings.menpaiId
  };
}

export default connect(mapStateToProps, {
  // setSkillTypes
})(WholePropTableContainer);