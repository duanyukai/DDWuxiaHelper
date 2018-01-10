import React, { Component } from 'react';
// import { withFauxDOM } from 'react-faux-dom';
import {Col, Grid, Panel, Row} from "react-bootstrap";
import D3Chart from './d3_chart';

import './css/app.css';

class FamilySkillEmuApp extends Component {
  // componentDidMount () {
  //   const faux = this.props.connectFauxDOM('div', 'chart');
  //   this.renderD3(faux);
  //   this.props.animateFauxDOM(800);
  // }


  render() {
    return (
      <div styleName="container">
        <Grid>
          <Row>
            <Col md={12} lg={10} lgOffset={1}>
              <Panel header="帮派技能模拟器" bsStyle="success">
                <D3Chart />
              </Panel>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}



// export default withFauxDOM(FamilySkillEmuApp);
export default FamilySkillEmuApp;