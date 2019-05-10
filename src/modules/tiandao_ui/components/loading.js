import React, {Component} from 'react';
import {Col, Grid, Panel, Row} from 'react-bootstrap';
import Spin from 'antd/es/spin';

class LoadingComponent extends Component {

  componentWillMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <div style={{marginTop: '100px', height: 'calc(100vh - 340px)'}}>
        <Grid>
          <Row>
            <Col md={8} mdOffset={2}>
              <Panel style={{textAlign: 'center'}}>
                <Panel.Heading>加载中</Panel.Heading>
                <Panel.Body>
                  <Spin size="large" />
                  <h3>加载中，请稍后…</h3>
                  <p>由于服务器水管较小，第一次加载可能较慢，但本站目前为纯静态站，第一次缓存后速度将有显著提升。您也可以资助我提升带宽，详情请点击右上角。</p>
                  <p>同时建议您使用chrome浏览器访问本站。本站未在IE浏览器上做测试，无法保证运行效果。</p>
                </Panel.Body>
              </Panel>
            </Col>
          </Row>
        </Grid>
      </div>
    );

  }
}

export default LoadingComponent;