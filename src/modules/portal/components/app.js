import React, { Component } from 'react';

import './css/app.css';

import panelPic1 from '../assets/imgs/1.png';
import panelPic2 from '../assets/imgs/2.png';
import panelPic3 from '../assets/imgs/3.png';
import panelPic4 from '../assets/imgs/4.png';

import xinfaPic from '../assets/imgs/xinfa.png';
import mapPic from '../assets/imgs/map.png';
import familyTechPic from '../assets/imgs/family-tech.png';
import calendarPic from '../assets/imgs/calendar.png';

const imgPath = require.context('../assets/imgs/', true);

import {Link} from 'react-router-dom';
import Card from 'antd/es/card';
import axios from 'axios';


const toolsList = [
  {
    path: '/xinfa',
    title: '心法模拟器',
    desc: <p>
      本工具是一个高仿游戏内UI的心法模拟器。<br />
      数据最新；样式直观；操作简便。<br />
      含最新9重数据，精确功力、属性、砭石需求、突破、潜修。
    </p>,
    img: 'xinfa.png'
  },
  {
    path: '/map',
    title: '交互式地图助手',
    desc: <p>
      本工具是一个可交互的天刀地图，包括文士乐伶墨宝创作点、航海图鉴、吃鸡物资、行政区划等内容，方便您查阅坐标数据。
    </p>,
    img: 'map.png'
  },
  {
    path: '/family-tech',
    title: '帮派技能模拟器',
    desc: <p>
      本工具是一个富交互的帮派技能属性、消耗模拟器。针对不同技能以可视化形式展现属性提升及资源消耗。
    </p>,
    img: 'family-tech.png'
  },
  {
    path: '/calendar',
    title: '天涯时刻吉凶预测',
    desc: <p>
      本工具包含现实时间、天涯时刻对照的模拟时钟，及未来时间吉凶预测时间轴.时间精确到秒，方便文士乐伶绘画、建房求风水等需求。
    </p>,
    img: 'calendar.png'
  },
  {
    path: '/role/',
    isOutSite: true,
    title: '角色信息查询',
    desc: <p>
      本工具可供您快速查询账号在线状态等一系列实用信息，不用再麻烦打开app即可得知。
    </p>,
    img: 'role.png'
  },
  {
    path: '/data-wiki',
    title: '数据百科',
    desc: <p>
      本工具包括各类天刀数据统计，持续更新中。目前包含砭石数据大全、词缀属性数据大全。
    </p>,
    img: 'data_wiki.png'
  },
  {
    path: '/panorama',
    title: '天刀全景图',
    desc: <p>
      本工具是一个在线的全景图浏览工具，您可以在这里体验媲美游戏中效果的全景体验。
    </p>,
    img: 'panorama.png'
  }
];

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
      news: []
    };
  }

  componentDidMount() {
    axios.get('https://news.wuxiatools.com/api/newest_list.php', {
      responseType: 'json'
    }).then((res) => {
      let data = res.data;
      this.setState({news: data});

    });
  }


  render() {
    return(
      <div>
        <div styleName='pic-header'>
          <div styleName="banner-main">
            <h1>段段天刀综合助手</h1>
            <p>本助手面向“天涯明月刀OL”网游，目前包括天刀导航、心法模拟器、天刀交互式地图、天涯时刻预测、帮派模拟器、数据百科等，功能正在积极更新完善中。</p>
            <p>请记住本站的新网址： <a style={{color: '#aaf'}} href="http://wuxiatools.com">www.wuxiatools.com</a> ，意即“天刀工具集.com”，十分易记。</p>
            <p>本站的旧网址会暂时保留： <a style={{color: '#aaf'}} href="http://wuxia.tools">www.wuxia.tools</a> ，前缀“wuxia”，后缀“.tools”工具之意。</p>
            <p>交流群：660695387 <a target="_blank"
              href="//shang.qq.com/wpa/qunwpa?idkey=182f40b60ccba796a3798e2e45fd963ca5dc299e643aced13f468b41eb31799d"><img
                border="0" src="//pub.idqqimg.com/wpa/images/group.png" alt="天刀助手交流群" title="天刀助手交流群" /></a>
              ，欢迎小伙伴来提建议。</p>
            <p>资金有限，服务器水管较小，访问可能较慢，还请大家见谅！</p>
          </div>
        </div>
        <div styleName="main">
          <h1 styleName="heading">
            新闻公告资讯 <small><a target="_blank" href="https://news.wuxiatools.com">查看更多</a></small>
          </h1>
          <div>
            <ul styleName="news-ul">
              {
                this.state.news.map(({_id, sTitle, dtReleaseTime, channelName, ddPreviewImages}) => {
                  return <li key={_id} styleName="news-li">
                    <a styleName="news-link" target="_blank" href={`https://news.wuxiatools.com/p/${_id}`}>
                      <span styleName="news-time">{dtReleaseTime.slice(5, 10)}</span> {sTitle}
                    </a>
                  </li>;
                })
              }
            </ul>
          </div>
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
          {/*<h1 styleName="heading">*/}
          {/*数据百科*/}
          {/*</h1>*/}
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
        </div>
      </div>
    );
  }
}

export default PortalApp;