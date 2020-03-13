module.exports =
`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>菜谱</title>
    <style>
        .recipe-box {
            width: 500px;
            border-width: 37px;
            border-style: solid;
            border-color: initial;
            border-image: url(https://wuxia-tools-main-server-1251080372.file.myqcloud.com/4069bfbcfbf48511f0df113dcf7afd98.png) 37 37 fill repeat;
            margin: 0 auto;
            text-align: center;
        }
        .a-block {
            text-align: center;
            font-weight: bold;
            color: #564728;
        }
        .title-block, .crit-food {
            display: flex;
            margin: 0 0 10px;
        }
        .title-img-wrapper {
            /*flex: 130px;*/
            position: relative;
            width: 150px;
            height: 150px;
            padding: 5px;
        }
        .title-img-bg {
            width: 171px;
            height: 162px;
            margin: -6px -15px;
        }
        .title-img {
            width: 128px;
            height: 128px;
            position: absolute;
            top: 12px;
            left: 12px;
        }
        .name-des {
            flex: auto;
            text-align: left;
            padding: 5px;
            margin: 5px ;
            border-width: 10px 10px;
            color: #564728;
            border-style: solid;
            border-image: url("./img/模糊背景框.png") 20 20 fill stretch;
        }
        .title {
            font-size: 24px;
            font-weight: bold;
            font-family: 华文中宋;
            text-align: center;
            display: inline-block;
            padding: 0 20px;
            min-width: 140px;
            color: #dfdfdf;
            text-shadow: 1px 1px 1px #000;
            margin: 5px ;
            border-width: 3px 8px;
            border-style: solid;
            border-image: url("./img/食物大标题背景.png") 3 8 fill stretch;
        }
        .title-prop {
            border-bottom: 1px solid #aaa;
            display: block;
        }
        .prop-block {
            display: flex;
        }
        .prop-base {
            flex: 3;
        }
        .prop-base div {
            display: inline-block;
            width: 171px;
            border-width: 3px 8px;
            border-style: solid;
            border-image: url("./img/标题毛笔.png") 3 8 fill stretch;
        }
        .prop-limit {
            flex: 7;
            margin: 5px auto;
        }
        .prop-limit table {
            text-align: center;
            margin: 0 auto;
            border: 1px solid #888;
            border-collapse: collapse;
            background: rgba(0,0,0,0.1);
            color: #564728;
        }
        .prop-limit table td {
            text-align: center;
            padding: 1px 3px;
            border: 1px solid #888;
        }
        .prop-limit td.table-head {
            font-weight: bold;
            background: rgba(0,0,0,0.2);
        }
        .prop-limit tr td:nth-child(2) {
            border-right-style: double;
            border-right-width: 5px;
        }
        .material {
            display: flex;
        }
        .material-item {
            flex: 1;
        }
        .material-img-wrapper {
            position: relative;
            width: 76px;
            height: 75px;
            margin: 0 auto;
        }
        .material-img {
            position: absolute;
            top: 6px;
            left: 6px;
            width: 64px;
            height: 64px;
            display: block;
            margin: 0 auto;
        }
        .material-img-type {
            position: absolute;
            top: 4px;
            left: -18px;
        }
        .material-name {
            display: block;
            font-size: 13px;
            color: #ffffff;
            text-shadow: 1px 1px 1px #000;
            text-align: center;
            padding: 2px 6px;
            background-image: linear-gradient(to right, rgba(81,61,53,0), rgba(81,61,53,0.8),rgba(81,61,53,0.8), rgba(81,61,53,0));
        }
        .crit {
            display: {{critDisplay}};
        }
    </style>
</head>
<body>
<div class="recipe-box">
    <div class="a-block" style="font-size:17px;">
        天涯明月刀2019年渔樵耕读版本 厨师身份烹饪攻略【临时版】<br />
        【多玩天刀攻略团】段段整理（长生剑 涂铃铃）
    </div>
    <div class="title">{{name}} <span style="font-size: 18px; color: #ccc">{{level}}（{{smallLevel}}级）</span></div>
    <div class="title-block">
        <div class="title-img-wrapper">
            <img class="title-img-bg" src="img/食物128像素大框.png" />
            <img class="title-img" src="https://wuxia-tools-assets-1251080372.cos.ap-shanghai.myqcloud.com/imagesets/ICONS/UI/CHUSHI128/{{icon}}.png" />
        </div>
        <div class="name-des">
            <div>
                <span class="title-prop">{{propDes}}</span>
            </div>
            <div class="des">
                {{des}}
            </div>
        </div>
    </div>
    <div class="prop-block">
<!--        <div class="prop-base">-->
<!--            <div>菜系：秦川</div>-->
<!--            <div class="huoli">单次消耗活力： 120</div>-->
<!--            <div class="jiesuo">解锁需次数： 5 </div>-->
<!--        </div>-->
        <div class="prop-limit">
            <table>
                <tr><td class="table-head">菜系</td><td>{{map}}</td><td class="table-head" colspan="8">“推荐”材料替换数量限制</td></tr>
                <tr><td class="table-head">制作消耗活力</td><td>{{huoli}}</td><td>主食</td><td>肉类</td><td>蔬菜</td><td>鱼类</td><td>水产</td><td>蛋类</td><td>水果</td><td>特殊</td></tr>
                <tr><td class="table-head">解锁需要次数</td><td>{{shulianCount}}</td><td>{{limit1}}</td><td>{{limit2}}</td><td>{{limit3}}</td><td>{{limit4}}</td><td>{{limit5}}</td><td>{{limit6}}</td><td>{{limit7}}</td><td>{{limit8}}</td></tr>
            </table>
        </div>
    </div>
    <div class="material">
        <div class="material-item">
            <div class="material-img-wrapper">
                <img class="material-img-bg" src="img/食材框.png" />
                <img class="material-img-type" src="img/{{m1t}}.png" /> <!-- 修改这里显示不同情况 -->
                <img class="material-img" src="https://wuxia-tools-assets-1251080372.cos.ap-shanghai.myqcloud.com/imagesets/ICONS/UI/CHUSHI128/{{m1icon}}.png" />
            </div>
            <span class="material-name">{{m1}}({{m1l}}级)</span>
        </div>
        <div class="material-item">
            <div class="material-img-wrapper">
                <img class="material-img-bg" src="img/食材框.png" />
                <img class="material-img-type" src="img/{{m2t}}.png" /> <!-- 修改这里显示不同情况 -->
                <img class="material-img" src="https://wuxia-tools-assets-1251080372.cos.ap-shanghai.myqcloud.com/imagesets/ICONS/UI/CHUSHI128/{{m2icon}}.png" />
            </div>
            <span class="material-name">{{m2}}({{m2l}}级)</span>
        </div>
        <div class="material-item">
            <div class="material-img-wrapper">
                <img class="material-img-bg" src="img/食材框.png" />
                <img class="material-img-type" src="img/{{m3t}}.png" /> <!-- 修改这里显示不同情况 -->
                <img class="material-img" src="https://wuxia-tools-assets-1251080372.cos.ap-shanghai.myqcloud.com/imagesets/ICONS/UI/CHUSHI128/{{m3icon}}.png" />
            </div>
            <span class="material-name">{{m3}}({{m3l}}级)</span>
        </div>
        <div class="material-item">
            <div class="material-img-wrapper">
                <img class="material-img-bg" src="img/食材框.png" />
                <img class="material-img-type" src="img/{{m4t}}.png" /> <!-- 修改这里显示不同情况 -->
                <img class="material-img" src="https://wuxia-tools-assets-1251080372.cos.ap-shanghai.myqcloud.com/imagesets/ICONS/UI/CHUSHI128/{{m4icon}}.png" />
            </div>
            <span class="material-name">{{m4}}({{m4l}}级)</span>
        </div>
    </div>
    <span class="crit title">暴击产物：{{critName}}</span>
    <div class="crit crit-food">
        <div class="title-img-wrapper">
            <img class="title-img-bg" src="img/食物128像素大框.png" />
            <img class="title-img" src="https://wuxia-tools-assets-1251080372.cos.ap-shanghai.myqcloud.com/imagesets/ICONS/UI/CHUSHI128/{{critIcon}}.png" />
        </div>
        <div class="name-des">
            <div class="des">
                暴击率：{{critRate}}<br>
                {{critPropDes}}<br>
                {{critDes}}
            </div>
        </div>
    </div>
    <div class="a-block" style="padding: 10px 0 0">
        完整厨师攻略请移步 多玩论坛 或 段段天刀综合助手 wuxiatools.com
    </div>
</div>
</body>
</html>`;
