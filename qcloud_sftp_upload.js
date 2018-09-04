let Client = require('ssh2-sftp-client');
let sftp = new Client();
sftp.connect({
  host: 'qq.neu.la',
  port: '22',
  username: 'dyk',
  password: 'DJF0518dyk'
}).then(() => {
  // return sftp.list('/var/www');
  // 递归遍历所有html文件并上传


}).then((data) => {
  console.log(data, 'the data info');
}).catch((err) => {
  console.log(err, 'catch error');
});