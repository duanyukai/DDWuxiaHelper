import React, {Component} from 'react';

import './css/text_ad.css';
import axios from 'axios';

class TextAd extends Component {

  constructor(props) {
    super(props);

    this.state = {
      adList: []
    };
  }

  componentDidMount() {
    let adList = [
      {text: '螃蟹天刀账号，找回包赔/免费上架/安全专业/售后保障，企业QQ 800178677', link: 'http://www.pxb7.com', color: '#f55', isBold: true, fullWidth: true},
      {text: '萌弟弟功力主播斗鱼6070318', link: 'https://www.douyu.com/6070318', color: '#44f', isBold: false, fullWidth: false},
      {text: '广告位招租', link: '#', color: '#000', isBold: false, fullWidth: false},
      {text: '欲投广告请联系QQ452214596', link: 'tencent://message/?uin=452214596', color: '#000', isBold: false, fullWidth: false},
    ];

    this.setState({
      adList: adList
    });


    axios.get('https://wuxia-tools-assets-1251080372.cos.ap-shanghai.myqcloud.com/ad/text.json', {
      responseType: 'json'
    }).then((res) => {
      let data = res.data;
      this.setState({
        adList: data
      });
    });
  }

  render() {
    // 判断天刀小悦referrer
    let referrer = document.referrer;
    if (referrer.includes('tool.helper.qq.com')) {
      return null;
    }

    return (
      <div styleName="text-ad">
        <div styleName="ad-sign">广告</div>
        <ul styleName="full-width-ad">
          {
            this.state.adList.filter(o => o.fullWidth).map((ad, i) => {
              return <li key={i}>
                <a href={ad.link} target="_blank" style={{color: ad.color, fontWeight: ad.isBold?'bold':'normal'}}>
                  {ad.text}
                </a>
              </li>;
            })
          }
        </ul>
        <hr styleName="hr" />
        <ul styleName="three-column-ad">
          {
            this.state.adList.filter(o => !o.fullWidth).map((ad, i) => {
              return <li key={i}>
                <a href={ad.link} target="_blank" style={{color: ad.color, fontWeight: ad.isBold?'bold':'normal'}}>
                  {ad.text}
                </a>
              </li>;
            })
          }
        </ul>
      </div>
    );
  }
}

export default TextAd;