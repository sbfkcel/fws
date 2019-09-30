/**
 * 项目文件压缩
 * @memberOf Watch
 */
module.exports = (option)=>{
    const fs = require('fs-extra'),
        path = require('path'),
        tip = require('./tip'),
        getImgInfo = require('./getImgInfo'),
        getDirFilesPath = require('./getDirFilesPath');      //获取目录文件数据

    let config = {};

    for(let i in option){
        config[i] = option[i];
    };

    return ()=>{
        return new Promise((resolve,reject)=>{
            //读取目录中所有文件
            let distDirFiles = getDirFilesPath({
                srcDir:config.src,
                ignoreDir:[],           //不排除任何目录
                ignore_:false           //不排除以"_"开始的文件
            }),
            distImgsData = {},          //dist/images目录图片数据
            cssFiles = (()=>{
                let cssListObj = distDirFiles['.css'],
                    temp = [];
                if(cssListObj){
                    for(let i in cssListObj){
                        temp.push(i);
                    };
                };
                return temp;
            })(),
            imgFiles = (()=>{
                let temp = [];
    
                //遍历以几类图片列表，将文件属于dist/images目录中的图片筛选出来
                ['jpg','jpeg','png','gif'].forEach((item)=>{
                    item = distDirFiles['.'+item];
                    if(item){
                        for(let i in item){
                            if(i.indexOf(path.join(config.dist,'images',path.sep)) === 0){
                                temp.push(i);
                            };  
                        };
                    };
                });
                return temp;    
            })(),
            getImgsDataTask = (()=>{
                let task = [];
                if(imgFiles.length){
                    imgFiles.forEach((item)=>{
                        task.push(getImgInfo(item));
                    });
                    return Promise.all(task);
                }else{
                    return undefined;
                };
            })();
    
            if(!cssFiles.length){
                resolve({
                    status:'success',
                    msg:'无有效的CSS文件需要进行压缩'
                });
            };
    
            if(getImgsDataTask){
                getImgsDataTask.then(v => {
                    //将dist/images目录内图片数据组织到成为JSON格式
                    v.forEach((item)=>{
                        if(item.status === 'success'){
                            let data = item.data,
                                key = data.path.replace(config.dist,'../').replace(/\\/g,'/');
                            distImgsData[key] = data;
                        };
                    });
    
                    cssFiles.forEach((item,index)=>{
                        let css = fs.readFileSync(item).toString(),
                            newCss;
                        
                        for(let i in distImgsData){
                            //将src/images中的数据(base64)替换为dist/images中优化过后的数据(base64)
                            if(fws.ImgsData[i] && distImgsData[i] && fws.ImgsData[i]['base64'] && distImgsData[i]['base64']){
    
                                //使用数据分开再合并法，拼接新的CSS
                                newCss = (()=>{
                                    let c = css.split(fws.ImgsData[i]['base64']),
                                        temp = '';
                                    c.forEach((item,index)=>{
                                        if(index < c.length - 1){
                                            //temp += item + distImgsData[i]['base64'];
                                            temp += item + distImgsData[i]['base64'];
                                        }else{
                                            temp += item;
                                        }; 
                                    });
                                    return temp;
                                })();
                            };
                        };
    
                        //如果新压缩的CSS小于
                        if(newCss && css && newCss.length < css.length){
                            //创建目录并写入文件
                            let distDir = path.dirname(item);
                            fs.ensureDir(distDir,err => {
                                if(err){
                                    reject({
                                        status:'error',
                                        msg:`创建失败 ${distDir}`,
                                        info:err
                                    });
                                };
                                
                                //写入css文件
                                try {
                                    fs.writeFileSync(item,newCss);
                                    tip.success(`更新 ${item}`);
                                    if(index === cssFiles.length - 1){
                                        resolve({
                                            status:'success',
                                            msg:'CSS inline-image 压缩处理完成'
                                        });
                                    };
                                } catch (err) {
                                    reject({
                                        status:'error',
                                        msg:`写入失败 ${item}`,
                                        distPath:item,
                                        info:err
                                    });
                                };
                            });
                        }else if(index === cssFiles.length - 1){
                            resolve({
                                status:'success',
                                msg:'CSS inline-image 压缩处理完成'
                            });
                        };  
                    });
                });
            }else{
                resolve({
                    status:'success',
                    msg:config.dist+'目录无有效图片需要进行base64转换'
                });
            };
        });
    };   
}