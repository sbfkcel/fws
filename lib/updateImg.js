'use strict';
/**
 * 根据项目文件信息更新精灵图
 */
 class UpdateImg{
    constructor(option){
        const _ts = this;
        _ts.config = {};
        _ts.m = {
            isSprite:require('./isSprite'),
            path:require('path'),
            getImgInfo:require('./getImgInfo'),
            getDirFilesPath:require('./getDirFilesPath'),
            updateImgData:require('./updateImgData')
        };

        for(let i in option){
            _ts.config[i] = option[i];
        };

        if(_ts.config.src){
            return _ts.updateFile();
        }else{
            return _ts.updateDir();
        };
        
    }
    updateFile(){
        const _ts = this,
            config = _ts.config,
            m = _ts.m;
        
        if(fws.ImgsData === undefined){
            config.srcDirFiles = m.getDirFilesPath({srcDir:fws.srcPath});
            return _ts.updateDir();
        };
        
        let key = config.src.replace(fws.srcPath,'../').replace(/\\/g,'/');
        return new Promise((resolve,reject)=>{
            m.getImgInfo(config.src).then(v => {
                if(v.status === 'success'){
                    let data = v.data;

                    fws.ImgsData = fws.ImgsData || {};
                    fws.ImgsData[key] = {};
                    for(let i in data){
                        fws.ImgsData[key][i] = data[i];
                    };

                    //将JSON对象转换成SASS对象并完成图片数据文件更新
                    m.updateImgData(fws.ImgsData).then(v => {
                        resolve(v);
                    }).catch(e => {
                        reject(e);
                    });
                };
            }).catch(e => {
                reject(e);
            });
        });

    }
    updateDir(){
        const _ts = this,
            m = _ts.m,
            config = _ts.config;

        return new Promise((resolve,reject)=>{
            let imgInfoTasks = [],
                imgInfoData = fws.ImgsData = {},
                data = config.srcDirFiles,
                imgInfoDataString;

            //遍历项目文件，如果是图片的则获取图片信息添加至任务列表
            for(let i in data){
                let isImgList = ['jpg','jpeg','png','gif'].some((item)=>{
                    return '.'+item === i;
                }),
                _isSprite = m.isSprite(i);
                
                if(isImgList && !_isSprite){
                    for(let ii in data[i]){
                        let isImgDir = ii.indexOf(m.path.join(fws.srcPath,'images',m.path.sep)) === 0;
                        if(isImgDir){
                            imgInfoTasks.push(m.getImgInfo(ii));
                        };
                    };
                };
            };

            Promise.all(imgInfoTasks).then(v => {
                //遍历图片任务数据，并生成sass数据文件写入
                v.forEach((item,index)=>{
                    let data = item.data,
                        key = data.path.replace(fws.srcPath,'../').replace(/\\/g,'/');
                    imgInfoData[key] = {};
                    for(let i in data){
                        imgInfoData[key][i] = data[i];
                        //imgInfoData[key]['base64'] = 'base64';
                    };
                });

                //将JSON对象转换成SASS对象并完成图片数据文件更新
                m.updateImgData(imgInfoData).then(v => {
                    resolve(v);
                }).catch(e => {
                    reject(e);
                });

            }).catch(e => {
                reject({
                    status:'error',
                    msg:`图片数据初始化失败`,
                    info:e
                });
            });
        });
    }
 };
 module.exports = UpdateImg;

// class UpdateImg{
//     constructor(option){
//         const _ts = this;

//         let m = _ts.m = {
//                 path:require('path'),
//                 fs:require('fs-extra'),
//                 copy:require('./copy'),
//                 updateImgData:require('./updateImgData'),
//                 getImgInfo:require('./getImgInfo')
//             },
//             config = {};

//         for(let i in option){
//             config[i] = option[i];
//         };

//         let key = config.src.replace(fws.srcPath,'../').replace(/\\/g,'/');

//         return new Promise((resolve,reject)=>{
//             m.getImgInfo(config.src).then(v => {
//                 if(v.status === 'success'){
//                     let data = v.data;

//                     fws.ImgsData = fws.ImgsData || {};
//                     fws.ImgsData[key] = {};
//                     for(let i in data){
//                         fws.ImgsData[key][i] = data[i];
//                     };

//                     // //拷贝文件
//                     // new m.copy(config).then(v => {

//                     // }).catch(e => {
//                     //     reject(e);
//                     // });

//                     //将JSON对象转换成SASS对象并完成图片数据文件更新
//                     m.updateImgData(fws.ImgsData).then(v => {
//                         resolve(v);
//                     }).catch(e => {
//                         reject(e);
//                     });
//                 };
//             }).catch(e => {
//                 reject(e);
//             });
//         }); 
//     }
// };
// module.exports = UpdateImg;