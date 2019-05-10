import React, {Component} from 'react';

import skillData from './assets/skill.json';

import './skill.css';
import Helmet from 'react-helmet/es/Helmet';
import Input from "antd/es/input";
import InputNumber from "antd/es/input-number";

class SkillComponent extends Component {

  constructor(props) {
    super(props);

    this.state = {
      wgMin: 0,
      wgMax: 0,
      ngMin: 0,
      ngMax: 0
    };

    this.renderSkillPanel = this.renderSkillPanel.bind(this);
  }


  renderSkillPanel(s) {
    let {wgMin, wgMax, ngMin, ngMax} = this.state;
    let sum = s.addition1List.reduce((last, cur) => last + cur, 0);
    return <div id={s.skillId} styleName="skill-panel">
      <div><img src={`https://wuxia-tools-assets-1251080372.file.myqcloud.com/imagesets/ICONS/SKILL/${s.icon.toUpperCase()}.PNG`} /></div>
      <div styleName="skill-name">{s.name}</div>
      <div>第{s.maxLevel}重</div>
      <div>武学套路: {s.typeDes}</div>
      <div>武学类型: {s.type}</div>
      <div>调息时间: {s.cd / 1000}秒</div>
      <div dangerouslySetInnerHTML={{ __html: s.des.split('###')[0].replace(/\\n/g, '<br />') }} />
      <div styleName="skill-panel-background">{s.background}</div>
      <div>技能加成系数： {s.addition1List.join(', ')}</div>
      <div>技能加成系数和： {sum}</div>
      <div>期望伤害：{(sum*(wgMin+ngMin)+1)*3}～{(sum*(wgMax+ngMax)+1)*3}</div>
    </div>;
  }

  render() {



    return (
      <div>
        <Helmet defer={false}>
          <meta charSet="utf-8" />
          <title>天刀全职业技能描述、技能加成 | 天刀数据百科 | 段段天刀综合助手</title>
          <meta name="keywords" content="天刀全职业技能,天刀数据百科" />
          <meta name="viewport" content="width=device-width"/>
        </Helmet>
        <div style={{marginTop: 100}}>
          <InputNumber style={{width: 100}} value={this.state.wgMin} onChange={(e) => this.setState({wgMin: e})} />
          <InputNumber style={{width: 100}} value={this.state.wgMax} onChange={(e) => this.setState({wgMax: e})} />
          <InputNumber style={{width: 100}} value={this.state.ngMin} onChange={(e) => this.setState({ngMin: e})} />
          <InputNumber style={{width: 100}} value={this.state.ngMax} onChange={(e) => this.setState({ngMax: e})} />
        </div>
        <div>
          {
            skillData.TX.map((s) => {
              return this.renderSkillPanel(s);
            })
          }
        </div>
      </div>
    );
  }
}

export default SkillComponent;
