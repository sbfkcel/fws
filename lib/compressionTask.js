/**
 * 项目文件压缩
 * @memberOf Watch
 */
module.exports = (option)=>{
    const {fs,path,tip,api,pathInfo,getDirFilesPath,getFileInfo,getCompileFn,getDistPath} = {
        fs:require('fs-extra'),
        path:require('path'),
        tip:require('./tip'),
        api:require('../api'),
        pathInfo:require('./getPathInfo'),
        getDirFilesPath:require('./getDirFilesPath'),      //获取目录文件数据
        getFileInfo:require('./getFileInfo'),              //获取指定文件的相关信息
        getCompileFn:require('./getCompileFn'),            //根据文件类型来获取编译方法
        getDistPath:require('./getDistPath')
    };

    let src = option.src,
        dist = option.dist,
        isMobile = option.isMobile,
        isBeautify = option.isBeautify,
        tasks = [],
        getCompressionFn = (type)=>{
            let fn;
            switch (type) {
                //页面
                case '.html':
                    fn = api.compileHtml;
                break;

                //样式
                case '.css':
                    fn = api.compileCss;
                break;

                //小程序样式
                case '.wxss':
                    fn = api.compileCss;
                break;

                //JS
                case '.js':
                    fn = api.compileJs;
                break;

                //图片
                case '.png':case '.jpg':case '.jpeg':case '.svg':case '.gif':
                    fn = api.compileImg;
                break;
                
                //其它
                default:
                    fn = api.Copy;
                break;
            };
            return fn;
        };
    
    //清空生产目录
    tasks.push(()=>{
        return new Promise((resolve,reject)=>{
            //先尝试直接删除目录
            fs.remove(dist,err => {
                //如果目录删除失败即遍历目录内所有的文件删除即可
                if(err){
                    let files = fs.readdirSync(dist);
                    files.forEach(item => {
                        let fileOrDirpath = path.join(dist,item);
                        try {
                            fs.removeSync(fileOrDirpath);
                            resolve({
                                status:'success',
                                msg:`清空 ${dist}`
                            });
                        } catch (error) {
                            reject({
                                status:'error',
                                msg:`清除  ${fileOrDirpath} 失败，请检查文件是否被其它程序占用`,
                                info:error
                            });
                        };
                    });                    
                }else{
                    resolve({
                        status:'success',
                        msg:`清空 ${dist}`
                    });
                };
            });
        });
    });

    //压缩项目文件
    tasks.push(()=>{
        return new Promise((resolve,reject)=>{
            let taskList = [],
                data = getDirFilesPath({
                    srcDir:src,
                    ignoreDir:[],           //不排除任何目录
                    ignore_:false           //不排除以"_"开始的文件
                });
            for(let i in data){
                for(let ii in data[i]){
                    let fileInfo = getFileInfo(ii),
                        fileType = fileInfo.type,
                        fileName = fileInfo.name,
                        CompressionFn = getCompressionFn(fileType);
                    
                    taskList.push(()=>{
                        return new CompressionFn({
                            src:ii,
                            dist:ii.replace(src,dist),
                            isMobile:isMobile,
                            isBeautify:isBeautify
                        });
                    });
                    
                };
            };

            //将编译任务异步执行
            let f = async ()=>{
                for(let i=0,len=taskList.length; i < len; i++){
                    let subTask = await taskList[i]();
                    if(subTask instanceof Array){
                        subTask.forEach((item,index)=>{
                            if(item.status === 'success'){
                                tip.success(item.msg);
                            };
                        });
                    };
                    if(subTask.status === 'success'){
                        tip.success(subTask.msg);
                    };
                };
                return {
                    status:'success',
                    msg:'目录文件压缩完成'
                };
            };

            f().then(v => {
                //isInitCompile = true;
                resolve(v);
            }).catch(e => {
                tip.error(e.msg);
                reject(e);
            });
        });
    });
    

    return tasks;
}