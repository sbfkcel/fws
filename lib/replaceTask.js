/**
 * 文件关键字替换
 * @memberOf Watch
 */
class ReplaceTask {
    constructor(option){
        const _ts = this;

        option = option || {};

        let m = _ts.m = {
            fs:require('fs-extra'),
            path:require('path'),
            pathInfo:require('./getPathInfo'),
            getDirFilesPath:require('./getDirFilesPath'),
            tip:require('./tip')
        },
        config = _ts.config = {};

        //配置写入到_ts.config
        for(let i in option){
            config[i] = option[i];
        };

        return ()=>{
            return new Promise((resolve,reject)=>{
                let taskList = _ts.taskList(),
                    result = {
                        status:'success'
                    },
                    f = async ()=>{
                        for(let i=0,len=taskList.length; i<len; i++){
                            let subTask = await taskList[i]();
                            if(subTask.status === 'success'){
                                m.tip.success(subTask.msg);
                            };
                        };
                        result.msg = '关键字匹配替换完成';
                        return result;
                    };
                if(taskList.length === 0){
                    result.msg = '无需要匹配替换的文件';
                    resolve(result);
                    return;
                };

                f().then(v => {
                    resolve(v);
                }).catch(e => {
                    reject(e);
                });
            });
        };
    }
    taskList(){
        const _ts = this,
            m = _ts.m,
            config = _ts.config,
            rule = config.rule;
            
        let tasks = [],

            //获取目录内所有文件
            data = m.getDirFilesPath({
                srcDir:config.src,
                ignoreDir:[],           //不排除任何目录
                ignore_:false           //不排除以"_"开始的文件
            });

            //遍历替换规则，如果类型为'*'则会匹配所有的`.js`、`.css`、`.html`、`.htm`、`.json`、`.xml`文件，否则只匹配替换指定类型的文件
            for(let i in rule){
                if(i === '*'){
                    let allType = ['js','css','html','htm','json','xml'];
                    allType.forEach(item => {
                        if(data['.'+item]){
                            for(let file in data['.'+item]){
                                tasks.push(
                                    ()=>{
                                        return _ts.replace({
                                            src:file,
                                            dist:file,
                                            rule:rule[i]
                                        })
                                    }                                    
                                );
                            };
                        };
                    });
                }else if(data[i]){
                    for(let file in data[i]){
                        tasks.push(
                            ()=>{
                                return _ts.replace({
                                    src:file,
                                    dist:file,
                                    rule:rule[i]
                                })
                            }
                        );
                    };
                };
            };
        return tasks;
    }
    replace(option){
        const _ts = this,
            m = _ts.m;
        let src = option.src,
            dist = option.dist,
            rule = option.rule,
            distDir = m.path.dirname(src);

        let fileInfo = m.pathInfo(src);
        return new Promise((resolve,reject)=>{
            //如果不是有效的文件，返回失败
            if(fileInfo.type !== 'file'){
                reject({
                    status:'error',
                    msg:`文件不存在 ${src}`
                });
            };

            let fileContent = m.fs.readFileSync(src).toString();
            rule.forEach(item => {
                let find = item.find,
                    replace = item.replace;
                
                //遍历全局变量，如果需要查找的有全局变量，此处需要用全局变量对应的值进行替换
                for(let i in fws.globalReplace){
                    if(find.indexOf(i) > -1){
                        find = find.replaceAll(i,fws.globalReplace[i]);
                    };
                };

                //如果传入的查询关键是是字符串，则转换为正则。否则还是使用正则
                if(typeof find === 'string'){
                    fileContent = fileContent.replaceAll(find,replace);
                }else{
                    fileContent = fileContent.replace(find,replace);
                };

                m.fs.ensureDir(distDir,err => {
                    if(err){
                        reject({
                            status:'error',
                            msg:`${distDir} 创建错误`,
                            info:err
                        });
                    }else{
                        try {
                            m.fs.writeFileSync(dist,fileContent);
                            resolve({
                                status:'success',
                                msg:`写入 ${dist}`,
                                distPath:dist,
                                data:fileContent
                            });
                        } catch (error) {
                            reject({
                                status:'error',
                                msg:`写入失败 ${dist}`,
                                distPath:dist,
                                info:error
                            });
                        };
                    };
                });
            });

        });
    }

};

module.exports = ReplaceTask;