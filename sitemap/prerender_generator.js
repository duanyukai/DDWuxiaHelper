const fs = require('fs');
const mkdirp = require('mkdirp');
const getDirName = require('path').dirname;
// 目标：生成['/', '/data', ]这玩意
// htaccess文件补充

let routes = [];

// 基本路径
routes = routes.concat([
  '/',
  '/xinfa', '/map', '/calendar', '/family-tech', '/rank', '/panorama', '/equip',
  '/data', '/data/gem', '/data/affix', '/data/item', '/data/tour', '/shimei'
]);
//////////////////////////////////////////////////////////////////////////////////////////
// 生成游历路由
let youliData = require('../src/modules/data_wiki/modules/youli/assets/youli.json');
routes = routes.concat(Object.keys(youliData).map(key => {
  return `/data/tour/${key}/${youliData[key][1].t1}`;
}));
// 生成游历htaccess，针对每个数字id后的子文件夹，增加一个单独的.htaccess即可
Object.keys(youliData).map(key => {
  let name = youliData[key][1].t1;
  let htaccess =
`DirectorySlash off
RewriteOptions AllowNoSlash
RewriteOptions Inherit
RewriteEngine on
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_URI} ^/prerender/data/tour/${key}(/.*)?$
RewriteCond %{REQUEST_URI} !^/prerender/data/tour/${key}/${name}$
RewriteRule ^ /data/tour/${key}/${name} [R=301,L,END]
`;
  let path = `data/tour/${key}`;
  let fileName = `./prerendered/${path}/.htaccess`;
  mkdirp(getDirName(fileName), function (err) {
    if (err) return err;
    fs.writeFileSync(fileName, htaccess);
  });
});
//////////////////////////////////////////////////////////////////////////////////////////
// 生成功力排行榜路由
let rankData = require('../src/modules/gongli_rank/assets/json/server.json');
// 生成功力排行榜路由
routes = routes.concat(Object.keys(rankData).map(key => {
  return `/rank/${key}`;
}));

//////////////////////////////////////////////////////////////////////////////////////////
// 写入总路由表
fs.writeFileSync('./sitemap/output/routes.json', JSON.stringify(routes, null, 4));

// 生成根目录htaccess
let prerenderRoot =
`DirectorySlash Off
RewriteOptions AllowNoSlash
Options -Indexes
DirectoryIndex index.html
RewriteEngine On

# 跳转所有形如：/xinfa/ 到 /xinfa
RewriteCond %{ENV:REDIRECT_LOOP} !1
RewriteRule ^(.+)/$ /$1 [R=301,L]

RewriteCond %{ENV:REDIRECT_LOOP} !1
RewriteRule ^(.+)/index.html$ /$1 [R=301,L]

# 修复关闭文件夹斜线后的文件
RewriteCond %{REQUEST_FILENAME} -d
RewriteCond %{REQUEST_URI} !/$
RewriteCond %{REQUEST_FILENAME}/index.html -f
RewriteRule (.*) $1/index.html [L,E=LOOP:1]
`;
fs.writeFileSync(`./prerendered/.htaccess`, prerenderRoot);