import React, { Component } from 'react';

import XinfaConfig from '../containers/xinfa_config';
import XinfaList from '../containers/xinfa_list';
import XinfaProps from '../containers/xinfa_props';
import XinfaShuji from '../containers/xinfa_shuji';
import {Col, Grid, Row} from "react-bootstrap";

import './css/app.css';

class XinfaEmuApp extends Component {
  render() {
    return (
      <div styleName="container">
        <Grid>
          <Row>
            <Col md={12} lg={10} lgOffset={1}>
              <Row>
                <Col xs={12} md={4}>
                  <XinfaConfig />
                </Col>
                <Col xs={12} md={8}>
                  <XinfaList />
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={4}>
                  <XinfaProps />
                </Col>
                <Col xs={12} md={8}>
                  <XinfaShuji />
                </Col>
              </Row>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default XinfaEmuApp;