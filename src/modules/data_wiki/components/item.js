import React, {Component} from 'react';
import PropTypes from 'prop-types';

import affixData from '../json/affix.json';
import affixExampleData from '../json/affix_type_example.json';
import Helmet from 'react-helmet/es/Helmet';

import './css/affix.css';

class AffixComponent extends Component {

  renderAffixTypeMatrix() {
    let cats = [
      {name: '力道', type: 'ld'},
      {name: '根骨', type: 'gg'},
      {name: '洞察', type: 'dc'},
      {name: '身法', type: 'sf'},
      {name: '气劲', type: 'qj'},

      {name: '外功攻击', type: 'wg'},
      {name: '外功防御', type: 'ng'},
      {name: '内功攻击', type: 'wf'},
      {name: '内功防御', type: 'nf'},

      {name: '命中', type: 'mz'},
      {name: '格挡', type: 'gd'},
      {name: '会心', type: 'hx'},
      {name: '会心率', type: 'hx'},
      {name: '韧劲', type: 'rj'},
      {name: '会心伤害', type: 'hs'},

      {name: '气血', type: 'qx'},
      {name: '内息', type: 'nx'},
    ];
    let matrix = [];
    for(let i = 0; i < cats.length; i++) {
      // 每一行
      matrix[i] = [];
      for(let j = 0; j <= i; j++) {
        // 每一列，下三角
        let a = cats[i].type;
        let b = cats[j].type;
        let type = ' -- ';
        Object.keys(affixExampleData).forEach((key) => {
          let data = affixExampleData[key].type;
          if((data.length === 1 && data.includes(a) && a === b) ||
            (data.length === 2 && data.includes(a) && data.includes(b) && a !== b)
          ) {
            type = key;
          }
        });
        matrix[i][j] += type;
      }
      for(let j = i + 1; j < cats.length; j++) {
        matrix[i][j] = ' -- ';
      }
    }
    // console.log(matrix);
    return null;
  }

  renderSingleAffix(affixType, affixIndex) {
    // 矩阵存储结果数据，每行是等级，每列是装备部位。第一行表头装备，第一列品级，第二列匠心，第三列id，第四列说明，第五列稀有否
    let rowOffset = 1, colOffset = 5;
    // 先创建一个满行满列的矩阵
    let result = [];
    for(let i = 0; i < 4 * 8 + rowOffset; i++) {
      result[i] = [];
      for (let j = 0; j < Object.keys(affixData).length + colOffset; j++) {
        result[i][j] = null;
      }
    }
    // 增加表头
    result[0][0] = 'id';
    result[0][1] = '来源';
    result[0][2] = '稀有';
    result[0][3] = '品级';
    result[0][4] = '匠心值';
    Object.keys(affixData).forEach((affixPos, i) => {
      // 先看第一条词缀
      let posData = affixData[affixPos][affixIndex === 0 ? '词缀一' : '词缀二'];
      if(posData.hasOwnProperty(affixType)) {
        // 增加表头
        const posMap = {
          ZhuWuQi: '主武', FuWuQi: '副武', AnQi: '暗器', ShouZhuo: '手镯', JieZhi: '戒指', XiangLian: '项链',
          TouShi: '头饰', HuWan: '护腕', ShangYi: '上衣', NeiChen: '内衬', YaoDai: '衣带', XieZi: '下装',
        };
        result[0][i + colOffset] = posMap[affixPos];
        let singleAffixData = posData[affixType];
        Object.keys(singleAffixData).forEach((id) => {
          let s = singleAffixData[id];
          let idList = id.split('-').map(parseFloat);
          let row = (idList[0] - 1) * 4 + (idList[1] - 1);
          result[row + rowOffset][i + colOffset] = s.desc.split('：')[1];
          result[row + rowOffset][0] = id;
          let kind = '';
          switch (idList[1]) {
          case 1: kind = affixIndex === 0 && idList[0] !== 1 ? '制造低级或洗练' : '制造低级'; break;
          case 2: kind = affixIndex === 0 ? '制造中级或洗练' : '制造中级'; break;
          case 3: kind = '仅升级'; break;
          case 4: kind = '仅洗练'; break;
          }
          if(affixIndex === 1 && s.color === 2 && idList[0] > 4) {
            kind = '仅升级';
          }
          result[row + rowOffset][1] = kind;
          let isFew = false;
          if(affixIndex === 0) {
            // 第一条词缀什么都不稀
            // if([1].includes(idList[1]) && idList[0] >= 5)
            //   isFew = true;
          } else {
            if([1, 2].includes(idList[1]) && idList[0] > 4)
              isFew = true;
          }
          if(s.color === 2)
            isFew = false;
          result[row + rowOffset][2] = isFew ? '稀' : '';
          result[row + rowOffset][3] = s.pinji + '品';
          result[row + rowOffset][4] = s.jiangxin + '匠心';
        });
      }
    });
    // 移除多余的空白行和列（第一行表头不判断）
    // 移除空行
    result = result.filter((row) => {
      return row.reduce((pre, cur) => pre || cur !== null, false);
    });
    // 判断是否为空
    if(result.length === 1)
      return '空';
    // 移除空列
    result = result[0].map((col, i) => result.map(row => row[i]));
    result = result.filter((row) => row.reduce((pre, cur) => pre || cur !== null, false));
    // 判断不同部位词缀属性是否完全相同，完全相同则合并
    let newRows = result.slice(colOffset).reduce((prev, row) => {
      // 寻找是否有完全相同的行
      function arraysEqual(arr1, arr2) {
        if(arr1.length !== arr2.length)
          return false;
        for(let i = arr1.length; i--;) {
          if(arr1[i] !== arr2[i])
            return false;
        }
        return true;
      }
      let hasSame = false;
      prev.forEach((oldRow) => {
        if(arraysEqual(oldRow.slice(1), row.slice(1))) {
          // 相同
          hasSame = true;
          oldRow[0] += '|' + row[0];
        }
      });
      if(!hasSame)
        prev.push(row);
      return prev;
    }, []);
    newRows = newRows.sort((a, b) => {
      let a1 = a[a.length - 1].split('+');
      let b1 = b[b.length - 1].split('+');
      return -parseFloat(a1[a1.length - 1]) + parseFloat(b1[b1.length - 1]);
    });
    result = result.slice(0, 5).concat(newRows);
    result = result[0].map((col, i) => result.map(row => row[i]));


    // console.log(result);
    // 构建jsx
    return <div style={{textAlign: 'center'}}>
      <table styleName='affix-table'>
        <thead>
          <tr>
            {result[0].map((cell, j) => <th key={j}>{cell}</th>)}
          </tr>
        </thead>
        <tbody>
          {
            result.slice(1).map((row, i) => {
              let tr = row.map((cell, j) => <td key={j}>{cell}</td>);
              return <tr key={i}>{tr}</tr>;
            })
          }
        </tbody>
      </table>
    </div>;
  }

  render() {
    return <div>
      <Helmet defer={false}>
        <meta charSet="utf-8"/>
        <title>天刀词缀数据百科，白薯紫薯全等级词缀属性 | 天刀数据百科 | 段段天刀综合助手</title>
        <meta name="keywords" content="天刀词缀数据,天刀数据百科"/>
        <meta name="viewport" content="width=device-width"/>
      </Helmet>
      <div style={{textAlign: 'center'}}>
        <h1>天刀装备词缀属性品级匠心来源综合统计一览表</h1>
        <h4>【多玩天刀攻略团】 段段制作（长生剑 涂铃铃）</h4>
        <br /> 多玩论坛帖子链接：http://bbs.duowan.com/thread-46469209-1-1.html
        <br />
        本数据页面：https://www.wuxiatools.com/data-wiki/affix，
        <br />
        转载请注明链接与出处“多玩论坛-段段”。
        <br />
        由于词缀数据的特殊性，可能存在数据错误，恳请您指正。同时本数据初期可能会较频更新，请届时查看多玩论坛最新版本。
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        justifyContent: 'space-around'
      }}>
        {
          ['淬力', '益气', '慧观', '纳敏','养髓',
            '项王', '武圣', '黄巾', '诸葛', '常山', '子房', '易水',
            '开碑', '含锋', '倒海', '蓄雷',
            '无漏', '盾拒', '超诣', '柔缠', '聚神',
            '厚德', '旷息',
            '秦皇', '淮南', '青莲', '愚公', '彭祖', '龙城', '飞将', '赵客'
          ].map((affixType, i) => {
            return <div key={i} style={{display: 'inline-block', textAlign: 'center'}}>
              <hr />
              <h2 style={{margin: 1}}>{affixType}</h2>
              第一词缀
              <br/>
              {this.renderSingleAffix(affixType, 0)}
              <br/>
              第二词缀
              <br/>
              {this.renderSingleAffix(affixType, 1)}
              <p style={{fontSize: 11}}>
                <span style={{fontSize: 12}}>「多玩天刀攻略团」段段整理（长生剑 涂铃铃）</span>
                <br />
                转载请注明出处，若数据有误欢迎批评指正
                <br />
                更多心法模拟器、帮派技能模拟、地图助手等
                <br/>
                欢迎关注搜索多玩论坛用户“段儿段儿”帖子。
                <br />
                http://bbs.duowan.com/space-uid-62595299.html
                <br />
                https://www.wuxiatools.com
              </p>
            </div>;
          })
        }
      </div>
    </div>;
  }
}

export default AffixComponent;