import React, { Component } from 'react';
import {Button, ButtonGroup, Col, Grid, PageHeader, Panel, Row, Table} from "react-bootstrap";

import './css/app.css';

class PanoramaViewer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      curPanoIndex: 0
    };
  }

  componentDidMount() {
  }
  
  render() {
    return(
      <div styleName='container'>
        <Grid>
          <Row>
            <Col lg={12}>
              <Panel header="天刀数据百科" bsStyle="success">
                数据百科，敬请期待！
              </Panel>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default PanoramaViewer;