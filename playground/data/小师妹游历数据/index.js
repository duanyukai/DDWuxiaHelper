const csv = require('csvtojson');
const fs = require('fs');

let tourList =[];

// todo ! 别忘了更新id列表
let actionList = [
  1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 1009, 1010, 1011, 1012, 1013, 1014, 1015, 1016, 1017, 1018, 1019,
  1020, 1021, 1022, 1023, 1024, 1025, 1026, 1027, 1028, 1029, 1030, 1031, 1032, 1033, 1034, 1035, 1901, 1902, 2001,
  2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020,
  2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2901, 2902, 3001, 3002, 3003, 3004, 3005, 3006,
  3007, 3008, 3009, 3010, 3011, 3012, 3013, 3014, 3015, 3016, 3017, 3018, 3019, 3020, 3021, 3022, 3023, 3024, 3025,
  3026, 3027, 3028, 3029, 3030, 3031, 3901, 3902, 4001, 4002, 4003, 4004, 4005, 4006, 4007, 4008, 4009, 4010, 4011,
  4012, 4013, 4014, 4015, 4016, 4017, 4018, 4019, 4020, 4021, 4022, 4023, 4024, 4025, 4026, 4027, 4028, 4029, 4030,
  4031, 4032, 4901, 4902, 5001, 5002, 5003, 5004, 5005, 5006, 6001, 6002, 6003, 6004, 6005, 6006, 7001, 7002, 7003,
  7004, 7005, 7006, 8001, 8002, 8003, 8004, 8005, 8006, 8007, 8008, 8009, 8010, 8011, 8012, 8013, 8014, 8015, 8016,
  8017, 8018, 8019, 8020, 8021, 8022, 8023, 8024, 8025
];

function fangwei(str) {
  // return str;  // todo 直接改这里关闭防伪
  let fangWeiMap = {
    [/《/]: '<<',
    [/》/]: '>>',
    [/……/]: '...',
    // [/一个/]: '——个',
    [/漂亮/]: '美丽',
    [/依旧/]: '依然',
    [/很多/]: '许多',  // todo 是否换方向
    [/好像/]: '仿佛',
  };
  Object.keys(fangWeiMap).forEach(regex => {
    let r = new RegExp(regex.split('/')[1], regex.split('/')[2]);
    str = str.replace(r, fangWeiMap[regex]);
  });
  return str;
}

function lua2Text(str) {
  // 直接替换语义，if如果，then…删除，==true删除
  let regexMap ={
    [/if /g]: '',
    [/ and /g]: '并且',
    [/==true/g]: '',
    [/ then return true else return false end/g]: '',
    [/ChildCheckChangeFashion\(\)/g]: '更换过时装',
    [/ChildCheckCompleteNode\((\d+)\$\$(\d+)\)/g]: '完成了任务$1且完成分支$2',  // todo 任务id得搞定一下
    [/ChildCheckCompleteTree\((\d+)\)/g]: '完成了任务$1',  // todo
    [/ChildGetGrouthDay\(\)>=(\d+)/g]: '师妹已培养了>=$1天',
    // [/GetChildAttr\(0\)\+GetChildAttr\(1\)\+GetChildAttr\(2\)\+GetChildAttr\(3\)\+GetChildAttr\(4\)>=(\d+)/g]: '五维属性值之和>=$1', // 先替换这种的
    [/GetChildAttr\(0\)>(\d+)/g]: '力道>$1',
    [/GetChildAttr\(0\)>=(\d+)/g]: '力道>=$1',
    [/GetChildAttr\(0\)/g]: '力道',
    [/GetChildAttr\(1\)>(\d+)/g]: '根骨>$1',
    [/GetChildAttr\(1\)>=(\d+)/g]: '根骨>=$1',
    [/GetChildAttr\(1\)/g]: '根骨',
    [/GetChildAttr\(2\)>(\d+)/g]: '气劲>$1',
    [/GetChildAttr\(2\)>=(\d+)/g]: '气劲>=$1',
    [/GetChildAttr\(2\)/g]: '气劲',
    [/GetChildAttr\(3\)>(\d+)/g]: '洞察>$1',
    [/GetChildAttr\(3\)>=(\d+)/g]: '洞察>=$1',
    [/GetChildAttr\(3\)/g]: '洞察',
    [/GetChildAttr\(4\)>(\d+)/g]: '身法>$1',
    [/GetChildAttr\(4\)>=(\d+)/g]: '身法>=$1',
    [/GetChildAttr\(4\)/g]: '身法',
    [/GetChildPower\(0\)>(\d+)/g]: '韬略>$1',
    [/GetChildPower\(0\)>=(\d+)/g]: '韬略>=$1',
    [/GetChildPower\(0\)/g]: '韬略',
    [/GetChildPower\(1\)>(\d+)/g]: '风雅>$1',
    [/GetChildPower\(1\)>=(\d+)/g]: '风雅>=$1',
    [/GetChildPower\(1\)/g]: '风雅',
    [/GetChildPower\(2\)>(\d+)/g]: '灵性>$1',
    [/GetChildPower\(2\)>=(\d+)/g]: '灵性>=$1',
    [/GetChildPower\(2\)/g]: '灵性',
    [/GetChildPower\(3\)>(\d+)/g]: '乐理>$1',
    [/GetChildPower\(3\)>=(\d+)/g]: '乐理>=$1',
    [/GetChildPower\(3\)/g]: '乐理',
    [/GetChildPower\(4\)>(\d+)/g]: '专注>$1',
    [/GetChildPower\(4\)>=(\d+)/g]: '专注>=$1',
    [/GetChildPower\(4\)/g]: '专注',
    [/GetChildPower\(7\)>=GetChildPower\(8\)/g]: '>=',
    [/GetChildPower\(8\)>GetChildPower\(7\)/g]: '>',
  };
  // todo 特殊处理列表 treeId 190 201 229 ？
  Object.keys(regexMap).forEach(regex => {
    let r = new RegExp(regex.split('/')[1], regex.split('/')[2]);
    str = str.replace(r, regexMap[regex]);
  });
  return str;
}

function removeConditions(str) {
  let map = {
    [/<gender=1\$\$师兄><gender=0\$\$师姐>/g]: '师兄/师姐',
    [/<menpai=(.+?)\$\$(.+?)>/g]: '[门派为$1时：$2]',
    [/<sister_prop_desc=(.+?)\$\$(.+?)>/g]: '[师妹等级为$1时：$2]',
    [/\$\$/]: '，',
  };
  Object.keys(map).forEach(regex => {
    let r = new RegExp(regex.split('/')[1], regex.split('/')[2]);
    str = str.replace(r, map[regex]);
  });
  return str;
}


//！！ 正式开始

let promises = actionList.map((key) => {
  let data = fs.readFileSync(`./action_trees/${key}.csv`);
  return csv({checkType: true, noheader:true}).fromString(data.toString().replace(/\n\d{4}, \d, \d, \d, \d, \d+\n/, ''));
});

Promise.all(promises).then(gen);

function gen(lists) {

  // 读取其他输入
  let files = ['ActionTreeGroupTable.csv', 'ChildChatTable.csv', 'ChildChatOptionTable.csv'];
  let otherFilePromises = files.map((key) => {
    let data = fs.readFileSync(`./other_input/${key}`);
    return csv({checkType: true, noheader: true}).fromString(data.toString());
  });
  // 读取完其他文件
  Promise.all(otherFilePromises).then((files) => {
    let requireList = files[0];
    let chatList = files[1];
    let chatOptionList = files[2];

    let allResult = {};
    lists.forEach((tour, i) => {
      // console.log(tour);
      let singleTourResult = [];
      tour.forEach(row => {
        // 重要的是2列的索引、6-10列的文本和41列的奖励、42列的子节点
        // todo 更新，14列是结束对话id，查ChildChatTable，然后再查OptionTable有亲密度选项
        // todo ActionTreeGroupTable有随机条件
        // todo ChatTable 第一列是id，第四列是说的话，第五列是选项id列表
        // todo ChatOptionTable 第一列是id，第二列是话，第四列是好友度
        let children = (row.field42 + '').split('$$').map(parseFloat);
        // todo 处理对话数据
        let chat = null;
        if(row.field14 !== 0) {
          // 存在结束对话
          let shimeiChat = chatList.filter(o => o.field1 === row.field14)[0];
          let choices = (shimeiChat.field5 + '').split('$$').map(parseFloat).map(id => {
            let choice = chatOptionList.filter(o => o.field1 === id)[0];
            return {
              text: removeConditions(fangwei(choice.field2)),
              degree: choice.field4
            };
          });
          chat = {
            text: removeConditions(fangwei(shimeiChat.field4)),
            choices
          };
        }

        singleTourResult[row.field2] = {
          t1: removeConditions(row.field6),
          t2: removeConditions(fangwei(row.field7)),
          t3: row.field8,
          t4: lua2Text(row.field9),
          t5: row.field10,
          reward: row.field41,
          children: children.filter(o => o > 0),
          chat
        };
      });
      // todo 处理触发条件数据
      // todo ActionTreGroupTable 第一列treeId，第二列没用？，第三列是actionId，第五列是触发条件，第6列是权重(除以100000，大部分千分之四？)，
      // todo 第7列是是否只能完成一次，第10列是cd时长（次数？最高90，怎么也能出现一次吧）
      // todo 方便起见，存在0里
      let conditions = requireList.filter(o => o.field3 === actionList[i]).map(req => {
        let text = req.field5;
        text = lua2Text(text);
        let p = req.field6 / 100000;
        if(p > 1) p = 1;
        return {
          text: text === '' ? '无特殊条件' : `${text}`,
          p: p,
          once: req.field7 === 1,
          cd: req.field10
        };
      });
      singleTourResult[0] = {
        conditions: conditions
      };

      // 添加到总的里
      allResult[actionList[i]] = singleTourResult;
    });

    // 写入文件
    fs.writeFileSync('./output/tour.json', JSON.stringify(allResult, null, 4));
  });
}