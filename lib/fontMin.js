/**
 * fontface字体精简
 * @memberOf Watch
 */
module.exports = (option)=>{    
    const {path,FontFaceExtract,Fontmin,getDirFilesPath,tip} = {
        path:require('path'),
        FontFaceExtract:require('font-face-extract'),
        Fontmin:require('fontmin'),
        getDirFilesPath:require('./getDirFilesPath'),
        tip:require('./tip')
    };

    let src = option.src,
        dist = option.dist,
        tasks = [];
    
    //分析输入目录文件信息
    return ()=>{
        return new Promise((resolve,reject)=>{
            let scrDirData = getDirFilesPath({
                srcDir:src,
                ignore_:false           //不排除以"_"开始的文件
            });

            //项目中无ttf字体则不作处理
            let ttfFile = scrDirData['.ttf'];
            if(scrDirData['.ttf'] === undefined){
                resolve({
                    status:'success',
                    msg:'项目中未使用到自定义字体'
                });
                return;
            };

            let htmlFile = [];
            
            //将项目中所有html、html文件保存到htmlFile数组中;
            let htmls = scrDirData['.html'],
                htms = scrDirData['.htm'];
            if(htmls){
                for(let i in htmls){
                    htmlFile.push(i);
                };
            };
            if(htms){
                for(let i in htms){
                    htmlFile.push(i);
                };
            };

            //如果项目中无html文件放弃处理
            if(htmlFile.length === 0){
                resolve({
                    status:'success',
                    msg:'项目中未找到html、htm文件'
                });
                return;
            };


            //有html、htm文件则开始分析页面
            let extract = new FontFaceExtract({
                src:htmlFile
            });

            extract.then(v => {
                let result = v.data.result;
                if(JSON.stringify(result) === '{}'){
                    resolve({
                        status:'success',
                        msg:'未分析出页面中有使用自定义字体'
                    });
                }else{
                    //字体任务转换队列
                    let fontMinTask = [];
                 
                    for(let i in result){
                        fontMinTask.push(()=>{
                            return new Promise((resolve,reject)=>{
                                let srcFile = i,                                    // 字体源文件
                                    distDir = path.dirname(i.replace(src,dist));    // 输出路径
                                    
                                let fontmin = new Fontmin()
                                    .src(srcFile)                                   // 输入配置
                                    .use(Fontmin.glyph({                            // 字型提取插件
                                        text:result[i]                              // 所需文字
                                    }))
                                    .use(Fontmin.ttf2eot())                         // eot 转换插件
                                    .use(Fontmin.ttf2woff())                        // woff 转换插件 
                                    .use(Fontmin.ttf2svg())                         // svg 转换插件
                                    .dest(distDir);
        
                                //开始转换
                                fontmin.run((err,files,stream)=>{
                                    if(err){
                                        reject({
                                            status:'error',
                                            msg:'字体精简过程遇到错误',
                                            data:err
                                        });
                                    }else{
                                        resolve({
                                            status:'success',
                                            msg:'完成字体精简',
                                            data:{
                                                srcFile:srcFile,
                                                outData:files
                                            }
                                        });
                                    };
                                });
                            });
                        });                        
                    };

                    //执行字体转换任务
                    let f = async ()=> {
                        let data = [];
                        for(let i=0,len=fontMinTask.length; i<len; i++){
                            let subTask = await fontMinTask[i]();
                            data.push(subTask);
                            if(subTask.status === 'success'){
                                tip.success(`精简 ${subTask.data.srcFile}`);
                            };
                        };
                        return {
                            status:'success',
                            msg:'字体精简完成',
                            data:data
                        };
                    };

                    //将转换的结果返回到主任务
                    f().then(v => {
                        resolve(v);
                    }).catch(e => {
                        reject(e);
                    });
                };
            }).catch(e => {
                reject(e);
            });
        });
    };

}