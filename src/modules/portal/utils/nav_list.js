import React from 'react';
import Icon from "antd/es/icon";

const toolsList = [
  {
    path: '/xinfa',
    title: '心法模拟器',
    desc: <p>
      本工具是一个高仿游戏内UI的心法模拟器。<br />
      数据最新；样式直观；操作简便。<br />
      含最新9重数据，精确功力、属性、砭石需求、突破、潜修。
    </p>,
    img: 'xinfa.png'
  },
  {
    path: '/map',
    title: '交互式地图助手',
    desc: <p>
      本工具是一个可交互的天刀地图，包括文士乐伶墨宝创作点、航海图鉴、吃鸡物资、行政区划等内容，方便您查阅坐标数据。
    </p>,
    img: 'map.png'
  },
  {
    path: '/equip',
    title: '装备模拟器',
    desc: <p>
      本工具覆盖所有装备信息，可以自由搭配装备，并完整地精确模拟精工、琢磨、珑铸、词缀数据，并提供功力战力计算及比较功能，以及装备信息可视化。
    </p>,
    img: 'equip.png'
  },
  {
    path: '/calendar',
    title: '天涯时刻吉凶预测',
    desc: <p>
      本工具包含现实时间、天涯时刻对照的模拟时钟，及未来时间吉凶预测时间轴.时间精确到秒，方便文士乐伶绘画、建房求风水等需求。
    </p>,
    img: 'calendar.png'
  },
  {
    path: '/shimei',
    title: <span>小师妹模拟器<Icon type="heart" theme="twoTone" twoToneColor="#ff0000" /></span>,
    desc: <p>
      本工具可供您模拟配置天刀小师妹玩法中，师妹五维、师妹技能等数据，快速查看升级消耗情况，并精确计算师妹五维、技能、收集度对玩家属性及功力的综合影响。
    </p>,
    img: 'shimei_skill.png'
  },
  {
    path: '/family-tech',
    title: '帮派技能模拟器',
    desc: <p>
      本工具是一个富交互的帮派技能属性、消耗模拟器。针对不同技能以可视化形式展现属性提升及资源消耗。
    </p>,
    img: 'family-tech.png'
  },
  {
    path: '/role/',
    isOutSite: true,
    title: '角色信息查询',
    desc: <p>
      本工具可供您快速查询账号在线状态等一系列实用信息，不用再麻烦打开app即可得知。
    </p>,
    img: 'role.png'
  },
  {
    path: '/rank',
    title: '功力排行榜',
    desc: <p>
      本工具可方便用户查询2018年年初以来所有服务器历史功力排行榜前1000名数据，支持按服务器、按玩家昵称筛选。
    </p>,
    img: 'rank.png'
  },
  {
    path: '/panorama',
    title: '天刀全景图',
    desc: <p>
      本工具是一个在线的全景图浏览工具，您可以在这里体验媲美游戏中效果的全景体验。
    </p>,
    img: 'panorama.png'
  },
  {
    path: '/',
    title: '魅力模拟器(敬请期待)',
    desc: <p>
      本工具包含天刀时装预览、魅力值配置等功能，方便玩家预览时装、配件样式以及考虑堆魅力值的方式。
    </p>,
    img: 'qidai.png'
  }
];

const dataWikiList = [
  {
    path: '/data/tour',
    title: '小师妹游历大全',
    desc: <p>
      本数据百科页包含天刀小师妹游历玩法各个趣味事件的触发条件、选项分支、奖励、对话等数据。
    </p>,
    img: 'youli.png'
  },
  {
    path: '/data/cook',
    title: '厨师食材配方大全',
    desc: <p>
      111
    </p>,
    img: 'youli.png'
  },
  {
    path: '/data/gem',
    title: '砭石数据汇总',
    desc: <p>
      本百科页包含天刀最新版本砭石1-11级各级属性、功力战力等数据方便查询。
    </p>,
    img: 'gem.png'
  },
  {
    path: '/data/item',
    title: '物品数据大全',
    desc: <p>
      本百科页包含天刀所有物品信息，提供与游戏内相似的UI展示，方便玩家查询各种物品数据。
    </p>,
    img: 'item.png'
  },
  {
    path: '/data/affix',
    title: '装备词缀大全',
    desc: <p>
      本百科页涵盖天刀最新版本装备的词缀属性、品级、匠心、来源等数据综合统计表，方便大家查阅词缀数据。
    </p>,
    img: 'affix.png'
  }
];

export {toolsList, dataWikiList};
