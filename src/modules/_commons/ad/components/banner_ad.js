import React, {Component} from 'react';
import axios from 'axios';

import './css/banner_ad.css';

class BannerAd extends Component {

  constructor(props) {
    super(props);

    this.state = {
      adList: []
    };
  }

  componentDidMount() {
    // let adList = [
    //   {img: 'http://placehold.it/728x90', link: 'http://www.pxb7.com', fullWidth: true},
    //   {img: 'http://placehold.it/350x90', link: 'http://www.pxb7.com', fullWidth: false}
    // ];

    axios.get('https://wuxia-tools-assets-1251080372.cos.ap-shanghai.myqcloud.com/ad/banner.json', {
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
      <div styleName="banner-a">
        <div styleName="a-sign">广告</div>
        <div styleName="full-width-a">
          {
            this.state.adList.filter(o => o.fullWidth).map((ad, i) => {
              return <div key={i}>
                <a href={ad.link} target="_blank">
                  <img src={`https://wuxia-tools-assets-1251080372.cos.ap-shanghai.myqcloud.com/ad/img/${ad.img}`} />
                </a>
              </div>;
            })
          }
        </div>
        <div styleName="two-column-a">
          {
            this.state.adList.filter(o => !o.fullWidth).map((ad, i) => {
              return <div key={i}>
                <a href={ad.link} target="_blank">
                  <img src={`https://wuxia-tools-assets-1251080372.cos.ap-shanghai.myqcloud.com/ad/img/${ad.img}`} />
                </a>
              </div>;
            })
          }
        </div>
      </div>
    );
  }
}

export default BannerAd;