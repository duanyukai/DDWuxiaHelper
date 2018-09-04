import React, { Component } from 'react';
import {connect} from 'react-redux';
import Tabs from 'antd/es/tabs';
import PropTable from '../components/prop_table';

import './css/prop_panel.css';

class PropPanelContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    return(
      <div styleName="prop-tabs">
        <Tabs tabPosition="top" size="small">
          <Tabs.TabPane tab="裸属性" key="1">
            <PropTable />
          </Tabs.TabPane>
          <Tabs.TabPane tab="门派加成" key="2">

          </Tabs.TabPane>
          <Tabs.TabPane tab="最终面板" key="3">

          </Tabs.TabPane>
        </Tabs>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    a: state.a,
  };
}

export default connect(mapStateToProps, {
  // actions

})(PropPanelContainer);