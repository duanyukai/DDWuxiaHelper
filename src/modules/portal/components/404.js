import React, {Component} from 'react';

import './css/404.css';
import Helmet from 'react-helmet';
import {Link} from "react-router-dom";

class NotFoundPage extends Component {


  render() {
    return (
      <div styleName="error-container">
        <div>
          <Helmet defer={false}>
            <meta charSet="utf-8" />
            <title>404 - 段段天刀综合助手</title>
            <meta name="viewport" content="width=device-width"/>
            <meta name="prerender-status-code" content="404" />
          </Helmet>
        </div>
        <h1>404</h1>
        <p styleName="return">返回到 <Link to="/">wuxiatools.com</Link> 首页</p>
      </div>
    );
  }
}

export default NotFoundPage;