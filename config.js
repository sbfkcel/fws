//该配置会被项目目录下'fws_config.js'同键值所取代

module.exports = {  
    //作者名称
    author:'FWS',
    
    //作者邮箱
    mail:'china1099@qq.com',
    
    // //项目名称
    // projectName:'',

    // //更新者信息
    // author_update:'',
    // mail_update:'',

    //图像合并处理引擎，推荐('canvassmith')
    //由于安装门槛，请在全局或fws成功安装'canvassmith'再启用，否则可能导致出错
    imgEngine:'',

    listenPort:3000,
    
    //模版路径
    tplPath:'',
    
    //字体路径
    ttfPath:'',

    //ignore的编译目录，只作拷贝
    ignoreCompileDir:['node_modules'],

    //资源匹配替换
    distReplace:{
        '*':[
            {
                find:'feutil.localstatic.com',
                replace:'pic.my4399.com/re/cms/feUtil'
            },
            {
                find:'$$localhost/staticfile',
                replace:'pic.my4399.com/re/cms/feUtil'
            }
        ]
    },
    
    //源文件目录同步路径
    srcSync:{
        targetPath:'',
        fileType:'*'
    },

    //编译目录同步路径
    devSync:{
        targetPath:'',
        fileType:'*'
    },

    //发布目录同步路径
    distSync:{
        targetPath:'',
        fileType:'*'
    },

    //svn信息
    svn:{
        pc:{
            username:"",
            password:""
        },
        mobile:{
            username:"",
            password:""
        }
    }
    
};