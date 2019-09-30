/// <reference path="../typings/globals/node/index.d.ts" />
'use strict';
class Watch{
    constructor(srcPath,options){
        const _ts = this;
        
        let m = _ts.m = {
                path:require('path'),
                chokidar:require('chokidar'),
                fs:require('fs-extra'),
                autoRefresh:require('../lib/autoRefresh'),              //自动刷新
                openurl:require('openurl'),                             //打开前台页面
                tip:require('../lib/tip'),                              //文字提示
                pathInfo:require('../lib/getPathInfo'),                 //判断文件或目录是否存在
                Compile:require('../lib/compile'),                      //编译文件
                isFwsDir:require('../lib/isFwsDir'),                    //判断是否为fws项目目录
                getDirFilesPath:require('../lib/getDirFilesPath'),      //获取目录文件数据
                isData:require('../lib/isData'),                        //判断是否为页面数据文件
                isSprite:require('../lib/isSprite'),                    //判断是否为精灵图数据
                getFileInfo:require('../lib/getFileInfo'),              //获取指定文件的相关信息
                getLocalIp:require('../lib/getLocalIp'),                //获取本机ip地址
                isFilter:require('../lib/isFilter'),                    //判断是否为需要忽略的文件
                getCompileFn:require('../lib/getCompileFn'),            //根据文件类型来获取编译方法
                getDistPath:require('../lib/getDistPath'),              //获取输出路径
                updateImgData:require('../lib/updateImgData'),          //更新sass图片数据文件
                updateImg:require('../lib/updateImg')
            },
            config = _ts.config = {},
            option = _ts.option = options;
        
        config.src = fws.srcPath = typeof srcPath === 'string' ? m.path.join(fws.cmdPath,srcPath,'src'+m.path.sep) : fws.srcPath;
        config.dev = fws.devPath = m.path.join(config.src,'..','dev'+m.path.sep);
        config.dist = fws.distPath = m.path.join(config.src,'..','dist'+m.path.sep);

    }
    init(){
        const _ts = this,
            m = _ts.m,
            config = _ts.config;
        
        let tasks = _ts.taskList(),
            f = async ()=>{
                for(let i=0,len=tasks.length; i<len; i++){
                    let task = await tasks[i]();
                    if(task.status === 'success'){
                        m.tip.success(task.msg);
                    };
                };
                return '已经启动文件监听服务';
            };
        
        f().then(v => {
            m.tip.highlight('========================================');
            m.tip.highlight(v);
            m.tip.highlight('========================================');
        }).catch(e => {
            m.tip.error(e.msg);
            console.log('error',e);
        });
        
    }
    taskList(){
        const _ts = this,
            m = _ts.m,
            config = _ts.config,
            option = _ts.option,
            tsOption = _ts.option;
        let tasks = [],
            isInitCompile,
            projectDir = m.path.join(config.src,'..');

        //检查项目是否为一个fws项目
        tasks.push(()=>{
            return new Promise((resolve,reject)=>{
                if(m.isFwsDir(projectDir)){
                    resolve({
                        status:'success',
                        msg:'检查目录为有效的 【FWS】 项目'
                    });
                }else{
                    reject({
                        status:'error',
                        msg:`${projectDir} 不是有效的fws项目目录`
                    });
                };
            });
        });

        //开启http服务
        //var listenPort;
        let vsCodeDebugConfigDirPath = m.path.join(fws.srcPath,'../','.vscode/'),
            vsCodeDebugConfigPath = m.path.join(vsCodeDebugConfigDirPath,'launch.json'),
            vsCodeDebugConfigTplPath = m.path.join(fws.tplPath,'json','launchTpl.json'),
            vsCodeDebugConfigTpl = (()=>{
                if(m.pathInfo(vsCodeDebugConfigPath).type === 'file'){
                    return JSON.parse(m.fs.readFileSync(vsCodeDebugConfigPath).toString());
                }else{
                    return JSON.parse(m.fs.readFileSync(vsCodeDebugConfigTplPath).toString());
                };
            })();

        if(option.server){
            tasks.push(()=>{
                return new Promise((resolve,reject)=>{
                    _ts.server = new m.autoRefresh();
                    _ts.server.init().then(v => {
                        //保存端口号
                        global.fws.listenPort = v.data.listenPort;
                        global.fws.localIp = m.getLocalIp();

                        let url = `${global.fws.localIp}:${global.fws.listenPort}`;
                        //vscode调试配置添加本服务url，以便启动访问
                        vsCodeDebugConfigTpl.configurations.forEach(item => {
                            if(item.name === 'FWS Web'){
                                item.url = `http://${url}/dev/`;
                            };
                        });
                        
                        v.msg = v.msg + ` ${url}`;
                        resolve(v);
                    }).catch(e => {
                        reject(e);
                    });
                });
            });
        };

        // 创建调试文件
        tasks.push(()=>{
            return new Promise((resolve,reject)=>{
                try {
                    // vscode调试配置添加本服务url，以便启动访问
                    vsCodeDebugConfigTpl.configurations.forEach(item => {
                        if(item.name === 'FWS Mocha'){
                            item.program = m.path.join(fws.fwsPath,'node_modules','mocha','bin','_mocha');
                        };
                    });

                    // 目录不存在则创建
                    if(m.pathInfo(vsCodeDebugConfigDirPath).type !== 'dir'){
                        m.fs.mkdirSync(m.path.join(vsCodeDebugConfigPath,'../'));
                    };
                    // 写入调试配置文件
                    m.fs.writeFileSync(vsCodeDebugConfigPath,JSON.stringify(vsCodeDebugConfigTpl,null,4));

                    resolve({
                        status:'success',
                        msg:'创建 vsCode 调试配置文件',
                        data:{
                            data:vsCodeDebugConfigTpl,
                            path:vsCodeDebugConfigPath
                        }
                    });
                } catch (error) {
                    reject({
                        status:'error',
                        msg:'创建 vsCode 调试配置文件失败'
                    });
                };
            });
        });

        //如果有开启快速模式，将不会预先编译项目
        if(!option.fast){
            //将初始化项目任务添加到任务列表
            let initCompileTasks = require('../lib/initCompile_dev')({
                src:fws.srcPath,
                dist:fws.devPath
            });

            tasks.push(...initCompileTasks);
        };

        //开启浏览服务
        if(option.server && option.browse){
            tasks.push(()=>{
                return new Promise((resolve,reject)=>{
                    try {
                        if(fws.listenPort){
                            m.openurl.open('http://'+fws.localIp+':'+fws.listenPort);
                            resolve({
                                status:'success',
                                msg:'浏览项目'
                            });
                        }else{
                            reject({
                                status:'error',
                                msg:'获取不到端口号',
                                info:listenPort
                            });
                        };                        
                    } catch (error) {
                        reject({
                            status:'error',
                            msg:'启动浏览器失败',
                            info:error
                        });
                    };
                });
            });
        };

        //监听文件
        tasks.push(()=>{
            return new Promise((resolve,reject)=>{
                try {
                    let w = m.chokidar.watch(config.src,{persistent:true}),
                        data = {};
                    
                    w.on('all',(stats,filePath)=>{
                        //是否为需要过滤的文件
                        let isFilter = m.isFilter(filePath),
                            taskList = [];

                        if(!isFilter){
                            //是否为精灵图
                            let isSprite = m.isSprite(filePath),
                                isData = m.isData(filePath),
                                fileInfo = m.getFileInfo(filePath),
                                fileType = fileInfo.type,
                                fileName = fileInfo.name,
                                isPublic = fileInfo.isPublic,
                                isVue = fileType === '.vue',
                                isPug = fileType === '.jade' || fileType === '.pug',

                                //是否为图片目录内图片（排除精灵图）
                                isImgDirImgs = (()=>{
                                    let isImgDir = filePath.indexOf(m.path.join(fws.srcPath,'images',m.path.sep)) === 0,
                                        isImg = ['jpg','jpeg','png','gif'].some((item)=>{
                                            return '.'+item === fileType;
                                        });

                                    return isImgDir && isImg && !isSprite;
                                })(),
                                key = isSprite ? '_sprite' : isImgDirImgs ? '_img' : fileType,
                                temp,
                                compileFn = ()=>{
                                    let compile = m.getCompileFn(key),
                                        option = {
                                            debug:true
                                        };
                                    if(isSprite){
                                        //如果是精灵图，编译该精灵图对应的目录
                                        let srcDir = option.srcDir = m.path.dirname(filePath);

                                        option.distSpreiteDir = m.path.resolve(srcDir.replace(config.src,config.dev),'..');
                                        option.distScssDir = m.path.join(config.src,'css','_fws','sprite');
                                        taskList.push(()=>{
                                            return new compile(option);
                                        });
                                    }else if(isData){
                                        compile = m.getCompileFn('.pug');
                                        if(isPublic){
                                            //如果是数据公共文件,则编译所有的jade|pug文件
                                            let files = [],
                                                pugFiles = data['.pug'],
                                                jadeFiles = data['.jade'];
                                            
                                            //将pug和jade的文件添加到文件列表
                                            if(pugFiles){
                                                for(let i in pugFiles){
                                                    files.push(i);
                                                };
                                            };

                                            if(jadeFiles){
                                                for(let i in jadeFiles){
                                                    files.push(i);
                                                };
                                            };

                                            files.forEach((item,index)=>{                                                
                                                option.src = item;
                                                option.dist = m.getDistPath(item,true);
                                                
                                                //根据jade|pug文件路径得到相对应的数据文件路径
                                                let srcInfo = m.getFileInfo(item),
	                                                dataPath = item.replace(
                                                        config.src,
                                                        m.path.join(config.src,'data'+m.path.sep)
                                                    );
	                                                dataPath = m.path.join(
                                                        m.path.dirname(dataPath),
                                                        srcInfo.name+'.js'
                                                    );
                                                    
                                                //检查对应的文件是否存在，如果存在则引入文件
                                                if(m.pathInfo(dataPath).extension === '.js'){
                                                    option.data = fws.require(dataPath);
                                                };

                                                taskList.push(()=>{
                                                    return new compile(option);
                                                });
                                            });
                                        }else{
                                            //非公共的数据文件,内里只编译与之相对应的jade|pug文件
                                            let files = [],

                                                //将与之对应的jade|pug文件路径添加到文件列表
                                                dirPath = filePath.replace(
                                                        m.path.join(config.src,'data'+m.path.sep),
                                                        config.src
                                                    );                                                
                                                files.push(m.path.join(
                                                    m.path.dirname(dirPath),
                                                    fileName+'.jade'
                                                ));
                                                files.push(m.path.join(
                                                    m.path.dirname(dirPath),
                                                    fileName+'.pug'
                                                ));
                                            
                                            //循环文件列表,并检查文件是否有效,如果有效则将编译任务添加到任务列表
                                            files.forEach((item,index)=>{
                                                if(m.pathInfo(item).extension){
                                                    option.src = item;
                                                    option.dist = m.getDistPath(item,true);
                                                    option.data = fws.require(filePath);

                                                    taskList.push(()=>{
                                                        return new compile(option);
                                                    });
                                                };
                                            });
                                        };
                                    }else if(isPublic && data[key]){
                                        //如果公共文件,且有同类型的文件则编译同类型所有文件
                                        for(let i in data[key]){
                                            // option.src = i;
                                            // option.dist = m.getDistPath(i,true);
                                            
                                            let fileInfo = m.getFileInfo(i),
                                                fileType = fileInfo.type,
                                                pugData;
                                            //如果文件是pug或jade扩展名，则尝试获取页面的数据
                                            if(fileType === '.pug' || fileType === '.jade'){
                                                let dataPath = i.replace(
                                                    config.src,
                                                    m.path.join(config.src,'data'+m.path.sep)
                                                );
                                                dataPath = m.path.join(
                                                    m.path.dirname(dataPath),
                                                    fileInfo.name + '.js'
                                                );

                                                //检查对应的文件是否存在，如果存在则引入文件
                                                if(m.pathInfo(dataPath).extension === '.js'){
                                                    pugData = fws.require(dataPath);
                                                };
                                            };

                                            taskList.push(()=>{
                                                //编译选项
                                                let op = {
                                                    src:i,
                                                    dist:m.getDistPath(i,true),                                                    
                                                    debug:true
                                                };

                                                //pug或jade数据有的话，需要增加该项
                                                if(pugData){
                                                    op.data = pugData;
                                                };

                                                return new compile(op);
                                            });
                                        };

                                    }else if(isVue){
                                        let esList = [],
                                            isEs = (type)=>{
                                                return type === '.es' || type === '.es6' || type === '.ts';
                                            };
                                        
                                        //遍历项目目录文件，如果是es、es6、ts文件则添加到文件编译列表
                                        for(let i in data){
                                            if(isEs(i)){
                                                for(let ii in data[i]){
                                                    esList.push(ii);
                                                };
                                            };
                                        };

                                        //遍历所有的文件列表
                                        esList.forEach((item)=>{
                                            option.src = item;
                                            option.dist = m.getDistPath(item,true);

                                            //重新得到文件编译方法
                                            let fileInfo = m.getFileInfo(item);
                                            compile = m.getCompileFn(fileInfo.type);

                                            taskList.push(()=>{
                                                return new compile(option);
                                            });  
                                        });
                                    }else{
                                        //只编译自身即可
                                        option.src = filePath;
                                        option.dist = m.getDistPath(filePath,true);
                                        
                                        if(isPug){
                                            //根据jade|pug文件路径得到相对应的数据文件路径
                                            let dataPath = filePath.replace(
                                                    config.src,
                                                    m.path.join(config.src,'data'+m.path.sep)
                                                );
                                                dataPath = m.path.join(
                                                    m.path.dirname(dataPath),
                                                    fileInfo.name + '.js'
                                                );
                                            
                                            //检查对应的文件是否存在，如果存在则引入文件
                                            if(m.pathInfo(dataPath).extension === '.js'){
                                                option.data = fws.require(dataPath);
                                            };
                                        };

                                        //如果是图片需要同步
                                        if(isImgDirImgs){
                                            taskList.push(()=>{
                                                let cp = m.getCompileFn('copy');
                                                return new cp(option);
                                            }); 
                                        };

                                        //使用与文件对应的方法进行处理
                                        taskList.push(()=>{
                                            return new compile(option);
                                        });                                        
                                    };
                                };

                            switch (stats) {
                                //文件添加，如果文件为非公共文件，则将文件保存到数据中
                                case 'add':
                                    if(data[key] === undefined){
                                        data[key] = {};
                                    };
                                    if(!isPublic && !isData){
                                        data[key][filePath] = null;
                                    };

                                    //如果初始化状态已经完成，则添加的文件也会进行编译处理
                                    if(isInitCompile){
                                        compileFn();
                                    };
                                    
                                    //500ms内wacth无新增加文件响应将初始化状态设置为完成
                                    if(!isInitCompile){
                                        clearTimeout(temp);
                                        temp = setTimeout(()=>{
                                            isInitCompile = true;
                                        },500);
                                    };
                                break;
                                //文件修改
                                case 'change':
                                    compileFn();
                                break;
    
                                //文件删除
                                case 'unlink':
                                    try {
                                        //图片目录，非精灵图删除更新图片base64数据
                                        if(isImgDirImgs){
                                            if(fws.ImgsData === undefined){
                                                let srcDirFiles = _ts.m.getDirFilesPath({
                                                    srcDir:fws.srcPath
                                                });
                                                
                                                taskList.push(()=>{
                                                    return new Promise((resolve,reject)=>{
                                                        new _ts.m.updateImg({
                                                            srcDirFiles:srcDirFiles
                                                        }).then(v => {
                                                            resolve(v);
                                                        }).catch(e => {
                                                            reject(e);
                                                        });
                                                    })
                                                });
                                            }else{
                                                let key = filePath.replace(fws.srcPath,'../').replace(/\\/g,'/');
                                                if(fws.ImgsData[key]){
                                                    delete fws.ImgsData[key];
                                                    taskList.push(()=>{
                                                        return new Promise((resolve,reject)=>{
                                                            m.updateImgData(fws.ImgsData).then(v => {
                                                                resolve(v);
                                                            }).catch(e => {
                                                                reject(e);
                                                            });
                                                        });
                                                    });
                                                };
                                            };
                                        };

                                        //精灵图删除即时更新数据
                                        if(isSprite){
                                            compileFn();
                                        };

                                        delete data[key][filePath];
                                    } catch (error) {
                                        console.log(error);
                                    };
                                break;
                            };

                            //如果有可执行的任务
                            if(taskList.length){
                                let f = async ()=>{
                                    let data = [];
                                    for(let i=0,len=taskList.length; i<len; i++){
                                        let subTask = await taskList[i]();
                                        data.push(subTask);
                                        if(subTask instanceof Array){
                                            subTask.forEach((item,index)=>{
                                                if(item.status === 'success'){
                                                    m.tip.success(item.msg);
                                                };
                                            })
                                        };
                                        if(subTask.status === 'success'){
                                            m.tip.success(subTask.msg);
                                        };
                                    };
                                    return {
                                        status:'success',
                                        msg:'文件监听编译完成',
                                        data:data
                                    };
                                };

                                f().then(v => {
                                    //编译完成，如果有开启server则需要往前台提供刷新服务

                                    if(tsOption.server){
                                        v.data.forEach((item,index)=>{
                                            _ts.server.io.broadcast('refresh',{
                                                status:'success',
                                                path:item.distPath
                                            });
                                        });
                                    };
                                    
                                }).catch(e => {
                                    //编译遇到出错
                                    m.tip.error(e.msg);
                                    console.log(e.info);
                                });
                            };
                        };                                               
                    });

                    resolve({
                        status:'success',
                        msg:'开启文件监听服务'
                    });
                } catch (error) {
                    reject({
                        status:'error',
                        msg:'',
                        info:error
                    });
                };
            });
        });
        
        return tasks;
    }


};


module.exports = {
    regTask:{
        command:'[name]',
        description:'项目监听编译',
        option:[
            ['-b, --browse','浏览器访问项目'],
            ['-s, --server','开启http服务'],
            ['-f, --fast','快速模式，将不会预先编译项目']
        ],
        help:()=>{
            console.log('');
            console.log('   补充说明:');
            console.log('   ------------------------------------------------------------');
            console.log('   暂无');
        },
        action:Watch
    }
};