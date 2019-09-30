class Build{
    constructor(srcPath,options){
        const _ts = this;

        let m = _ts.m = {
                fs:require('fs-extra'),
                path:require('path'),
                tip:require('../lib/tip'),
                pathInfo:require('../lib/getPathInfo'),
                isFwsDir:require('../lib/isFwsDir'),
                ReplaceTask:require('../lib/replaceTask'),
                compressionTask:require('../lib/compressionTask'),
                simplifyFont:require('../lib/simplifyFont'),
                fontmin:require('fontmin')
            },
            config = _ts.config = {},
            option = _ts.option = options;
        
        config.src = fws.srcPath = typeof srcPath === 'string' ? m.path.join(fws.cmdPath,srcPath,'src'+m.path.sep) : fws.srcPath;
        config.dev = fws.devPath = m.path.join(config.src,'..','dev'+m.path.sep);
        config.dist = fws.distPath = m.path.join(config.src,'..','dist'+m.path.sep);
    }

    //初始化
    init(){
        const _ts = this;

        let m = _ts.m,
            config = _ts.config,
            tasks = _ts.taskList(),
            f = async ()=>{
                for(let i=0,len=tasks.length; i<len; i++){
                    let task = await tasks[i]();
                    if(task.status === 'success'){
                        m.tip.success(task.msg);
                    }else if(task.status === 'part'){
                        console.log('');
                        console.log(task.msg);
                        console.log('----------------------------------------');                        
                    };
                };
                return '编译完成。';
            };
        
        f().then(v => {
            console.log('');
            m.tip.highlight('========================================');
            m.tip.highlight(v);
            m.tip.highlight('========================================');
        }).catch(e => {
            m.tip.error(e.msg);
            console.log('error',e);
        });
    }

    //taskList
    taskList(){
        const _ts = this;
        
        let m = _ts.m,
            config = _ts.config,
            option = _ts.option,
            tasks = [];
        
        //备份文件，如果不是fws项目目录且未强制启用不备份功能则需要备份文件
        let projectDir = m.path.join(config.src,'..'),                                  //项目目录
            backupDirName = m.pathInfo(projectDir).name+'_fwsBackup'+(+new Date),       //备份目录名
            backupDirPath = m.path.join(projectDir,'..',backupDirName),                 //备份目录路径
            isFwsDir = m.isFwsDir(projectDir);                                          //是否为fws项目目录
        
        //非fws项目需要先备份目录
        if(!isFwsDir){
            tasks.push(()=>{
                return new Promise((resolve,reject)=>{
                    //创建备份目录
                    m.fs.ensureDir(backupDirPath).then(v => {
                        //开始复制文件
                        m.fs.copy(projectDir,backupDirPath).then(v => {
                            resolve({
                                status:'success',
                                msg:`备份 ${projectDir} -> ${backupDirPath}`,
                                data:backupDirPath
                            });
                        }).catch(e => {
                            reject({
                                status:'error',
                                msg:`${projectDir} 备份失败`,
                                info:e
                            });
                        });
                    }).catch(e => {
                        reject({
                            status:'error',
                            msg:`${backupDirPath} 创建失败`,
                            infor:e
                        });
                    });                    
                });
            });
        }else{
            //初始化项目
            tasks.push(_ts.insertPart('初始化：'));

            //将初始化项目任务添加到任务列表
            let initCompileTasks = require('../lib/initCompile_dev')({
                src:fws.srcPath,
                dist:fws.devPath
            });
            tasks.push(...initCompileTasks);


            //项目编译关键字替换
            let replaceRule = fws.config.distReplace;
            if(replaceRule){
                tasks.push(_ts.insertPart('关键字匹配替换：'));

                //得到目录内的所有文件url路径
                let replaceTask = new m.ReplaceTask({
                    src:fws.devPath,
                    rule:replaceRule
                });
                tasks.push(replaceTask);
            };
        };
        
        //项目文件压缩
        tasks.push(_ts.insertPart('文件压缩处理：'));
        let compressionTask = m.compressionTask({
            src:isFwsDir ? fws.devPath : backupDirPath,
            dist:isFwsDir ? fws.distPath : projectDir,
            isMobile:option.mobile,                     //是否为移动端
            isBeautify:option.beautify                  //是否格式化代码
        });        
        tasks.push(...compressionTask);

        //css Base64压缩
        tasks.push(_ts.insertPart('CSS inline-image Base64编码压缩'));
        let cssBase64Simplify = require('../lib/cssBase64Simplify');
        tasks.push(cssBase64Simplify({
            src:isFwsDir ? fws.distPath : projectDir,
            dist:isFwsDir ? fws.distPath : projectDir
        }));

        //字体文件精简
        if(isFwsDir){
            tasks.push(_ts.insertPart('字体文件精简：'));        
            let simplifyFont = require('../lib/fontMin');
            tasks.push(
                simplifyFont({
                    src:isFwsDir ? fws.devPath : backupDirPath,
                    dist:isFwsDir ? fws.distPath : projectDir
                })
            ); 
        };
               
        return tasks;
    }

    //insertPart
    insertPart(partTitle){
        return ()=>{
            return new Promise((resolve,reject)=>{
                resolve({
                    status:'part',
                    msg:partTitle
                })
            });
        }
    }
    
};


module.exports = {
    regTask:{
        command:'[name]',
        description:'编译项目',
        option:[
            ['-m, --mobile','移动端模式，css样式将不会添加全部前缀'],
            ['-b, --beautify','css、js文件格式化，不被压缩 ']
        ],
        help:()=>{
            console.log('');
            console.log('   补充说明:');
            console.log('   ------------------------------------------------------------');
            console.log('   暂无');
        },
        action:Build
    }
};