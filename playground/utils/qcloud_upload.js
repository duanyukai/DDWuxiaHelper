const COS = require('cos-nodejs-sdk-v5');
const secrets = require('../../secrets/secrets');
const fs = require('fs');

let srcDir = '../data/魅力数据/img_output/png/';
let desDir = '/shizhuang/icon/';
let bucket = 'wuxia-tools-assets-1251080372';

// 创建实例
let cos = new COS({
  SecretId: secrets.SecretId,
  SecretKey: secrets.SecretKey,
});
// 上传
fs.readdir(srcDir, function(err, items) {
  for (let i=0; i<items.length; i++) {
    let filePath = `${srcDir}${items[i]}`;
    if(fs.lstatSync(filePath).isFile()) {
      let ContentEncoding = '', ContentType = '';
      let originEnding;
      if(filePath.endsWith('.gz')) {
        ContentEncoding = 'gzip';
        originEnding = items[i].replace(/\.gz$/, '').split('.').pop();
      } else {
        originEnding = items[i].split('.').pop();
      }
      let fileKey = desDir + items[i].replace(/\.gz$/, '');

      switch (originEnding) {
      case 'js': ContentType = 'application/javascript; charset=utf-8';  break;
      case 'css': ContentType = 'text/css';  break;
      case 'html': ContentType = 'text/html';  break;
      case 'png': ContentType = 'image/png';  break;
      case 'svg': ContentType = 'image/svg+xml';  break;
      case 'ttf': ContentType = 'application/x-font-ttf';  break;
      case 'eot': ContentType = 'application/vnd.ms-fontobject';  break;
      case 'woff': ContentType = 'application/x-font-woff';  break;
      case 'woff2': ContentType = 'application/x-font-woff';  break;
      }

      cos.putObject({
        Bucket: bucket,
        Region: 'ap-shanghai',
        Key: fileKey,
        ContentEncoding: ContentEncoding,
        ContentType: ContentType,
        ContentLength: fs.statSync(filePath).size,
        Body: fs.createReadStream(filePath),
        onProgress: function (progressData) {
          console.log(progressData);
        },
      }, function (err, data) {
        if (err) {
          console.log(err);
        } else {
          // console.log(data);
          console.log(`成功上传：${fileKey}`);
        }
      });
    }
  }
});