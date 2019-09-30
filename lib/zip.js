const fs = require('fs-extra'),
    path = require('path'),
    pathInfo = require('./getPathInfo'),
    archiver = require('archiver');

module.exports = (filePath,outPath)=>{
    return new Promise((resolve,reject)=>{
        //输入的路径无效则抛出错误
        if(!fs.existsSync(filePath)){
            reject({
                status:'success',
                msg:`${filePath} 不是有效的路径`
            });
        };

        //确保输出目录已经存在
        let outDir = path.dirname(outPath);
        fs.ensureDir(outDir);

        let output = fs.createWriteStream(outPath),                         //压缩包文件流
            zipDirName = path.basename(outPath,path.extname(outPath)),      //压缩包内目录名
            archive = archiver('tar',{
                zlib:{
                    level:9
                }
            });
        
        //完成捕获
        archive.on('end',() => {
            resolve({
                status:'success',
                msg:`${filePath} 压缩成功`
            });
        });

        //错误捕获
        archive.on('error',err => {
            reject({
                status:'error',
                msg:`${filePath} 压缩遇到错误`,
                data:err
            });
        });
    
        archive.pipe(output);
        // archive.directory(filePath,zipDirName);

        let files = fs.readdirSync(filePath);
        files.forEach(item => {
            let itemPath = path.join(filePath,item),
                itemInfo = pathInfo(itemPath),
                isIgnore = (()=>{
                    // 过滤掉所有以'.'开头的文件及目录及'node_modules'目录
                    if(item[0] === '.' || item === 'node_modules'){
                        return true;
                    };

                    // 过滤掉以下文件类型
                    return ['tar','zip','rar'].some(item => {
                        return '.'+item === itemInfo.extension;
                    });
                })();
            
            // 如果不是需要过滤的文件则添加到压缩包
            if(!isIgnore){
                if(itemInfo.type === 'file'){
                    archive.file(itemPath,{name:zipDirName + '/' + item});
                }else{
                    archive.directory(itemPath,zipDirName + '/' + item);
                };
            };
            
        });
        archive.finalize();
    });
};