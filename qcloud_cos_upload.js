const COS = require('cos-nodejs-sdk-v5');
const secrets = require('./secrets/secrets');
const fs = require('fs');
// 创建实例
let cos = new COS({
  SecretId: secrets.SecretId,
  SecretKey: secrets.SecretKey,
});
// 上传
fs.readdir('./dist', function(err, items) {
  for (let i=0; i<items.length; i++) {
    let filepath = `./dist/${items[i]}`;
    if(fs.lstatSync(filepath).isFile()) {
      let ContentEncoding = '', ContentType = '';
      let originEnding;
      if(filepath.endsWith('.gz')) {
        ContentEncoding = 'gzip';
        originEnding = items[i].replace(/\.gz$/, '').split('.').pop();
      } else {
        originEnding = items[i].split('.').pop();
      }
      let fileKey = items[i].replace(/\.gz$/, '');
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
        Bucket: 'wuxia-tools-main-server-1251080372',
        Region: 'ap-shanghai',
        Key: fileKey,
        ContentEncoding: ContentEncoding,
        ContentType: ContentType,
        ContentLength: fs.statSync(filepath).size,
        Body: fs.createReadStream(filepath),
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