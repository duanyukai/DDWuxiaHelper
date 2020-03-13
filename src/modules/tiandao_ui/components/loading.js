import React, {Component} from 'react';
import Spin from 'antd/es/spin';

class LoadingComponent extends Component {

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <div style={{marginTop: '80px', height: 'calc(100vh - 100px)', maxHeight: 300}}>
        <div style={{maxWidth: 600, margin: '0 auto', textAlign: 'center', border: '1px solid #ccc', padding: '20px 30px'}}>
          <Spin size="large" />
          <h3>加载中，请稍后…</h3>
          <p>由于服务器带宽较小，第一次加载可能较慢，但本站目前为纯静态站，第一次缓存后速度将有显著提升。您也可以资助我提升带宽，详情请点击右上角捐助。</p>
          <p>同时建议您使用chrome浏览器访问本站，本站暂不完整支持IE浏览器。</p>
        </div>
      </div>
    );

  }
}

export default LoadingComponent;