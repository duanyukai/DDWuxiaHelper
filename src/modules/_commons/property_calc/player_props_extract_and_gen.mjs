import propsDesList from '../common_data/props_des_list.json';

// 根据EquipAddition表精确提取数值，注意单位(命中会心乘100，韧劲除以100)
export function extractPropsByEquipAddition(row) {
  let props = {};

  // 扫描propsDes里所有key，找出row里是否有非0值，进行存储，同时考虑特殊转换
  Object.keys(propsDesList).forEach(key => {
    if(row.hasOwnProperty(key) && row[key] !== 0) {
      let scaled = row[key];
      switch (key) {
      case 'mz':
      case 'gd':
      case 'hx':
      case 'hs':
        scaled *= 100;
        break;
      case 'rj':
        scaled /= 100;
        break;
      default:
        break;
      }
      props[key] = +Number(scaled).toFixed(10);  // 截断小数
    }
  });

  return props;
}


// 根据props还原单行精简文字描述
export function genTextByPlayerProps(props) {
  let text = '';

  // 扫描props里的key，查出对应中文短名
  Object.keys(props).forEach(key => {
    if(props[key] !== 0 && key !== 'gongliOffset' && key !== 'zhanliOffset') {
      text += ` ${propsDesList[key].shortName}+${+props[key].toFixed(10)}${propsDesList[key].isPct?'%':''}`;
    }
  });

  return text;
}

// 根据文本推测提取属性
export function extractPropsByText(text) {
  // 预处理数据
  // 示例结构
  // "气劲+7    身法+5<br>韧劲+1.1%    命中+2%"
  // 分隔符：tab、空格、br
  let arr = text.replace(/\s+/g, ' ').replace(/(\t| |<br>)/g, '$').split('$');
  let props = {};
  arr.forEach(text => {
    let type = text.split('+')[0];
    let value = parseFloat(text.split('+')[1]);  // 直接扔掉百分号，数据存储的都是百倍值
    let typeId;
    Object.keys(propsDesList).forEach(key => {
      if(propsDesList[key].possibleNames.includes(type))
        typeId = key;
    });
    props[typeId] = value;
  });

  return props;
}

// 根据文本推测提取属性（尽量少用） todo
// export function extractPropsByText(text) {
//   let props = {};
//   if(!text) return props;
//
//   let cats = [
//     {name: '力道', type: 'ld'},
//     {name: '根骨', type: 'gg'},
//   ];
//
//   try {
//     text.split(' ').forEach(propStr => {
//       console.log(propStr);
//       for(let cat of cats) {
//         if(propStr.includes(cat.name)) {
//           let num = parseFloat(propStr.split('+')[1]);
//           props[cat.type] = num;
//         }
//       }
//     });
//   } catch(e) {
//     // 词缀数据有误
//     console.log(e);
//   }
//   return props;
// }