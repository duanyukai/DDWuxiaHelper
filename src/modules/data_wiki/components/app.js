import React, { Component } from 'react';
import {Button, ButtonGroup, Col, Grid, PageHeader, Panel, Row, Table} from 'react-bootstrap';

import './css/app.css';
import {Link} from 'react-router-dom';
import {Helmet} from 'react-helmet';

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
        <Helmet defer={false}>
          <meta charSet="utf-8" />
          <title>天刀数据百科 | 段段天刀综合助手</title>
          <meta name="keywords" content="天刀数据百科" />
          <meta name="viewport" content="width=device-width"/>
        </Helmet>
        <Grid>
          <Row>
            <Col lg={12}>
              <Panel bsStyle="success">
                <Panel.Heading>天刀数据百科</Panel.Heading>
                <Panel.Body>
                  数据百科持续制作中，更多内容敬请期待！
                  <p>
                    目前已有数据内容如下：
                  </p>
                  <p style={{fontSize: 14}}>
                    <Link to="/data-wiki/gem">砭石百科</Link>{' '}
                    <Link to="/data-wiki/affix">词缀百科</Link>
                  </p>
                </Panel.Body>
              </Panel>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default PanoramaViewer;