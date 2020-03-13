import React, {Component} from 'react';
import debounce from 'lodash/debounce';

import recipeList from './assets/cookbook.json';
import materialList from './assets/material.json';

import './cook.css';
import Helmet from 'react-helmet/es/Helmet';
import Tabs from 'antd/es/tabs';
import Table from 'antd/es/table';
import {getRecipeTableColumns} from './utils/table_utils';
import Input from 'antd/es/input';
import Checkbox from 'antd/es/checkbox';
import Divider from 'antd/es/divider';
import InputNumber from 'antd/es/input-number';
import Button from 'antd/es/button';
import Icon from 'antd/es/icon';
import Switch from 'antd/es/switch';
import {getFilteredRecipeList, getFullCookbook, getRecipe, IMG_BASE_DOMAIN} from './utils/data_utils';

class CookComponent extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedRowKeys: [],

      cookbook: getFullCookbook(),
      name: '',
      keyword: '',
      minLevel: 0,
      maxLevel: 8,
      onlyCritical: false,
      onlyFeast: false
    };

    this.renderRecipe = this.renderRecipe.bind(this);
    this.updateFilteredRecipes = this.updateFilteredRecipes.bind(this);
  }

  // 渲染食谱页面
  renderRecipe(f) {
    // 获取合并后的菜谱数据
    f = getRecipe(f.productId);
    // 类别
    let materialTypeToName = typeId => ['专属' ,'可替代', '推荐'][typeId];
    let materialTypePinyin = typeId => ['zhuanshu' ,'ketidai', 'tuijian'][typeId];
    let levelToChinese = levelId => ['初级', '中级', '高级'][Math.floor(levelId / 3)];
    return <div styleName="recipe-box">
      <div styleName="a-block-top">
          天涯明月刀2019年渔樵耕读版本 厨师身份烹饪攻略<br/>
          【多玩天刀攻略团】段段整理（长生剑 涂铃铃）
      </div>
      <div styleName="title">{f.name} <span>{levelToChinese(f.level)}（{f.unlockLevel}级）</span></div>
      <div styleName="title-block">
        <div styleName="title-img-wrapper">
          <img styleName="title-img-bg" src={`${IMG_BASE_DOMAIN}/ui/cook/product_border_128.png`}/>
          <img styleName="title-img"
            src={`${IMG_BASE_DOMAIN}/imagesets/ICONS/UI/CHUSHI128/${f.icon.toUpperCase()}.png`}/>
        </div>
        <div styleName="name-des">
          <div>
            <span styleName="title-prop" dangerouslySetInnerHTML={{__html: f.propDes}} />
          </div>
          <div styleName="des" dangerouslySetInnerHTML={{__html: f.des}} />
        </div>
      </div>
      <div styleName="prop-block">
        <div styleName="prop-limit">
          <table>
            <tr>
              <td styleName="table-head">菜系</td>
              <td>{f.map}</td>
              <td styleName="table-head" colSpan="8">材料替换数量限制</td>
            </tr>
            <tr>
              <td styleName="table-head">制作消耗活力</td><td>{f.huoli}</td>
              <td>主食</td><td>肉类</td><td>蔬菜</td><td>鱼类</td><td>水产</td><td>蛋类</td><td>水果</td><td>特殊</td>
            </tr>
            <tr>
              <td styleName="table-head">解锁需要次数</td>
              <td>{f.shulianCount}</td>
              <td>{f.limits[0]}</td><td>{f.limits[1]}</td><td>{f.limits[2]}</td>
              <td>{f.limits[3]}</td><td>{f.limits[4]}</td><td>{f.limits[5]}</td>
              <td>{f.limits[6]}</td><td>{f.limits[7]}</td>
            </tr>
          </table>
        </div>
      </div>
      <div styleName="material">
        {
          [0, 1, 2, 3].map(i => <div styleName="material-item">
            <div styleName="material-img-wrapper">
              <img styleName="material-img-bg" src={`${IMG_BASE_DOMAIN}/ui/cook/material_border.png`} />
              <img styleName="material-img-type" src={`${IMG_BASE_DOMAIN}/ui/cook/${materialTypePinyin(f.materialTypes[i])}.png`}/>
              <img styleName="material-img"
                src={`${IMG_BASE_DOMAIN}/imagesets/ICONS/UI/CHUSHI128/${f.materials[i].icon.toUpperCase()}.png`}/>
            </div>
            <span styleName="material-name">{f.materials[i].name}({f.materials[i].level}级)</span>
          </div>)
        }
      </div>
      <div style={{display: f.criticalName ? '' : 'none'}}>
        <span styleName="title">暴击产物：{f.criticalName}</span>
        <div styleName="crit-food">
          <div styleName="title-img-wrapper">
            <img styleName="title-img-bg" src={`${IMG_BASE_DOMAIN}/ui/cook/product_border_128.png`}/>
            <img styleName="title-img"
              src={`${IMG_BASE_DOMAIN}/imagesets/ICONS/UI/CHUSHI128/${f.criticalIcon.toUpperCase()}.png`}/>
          </div>
          <div styleName="name-des">
            <div styleName="des">
              <div>暴击率：{f.criticalRate}</div>
              <div dangerouslySetInnerHTML={{__html: f.criticalPropDes}} />
              <div dangerouslySetInnerHTML={{__html: f.criticalDes}} />
            </div>
          </div>
        </div>
      </div>
      <div styleName="a-block-bottom">
          整理制作：段段天刀综合助手 wuxiatools.com
      </div>
    </div>;
  }

  componentDidUpdate(prevProps, prevState) {
    let self = this;
    let {name, keyword, minLevel, maxLevel, onlyCritical, onlyFeast} = this.state;
    // 更新筛选列表结果
    if (prevState.name !== name || prevState.keyword !== keyword || prevState.minLevel !== minLevel ||
      prevState.maxLevel !== maxLevel || prevState.onlyCritical !== onlyCritical ||
      prevState.onlyFeast !== onlyFeast) {
      console.log('bianle');
      debounce(() => {
        console.log('重算');
        self.setState({
          cookbook: getFilteredRecipeList(name, keyword, minLevel, maxLevel, onlyCritical, onlyFeast)
        });
      }, 500);
    }
  }

  updateFilteredRecipes() {

  }

  render() {
    let self = this;

    return (
      <div>
        <Helmet defer={false}>
          <meta charSet="utf-8" />
          <title>天刀厨师身份食材菜谱大全 | 天刀数据百科 | 段段天刀综合助手</title>
          <meta name="description" content="天刀厨师身份食材菜谱大全，包含所有食材的来源、描述、等级数据，以及菜谱的描述、配方、替换推荐等详尽的数据" />
          <meta name="keywords" content="天刀全职业技能,天刀数据百科" />
          <meta name="viewport" content="width=device-width"/>
        </Helmet>
        <div styleName="header">
          <h1>大标题说明嗷嗷</h1>
        </div>
        <div styleName="cook-tabs">
          <Tabs defaultActiveKey="1" animated={true}>
            <Tabs.TabPane tab="菜谱配方" key="1">
              <div styleName="cook-tab-content">
                <div styleName="filter-panel">
                  {/*<div>*/}
                  {/*  <h5 style={{display: 'inline-block'}}>菜谱标记</h5>{' '}*/}
                  {/*  <Button.Group>*/}
                  {/*    <Button>显示全部</Button>*/}
                  {/*    <Button>显示已勾选菜谱</Button>*/}
                  {/*    <Button>显示未勾选菜谱</Button>*/}
                  {/*  </Button.Group>*/}
                  {/*</div>*/}
                  <div>
                    <h5 style={{display: 'inline-block'}}>菜名筛选</h5>{' '}
                    <Input
                      style={{width: 200}}
                      placeholder="可查食谱名称或描述内容"
                      value={this.state.name}
                      onChange={(e) => this.setState({name: e.target.value})}
                    />
                  </div>
                  <div>
                    <h5 style={{display: 'inline-block'}}>等级上下限</h5>{' '}
                    {/*<Slider marks={{1:1,2:2,3:3,4:4,5:5,6:6,7:7,8:8,9:9}} step={1} defaultValue={[1,9]} min={1} max={9} range={true} />*/}
                    <Input.Group compact style={{display: 'inline-block', width: 400}}>
                      <Input style={{ width: 100, textAlign: 'center' }} placeholder="最低等级" />
                      <Input
                        style={{
                          width: 30,
                          borderLeft: 0,
                          pointerEvents: 'none',
                          backgroundColor: '#fff',
                        }}
                        placeholder="~"
                        disabled
                      />
                      <Input style={{ width: 100, textAlign: 'center', borderLeft: 0 }} placeholder="最高等级" />
                    </Input.Group>
                  </div>
                  <div>
                    <h5 style={{display: 'inline-block'}}>计算毕业剩余所需食材数量1233dsfsfsd999 <Icon type="question-circle" /></h5>{' '}
                    <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked /><br/>
                    <Button.Group>
                      <Button>全部无限</Button>
                      <Button>清空全部</Button>
                      <Button type="primary">开始筛选</Button>
                    </Button.Group>
                    <span></span>
                    <a style={{ marginLeft: 8, fontSize: 12 }}>
                      {this.state.expand ? '折叠' : '展开'}折叠食材数量表单 <Icon type={this.state.expand ? 'up' : 'down'} />
                    </a>
                    <div>
                      {
                        [0,1,2,3,4,5,6,7,8].map((typeId) => {
                          return <div key={typeId}>
                            种类{typeId}
                            <div>
                              {
                                materialList.filter((m) => m.type === typeId).sort((a, b) => a.name.length - b.name.length).map((m) => {
                                  return <span key={m.materialId} styleName="material-num-checkbox-wrapper">
                                    <Checkbox styleName="material-num-checkbox">{m.name}</Checkbox>
                                    <InputNumber
                                      style={{width: 60}}
                                      min={0} max={9999}
                                      size="small" placeholder="数量"
                                      defaultValue={0}
                                    />
                                    <Divider type="vertical" />
                                  </span>;
                                })
                              }
                            </div>
                          </div>;
                        })
                      }
                    </div>
                  </div>
                </div>
                <div styleName="main-table-panel">

                  {/*自绘表格*/}
                  <table>
                    {
                      this.state.cookbook.map(recipe => <tr key={recipe.recipeId}>
                        <td>{recipe.name}</td>
                      </tr>)
                    }
                  </table>





                  {/*表格*/}
                  <Table
                    columns={getRecipeTableColumns()}
                    dataSource={recipeList}
                    size="middle"
                    rowSelection={{
                      selectedRowKeys: this.state.selectedRowKeys,
                      onChange: (selectedRowKeys) => self.setState({selectedRowKeys})
                    }}
                    expandedRowRender={r => this.renderRecipe(r)}
                    rowKey={(record) => record.productId}
                  />




                </div>
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab="食材信息" key="2">
              <div styleName="cook-tab-content">
                <div styleName="filter-panel">
                  sasd fdsf当时当时功夫
                </div>
                <div styleName="main-table-panel">
                  给对方个
                </div>
              </div>
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default CookComponent;
