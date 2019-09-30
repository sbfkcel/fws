/// <reference path="../typings/globals/node/index.d.ts" />
'use strict';
const fs = require('fs-extra');

let aConfigDirList = fs.readdirSync(fws.tplConfigPath),//获取配置目录所有文件列表
    aConfigList = [],
    re = /^(\w*)(.json)$/i;

aConfigDirList.forEach((item,index)=>{
    if(re.test(item)){
        aConfigList.push(item.substr(0,item.length - 5));
    };
});

class create{
    constructor(name,options){
        const _ts = this;

        //任务依赖模块
        let m = _ts.m = {
                fs:require('fs-extra'),
                path:require('path'),
                tip:require('../lib/tip'),                            //文字提示
                getType:require('../lib/getType'),                    //获取数据类型
                pathInfo:require('../lib/getPathInfo'),               //获取目标路径的相关信息
                getDirFilesPath:require('../lib/getDirFilesPath')     //获取目录文件数据
            },
            config = _ts.config = {
                // name:'demo',                                //<string>,项目名称
                // template:'default'                          //<string>,项目配置文件名
            };
        config.name = name;

        config.template = typeof options.template === 'string' ? options.template : 'default';
        config.unittest = options.unittest;

        _ts.starTime = new Date();
    }

    /**
     * 任务初始入口
     */
    init(){
        const _ts = this,
            m = _ts.m,
            config = _ts.config;
        let f = async ()=>{
            let pList = _ts.start();

            for(let i of pList){
                await i;
            };

            return '项目【'+config.name+'】创建成功。用时'+ (new Date() - _ts.starTime) + 'ms';
        };

        f().then(v => {
            m.tip.highlight('========================================');
            m.tip.highlight(v);
            m.tip.highlight('========================================');
        }).catch(err => {
            m.tip.error(err);
        });
    }

    /**
     * 创建方法
     */
    start(){
        const _ts = this,
            m = _ts.m,
            config = _ts.config;
        
        //初始化相关目录
        let initDir,
            initFilesData,
            taskListData = [],
            taskList = [];
        
        //定义初始化目录任务
        initDir = new Promise((resolve,reject)=>{
            //检查项目名称参数是否传入
            if(config.name === undefined){
                reject('项目名称不允许为空');
            };

            //获取设置项目的相关目录信息
            let projectPath = m.path.join(fws.cmdPath,config.name),
                projectIsExist = m.pathInfo(projectPath).type === 'dir';                
            
            //检查项目目录是否已经存在
            if(projectIsExist){
                reject('警告：'+config.name+'目录已存在。请更换项目名称或删除原有项目之后重试。');
            };

            fws.srcPath = m.path.join(projectPath,'src');
            fws.devPath = m.path.join(projectPath,'dev');
            fws.distPath = m.path.join(projectPath,'dist');
            fws.testPath = m.path.join(projectPath,'test');

            //创建目录
            fs.mkdirSync(projectPath);
            m.tip.success('创建 '+projectPath);

            fs.mkdirSync(fws.srcPath);
            m.tip.success('创建 '+fws.srcPath);

            fs.mkdirSync(fws.devPath);
            m.tip.success('创建 '+fws.devPath);

            fs.mkdirSync(fws.distPath);
            m.tip.success('创建 '+fws.distPath);

            if(config.unittest){
                fs.mkdirSync(fws.testPath);
                m.tip.success('创建 '+fws.testPath);

                //创建单元测试演示及依赖文件
                let demoTestPath =  m.path.join(fws.testPath,'main.test.js'),
                    packagePath = m.path.join(projectPath,'package.json'),
                    packageTplPath = m.path.join(fws.tplPath,'json','packageTpl.json'),
                    packageTpl = JSON.parse(m.fs.readFileSync(packageTplPath).toString());
                m.fs.copySync(
                    m.path.join(fws.tplPath,'test','main.test.js'),
                    demoTestPath
                );
                m.tip.success('创建 '+demoTestPath);

                packageTpl.author = fws.config.author;
                packageTpl.name = config.name;

                m.fs.writeFileSync(packagePath,JSON.stringify(packageTpl,null,4));
                m.tip.success('创建 '+packagePath);
            };

            //创建项目配置文件
            let projectType = (()=>{
                    let type = config.template.split('_')[0],
                        list = ['vue','react'];
                    for(let i=0,len=list.length; i<len; i++){
                        let item = list[i];
                        if(item === type){
                            return item;
                        };
                    };
                    return undefined;
                })(),
                fws_config = {
                    author:fws.config.author,                           //作者
                    mail:fws.config.mail,                               //邮箱
                    projectName:config.name,                            //项目名称
                    template:config.template,                           //模版
                    projectType:projectType,                            //模版类型
                    createTime:new Date().valueOf(),                    //创建时间
                    updater:undefined,                                  //更新者
                    updateTime:undefined,                               //更新时间
                    distReplace:fws.config.distReplace,                 //资源匹配对应关系
                    srcSync:fws.config.srcSync,                         //src同步目录配置
                    devSync:fws.config.devSync,                         //dev同步目录配置
                    distSync:fws.config.distSync                        //dist同步目录配置
                },
                fwsConfigPath = m.path.join(projectPath,'fws_config.js');

            fws_config = `module.exports = ${JSON.stringify(fws_config,null,4)};`;

            fs.writeFileSync(fwsConfigPath,fws_config);
            m.tip.success('创建 '+fwsConfigPath);

            //初始化项目文件结构数据
            (initFilesData = (dirPath,configData)=>{
                for(let i in configData){

                    //得到当前路径
                    let currentPath = m.path.join(dirPath);

                    if(i === '__files__'){
                        configData[i].forEach((item,index)=>{
                            taskListData.push({
                                src:m.path.join(fws.tplPath,item[0]),
                                target:m.path.join(currentPath,item[1])
                            });
                        });
                    }else if(i !== '__name__'){
                        currentPath = m.path.join(currentPath,i);       //设置当前路径为新目录
                        fs.mkdirSync(currentPath);                      //创建目录
                        m.tip.success('创建 '+currentPath);

                        if(m.getType(configData[i]) === 'object'){
                            initFilesData(currentPath,configData[i]);   //如果是目录则无限级循环
                        };
                    };
                };
            })(fws.srcPath,_ts.getTemplate());

            resolve('项目目录结构初始成功');
        });

        //将初始化目录添加到任务列表
        taskList.push(initDir);

        //遍历项目文件结构数据，并将文件初始任务追加到任务列表
        taskListData.forEach((item,index)=>{
            taskList.push(_ts.taskInit(item.src,item.target));
        });

        return taskList;
    }

    /**
     * 任务初始化
     * @param {*} src 
     * @param {*} target 
     */
    taskInit(src,target){
        const _ts = this,
            m = _ts.m,
            config = _ts.config;
        
        let srcInfo = m.pathInfo(src);

        return new Promise((resolve,reject)=>{
            if(srcInfo.type === 'file'){
                let readAble = fs.createReadStream(src),            //创建读取流
                    writAble = fs.createWriteStream(target);        //创建写入流
                readAble.pipe(writAble);                            //管道写入文件
                m.tip.success('创建 '+target);
                resolve({
                    status:'success',
                    path:target
                });
            }else if(srcInfo.type === 'dir'){

                //如果是目录，则将目录直接copy到对应的项目中
                target = m.path.join(target,srcInfo.name);
                m.tip.success('拷贝 '+target);
                fs.copy(src,target,err => {
                    if(err){
                        reject({
                            status:'error',
                            msg:err
                        });
                    }else{
                        resolve({
                            status:'success',
                            path:target
                        });
                    };
                });
            };
        });        
    }

    /**
     * 用于获取模版配置信息
     */
    getTemplate(){
        const _ts = this,
            m = _ts.m,
            config = _ts.config;
        
        let tplFilePath = m.path.join(fws.tplConfigPath,config.template+'.json'),
            tplConfig;
        
        if(m.pathInfo(tplFilePath).type === 'file'){
            tplConfig = JSON.parse(fs.readFileSync(tplFilePath));
        }else{
            throw new Error(tplFilePath + '不存在');
        };

        return tplConfig;
    }
};

module.exports = {
    regTask:{
        command:'[name]',
        description:'创建一个新的空项目',
        option:[
            ['-t, --template [template]','项目模版。默认pc，可选参数 '+aConfigList.toString()],
            ['-u, --unittest','创建单元测试模块文件及依赖配置']
        ],
        help:()=>{
            console.log('');
            console.log('   补充说明:');
            console.log('   ------------------------------------------------------------');
            console.log('   如何自定义项目模版见 '+fws.tplPath);
        },
        action:create
    },
    fun:()=>{}
};