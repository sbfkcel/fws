# 配置文件

此处说明仅列出可能经常需要使用的项，随着后续版本的迭代，配置内容会有增减。

`fws安装目录/config.js`

```javascript
//该配置文件会被项目目录下'fws_config.js'同键值所替代
module.exports = {  
    //名字&邮箱
    //此后使用脚手架创建的项目文件签名都依赖于此
    author:'name',
    mail:'name@xxx.com',

    //图像合并处理引擎，推荐('canvassmith')
    //由于安装门槛，请在全局或fws成功安装'canvassmith'再启用，否则可能导致出错
    imgEngine:'',

    //fws watch任务创建的server默认起始端口
    listenPort:3000,

    //需要忽略编译的目录，只作拷贝
    ignoreCompileDir:['node_modules','.git'],

    //资源匹配替换
    distReplace:{
        //key为需要替换的文件类型，'*'为（`.js`、`.css`、`.html`、`.htm`、`.json`、`.xml`）文件
        '*':[
            {
                find:'local-static.com',            //正则或字符串，需要匹配的关键字
                replace:'cdn-static.com'            //需要替换的关键字
            }
        ]
    },

    
};
```
