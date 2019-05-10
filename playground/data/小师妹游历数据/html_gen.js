const fs = require('fs');
const tourList = require('./output/tour.json');

let wholeTemplate = `
<meta charset="utf-8">
<style>
    * {
        font-family: '微软雅黑';
    }
    .card-container {
        width: 750px;
        /*border: 1px #000 solid;*/
        border: 37px solid;
        border-image: url(bg.png) 37 37 fill repeat;
        text-align: center;
    }
     .card-container > .card-selection-header {
        /*display: none;*/
        margin-top: -20px;
    }
    .card-container > .card-selection-header > .card-selection-header-text,
    .card-container > .card-selection-header > .vertical-line,
    .card-container > .card-selection-header > .horizontal-line {
        display: none;
    }
    .card-header {
        font-size: 28px;
        text-align: center;
        /*border-image: url(text-bg.png) 0 32 fill stretch;*/
        background-image: linear-gradient(to right, rgba(101,81,73,0), rgba(101,81,73,0.5),rgba(101,81,73,0.5), rgba(101,81,73,0));
        /*width: 60%;*/
        display: inline-block;
        padding: 0 80px;
        font-family: 华文中宋;
        font-weight: bold;
        margin: 0 0 10px 0;
        /*text-shadow: 2px 2px 2px #ccc;*/
    }
    .card-no {
         font-size: 14px;
         font-family: 华文中宋;
         font-weight: bold;
    }
    .card-img {
        display: block;
        margin: 4px auto;
        width: 693px;
        height: 289px;
        box-shadow: 5px 5px 12px 1px rgba(0,0,0,0.6);
    }
    .condition {
        font-weight: bold;
        color: #444;
    }
    .condition-text {
        font-weight: normal;
        color: #64534a;
    }
    .card-selection-container {

    }
    .card-selection {
        /*margin-left: 12px;*/
        padding-left: 22px;
        overflow: hidden;
        margin-top: -5px;
        padding-top: 5px;
    }
    .card-selection-header {
        position: relative;
        font-size: 18px;
        display: block;
        height: 25px;
        padding-left: 30px;
        text-align: left;
    }
    .card-selection-header-text {
        border-style: solid;
        border-width: 4px 40px;
        border-image: url(btn.png) 4 40 fill stretch;
        color: #fff;
        font-size: 18px;
        cursor: pointer;
        margin-left: -10px;
        text-shadow: 1px 1px 1px #000;
    }
    .vertical-line {
        width: 6px;
        height: 10000px;
        background: #4e5333;
        position: absolute;
        top: -9985px;
        left: -16px;
    }
    .horizontal-line {
        width: 20px;
        height: 6px;
        position: absolute;
        background: #4e5333;
        top: 9.7px;
        left: -16px;
    }
    .diamond {
        width: 6px;
        height: 6px;
        margin: 7px 0 0 7px;
        border: 5px solid #4e5333;
        z-index: 999;
        transform-origin: 0 100%;
        transform: rotate(-45deg);
        background: #747b4c;
        position: absolute;
        left: -19px;
        top: 1px;
    }
    .diamond2 {
        top: 1px;
        left: 2px;
    }
    .card-text {
        margin: 10px 5px;
        border: 1px solid #aaa;
        background: rgba(0,0,0,0.1);
        text-align: left;
        padding: 5px;
    }
    .reward {
        background: #574965;
        color: #fff;
        border-radius: 3px;
        padding: 2px 10px;
        font-size: 14px;
        line-height: 21px;
    }
    .copyright1 {
        color: #64534a;
        font-weight: bold;
        font-size: 22px;
    }
     .copyright2 {
        color: #64534a;
    }
    .choice-table {
        margin: 4px 0;
        border-collapse: collapse;
        border: #666 solid 1px;
        border-width: 1px 1px;
    }
    .choice-table td {
        font-family: 'Source Code Pro', '微软雅黑';    
    }
    .choice-table tr:first-child {
        border: #666 solid 1px;
        border-width: 1px 0px;
    }
    .choice-table tr:first-child td {
        background: rgba(0,0,0,0.3);
        color: #fff;
        text-shadow: 1px 1px 1px #000;
    }
</style>
<div class="card-container">
    <div class="copyright1">
    天涯明月刀2018年冬季青梅煮酒版本 小师妹游历玩法最全攻略<br />
    游历文案与图片、触发条件、选项分支及条件、奖励、对话大全<br />
    【多玩天刀攻略团】段段 整理（长生剑 涂铃铃）
    </div>
    <div class="card-no">{{no}}</div>
    <div class="card-header">{{name}}</div>
    <div class="card-conditions">{{conditions}}</div>
    <img class="card-img" src="{{img}}"/>
    {{sub}}
    <div class="copyright2">
    @段段天刀综合助手 www.wuxiatools.com <br />
    <span style="font-size: 12px;">心法装备帮派技能等模拟工具，砭石物品游历等数据百科大全</span>
    </div>
</div>
`;




let choiceTemplate = `
<div class="card-selection-header">
    <div class="vertical-line"></div>
    <div class="horizontal-line"></div>
    <div class="diamond diamond2"></div>
    <span class="card-selection-header-text">{{choice}}</span>
</div>
`;

let subTemplate = `
<div class="card-sub-panel">
    <div class="card-selection-container">
        <div class="card-selection">
            <div class="card-text">
                {{intro}}
            </div>
            {{list}}
        </div>
    </div>
</div>
`;

let rawCss = `
<style>
    .card-text-text,
    .copyright1, .copyright2,
    .choice-table,
    .card-img,
    .card-container > .card-selection-header > .card-selection-header-text
    {
        display: none;
    }
    .card-header {
        color: #66F;
        font-weight: bold;
    }
    .reward {
        color: #66F;
    }
   
   
</style>
`;


let textResult = '';  // todo 为了小帖子写的
let allHtmlResult = ''; // 合并所有的帖子
allHtmlResult += rawCss;


Object.keys(tourList).forEach(tourId => {
  // console.log(tourId);

  let tour = tourList[tourId];

  // 拿出第一行，分别有标题、文本、图片位置
  let firstLine = tour[1];
  // 构造初始模板
  let result = wholeTemplate
    .replace(/{{name}}/, firstLine.t1)
    // .replace(/{{name}}/, `{{name:${firstLine.t1}}}`)  // todo 小文本临时用
    .replace(/{{no}}/, '№' + tourId)
    .replace(/{{img}}/, '../imgs/XIAYULU_TIPS/' + firstLine.t3.split('/').reverse()[0].toUpperCase());
  // todo 小帖子头部
  // textResult += `————————————————\n${tourId}:${firstLine.t1}\n`;

  // todo 新增触发条件
  result = result
    .replace(/{{conditions}}/, tour[0].conditions.reduce((last, cur, i) => {
      return `${last}
        <div>
        <span class="condition">条件${i + 1}：${cur.text !== '无特殊条件' ? `当${cur.text}时`  : '无特殊条件'}，</span>
        <span class="condition-text">概率${cur.p * 100}%，${cur.once ? '仅可完成一次' : '可重复完成'}，${cur.cd === 0 ? '无cd' : 'cd时长' + cur.cd + '次'}</span>
        </div>
      `;
    }, ''));



  // 深度优先遍历这颗树，递归构造文本
  function DFS(lineId, hasChoice, number) {
    let line = tour[lineId];
    let subListResult = '';
    if(line.children.length !== 0) {
      // 遍历每个孩子节点，构造选项子结构
      let subList = line.children.map((child, i) => {
        let n;
        if (number === '')
          n = i + 1;
        else
          n = number + '.' + (i + 1);
        return DFS(child, false, n);
      });

      // 顺序拼接所有孩子节点
      subListResult = subList.join('');
    } else {
      // 没孩子了，直接拼接一个结束
      subListResult = '';
    }
    // 拼接奖励
    let reward = line.reward === '' ? '' : `<span class="reward">${line.reward}</span>`;
    // let reward = line.reward === '' ? '' : `<span class="reward">{{reward:${line.reward}}}</span>`;   //todo 改了临时用的标记
    // 拼接对话
    let chat = '';
    if (line.chat) {
      let choices = line.chat.choices.reduce((last, cur) => {
        return `${last}
          <tr><td>${cur.text}</td><td>亲密度${(cur.degree < 0 ? '' : '+') + cur.degree}</td></tr>
        `;
      }, '');
      chat = `<table class="choice-table"><tr><td colspan="2">${line.chat.text}</td></tr>${choices}</table>`;
    }
    // 拼接选项条件
    let choiceCondition = '';
    if(line.t4 !== '') {
      choiceCondition = `（选项需满足：${line.t4}）<br />`;
    }

    return choiceTemplate
      .replace(/{{choice}}/, number + ' ' + line.t1) +
      subTemplate
        .replace(/{{intro}}/, `<div class="card-text-text">${choiceCondition}${line.t2.replace(/\\n/g, '<br />')}</div>` + reward + chat)
        .replace(/{{list}}/, subListResult);
  }
  let treeResult = DFS(1, true, '');  // 最后一个参数是确定是否含选项的（最顶层的选项是标题名字）
  result = result.replace(/{{sub}}/, treeResult);

  // 写入文件
  fs.writeFileSync(`./html_output/${tourId}.html`, result);


  // 合并所有帖子
  if(tourId !== 1001) {
    result = result.replace(/<style>[^<]*<\/style>/, '');
  }
  allHtmlResult += result;
});

// 写入总文件
fs.writeFileSync(`./html_output/all.html`, allHtmlResult);




/*
小帖子结构：
————————————————
1001:啊啊啊啊案件
1 你选择啊
1.1 你选择啊， <span>奖励…<span>
1.2 ^^^^
亲密度对话：
啊啊啊？
1.啊啊 +2
2.aaa +1
3.asfdf +0
————————————————


 */