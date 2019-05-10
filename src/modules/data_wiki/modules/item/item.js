import React, {Component} from 'react';
import Helmet from 'react-helmet/es/Helmet';
import LazyLoad from 'react-lazyload';
import axios from 'axios';
import debounce from 'lodash/debounce';

// import itemList from '../json/items.json';

import './item.css';
import BannerAd from '../../../_commons/ad/components/banner_ad';
import TextAd from '../../../_commons/ad/components/text_ad';

class ItemComponent extends Component {

  constructor(props) {
    super(props);

    this.state = {
      items: [],
      result: [],
      searchText: '',
      showModal: false,
      currentId: null
    };

    this.searchItem = this.searchItem.bind(this);
    // this.renderListMode = this.renderListMode.bind(this);
    this.renderCardMode = this.renderCardMode.bind(this);
    this.showModal = this.showModal.bind(this);
    this.renderImage = this.renderImage.bind(this);
    this.renderModalContent = this.renderModalContent.bind(this);
    this.suiyinFormat = this.suiyinFormat.bind(this);

    this.searchDebounce = debounce(this.searchDebounce, 700);
  }

  componentDidMount() {
    let self = this;
    // 远程获取json文件
    axios.get('https://wuxia-tools-assets-1251080372.file.myqcloud.com/item_json/items20181207.json')
      .then(function (response) {
        self.setState({
          items: response.data,
          result: response.data
        });
        console.log(response.data[1]);
      })
      .catch(function (error) {
        console.log(error);
      });
  }


  searchItem(e) {
    let self = this;
    let text = e.target.value;
    this.setState({
      searchText: text
    });
    console.log('z');
    this.searchDebounce(text);
  }

  searchDebounce(text) {
    // 让名称匹配的排在前面
    let result = this.state.items.filter(o => o.name.includes(text))
      .concat(this.state.items.filter(o => o.des.includes(text)))
      .concat(this.state.items.filter(o => o.background.includes(text)));
    result =[...new Set(result)];
    this.setState({
      result: result
    });
  }

  // renderListMode() {
  //   return this.state.result.slice(0, 300).map((item, i) => {
  //     return <div key={i} styleName="item-list-item">
  //       <img height={64} src={`wuxia-tools-assets-1251080372.file.myqcloud.com/item/${item.icon64}.png`} />
  //       {item.name}111
  //       <hr styleName="item-hr" />
  //       {item.des.replace(/<[^>]*>/g, '')}
  //       {item.background.replace(/<[^>]*>/g, '')}
  //     </div>;
  //   });
  // }

  renderCardMode() {
    if(this.state.result.length === 0)
      return <div styleName="no-result">搜索无结果</div>;
    let cards = this.state.result.slice(0, 150).map((item, i) => {
      return <span
        key={i} styleName="card-item"
        onClick={() => this.showModal(item.id)}
      >
        <span styleName="card-img">
          <img height={64} src={`https://wuxia-tools-assets-1251080372.file.myqcloud.com/item/${item.icon64}.png`} />
        </span>
        <span styleName="card-name">{item.name}</span>
      </span>;
    });
    return <div styleName="cards-container">
      {cards}
    </div>;
  }

  showModal(id) {
    this.setState({
      currentId: id,
      showModal: true
    });

  }

  suiyinFormat(tong) {
    if(tong === 0)
      return '0 铜';
    let jin = Math.floor(tong / 10000);
    let yin = Math.floor(tong % 10000 / 100);
    let newTong = Math.floor(tong % 100);
    return `${jin?`${jin} 金`:''} ${yin?`${yin} 银`:''} ${newTong?`${newTong} 铜`:''}`;
  }

  renderImage(item) {
    // 显示需要用到的
    // let colorList = ['#f1b645', '#e4c840', '#9b58a6', '#3e9cd5', '#63b458', '#8d9091'];
    let colorList = ['#fff', '#63b458', '#3e9cd5', '#9b58a6', '#e4c840', '#f1b645'];
    let menpaiList = ['真武', '太白', '神威', '丐帮', '唐门', '五毒', '少林', '天香', '神刀', '移花'];
    let sellTypeMap = {1: '铜', 2: '铜', 23: '神魄', 25: '青梅令'};
    let sexList = [null, '成男', '成女', '少女'];

    // html字符串转换
    let des = item.des.replace(/\\n/g, '<br />').replace(/\$\$/g, ',');
    let backDes = item.background.replace(/\\n/g, '<br>').replace(/<br><br>/g, '<br>').replace(/\$\$/g, ',');
    let fromWhere = item.fromWhere.replace(/\\n/g, '<br>').replace(/<br><br>/g, '<br>').replace(/\$\$/g, ',').replace(/\[[^,]*,([^,]*)[^\]]*\]/g, '<span style="color: #e4c840; text-decoration: underline">$1</span>');
    let howToUse = item.howToUse.replace(/\\n/g, '<br>').replace(/<br><br>/g, '<br>').replace(/\$\$/g, ',').replace(/\[[^,]*,([^,]*)[^\]]*\]/g, '<span style="color: #e4c840; text-decoration: underline">$1</span>');

    // 处理售店获得碎银格式
    let sellString = `${item.sellCost} ${sellTypeMap[item.sellType]}`;
    if(item.sellType === 1 || item.sellType === 2)
      sellString = this.suiyinFormat(item.sellCost);

    // 处理售店换物品类型
    let sellItem = item.sellItem === 0 ? null : this.state.items.filter(o => o.id === item.sellItem)[0];

    return <div style={{width: 350, background: '#252525', color: '#fff', padding: 10, fontSize: 16}}>
      <img styleName="item-modal-img" src={`https://wuxia-tools-assets-1251080372.file.myqcloud.com/item/${item.icon64}.png`} />
      <span
        styleName="item-modal-name"
        style={{color: colorList[item.quality]}}
      >
        {item.name}
      </span>
      <div>
        {item.minLV !== 0 && <div styleName="item-modal-prop">需要等级:<span styleName="item-modal-prop-num">{item.minLV}{item.maxLV !== 0 && '-' + item.maxLV}</span></div>}
        {item.valueLV !== 0 && <div styleName="item-modal-prop">品质等级:<span styleName="item-modal-prop-num">{item.valueLV}</span></div>}
        {item.cdLen !== 0 && <div styleName="item-modal-prop">调息时间:<span styleName="item-modal-prop-num">{(item.cdLen / 1000).toFixed(2)}秒</span></div>}
        {item.menpai !== -1 && <div styleName="item-modal-prop">门派:<span styleName="item-modal-prop-num">{menpaiList[item.menpai]}</span></div>}
        {item.sex && item.sex!=='1$$ 2$$ 3' && <div styleName="item-modal-prop">性别:<span styleName="item-modal-prop-num">{(item.sex+'').split('$$').map(parseFloat).reduce((last, c) => last + ' ' + sexList[c], '')}</span></div>}
        {/*身份先不弄了 job*/}
        {item.pacMax !== 0 && <div styleName="item-modal-prop">堆叠上限:<span styleName="item-modal-prop-num">{item.pacMax}</span></div>}
        {item.itemType !== 0 && <div styleName="item-modal-prop">分类:<span styleName="item-modal-prop-num">{item.itemType || '空'}</span></div>}
      </div>
      <hr styleName="item-modal-hr" />
      <div dangerouslySetInnerHTML={{ __html: des }} />
      <div styleName="item-modal-back-des" dangerouslySetInnerHTML={{ __html: backDes }} />
      <hr styleName="item-modal-hr" />
      {item.fromWhere !== '' &&
        <div>
          <div dangerouslySetInnerHTML={{ __html: fromWhere }} />
          <div dangerouslySetInnerHTML={{ __html: howToUse }} />
          <hr styleName="item-modal-hr" />
        </div>
      }
      <div>
        {item.canSell === 0 && <div styleName="item-modal-cannot">不可售店</div>}
        {item.canDiscard  === 0 && <div styleName="item-modal-cannot">不可丢弃</div>}
        {item.canMail === 0 && <div styleName="item-modal-cannot">不可邮寄</div>}
        {item.canBank === 0 && <div styleName="item-modal-cannot">不可存仓库</div>}
        {/*{item.canPitch === 0 && <div styleName="item-modal-cannot">不可丢弃</div>}*/}
        <div styleName="item-modal-prop-long">售点获货币:<span styleName="item-modal-prop-num">{sellString}</span></div>
        <div styleName="item-modal-prop-long">售店获物品:<span styleName="item-modal-prop-num"> {sellItem === null ? '无' : `${sellItem.name} ${item.sellItemNum} 个`}</span></div>
      </div>
    </div>;
  }

  renderModalContent() {
    if (this.state.currentId) {
      let m = this.state.items.filter(o => o.id === this.state.currentId)[0];
      return <div>
        {this.renderImage(m)}
      </div>;
    } else {
      return null;
    }

  }

  render() {
    return <div>
      <Helmet defer={false}>
        <meta charSet="utf-8"/>
        <title>天刀物品数据百科，最全背包物品属性、图片整理 | 天刀数据百科 | 段段天刀综合助手</title>
        <meta name="keywords" content="天刀物品数据百科,天刀数据百科"/>
        <meta name="viewport" content="width=device-width"/>
      </Helmet>
      <div styleName="whole-page">
        <div styleName="search-panel-wrapper">
          <div styleName="search-panel">
            <h1 style={{color:'#fff'}}>段段天刀物品数据百科</h1>
            本页数据为“20181210”日期版本。按照官方更新频度，一般两周以内的数据都可视为最新的。
            本站配有数据更新脚本，但仍需手动运行，若您发现有大更新未及时同步可加入下方QQ群反馈。<br/>
            本工具目前为基本功能试行阶段，有任何功能上的建议您都可提出。QQ交流群：660695387。<br/>
            <input
              styleName="search-input"
              placeholder="请输入查询的关键词"
              onChange={this.searchItem}
              value={this.state.searchText}
            />
          </div>
        </div>
        <div styleName="item-list-container">
          <div>
            {/*{this.renderListMode()}*/}
            {this.renderCardMode()}
          </div>
        </div>
        <BannerAd />
      </div>
      <div id="item-modal"
        styleName="item-modal" style={{display: this.state.showModal ? 'block' : 'none'}}
        onClick={() => this.setState({showModal: false})}
      >
        <div
          styleName="modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          <div>
            <span
              styleName="item-modal-close"
              onClick={() => this.setState({showModal: false})}
            >
              &times;
            </span>
            <p styleName="item-modal-header">物品详情</p>
          </div>
          {this.renderModalContent()}
        </div>
      </div>
    </div>;
  }
}

export default ItemComponent;