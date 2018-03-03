const csv = require('csvtojson');
const fs = require('fs');

let typeList = [];
let techList = [];

csv().fromFile('./subtype.csv')
  .on('json',(jsonObj)=>{ typeList.push(jsonObj); })
  .on('done',(error)=> {
    csv().fromFile('./tech2.csv')
      .on('json',(jsonObj)=>{ techList.push(jsonObj); })
      .on('done',(error)=> {
        gen();
      });
  });

function gen() {
  let techData = [];
  // 基本数据
  typeList.forEach(({skillId, skillType, maxLevel, name, img, des}) => {
    techData.push({
      skillId: parseInt(skillId), skillType: parseInt(skillType), skillName: name,
      maxLevel: parseInt(maxLevel), mainDes: des,
      levels: []
    });
  });
  // 等级消耗数据
  techList.forEach(({skillId, familyLevel, xiuwei, banggong, suiyin, des}) => {
    let skillObject = techData.filter((t) => t.skillId == skillId)[0];
    // console.log(skillObject);
    if(skillObject) {
      skillObject.levels[familyLevel] = {
        xiuwei: parseInt(xiuwei),
        banggong: parseInt(banggong),
        suiyin: parseInt(suiyin),
        des,
        props: des.match(/(\d+\.?\d*%?)/g)
      }
    }
  });

  // 细化属性数据
  techData = techData.map((t) => {
    // 测试去掉哪些属性。
    if(t.levels[1] && t.levels[2]) {
      let a = t.levels[1].props;
      let b = t.levels[2].props;

      console.log(a);
      console.log(b);

      let same = a.map((x, i) =>  x === b[i]);
      console.log(t.levels);

      t.levels.map(l => {
        let newProps = [];
        if(l.props) {
          l.props.forEach((x, i) => {
            if(!same[i])
              newProps.push(x);
          });
          l.props = newProps;
        }
        return l;
      });
    }
    return t;
  });

  fs.writeFile(`./output/family_skills.json`, JSON.stringify(techData, null, 4) , function(err) {
    if(err) {
      console.log(err);
    }
  });
}