import React from "react";
import {Col, Grid, Panel, Row} from "react-bootstrap";

export default () => {
  return (
    <div style={{margin: '100px'}}>
      <Grid>
        <Row>
          <Col md={8} mdOffset={2}>
            <Panel title='加载中'>
              <h3>加载中，请稍后…</h3>
              <p>由于目前服务器在美国，第一次加载速度较慢，但本站目前为纯静态站，第一次缓存后速度将有显著提升。</p>
            </Panel>
          </Col>
        </Row>
      </Grid>

    </div>
  );
}