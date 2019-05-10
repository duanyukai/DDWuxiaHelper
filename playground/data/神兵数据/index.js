require = require('@std/esm')(module,{'esm':'js'});
const {extractPropsByText} = require('../../../src/modules/_commons/property_calc/player_props_extract_and_gen');
const csv = require('csvtojson');
const fs = require('fs');

const {getSkillLevelProps, getSkillChapterProps} = require('./trick');

let files = [
  'ShenbingExtraDescTable_Retail',  // 章节故事
  'ShenbingLevelPttTable_Retail',  // 章节、技能等级数据
  'ShenbingPttTable_Retail',  // 神兵数据，含章节额外属性
  'ZhiliaoExtraDescTable_Retail',  // 质料故事
  'ZhiliaoLevelPttTable_Retail',  // 质料等级数据
  'ZhiliaoPttTable_Retail',  // 质料id与名字
];

let promises = files.map((key) => {
  return csv({checkType: true}).fromFile(`./input/${key}.csv`);
});

Promise.all(promises).then(gen);

function gen(data) {
  let chapterStoryList = data[0];
  let skillDataList = data[1];
  let shenbingList = data[2];
  let zhiliaoStoryList = data[3];
  let zhiliaoDataList = data[4];
  let zhiliaoList = data[5];

  let result = {};

  shenbingList.forEach(sb => {
    let shenbingId = sb.shenbingId;

    // todo 青龙首跳过
    if(shenbingId === 15)
      return;

    // 每一个神兵总的基本属性
    if(!result.hasOwnProperty(sb.shenbingId)) {
      result[sb.shenbingId] = {};
    }
    result[sb.shenbingId] = {
      name: sb.name,
      icon: 111,
      zhiliaoList: [],
      skillLevels: [],
      chapters: []
    };
    // 遍历其下三个质料
    zhiliaoList.filter(z => (z.zhiliaoId-z.zhiliaoId%100)/100 === sb.shenbingId).forEach(({zhiliaoId, zhiliaoName}) => {
      //质料等级数据
      let levels = [];
      zhiliaoDataList.filter(z => z.zhiliaoId === zhiliaoId).forEach(zlLevel => {
        levels[zlLevel.level] = {
          zhiliaoCount: +zlLevel.useCountList.split('$$')[0].trim(),  // 升级用的质料数
          chu: +zlLevel.useCountList.split('$$')[1].trim(),  // 升级用的初
          suiyin: zlLevel.suiyin,
          des: zlLevel.des,
          props: extractPropsByText(zlLevel.des)  // todo
        };
      });
      // 质料文案
      let zhiliaoStory = zhiliaoStoryList.find(z => z.zhiliaoId === zhiliaoId);
      // 汇总
      result[sb.shenbingId].zhiliaoList.push({
        name: zhiliaoName,
        icon: zhiliaoStory.icon,
        background: [
          zhiliaoStory.zhiliaoDes1, zhiliaoStory.zhiliaoDes2, zhiliaoStory.zhiliaoDes3, zhiliaoStory.zhiliaoDes4
        ],
        levels: levels
      });
    });

    // 遍历小节技能属性
    // 消耗三个质料解锁、进、深的
    // todo 技能属性提取困难，需要手动构造实现
    skillDataList.filter(s => s.shenbingId === shenbingId).forEach(skillLevelData => {
      let jin, shen;
      if(skillLevelData.skillLevel === 0) {  // 解锁的那一下，免费点第一节
        jin = 0;
        shen = 0;
      } else {
        if(skillLevelData.itemIdList == 1082002) {
          jin = +skillLevelData.countListcount;
          shen = 0;
        } else if(skillLevelData.itemIdList == '1082002$$ 1082003') {
          jin = +skillLevelData.countListcount.split('$$')[0].trim();
          shen = +skillLevelData.countListcount.split('$$')[1].trim();
        }
      }
      // 汇总
      let props = getSkillLevelProps(shenbingId, skillLevelData.skillLevel);
      result[sb.shenbingId].skillLevels[skillLevelData.skillLevel] = {
        jin,  // 进
        shen,  // 深
        props: typeof props === 'object' ? props : {}, // 1%洞察这种，手动生成 todo
        extraDes: typeof props === 'string' ? props : {}
      };
    });

    // 大章节额外属性，和文案
    let sbStory = chapterStoryList.filter(c => c.shenbingId == shenbingId);

    // 额外属性，手动生成
    // todo
    result[sb.shenbingId].chapters = [
      null, {
        background: sbStory.chapter1,
        audio: sbStory.audio1,
        author: sbStory.author1,
        extraDes: sb.chapterExtraList.split(':')[1].replace(/#/g, ''),
        props: getSkillChapterProps(shenbingId, 1)  // 额外+0.5%那种
      },{
        background: sbStory.chapter2,
        audio: sbStory.audio2,
        author: sbStory.author2,
        extraDes: sb.chapterExtraList.split(':')[2].replace(/#/g, ''),
        props: getSkillChapterProps(shenbingId, 2)  // 额外+0.5%那种
      },{
        background: sbStory.chapter3,
        audio: sbStory.audio3,
        author: sbStory.author3,
        extraDes: sb.chapterExtraList.split(':')[3].replace(/#/g, ''),
        props: getSkillChapterProps(shenbingId, 3)  // 额外+0.5%那种
      },{
        background: sbStory.chapter4,
        audio: sbStory.audio4,
        author: sbStory.author4,
        extraDes: sb.chapterExtraList.split(':')[4].replace(/#/g, ''),
        props: getSkillChapterProps(shenbingId, 4)  // 额外+0.5%那种
      },
    ];
  });

  fs.writeFileSync('./output/shenbing.json', JSON.stringify(result, null, 4) , function(err) {
    if(err) {
      console.log(err);
    }
  });
}


let rrr = {
  1: {
    name: '左手剑',
    icon: '111',
    zhiliaoList: [
      {
        name: '樽前酒',
        icon: 111,
        background: [
          '酒啊', '啊啊', 'aa ', 'afdf'
        ],
        levels: [
          null,  // 0级前解锁，用1？
          {
            count: 5,  // 升级的
            chu: 180,  // 升级的
            props: {}
          },
        ]
      }
    ],
    skillLevels: [
      null,
      {
        jin: 50,
        shen: 20,
        props: {} // 1%洞察这种
      }
    ],
    chapters: [
      null,
      {
        background: '1212',  // ?? 谁外谁内
        audio: '111',
        props: {}  // 额外+0.5%那种
      }
    ]
  }
};