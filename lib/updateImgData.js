//更新图片数据
module.exports = (obj)=>{
    
    obj = obj || fws.ImgsData;

    const fs = require('fs-extra'),
        path = require('path');

    let dataString,
        imgDataPath = path.join(fws.srcPath,'css','_fws','_imagesData.scss'),
        imgDataDir = path.dirname(imgDataPath);

    //将JSON对象转换成SASS对象
    dataString = JSON.stringify(obj,null,2).replace(/\{/g,'(').replace(/\}/g,')');
    dataString = `@charset "utf-8";\r\n//Updated by FWS. ${new Date}\r\n$_imagesData:${dataString}`;

    return new Promise((resolve,reject)=>{
        fs.ensureDir(imgDataDir,err => {
            if(err){
                reject({
                    status:'error',
                    msg:`创建 ${imgDataDir}`,
                    info:err
                });
            };
    
            //写入_fws/_imagesData.scss文件
            try {
                fs.writeFileSync(imgDataPath,dataString);
                resolve({
                    status:'success',
                    msg:`写入 ${imgDataPath}`,
                    data:dataString,
                    distPath:imgDataPath
                });
            } catch (err) {
                reject({
                    status:'error',
                    msg:`写入 ${imgDataPath}`,
                    info:err,
                    distPath:imgDataPath
                });
            };
        });
    });
    
};