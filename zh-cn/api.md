# API

FWS目前提供了文件编译及压缩的接口。可根据团队需要自定义任务模块或进行二次开发。

也可部署在集成服务器来处理项目发布策略，又或是用于优化业务环节。


## 如何使用


```javascript
//引入FWS
const fws = require('fws');
```

## 图片压缩
```javascript
let imgCompile = new fws.compileImg({
    src:'/demo/src/logo.png',                   //<string> 源文件路径
    dist:'/demo/dist/logo.png'                  //<string> 输出文件路径
});

imgCompile.then(r => {
    //压缩成功
    console.log(r);
}).catch(e => {
    //压缩失败
    console.log(e);
});
```

## js文件压缩
```javascript
let jsCompile = new fws.compileJs({
    src:'/demo/src/main.js',                    //<string> 源文件路径
    dist:'/demo/src/main.min.js'                //<string> 输出文件路径
});

jsCompile.then(r => {
    //压缩成功
    console.log(r);
}).catch(e => {
    //压缩失败
    console.log(e);
});
```

## css文件压缩
```javascript
let cssCompile = new fws.compileCss({
    src:'/demo/src/style.css',                  //<string> 源文件路径
    dist:'/demo/src/style.css',                 //<string> 输出文件路径
    isMobile:false                              //[boolean] 为`true`的话，css不会添加全部兼容前缀
});

cssCompile.then(r => {
    //压缩成功
    console.log(r);
}).catch(e => {
    //压缩失败
    console.log(e);
});
```

<!-- ## html文件压缩
```javascript
    let htmlCompile = new fws.compileHtml({

    });

    htmlCompile.then(r => {
        //编译成功
        console.log(r);
    }).catch(e => {
        //编译失败
        console.log(e);
    });
``` -->

## 文件拷贝
```javascript
let copy = new fws.Copy({
    src:'/demo/src/main.js',                //<string> 复件的文件路径
    dist:'/demo/src/main.back'              //<string> 目标文件路径
});

copy.then(r => {
    //拷贝成功
    console.log(r);
}).catch(e => {
    //拷贝失败
    console.log(e);
});
```

## sass文件编译：
```javascript
let sassCompile = new fws.Sass2css({
    src:'/demo/src/style.scss',             //<string> 源文件路径
    dist:'/demo/dist/style.css',            //<string> 输出路径
    debug:false                             //[boolean] 是否带有调试信息
});

sassCompile.then(r => {
    //编译成功
    console.log(r);
}).catch(e => {
    //编译失败
    console.log(e);
});
```

## ts、tsx、jsx、es、es6文件编译
```javascript
let esCompile = new fws.Es2({
    src:'/demo/src/main.es6',               //<string> 源文件路径
    dist:'/demo/dist/main.js',              //<string> 输出路径
    debug:false                             //[boolean] 是否带有调试信息
});

esCompile.then(r => {
    //编译成功
    console.log(r);
}).catch(e => {
    //编译失败
    console.log(e);
});
```

## Pug文件编译
```javascript
let pugCompile = new fws.Pug2html({
    src:'/demo/src/index.pug',              //<string> 源文件路径
    dist:'/demo/dist/index.html',           //<string> 输出路径
    data:{},                                //[object] 页面所对应的json数据
    debug:false                             //[boolean] 是否带有自动刷新页面脚本
});

pugCompile.then(r => {
    //编译成功
    console.log(r);
}).catch(e => {
    //编译失败
    console.log(e);
});
```

## 精灵图合并
```javascript
let sprite = new fws.OutSprite({
    srcDir:'/demo/src/images/_spritexxx/',                  //<string> 精灵图源图目录
    distSpreiteDir:'/demo/dev/images/',                     //<string> 精灵图输出目录
    distScssDir:'/demo/src/css/_fws/sprite/_spriteData/'    //<string> scss输出目录
});

sprite.then(r => {
    //编译成功
    console.log(r);
}).catch(e => {
    //编译失败
    console.log(e);
});
```

<!-- ## html签名添加
```javascript
    let htmlCompile = new fws.html2html({

    });

    htmlCompile.then(r => {
        //编译成功
        console.log(r);
    }).catch(e => {
        //编译失败
        console.log(e);
    });
``` -->