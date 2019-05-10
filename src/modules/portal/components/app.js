import React, { Component } from 'react';

import './css/app.css';

const imgPath = require.context('../assets/imgs/', true);

import {Link} from 'react-router-dom';
import Card from 'antd/es/card';
import axios from 'axios';

import {toolsList, dataWikiList} from '../utils/nav_list';
import Adsense from './adsense';
import TextAd from '../../_commons/ad/components/text_ad';
import BannerAd from '../../_commons/ad/components/banner_ad';
import Row from 'antd/es/grid/row';
import Col from 'antd/es/grid/col';
import MainPageAd from '../../_commons/ad/components/main_page_ad';

const otherSites = [
  {
    'img': '1.png',
    'content': <div>
      <p><a target='_blank' href='http://wuxia.qq.com'>天涯明月刀首页(wuxia.qq.com)</a></p>
      <hr />
      <p><a target='_blank' href='http://wuxia.qq.com/main.shtml'>天刀官网主站</a></p>
      <p><a target='_blank' href='http://wuxia.qq.com/events.shtml'>天刀官网活动中心</a></p>
      <p><a target='_blank' href='http://wuxia.qq.com/kz'>逍遥客栈</a></p>
      <p><a target='_blank' href='http://daoju.qq.com/wuxia'>腾讯道聚城</a></p>
    </div>
  },
  {
    'img': '2.png',
    'content': <div>
      <p><a target='_blank' href='http://wuxia.duowan.com'>多玩天刀首页(wuxia.duowan.com)</a></p>
      <hr />
      <p><a target='_blank' href='http://bbs.duowan.com/forum-2162-1.html'>多玩天刀论坛导航</a></p>
      <p><a target='_blank' href='http://bbs.duowan.com/forum-2400-1.html'>论坛综合讨论版</a></p>
      <p><a target='_blank' href='http://bbs.duowan.com/forum-2372-1.html'>论坛恩怨自爆版</a></p>
      <p><a target='_blank' href='http://bbs.duowan.com/forum-2533-1.html'>论坛捏脸数据版</a></p>
    </div>
  },
  {
    'img': '3.png',
    'content': <div>
      <hr />
      <p><a target='_blank' href='https://www.douyu.com/directory/game/tianya'>斗鱼天刀</a></p>
      <p><a target='_blank' href='https://www.panda.tv/cate/tymyd'>熊猫天刀</a></p>
      <p><a target='_blank' href='http://www.huya.com/g/tymyd'>虎牙天刀</a></p>
      <p><a target='_blank' href='https://www.zhanqi.tv/games/tianyamingyuedao'>战旗天刀</a></p>
    </div>
  },
  {
    'img': '4.png',
    'content': <div>
      <hr />
      <p><a target='_blank' href='https://tieba.baidu.com/f?kw=%E5%A4%A9%E6%B6%AF%E6%98%8E%E6%9C%88%E5%88%80ol&ie=utf-8'>天涯明月刀ol贴吧</a></p>
      <p><a target='_blank' href='https://weibo.com/206667365'>天刀值日团微博</a></p>
    </div>
  },
];

class PortalApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      news: [],
      adLinks: []
    };
  }

  componentDidMount() {
    // 新闻列表
    axios.get('https://news.wuxiatools.com/api/newest_list.php', {
      responseType: 'json'
    }).then((res) => {
      let data = res.data;
      this.setState({news: data});

    });
    // 推广列表
    axios.get('https://wuxia-tools-assets-1251080372.cos.ap-shanghai.myqcloud.com/ad/main.json', {
      responseType: 'json'
    }).then((res) => {
      let data = res.data;
      this.setState({
        adLinks: data
      });
    });
  }

  render() {
    return(
      <div>
        <div styleName='pic-header'>
          <div styleName="banner-main">
            <h1>段段天刀综合助手</h1>
            <p>本助手面向“天涯明月刀OL”网游，目前包括天刀导航，心法、装备、帮派技能模拟器，天刀交互式地图、天涯时刻预测、数据百科等功能，目前跟进版本积极更新完善中。</p>
            <p>同时，本站将密切关注天涯明月刀手游进展，将跟随天刀手游更新进度来创建更多更方便的工具给大家使用。</p>
            <p>本站域名： <a style={{color: '#aaf'}} href="http://wuxiatools.com">www.wuxiatools.com</a> ，意即“天刀工具集”。</p>
            <p>本站旧域名会暂时保留： <a style={{color: '#aaf'}} href="http://wuxia.tools">www.wuxia.tools</a> ，前缀“wuxia”即天刀，后缀“.tools”工具之意。</p>
            <p>交流群：660695387 <a target="_blank"
              href="//shang.qq.com/wpa/qunwpa?idkey=182f40b60ccba796a3798e2e45fd963ca5dc299e643aced13f468b41eb31799d"><img
                border="0" src="//pub.idqqimg.com/wpa/images/group.png" alt="天刀助手交流群" title="天刀助手交流群" /></a>
              ，欢迎小伙伴来提建议。</p>
          </div>
        </div>
        <div styleName="main">
          <MainPageAd />
          <TextAd />
          <Row type="flex" align="middle">
            <Col md={16} xs={24}>
              <h1 styleName="heading">
                天刀端游新闻公告 <small><a target="_blank" href="https://news.wuxiatools.com">查看更多</a></small>
              </h1>
              <div>
                <ul styleName="news-ul">
                  {
                    this.state.news.slice(0, 18).map(({_id, sTitle, dtReleaseTime, channelName, ddPreviewImages}) => {
                      return <li key={_id}>
                        <a target="_blank" href={`https://news.wuxiatools.com/p/${_id}`}>
                          <span styleName="news-time">{dtReleaseTime.slice(5, 10)}</span> {sTitle}
                        </a>
                      </li>;
                    })
                  }
                </ul>
              </div>
            </Col>
            <Col md={8} xs={24} style={{textAlign: 'center'}}>
              {/*<a href="#">*/}
              <img
                styleName="shouyou-img"
                onClick={()=>alert('本站计划跟随官方内测时间线同步更新手游攻略站，敬请期待！')}
                src={imgPath('./shouyou.png', true)}
              />
              {/*</a>*/}
            </Col>
          </Row>
          <h1 styleName="heading">
            站内工具导航
          </h1>
          <div styleName="flex-wrapper">
            {
              toolsList.map(({path, title, desc, img, isOutSite}, i) => {
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
          {/*<Adsense />*/}
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
          <Adsense />
          <h1 styleName="heading">
            快速站外导航 <small>进错域名不担心，记住 wuxiatools.com ，一站导航</small>
          </h1>
          <div styleName="flex-wrapper">
            {
              otherSites.map(({img, content}, i) => {
                return (
                  <div key={i} styleName="tool-card-wrapper">
                    <Card
                      styleName="tool-card"
                      cover={<img styleName="cover-img" src={imgPath(`./${img}`, true)} />}
                    >
                      <div>
                        {content}
                      </div>
                    </Card>
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

export default PortalApp;