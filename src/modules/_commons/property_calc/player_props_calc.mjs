import menpai5dTranslation from '../common_data/menpai_5d_translation.json';

// 统一标准的0属性结构
export const zeroProps = {
  // isOrigin: true,  // 标记是否是原始属性，用于校验功力战力的数值
  // realGongli: 0,  // 真实计算得功力值，冗余属性便于显示
  // realZhanli: 0,  // 真实计算得战力值，冗余属性便于显示

  ld: 0, gg: 0, qj: 0, dc: 0, sf: 0,  // 五维
  wg: 0, ng: 0,  // 内外功固定值
  wgMin: 0, wgMax: 0, ngMin: 0, ngMax: 0,  // 内外功随机值，在计算属性及显示时，简单求和即可
  wf: 0, nf: 0,  // 双防
  mz: 0, gd: 0,  // 命中格挡（百分数，即放大100倍的）
  hx: 0, rj: 0, hs: 0,  // 会心韧劲会伤
  qx: 0, nx: 0, // 气血内息
  poshang: 0, chaizhao: 0, yushang: 0, liaoshang: 0,  // 字面属性

  zhiming: 0, naishou: 0,  // 致命耐受？？？是否单独算 todo 待考究

  gongliOffset: 0,  // 功力平衡
  zhanliOffset: 0,  // 战力平衡

  ldAP: 0, ggAP: 0, qjAP: 0, dcAP: 0, sfAP: 0,  // 五维加百分比（不加功力）（百分数，即放大100倍的）
  wgAP: 0, ngAP: 0, wfAP: 0, nfAP: 0, // 双攻双防加百分比（不加功力）
  qxAP: 0, nxAP: 0, // 气血内息加百分比（不加功力）
  poshangAP: 0,  // 破伤加百分比 （不加功力）

  ldNC: 0, ggNC: 0, qjNC: 0, dcNC: 0, sfNC: 0,  // 五维单纯加属性不加功力战力数值（buff等）
  wgNC: 0, ngNC: 0, wfNC: 0, nfNC: 0, // 双攻双防单纯加属性不加功力战力数值（buff等）
  mzNC: 0, gdNC: 0,  // 命中格挡单纯加属性不加功力战力数值（buff等）（百分数，即放大100倍的）
  hxNC: 0, rjNC: 0, hsNC: 0,  // 会心韧劲会伤单纯加属性不加功力战力数值（buff等）（百分数）
  qxNC: 0, nxNC: 0, // 气血内息单纯加属性不加功力战力数值（buff等）（百分数）
  poshangNC: 0, chaizhaoNC: 0, yushangNC: 0, liaoshangNC: 0,  // 字面属性

  wgWeak: 0, ngWeak: 0, wfWeak: 0, nfWeak: 0, // 削弱敌方内外攻防属性
  mzWeak: 0, gdWeak: 0,  // 削弱敌方命中格挡（百分数，即放大100倍的）
  hxWeak: 0, rjWeak: 0, hsWeak: 0,  // 削弱敌方会心韧劲会伤

  // todo 内外防减百分比，暂时没看到
};

// 计算功力值
export function calcGongli(props) {
  props = Object.assign({...zeroProps}, props);  // 补全空缺属性
  // 五维系数0.8，1命中=5 1格挡=5 1会心=10 1韧劲=9 1外攻=1 1内功=1.6 内外防=0.5 1气血=0.1 会心伤害=4
  // 破伤0，1拆招=2，1愈伤=0，1疗伤效果=0
  let sum = 0;
  sum += (props.ld + props.gg + props.qj + props.sf + props.dc) * 0.8;
  sum += props.mz * 5;
  sum += props.gd * 5;
  sum += props.hx * 10;
  sum += props.rj * 9;

  sum += props.wg;
  sum += props.ng * 1.6;

  sum += (props.wgMin + props.wgMax) / 2;
  sum += (props.ngMin + props.ngMax) / 2 * 1.6;

  sum += props.wf * 0.5;
  sum += props.nf * 0.5;

  sum += props.qx / 10;
  sum += props.hs * 4;
  sum += props.chaizhao * 2;

  // 最后加上功力偏移
  sum += props.gongliOffset;

  return +sum.toFixed(10);
}

export function calcZhanli(props) {
  props = Object.assign({...zeroProps}, props);
  // 解析出结果：（内外功实际上是最小值最大值分别乘系数算出来的，0.42和0.54）
  // 五维系数0.18 1命中=3 1格挡=3 1会心=12 1韧劲=0.3 1外攻=0.84! 1内功=1.08! 内外防=0.18 1气血=0.03 会心伤害=12
  // 1破伤=10，1拆招=0，1愈伤=5，1疗伤效果=0.2
  let sum = 0;
  sum += (props.ld + props.gg + props.qj + props.sf + props.dc) * 0.18;
  sum += props.mz * 3;
  sum += props.gd * 3;
  sum += props.hx * 12;
  sum += props.rj * 0.3;

  sum += props.wg * 0.84;
  sum += props.ng * 1.08;

  sum += (props.wgMin + props.wgMax) / 2 * 0.84;
  sum += (props.ngMin + props.ngMax) / 2 * 1.08;

  sum += props.wf * 0.18;
  sum += props.nf * 0.18;

  sum += props.qx * 0.03;
  sum += props.hs * 12;
  sum += props.poshang * 10;
  sum += props.yushang * 5;
  sum += props.liaoshang * 0.2;
  // 最后加上战力偏移
  sum += props.zhanliOffset;
  return +sum.toFixed(10);
}

// 属性相加
export function sumProps(...propsList) {
  // 对应项相加即可
  return propsList.reduce((prev, curr) => {
    if(curr) {
      Object.keys(curr).forEach(key => {
        if (prev.hasOwnProperty(key))
          prev[key] += curr[key];
      });
    }
    return prev;
  }, {...zeroProps});
}

// 属性相减(a-b)
export function minusProps(a, b) {
  // 对应项相加即可
  let result = {...a};
  Object.keys(a).forEach(key => {
    result[key] -= (b[key] || 0);
  });
  return result;
}

// 属性乘倍数（部分属性乘倍数无意义，这里暂且不管）
export function mulProps(p, ratio) {
  let newProps = {...p};
  Object.keys(p).forEach(key => {
    newProps[key] = p[key] * ratio;
  });
  return newProps;
}

// 计算门派加成后属性（即二级属性和一级属性冗余，保持props中功力战力不变即可）
export function calcMenpai5dTranslatedProps(props, menpaiId) {
  let id2Code = ['ZW', 'TB', 'SW', 'GB', 'TM', 'WD', 'SL', 'TX', 'SD', 'YH'];  // todo 偷懒旧数据直接用了
  let coefficient = menpai5dTranslation[id2Code[menpaiId]];
  // props里根据每一项，折算计算
  let result = {...props};
  Object.keys(coefficient).forEach((primaryKey) => {
    let co = coefficient[primaryKey];
    Object.keys(co).forEach((secondaryKey) => {
      let c = co[secondaryKey];
      // // 不必再单独处理外攻内攻
      // switch(secondaryKey) {
      // case 'wg':
      //   result['wgMin'] += result[primaryKey] * c;
      //   result['wgMax'] += result[primaryKey] * c;
      //   break;
      // case 'ng':
      //   result['ngMin'] += result[primaryKey] * c;
      //   result['ngMax'] += result[primaryKey] * c;
      //   break;
      // default:
      //   result[secondaryKey] += result[primaryKey] * c;
      // }
      result[secondaryKey] += result[primaryKey] * c;
    });
  });
  // result.isOrigin = false;
  return result;
}