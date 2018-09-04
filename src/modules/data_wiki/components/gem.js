import React, {Component} from 'react';

import gemData from '../json/gem.json';
import {Table, Tabs, Radio, Card, Row, Col} from 'antd';
import {Sparklines, SparklinesLine} from 'react-sparklines';

const gemPicPath = require.context('../assets/imgs/gem', true);

import './css/gem.css';
import Helmet from "react-helmet/es/Helmet";

let gongliCoMap = {
  '力道': 0.8, '气劲': 0.8, '洞察': 0.8, '身法': 0.8, '根骨': 0.8,
  '外功攻击': 1, '内功攻击': 1.6, '外功防御': 0.5, '内功防御': 0.5,
  '命中率': 5, '会心率': 10, '会心伤害': 4,
  '格挡率': 5, '韧劲': 9,
  '气血上限': 0.1,
  '全基础属性': 4,
  '破伤': 0,
  '双防': 1
};

let zhanliCoMap = {
  '力道': 0.3, '气劲': 0.3, '洞察': 0.3, '身法': 0.3, '根骨': 0.3,
  '外功攻击': 0.85, '内功攻击': 1.05, '外功防御': 0.18, '内功防御': 0.18,
  '命中率': 3, '会心率': 12, '会心伤害': 12,
  '格挡率': 3, '韧劲': 0.3,
  '气血上限': 0.03,
  '全基础属性': 1.5,
  '破伤': 10,
  '双防': 0.36
};

class GemComponent extends Component {

  constructor(props) {
    super(props);

    this.state = {
      gemType: 'circle'
    };
  }

  calcGongli(str) {
    let data =  str.replace(/%/g, '').split('$$').map((str) => str.split('+'));
    return +(data.reduce((gongli, arr) => {
      return gongli + gongliCoMap[arr[0]] * parseFloat(arr[1]);
    }, 0)).toFixed(1);
  }

  calcZhanli(str) {
    let data =  str.replace(/%/g, '').split('$$').map((str) => str.split('+'));
    return +(data.reduce((zhanli, arr) => {
      return zhanli + zhanliCoMap[arr[0]] * parseFloat(arr[1]);
    }, 0)).toFixed(1);
  }

  render() {
    let self = this;
    return (
      <div style={{paddingTop: '20px'}}>
        <Helmet defer={false}>
          <meta charSet="utf-8" />
          <title>天刀砭石数据百科，全类型全等级砭石属性 | 天刀数据百科 | 段段天刀综合助手</title>
          <meta name="keywords" content="天刀砭石数据,天刀数据百科" />
          <meta name="viewport" content="width=device-width"/>
        </Helmet>
        <Row>
          <Col span={24} gutter={10}>
            <Card title="砭石数据百科" styleName="gem-card">
              <p>
                砭石数据百科，本页面包含天涯明月刀最新版本砭石属性、功力战力数据方便查询。由于数据庞杂显示上较拥挤，建议您使用电脑浏览器浏览。
              </p>
              <br />
              <Tabs type="card">
                {
                  Object.keys(gemData).map((levelKey, i) => {
                    // 处理数据
                    let propRender = function (obj) {
                      if(obj && obj.propDes) {
                        // 计算功力战力
                        let gongli = self.calcGongli(obj.propDes);
                        let zhanli = self.calcZhanli(obj.propDes);
                        return [
                          <p key="gongli">功力+{gongli}</p>,
                          <p key="zhanli">战力+{zhanli}</p>,
                          <hr key="hr" />,
                        ].concat(obj.propDes.split('$$').map((s, i) => (
                          <p key={i}>{s}</p>
                        )));
                      }
                      return '';
                    };
                    const columns = [
                      { title: '图片', width: 50, dataIndex: 'name', key: 'img', fixed: 'left', render: (name) => <img src={gemPicPath(`./${name}.png`, true)} /> },
                      { title: '砭石名称', width: 100, dataIndex: 'name', key: 'name', fixed: 'left', render: (name) => <span style={{fontSize: 16}}>{name}</span> },
                      { title: '数据趋势', dataIndex: '', key: 'trend', fixed: 'left', width: 100, render: (obj) => {
                        // 判断几种数据
                        if(obj['1']) {
                          let data = [];
                          for(let k = 1; k <= 11; k++) {
                            obj[k].propDes.replace(/%/g, '').split('$$').forEach((str, i) => {
                              if(!data[i])
                                data[i] = [];
                              data[i].push(parseFloat(str.split('+')[1]));
                            });
                          }
                          return (
                            data.map((arr, i) => (
                              <div key={i}>
                                <Sparklines data={arr} svgWidth={85} svgHeight={20}>
                                  <SparklinesLine color="#9450b0" />
                                </Sparklines>
                              </div>
                            ))
                          );
                        }
                      }},
                      { title: '第11重', dataIndex: '11', key: '11', render: propRender },
                      { title: '第10重', dataIndex: '10', key: '10', render: propRender },
                      { title: '第9重', dataIndex: '9', key: '9', render: propRender },
                      { title: '第8重', dataIndex: '8', key: '8', render: propRender },
                      { title: '第7重', dataIndex: '7', key: '7', render: propRender },
                      { title: '第6重', dataIndex: '6', key: '6', render: propRender },
                      { title: '第5重', dataIndex: '5', key: '5', render: propRender },
                      { title: '第4重', dataIndex: '4', key: '4', render: propRender },
                      { title: '第3重', dataIndex: '3', key: '3', render: propRender },
                      { title: '第2重', dataIndex: '2', key: '2', render: propRender },
                      { title: '第1重', dataIndex: '1', key: '1', render: propRender }
                    ];

                    let data = Object.keys(gemData[levelKey]).map((gemKey) => {
                      let singleGem = gemData[levelKey][gemKey];

                      return Object.assign({
                        img: singleGem.img,
                        img2: '图',
                        name: gemKey
                      }, singleGem.levels);
                    }).filter(({name}) => {
                      switch (this.state.gemType) {
                      case 'circle':
                        if(name.includes('圆'))
                          return true;
                        break;
                      case 'rect':
                        if(name.includes('棱'))
                          return true;
                        break;
                      case 'triangle':
                        if(name.includes('小'))
                          return true;
                        break;
                      default:
                        return false;
                      }
                      return false;
                    });

                    return (
                      <Tabs.TabPane key={i} tab={levelKey}>
                        <div>
                          <Radio.Group
                            onChange={(e) => this.setState({gemType: e.target.value})}
                            defaultValue={this.state.gemType}
                            buttonStyle="solid"
                          >
                            <Radio.Button value="circle">圆石</Radio.Button>
                            <Radio.Button value="rect">棱石</Radio.Button>
                            <Radio.Button value="triangle">小石</Radio.Button>
                          </Radio.Group>{'  '}
                          <span style={{fontSize: 14}}>【多玩天刀攻略团】 段段制作</span>，多玩论坛帖子链接：http://bbs.duowan.com/thread-46427162-1-1.html，本数据页面：https://www.wuxiatools.com/data-wiki/gem，转载请注明链接与出处“多玩论坛-段段”。
                        </div>
                        <br />
                        <Table
                          columns={columns}
                          dataSource={data}
                          scroll={{x:1500 }}
                          pagination={false}
                          size="small"
                          bordered
                          rowClassName={(record, index) => index % 2 ? 'gem-table-even' : 'gem-table-odd'}
                          style={{whiteSpace: 'nowrap'}}
                        />
                      </Tabs.TabPane>
                    );
                  })
                }
              </Tabs>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default GemComponent;
