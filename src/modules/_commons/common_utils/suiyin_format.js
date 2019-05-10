import React from 'react';

// 碎银格式化文本
export function suiyinFormatText(tong) {
  if(tong === 0)
    return '0 铜';
  let jin = Math.floor(tong / 10000);
  let yin = Math.floor(tong % 10000 / 100);
  let newTong = Math.floor(tong % 100);
  return `${jin?` ${jin} 金`:''}${yin?` ${yin} 银`:''}${newTong?` ${newTong} 铜`:''}`;
}

// 碎银格式化图标
export function suiyinFormatImg(tong) {
  if(tong === 0)
    return '0 铜';
  let jin = Math.floor(tong / 10000);
  let yin = Math.floor(tong % 10000 / 100);
  let newTong = Math.floor(tong % 100);
  return <span>{jin && <span>{jin} <img /></span>} {yin && <span>{yin} <img /></span>} {newTong && <span>{newTong} <img /></span>}</span>;
}