import React, {Component} from 'react';
import debounce from 'lodash/debounce';

import youliData from './assets/youli.json';

import './youli.css';
import Helmet from 'react-helmet/es/Helmet';
import Select from 'antd/es/select';
import Spin from 'antd/es/spin';
import Collapse from 'antd/es/collapse/Collapse';
import Table from 'antd/es/table/Table';
import Link from 'react-router-dom/es/Link';
import Redirect from 'react-router-dom/es/Redirect';
import ButtonGroup from 'antd/es/button/button-group';
import Button from 'antd/es/button/button';
import Checkbox from 'antd/es/checkbox';
import Icon from 'antd/es/icon';
import Modal from 'antd/es/modal';

import * as Scroll from 'react-scroll';
import Alert from 'antd/es/alert';

import Adsense from '../../../portal/components/adsense';
import TextAd from "../../../_commons/ad/components/text_ad";
import BannerAd from "../../../_commons/ad/components/banner_ad";

class YouLiComponent extends Component {

  constructor(props) {
    super(props);

    this.state = {
      idList: [],
      value: [],
      fetching: false,
      foldList: [],
      showText: true,
      showTrust: true
    };


    this.searchTour = this.searchTour.bind(this);
    this.searchTour = debounce(this.searchTour, 300);

    this.handleTourChange = this.handleTourChange.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);

  }

  componentDidMount() {
    // 默认搜索一下空字符串，预加载一下所有列表
    this.searchTour('');
  }


  searchTour (value) {
    this.setState({ data: [], fetching: true });

    let keyword = value;
    let idList = Object.keys(youliData).filter(tourId => {
      return youliData[tourId][1].t1.includes(keyword);
    });
    this.setState({
      idList: idList,
      fetching: false
    });
  }

  handleTourChange(value) {
    // 切换url
    this.props.history.push(`/data/tour/${value.key}`);
    // 跳转位置
    Scroll.scroller.scrollTo('tour-content', {duration: 600, smooth: 'linear'});
  }

  handleOptionChange(values) {
    this.setState({
      showText: values.includes('showText'),
      showTrust: values.includes('showTrust')
    });
  }

  renderTour(tourId) {
    let self = this;
    tourId = tourId || 1001;
    let tour = youliData[tourId];

    // 拿出第一行，分别有标题、文本、图片位置
    let firstLine = tour[1];
    let conditions = tour[0].conditions.map((cur, i) => {
      return <div key={i}>
        <span styleName="condition">条件{i + 1}：{cur.text || '无'}，</span>
        <span styleName="condition-text">概率{cur.p * 100}%，{cur.once ? '仅可完成一次' : '可重复完成'}，{cur.cd === 0 ? '无cd' : 'cd时长' + cur.cd + '次'}</span>
      </div>
      ;
    });

    // 每一个number对应的选项文本缓存
    let numberTextList = [];
    // 深度优先遍历这颗树，递归构造文本
    function DFS(lineId, hasChoice, number) {
      let line = tour[lineId];
      let subListResult = null;
      if(line.children.length !== 0) {
        // 遍历每个孩子节点，构造选项子结构
        subListResult = line.children.map((child, i) => {
          let n;
          if (number === '')
            n = i + 1;
          else
            n = number + '.' + (i + 1);
          return <div key={n}>{DFS(child, false, n)}</div>;
        });
      } else {
        // 没孩子了，直接拼接一个结束
        subListResult = null;
      }
      // 拼接奖励
      let reward = line.reward === '' ? null : <div><span styleName="reward">{line.reward}</span></div>;
      // 拼接对话
      let chat = null;
      if (line.chat) {
        let choices = line.chat.choices.map((cur, i) => {
          return <tr key={i}><td>{cur.text.replace(/\\n/g, '')}</td><td styleName="xinren-td">信任度{(cur.degree < 0 ? '' : '+') + cur.degree}</td></tr>;
        });
        chat = <table styleName="choice-table"><tbody><tr><td colSpan={2}>{line.chat.text.replace(/\\n/g, '')}</td></tr>{choices}</tbody></table>;
      }
      // 存储奖励缓存
      numberTextList.push({key: number, text: line.t1});
      // 拼接条件
      let choiceCondition = <span />;
      if(line.t4 !== '') {
        choiceCondition = <span>（选择此项需：{line.t4}）<br/></span>;
      }
      return <React.Fragment key={number}>
        <div styleName="card-selection-header">
          <div styleName="vertical-line" />
          <div styleName="horizontal-line" />
          <div styleName="diamond" />
          <span styleName="card-selection-header-text"
            onClick={() => {
              let result = numberTextList.filter(o => o.key && number.toString().startsWith(o.key)).reverse().map((o, i) => <tr key={i}><td>{o.key}</td><td>{' '}{o.text}</td></tr>);
              Modal.info({
                title: '选项路径',
                content: <div><table className="dd-table"><tbody>{result}</tbody></table></div>,
                onOk() {},
                okText: '确定'
              });
            }}
          >
            {number + ' ' + line.t1}
          </span>
        </div>
        <div styleName="card-sub-panel">
          <div styleName="card-selection-container">
            <div styleName="card-selection">
              <div styleName={self.state.showText?'card-content-wrapper':'card-content-wrapper card-content-wrapper-less'}>
                {choiceCondition}
                <div styleName={self.state.showText ? '':'card-text-hide'}>{line.t2.replace(/\\n/g, '')}</div>
                {reward}
                <div style={{display: self.state.showTrust?'':'none'}}>{chat}</div>
              </div>
              {subListResult}
            </div>
          </div>
        </div>
      </React.Fragment>;
    }

    let treeResult = DFS(1, true, '');  // 最后一个参数是确定是否含选项的（最顶层的选项是标题名字）

    // 构造整个模板
    return <div styleName="card-container">
      <div styleName="copyright1">
        天涯明月刀2018年冬季青梅煮酒版本 小师妹游历玩法攻略<br/>
        【多玩天刀攻略团】段段 整理（长生剑 涂铃铃）
      </div>
      <div styleName="card-no">{'№' + tourId}</div>
      <div styleName="card-header">{firstLine.t1}</div>
      <div styleName="card-no">{conditions}</div>
      <img styleName="card-img" src={'https://wuxia-tools-assets-1251080372.file.myqcloud.com/xiaoshimei/youli-img/SM_YOULI/XIAYULU_TIPS/' + firstLine.t3.split('/').reverse()[0].toUpperCase()}/>
      {treeResult}
      <div styleName="copyright2">@段段天刀综合助手 www.wuxiatools.com</div>
    </div>;
  }

  render() {
    let {id, name} = this.props.match.params;
    const { fetching, idList, value } = this.state;
    let openAll = false;
    // 判断跳转。id错误时
    if(id !== undefined && !youliData[id]) {
      return <div>
        <Helmet defer={false}>
          <meta name="prerender-status-code" content="301" />
          <meta name="prerender-header" content={`Location: ${location.protocol}//${location.hostname}/data/tour`} />
        </Helmet>
        {!navigator.userAgent.includes('prerender') && <Redirect to="/data/tour" />}
      </div>;
    }
    // 名称不匹配时
    if(youliData[id] && name !== youliData[id][1].t1) {
      let url = `${location.protocol}//${location.hostname}/data/tour/${id}/${youliData[id][1].t1}`;
      url = encodeURI(url);
      return <div>
        <Helmet defer={false}>
          <meta name="prerender-status-code" content="301" />
          <meta name="prerender-header" content={`Location: ${url}`} />
        </Helmet>
        {!navigator.userAgent.includes('prerender') && <Redirect to={`/data/tour/${id}/${youliData[id][1].t1}`} />}
      </div>;
    }
    // id、名称合规时，继续
    let isIndex = false;
    if(id === undefined) {
      openAll = true;
      id = 1001;
      isIndex = true;
    }
    let tourName = youliData[id][1].t1;

    // 表格用的
    let tableData = Object.keys(youliData).map(tourId => {
      return {
        id: tourId,
        name: youliData[tourId][1].t1,
        des: youliData[tourId][1].t2,
      };
    });
    let tableColumns = [
      {
        title: 'id', dataIndex: 'id', key: 'id', width: 50,
        render: (text, record) => <span styleName="table-header"><Link onClick={() => Scroll.scroller.scrollTo('tour-content', {duration: 600, smooth: 'linear'})} to={`/data/tour/${record.id}/${record.name}`}>{text}</Link></span>,
      },
      {
        title: '名称', dataIndex: 'name', key: 'name', width: 120,
        render: (text, record) => <span styleName="table-header"><Link onClick={() => Scroll.scroller.scrollTo('tour-content', {duration: 600, smooth: 'linear'})}  to={`/data/tour/${record.id}/${record.name}`}>{text}</Link></span>,
      },
      {
        title: '事件描述', dataIndex: 'des', key: 'des', width: 300,
        render: text => <div styleName="table-des">{text}</div>,
      }
    ];

    // 上下条用
    let curIndex = Object.keys(youliData).findIndex((arrId) => arrId == id);
    let prev = curIndex - 1 >= 0 ? curIndex - 1 : null;
    let next = curIndex + 1 < Object.keys(youliData).length ? curIndex + 1 : 1;
    prev = prev !== null ? Object.keys(youliData)[prev] : null;
    next = next !== null ? Object.keys(youliData)[next] : null;

    return (
      <div style={{paddingTop: '20px'}}>
        <Helmet defer={false}>
          <meta charSet="utf-8" />
          <title>{`${isIndex?'': `${tourName} - `}天刀小师妹游历玩法攻略，触发条件、选项分支、奖励、对话大全 | 天刀数据百科 | 段段天刀综合助手`}</title>
          <meta name="keywords" content="天刀小师妹游历攻略,天刀数据百科" />
          <meta name="viewport" content="width=device-width"/>
        </Helmet>
        <div styleName="wrapper">
          <h1>天刀小师妹游历玩法攻略</h1>
          <h3>触发条件、选项分支、奖励、对话大全</h3>
          <p>
            说明：本工具用于方便查询小师妹游历玩法涉及的各项数据，仅供参考。本数据百科由于涉及过多玩法数据细节，严重剧透，
            可能影响剧情党等游戏体验，请斟酌后选择查看与否，本帖主要为丝毫不关注文案设计的功力党提供方便。
          </p>
          <p>
            页面中数据仅供参考，由于游历分支数据类别的不同，有一些选项可能在一些条件下隐藏，有一些选项会在选过以后不再显示，选择时需谨慎对照选择。
            小师妹游历服装来源请参考
            <a href="http://bbs.duowan.com/thread-46602817-1-1.html" target="_blank">这个连接</a>。
          </p>
          <p>
            excel分支奖励版请移步多玩论坛下载，<a href="http://bbs.duowan.com/thread-46595410-1-1.html" target="_blank">点击此处</a>。
            QQ群交流：660695387。
          </p>
          <Alert
            message="温馨提示"
            description={<div>
              2018-12-28更新：优化手机端显示，更新部分游历数据，增加全部游历概览表格。<br />
              2018-12-30更新：优化游历导航，增加点击选项查看单独分支功能，更方便大家浏览及快速作出选择。<br />
              转载本页数据请注明编纂整理者“<b>段段</b>”（近日发现存在恶意抹去作者信息的攻略传播）。<br />
              本站近日流量骤增，为补贴服务器费用，目前增加了展示效果较好的谷歌广告，希望不影响您的体验。<br />
              若本站帮到了您，您可以在电脑端点击页面右上方“联系与捐助”按钮等方式进行捐助，以便段段升级服务器降低过载率和优化网站内容。
            </div>}
            type="info"
            showIcon
            style={{marginBottom: 10}}
          />
          <TextAd />
          <Adsense />
          <Collapse defaultActiveKey={openAll ? [] : []} style={{marginBottom: 10}}>
            <Collapse.Panel header="展开/折叠 全部游历" key="1" forceRender>
              <Table
                columns={tableColumns}
                dataSource={tableData}
                size="small"
                rowKey="id"
              />
            </Collapse.Panel>
          </Collapse>
          <Select
            showSearch
            labelInValue
            size="large"
            value={value}
            placeholder="搜索游历标题"
            notFoundContent={fetching ? <Spin size="small" /> : '无数据'}
            filterOption={false}
            onSearch={this.searchTour}
            onChange={this.handleTourChange}
            styleName="search-input"
          >
            {idList.map(d => <Select.Option key={d}>{youliData[d][1].t1}</Select.Option>)}
          </Select>
          <Checkbox.Group options={[{label: '显示文案', value: 'showText'}, {label: '显示信任度', value: 'showTrust'}]} defaultValue={['showText', 'showTrust']} onChange={(v) => this.handleOptionChange(v)} />
          <Scroll.Element name="tour-content">
            <div style={{textAlign: 'center', marginTop: 10, marginBottom: 10}}>
              <ButtonGroup>
                {prev ?
                  <Button><Link to={`/data/tour/${prev}/${youliData[prev][1].t1}`}><Icon type="left" /> {youliData[prev][1].t1}</Link></Button> : <Button disabled>无上一游历</Button>
                }
                {next ?
                  <Button><Link to={`/data/tour/${next}/${youliData[next][1].t1}`}>{youliData[next][1].t1} <Icon type="right" /></Link></Button> : <Button disabled>无下一游历</Button>
                }
              </ButtonGroup>
            </div>
            {this.renderTour(id)}
            <div style={{textAlign: 'center', marginTop: 10, marginBottom: 10}}>
              <ButtonGroup>
                {prev ?
                  <Button><Link to={`/data/tour/${prev}/${youliData[prev][1].t1}`}><Icon type="left" /> {youliData[prev][1].t1}</Link></Button> : <Button disabled>无上一游历</Button>
                }
                {next ?
                  <Button><Link to={`/data/tour/${next}/${youliData[next][1].t1}`}>{youliData[next][1].t1} <Icon type="right" /></Link></Button> : <Button disabled>无下一游历</Button>
                }
              </ButtonGroup>
            </div>
          </Scroll.Element>
          <BannerAd />
        </div>
      </div>
    );
  }
}

export default YouLiComponent;
