const fs = require('fs');

let subPathList = ['rank', 'data/tour'];

subPathList.forEach(path => {
  // 在文件夹中建立htaccess
  let content =
`<ifModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule (.*) index.html [QSA,L]
</ifModule>`;
  fs.writeFileSync(`./dist/${path}/.htaccess`, content);
});

