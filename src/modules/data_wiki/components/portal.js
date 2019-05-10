import React, { Component } from 'react';

import './css/app.css';
import {BrowserRouter, Link, Route, Switch} from 'react-router-dom';
import {Helmet} from 'react-helmet';
import {dataWikiList} from '../../portal/utils/nav_list';
const imgPath = require.context('../../portal/assets/imgs/', true);
import Card from 'antd/es/card';
import TextAd from '../../_commons/ad/components/text_ad';
import BannerAd from '../../_commons/ad/components/banner_ad';

class DataWikiPortal extends Component {
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
        <div styleName="main">
          <TextAd />
          <h1 styleName="heading">
            数据百科
          </h1>
          <div styleName="flex-wrapper">
            {
              dataWikiList.map(({path, title, desc, img, isOutSite}, i) => {
                let content = <Card
                  hoverable
                  styleName="tool-card"
                  cover={<img styleName="cover-img" src={imgPath(`./${img}`, true)} />}
                >
                  <h3 styleName="card-title">{title}</h3>
                  <div style={{color: '#888'}}>{desc}</div>
                </Card>;
                return (
                  <div key={i} styleName="tool-card-wrapper">
                    {isOutSite ?
                      <a target="_blank" href={path}>
                        {content}
                      </a>
                      :
                      <Link to={path}>
                        {content}
                      </Link>
                    }
                  </div>
                );
              })
            }
          </div>
          <BannerAd/>
        </div>
      </div>
    );
  }
}

export default DataWikiPortal;