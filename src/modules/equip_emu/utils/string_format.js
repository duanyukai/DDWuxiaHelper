export function suiyinFormat(tong) {
  let jin = Math.floor(tong / 10000);
  let yin = Math.floor(tong % 10000 / 100);
  let newTong = Math.floor(tong % 100);
  return `${jin}金${yin}银${newTong}铜`;
}