#!/usr/bin/env node
'use strict';
const {fs,path,cwdPath,program,tip,pathInfo,getType,fwsConfig,npmPackage,getLocalIp} = {
    fs:require('fs'),
    path:require('path'),
    cwdPath:process.cwd(),                                  //当前路径
    program:require('commander'),
    tip:require('./lib/tip'),                               //文字提示
    pathInfo:require('./lib/getPathInfo'),                  //获取目标路径的相关信息
    getType:require('./lib/getType'),                       //获取数据类型
    fwsConfig:require('./config'),
    npmPackage:require('./package.json'),
    getLocalIp:require('./lib/getLocalIp')                  //获取本机ip地址
};

//字符串方法扩展
String.prototype.replaceAll = function(substr,replacement){
    let re = /\*|\.|\?|\+|\$|\^|\[|\]|\(|\)|\{|\}|\||\\|\//g,
        newReS = substr.replace(re,(item,index)=>{
            return '\\'+item;
        }),
        newRe = new RegExp(newReS,'g');
    return this.replace(newRe,replacement);
};


//声明版本号
program.version(npmPackage.version);

//定义全局
global.fws = {
    'fwsPath':path.join(__dirname,path.sep),                        //fws目录路径
    'taskPath':path.join(__dirname,'task'+path.sep),                //任务插件路径
    'tplPath':path.join(__dirname,'tpl'+path.sep),                  //内置tpl目录
    'tplConfigPath':path.join(__dirname,'tpl','_config'+path.sep),  //内置tpl配置目录    
    'cmdPath':cwdPath,                                              //当前进程所在的目录
    'srcPath':path.join(cwdPath,'src'+path.sep),                    //当前进程下的src目录
    'devPath':path.join(cwdPath,'dev'+path.sep),                    //当前进程下的dev目录
    'distPath':path.join(cwdPath,'dist'+path.sep),                  //当前进程下的dist目录
    'config':fwsConfig,
    'require':(module)=>{                                           //引入模块并且不缓存
        delete require.cache[require.resolve(module)];
        return require(module);
    },
    'globalReplace':{
        '$$localhost':getLocalIp()
    },
    'cache':{}                                                      //文件编译缓存
};

global.fws_spriteTime ={};                                          //用于保存精灵图目录编译时间


fws.config.update_author = fwsConfig.author;
fws.config.update_mail = fwsConfig.mail;

//项目配置信息覆盖fws信息
let fwsConfigPath = path.join(cwdPath,'fws_config.js');
if(pathInfo(fwsConfigPath).type === 'file'){
    let fwsConfigData = require(fwsConfigPath);
    for(let i in fwsConfigData){
        fws.config[i] = fwsConfigData[i];
    };
};


//检查任务目录是否存在,如果有则注册所有任务
if(pathInfo(path.join(__dirname,'/task')).type === 'dir'){
    let taskDirList = fs.readdirSync(fws.taskPath),
        task = {},
        taskList = [];
    
    //获取任务目录下的所有.js文件
    taskDirList.forEach((item,index)=>{
        if(path.extname(item).toLowerCase() === '.js'){
            taskList.push(item);
        };
    });
    
    for(let index=0,len = taskList.length; index<len; index++){
        let item = taskList[index],            
            taskFile = path.join(fws.taskPath,item),
            extName = path.extname(taskFile),               //得到文件扩展名
            fileName = path.basename(taskFile,extName),     //得到文件名,不包括扩展名部分的
            taskContent = require(taskFile).regTask;        //得到任务注册相关参数
        
        //检查是否有注册任务
        if(taskContent){
            //任务主参数接收
            if(taskContent.command && getType(taskContent.command) === 'string'){
                task[fileName] = program.command(`${fileName} ${taskContent.command}`);
            }else{
                tip.error(`任务 "${taskFile}" regTask.command 无效`);
                continue;
            };            
        
            //任务描述添加
            if(taskContent.description && getType(taskContent.description) === 'string'){
                task[fileName].description(taskContent.description);
            };      

            //任务参数绑定
            if(taskContent.option && getType(taskContent.option) === 'array'){
                taskContent.option.forEach((item,index)=>{
                    task[fileName].option.apply(task[fileName],item);
                });
            };
            
            //任务方法绑定
            if(taskContent.action && getType(taskContent.action) === 'function'){
                task[fileName].action((name,options)=>{
                    let task = new taskContent.action(name,options);
                    task.init();                                   
                });
            }else{
                tip.error(`任务 "${taskFile}" regTask.action 必须是一个函数`);
            };

            //任务帮助说明处理
            if(taskContent.help && getType(taskContent.help) === 'function'){
                task[fileName].on('--help',(...arg)=>{
                    taskContent.help(arg);
                });
            };

        }else{
            tip.error(`"${taskFile}" 不是一个有效的任务插件，请检查插件暴露参数。`);
        };
        
    };

}else{
    tip.error(`任务目录 ${fws.taskPath}  好像不存在，请检查……`);
};


//添加额外的帮助信息
program.on('--help',()=>{
    console.log(`   意见反馈:`);
    console.log(`   ------------------------------------------------------------`);
    console.log('   @单炒饭  https://github.com/sbfkcel/fws/wiki');
});

//解析命令行参数argv
program.parse(process.argv);

//当没有传入参数时，输出帮助信息
if (!process.argv.splice(2).length) {
    program.outputHelp();
};
