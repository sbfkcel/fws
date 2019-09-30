'use strict';

/**
 * 精灵图生成
 * 
 * @class OutSprite
 * {
 *  srcDir:'',                  <string> 源文件路径
 *  distSpreiteDir:'',          [string] 精灵图输出目录
 *  distScssDir:''              [string] scss输出目录
 * }
 */
class OutSprite{
    constructor(option){
        const _ts = this;

        option = option || {};

        let m = _ts.m = {
                path:require('path'),
                fs:require('fs-extra'),
                spritesmith:require('spritesmith'),
                svgstore:require('svgstore'),
                pathInfo:require('./getPathInfo')
            },
            config = _ts.config = {};

        //配置写入到_ts.config
        for(let i in option){
            config[i] = option[i];
        };

        return new Promise((resolve,reject)=>{
            //检查目录是否存在
            if(m.pathInfo(config.srcDir).type === 'dir'){
                _ts.init().then(v => {
                    resolve(v);
                }).catch(e => {
                    reject(e);
                });
            }else{
                reject({
                    status:'error',
                    msg:`${config.srcDir} 不是有效的目录`
                });
            };
        });
    }

    init(){
        const _ts = this,
            m = _ts.m,
            config = _ts.config;
        
        let srcDirName = (()=>{
            let pathDirs = config.srcDir.split(m.path.sep);
            return pathDirs[pathDirs.length-1];
        })(),
        
        spriteTaskList = [],
        
        imgList = _ts.getImgList();


        //处理svg图片
        spriteTaskList.push(new Promise((resolve,reject)=>{
            //处理svg图片
            if(imgList.svg.length){
                let svgstore = m.svgstore(),
                    dist = m.path.join(config.distSpreiteDir,srcDirName+'.svg');
                
                //将svg图片添加到svgstore
                imgList.svg.forEach((item,index)=>{
                    let svgElementName = m.path.basename(item,m.path.extname(item));
                    svgstore.add(svgElementName,m.fs.readFileSync(item,'utf8'));
                });

                //写入文件
                m.fs.ensureDir(config.distSpreiteDir,err => {
                    if(err){
                        reject({
                            status:'error',
                            msg:`创建失败 ${config.distSpreiteDir}`,
                            info:err
                        });
                    }else{
                        try {
                            m.fs.writeFileSync(dist,svgstore);
                            resolve({
                                status:'success',
                                msg:`SVG精灵 ${config.srcDir}`,
                                data:svgstore.toString()
                            });
                        } catch (err) {
                            reject({
                                status:'error',
                                msg:`写入失败 ${dist}`,
                                info:err
                            });
                        };
                    };
                });                
            }else{
                resolve({
                    status:'success',
                    msg:'目录无Svg图片要处理'
                });
            };
        }));

        

        //处理png精灵图片
        spriteTaskList.push(new Promise((resolve,reject)=>{
            if(imgList.png.length){
                //tl,bl

                //设置选项
                let option = {
                    src:imgList.png,                //png图片列表
                    padding:4,                      //图片间隙大小
                    algorithm:'binary-tree',         //图片对齐方式
                    algorithmOpts:{
                        sort:false
                    }
                };

                (()=>{
                    let rule = srcDirName.split('_'),
                        temp = +rule[rule.length - 1],
                        isAlgorithms = (type)=>{
                            let tempType = 'binary-tree';
                            switch (type) {
                                case 'td':
                                    tempType = 'top-down';
                                    break;
                                case 'lr':
                                    tempType = 'left-right';
                                    break;
                                case 'd':
                                    tempType = 'diagonal';
                                    break;
                                case 'ad':
                                    tempType = 'binary-tree';
                                    break;
                            };
                            return tempType;
                        };

                    option.padding = isNaN(temp) ? 4 : temp;
                    option.algorithm = isNaN(temp) ? isAlgorithms(rule[rule.length - 1]) : isAlgorithms(rule[rule.length - 2]);
                })();

                //如果配置中有声明图像处理引擎，则传入引擎到配置中
                if(fws.config.imgEngine !== '' && typeof fws.config.imgEngine === 'string'){
                    option.engine = require(fws.config.imgEngine);
                };

                //生成png精灵图、sass文件、以及更新项目精灵图索引（sass）
                let pngMotor = (err,result)=>{
                    if(err){
                        reject({
                            status:'error',
                            msg:`编译出错 ${config.srcDir} *.png`,
                            info:err
                        });
                    }else{
                        //精灵图数据
                        let spriteData = {
                                size:{},
                                spriteNames:[],                    
                                element:{},
                                url:'',
                                path:''                            
                            },

                            //精灵图目录名称
                            dirName = (()=>{
                                let pathDirs = config.srcDir.split(m.path.sep);
                                return pathDirs[pathDirs.length-1];
                            })(),

                            //sass文件输出路径
                            spriteSassDistPath = m.path.join(config.distScssDir,'_spriteData',dirName+'.scss'),

                            //sass文件输出目录
                            spriteSassDistDir = m.path.dirname(spriteSassDistPath),
                            
                            //精灵图输出路径
                            spriteDist = m.path.join(config.distSpreiteDir,srcDirName+'.png');

                        let outTask = [];
                        
                        //保存精灵图图片
                        outTask.push(()=>{
                            return new Promise((resolve,reject)=>{
                                if(result.image){
                                    m.fs.ensureDir(config.distSpreiteDir,err => {
                                        if(err){
                                            resolve({
                                                status:'error',
                                                msg:`创建失败 ${config.distSpreiteDir}`,
                                                info:err
                                            });
                                        }else{
                                            try {
                                                m.fs.writeFileSync(spriteDist,result.image);
                                                resolve({
                                                    status:'success',
                                                    msg:`生成 ${spriteDist}`,
                                                    distPath:spriteDist,
                                                    data:result.image
                                                });
                                            } catch (err) {
                                                reject({
                                                    status:'error',
                                                    msg:`写入失败 ${spriteDist}`,
                                                    distPath:spriteDist,
                                                    info:err
                                                });
                                            };
                                        }
                                    });                                    
                                };
                            });
                        });
                         
                        //保存精灵图SASS
                        outTask.push(()=>{
                            return new Promise((resolve,reject)=>{
                                //得到精灵图的url
                                spriteData.url = (()=>{
                                    let sPath = '';
                
                                    //如果不是在fws环境下使用，图片url为文件名，否则根据fws.devPath的目录来生成相对的
                                    if(global.fws){
                                        let surl = spriteDist.replace(fws.devPath,'');
                                            //sPath = '..';
                                        surl = surl.split(_ts.m.path.sep);
                                        surl.forEach((item,index)=>{
                                            if(item !== ''){
                                                let sep = !sPath ? '' : '/';
                                                sPath += sep+item;
                                            };
                                        });
                                    }else{
                                        sPath = dirName+'.png';
                                    };                    
                                    return sPath;
                                })();
                                
                                //得到精灵图输出路径
                                spriteData.path = spriteDist;
                
                                //精灵图元素数据
                                if(result.coordinates){
                                    for(let i in result.coordinates){
                                        let fileType = _ts.m.path.extname(i),
                                            fileName = _ts.m.path.basename(i,fileType);
                                        spriteData.spriteNames.push(fileName);
                                        spriteData.element[fileName] = result.coordinates[i];
                                    };
                                };
                                spriteData.spriteNames = '_!@!&_'+spriteData.spriteNames.toString()+'_&!@!_';
                
                                //精灵图大小
                                if(result.properties){
                                    spriteData.size.width = result.properties.width;
                                    spriteData.size.height = result.properties.height;
                                };
    
                                //将对象数据转为sass字符串 
                                let sSpriteData = JSON.stringify(spriteData,null,2);
                
                                sSpriteData = sSpriteData.replace('"_!@!&_','(');
                                sSpriteData = sSpriteData.replace('_&!@!_"',')');
                                sSpriteData = sSpriteData.replace(/{/g,'(');
                                sSpriteData = sSpriteData.replace(/}/g,')');
                
                                sSpriteData = '$'+dirName+': '+sSpriteData;
    
                                //保存sass 文件
                                m.fs.ensureDir(spriteSassDistDir,err => {
                                    if(err){
                                        reject({
                                            status:'error',
                                            msg:`创建失败 ${spriteSassDistDir}`,
                                            info:err
                                        });
                                    }else{
                                        try {
                                            m.fs.writeFileSync(spriteSassDistPath,sSpriteData);
                                            resolve({
                                                status:'success',
                                                msg:`写入 ${spriteSassDistPath}`,
                                                distPath:spriteSassDistPath,
                                                data:sSpriteData
                                            });
                                        } catch (error) {
                                            reject({
                                                status:'error',
                                                msg:`写入失败 ${spriteSassDistPath}`,
                                                distPath:spriteSassDistPath,
                                                info:err
                                            });
                                        };
                                    };
                                });
                            });
                        });

                        //更新精灵图数据(scss/_spriteData.scss)到项目
                        outTask.push(()=>{
                            return new Promise((resolve,reject)=>{
                                let aSdFileList = m.fs.readdirSync(spriteSassDistDir),
                                    aSdList = [],
                                    _spriteDataContent = '@charset "utf-8";\r\n//以下内容由程序自动更新\r\n',
                                    re = /^(\w*).(scss)$/i;
                                //筛选出非标准的.scss文件
                                aSdFileList.forEach((item,index)=>{
                                    if(re.test(item)){
                                        _spriteDataContent += '@import "./_spriteData/'+item+'";\r\n';
                                        aSdList.push(item);
                                    };
                                });
    
                                //更新
                                let _fws_spriteDataPath = m.path.join(config.distScssDir,'_spriteData.scss');
                                
                                m.fs.ensureDir(config.distScssDir,err => {
                                    if(err){
                                        reject({
                                            status:'error',
                                            msg:`创建失败 ${config.distScssDir}`,
                                            info:err
                                        });
                                    }else{
                                        try {
                                            m.fs.writeFileSync(_fws_spriteDataPath,_spriteDataContent);
                                            resolve({
                                                status:'success',
                                                msg:`写入 ${_fws_spriteDataPath}`,
                                                distPath:_fws_spriteDataPath,
                                                data:_spriteDataContent
                                            });
                                        } catch (error) {
                                            reject({
                                                status:'error',
                                                msg:`写入失败 ${_fws_spriteDataPath}`,
                                                distPath:_fws_spriteDataPath,
                                                info:error
                                            });
                                        };
                                    };
                                });
                               
                            });
                        });

                        let pngTaskAsync = async ()=>{
                            let data = {};
                            for(let i=0,len = outTask.length; i<len; i++){
                                let result = await outTask[i]();

                                switch (i) {
                                    case 0:
                                        data['spritePng'] = result.data;
                                    break;
                                    
                                    case 1:
                                        data['spriteScss'] = result.data;
                                    break;

                                    case 2:
                                        data['spriteScssMap'] = result.data;
                                    break;
                                };
                            };
                            return {
                                status:'success',
                                msg:`PNG精灵 ${config.srcDir}`,
                                data:data
                            };
                        };
                        pngTaskAsync().then(v => {
                            resolve(v);
                        }).catch(e => {
                            reject(e);
                        });
                        
                    };
                };

                m.spritesmith.run(option,pngMotor);
            }else{
                resolve({
                    status:'success',
                    msg:'目录无Png图片要处理'
                });
            };
        }));
        
        return Promise.all(spriteTaskList);
    }

    //获取图片列表
    getImgList(){
        const _ts = this,
            m = _ts.m,
            config = _ts.config;
        
        let imgList = {
                'png':[],
                'svg':[]
            },
            files = m.fs.readdirSync(config.srcDir);
        files.forEach((item,index)=>{
            let type = item.substr(item.length - 4,4).toLowerCase(),
                filePath = m.path.join(config.srcDir,item);
            switch (type) {
                case '.png':
                    imgList.png.push(filePath);
                break;
            
                case '.svg':
                    imgList.svg.push(filePath);
                break;
            };
        });
        return imgList;        
    }

};

module.exports = OutSprite;
