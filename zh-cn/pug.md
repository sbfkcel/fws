# Pug 编译策略

通常Pug被用于后端渲染。但其实在前端重构阶段使用也能弥补手写html带来的诸多诟病。

** 譬如： **

- 让页面更规范
- 减少手写冗余内容
- ...

FWS让页面自动对应数据，如果项目页面较多，一些公共的模块在重构阶段就能够被很好地重用。

## 示例

```bash
项目目录
│  fws_config.js            # 项目配置文件
└─src                       # 源文件目录
    │  index.pug
    │  _footer.pug          # 以'_'开始，则为pug公共文件
    └─data                  # pug数据目录
            index.js        # 页面数据文件，与项目中的'index.pug'页面对应
            _public.js      # '_'公共数据文件

```

** src/index.pug 文件**
```pug
html
    head
        title #{name}—#{pageTitle}
    body
        //nav
        nav
            each item in nav
                a(href=item.link) #{item.name}
        
        //footer
        include _footer
```

** src/_footer.pug 文件**
```pug
div.footer!=footer
```

** src/data/index.js 文件**

```javascript
const path = require('path');
let publicPath = path.join(__dirname,'_public'),      //得到项目公共文件路径
	publicData = fws.require(publicPath);               //得到公共文件数据

//输出页面数据
module.exports = {
    "nav":publicData.nav,
    "name":publicData.name,    
    "footer":publicData.footer,
    "pageTitle":"Home Page"
};
```
!> 代码中的`fws.require`是`Node.js`中`require`禁用缓存版本，为确保每次刷新页面不会从缓存中读取公共文件数据。

** src/data/_public.js 文件**

```javascript
exports.name = 'Demo';
exports.footer = 'Power by xxx &copy;';
exports.nav = [
	{
		"name":"HOME",
		"link":"./"
	},
	{
		"name":"PRODUCT",
		"link":"./product.html"
	},
	{
		"name":"ABOUT",
		"link":"./about.html"
	}
];
```

** 编译结果 dist/index.html 文件**

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Demo—Home Page</title>
  </head>
  <body>
    <!--nav-->
    <nav>
	    <a href="./">HOME</a>
	    <a href="./product.html">PRODUCT</a>
	    <a href="./about.html">ABOUT</a>
    </nav>
    <!--footer-->
    <div class="footer">Power by xxx &copy;</div>
  </body>
</html>
```

