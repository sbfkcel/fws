'use strict';
/**
 * 图片压缩处理
 * - 用于压缩png、svg、jpeg等图片
 * 
 * @class Compile
 * {
 *  src:'',                 <string> 源文件路径
 *  dist:'',                <string> 输出路径
 * }
 */
class Compile{
    constructor(option){
        const _ts = this;

        option = option || {};

        let m = _ts.m = {
                fs:require('fs-extra'),
                path:require('path'),
                pathInfo:require('../lib/getPathInfo'),
                copy:require('../lib/copy'),
                Svgo:require('svgo'),
                imagemin:require('imagemin'),
                imagemin_pngquant:require('imagemin-pngquant'),
                imagemin_jpegrecompress:require('imagemin-jpeg-recompress'),
                imagemin_gifsicle:require('imagemin-gifsicle')
            },            
            config = _ts.config = {};

        //配置写入到_ts.config
        for(let i in option){
            config[i] = option[i];
        };
        let src = config.src,
            dist = config.dist;

        return _ts.taskList();
    }

    taskList(){
        const _ts = this,
            m = _ts.m,
            config = _ts.config;

        return new Promise((resolve,reject)=>{
            
            //读取文件内容
            let distDir = m.path.dirname(config.dist),
                extension = m.pathInfo(config.src).extension,
                isImg = (()=>{
                    let type = ['png','jpg','jpeg','svg','gif'];
                    return type.some(item => {
                        return extension === '.'+item;
                    });
                })();

            if(isImg){
                //svg格式处理
                if(extension === '.svg'){
                    //读取svg内容
                    let svgContent = m.fs.readFileSync(config.src);

                    //压缩svg
                    new m.Svgo({}).optimize(svgContent,result => {                        
                        svgContent = result.data;
                    });

                    //写入新的压缩文件
                    m.fs.ensureDir(distDir,err => {
                        if(err){
                            reject({
                                status:'error',
                                msg:`${distDir} 创建失败`,
                                infor:err
                            });
                        };
                        try{
                            m.fs.writeFileSync(config.dist,svgContent);
                            resolve({
                                status:'success',
                                msg:`写入 ${config.dist}`,
                                data:svgContent
                            });
                        }catch(err){
                            reject({
                                status:'error',
                                msg:`写入 ${config.dist}`,
                                info:err
                            });
                        };
                    });
                }

                //其它格式（jpg、jpeg、png）处理
                else{
                    //得到原始文件大小，好作比较
                    let originalSize = m.fs.readFileSync(config.src).length,
                        useList = undefined,
                        imgmini = (optimization,callback) => {
                            //gif压缩选项，如果不是gif则不需要
                            if(extension === '.gif'){
                                useList = [
                                    m.imagemin_gifsicle({
                                        optimizationLevel:3,
                                        interlaced:false,
                                        colors:200
                                    })
                                ];
                            };
                            m.imagemin([config.src],'',{
                                plugins:[
                                    m.imagemin_jpegrecompress({
                                        quality:'high',
                                        accurate:true,
                                        method:optimization,
                                        min:40,
                                        max:90,
                                        loops:6
                                    }),
                                    m.imagemin_pngquant({
                                        nofs:false,
                                        speed:1,
                                        quality:'0-100'
                                    })
                                ],
                                use:useList
                            }).then(result => {
                                if(typeof callback === 'function'){
                                    callback(result);
                                };
                            });
                        };
                    
                    //尝试使用ssim方式先压缩，如果压缩结果没有变小则进行深层压缩
                    imgmini('ssim',result => {
                        let img = result[0].data,
                            imgSize = img.length;

                        //新图片如果小于原始结果则保存结果
                        if(imgSize < originalSize){
                            //写入新的压缩文件
                            m.fs.ensureDir(distDir,err => {
                                if(err){
                                    reject({
                                        status:'error',
                                        msg:`${distDir} 创建失败`,
                                        infor:err
                                    });
                                };
                                try{
                                    m.fs.writeFileSync(config.dist,img);
                                    resolve({
                                        status:'success',
                                        msg:`写入 ${config.dist}`,
                                        data:img
                                    });
                                }catch(err){
                                    reject({
                                        status:'error',
                                        msg:`写入 ${config.dist}`,
                                        info:err
                                    });
                                };
                            });
                        }else{
                            imgmini('ms-ssim',result => {
                                let img = result[0].data,
                                    imgSize = img.length;

                                //写入新的压缩文件
                                m.fs.ensureDir(distDir,err => {
                                    if(err){
                                        reject({
                                            status:'error',
                                            msg:`${distDir} 创建失败`,
                                            infor:err
                                        });
                                    };

                                    //进行深层压缩，如果依然不能优化则Copy
                                    if(imgSize < originalSize){
                                        try{
                                            m.fs.writeFileSync(config.dist,img);
                                            resolve({
                                                status:'success',
                                                msg:`写入 ${config.dist}`,
                                                data:img
                                            });
                                        }catch(err){
                                            reject({
                                                status:'error',
                                                msg:`写入 ${config.dist}`,
                                                info:err
                                            });
                                        };
                                    }else{
                                        new m.copy({
                                            src:config.src,
                                            dist:config.dist
                                        }).then(v => {
                                            resolve(v);
                                        }).catch(e => {
                                            reject(e);
                                        });
                                    };
                                });
                            });
                        };

                    })
                    

                };
            }else{
                reject({
                    status:'error',
                    msg:`${config.src} 不是有效的 PNG|JPG|JPEG|SVG 文件`
                });
            };
        });
    }
}
module.exports = Compile;
