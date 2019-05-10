const csv = require('csvtojson');
const fs = require('fs');

let fileList = ['PetTable_Retail', 'PetSkillTable', 'PetPropagationTable'];

let promises = Object.keys(fileList).map((key) => {
  let data = fs.readFileSync(`./input/${key}.csv`);
  return csv({checkType: true}).fromString(data.toString());
});

Promise.all(promises).then(gen);

function gen(lists) {
  let petList = lists[0];
  let skillList = lists[1];
  let propagationList = lists[2];

  let result = {};

  petList.forEach(p => {

  });


  // 写入文件
  fs.writeFileSync('./output/pet.json', JSON.stringify(result, null, 4));
}