'use strict';
/**
 * 文件编译处理
 * 
 * @class Compile
 * {
 *  src:'',                 //输入文件
 *  dist:undefined,         //输出模块，不指定由编译模块处理
 *  debug:true              //开启debug模式，会生成map并编译到dev目录
 * }
 */
class Compile{
    constructor(option){
        const _ts = this;

        option = option || {};

        let m = _ts.m = {
                fs:require('fs-extra'),
                path:require('path'),
                pathInfo:require('./getPathInfo'),
                tip:require('./tip')
            },
            config = _ts.config = {};

        //配置写入到_ts.config
        for(let i in option){
            config[i] = option[i];
        };

        //默认开启debug模式
        config.debug = config.debug === undefined ? true : config.debug;

        //确定传入的文件是有效的再开始处理
        if(m.pathInfo(config.src).type === 'file'){
            _ts.init();
        }else{
            m.tip.error(config.src + ' 文件不存在');
        };
    }
    
    init(){
        const _ts = this,
            m = _ts.m,
            config = _ts.config;

        let fileType = m.path.extname(config.src).toLowerCase(),        //文件类型
            fileName = m.path.basename(config.src,fileType),            //文件名称
            filePrefix = fileName ? fileName.substr(0,1) : undefined;   //文件前缀
            

        //设置输出目录
        let distPath = _ts.distPath(fileName,fileType);
        let a = _ts.compile(config.src,distPath,fileType);
        console.log(a);

    }
    /**
     * 编译
     * @memberOf Compile
     */
    compile(src,dist,fileType){
        const _ts = this,
            m = _ts.m,
            config = _ts.config;
        
        let option = {
                src:src,
                dist:dist,
                debug:config.debug
            };

        let fns = {
                '.pug':_ts.getCompileFn(option,'pug'),
                '.jade':_ts.getCompileFn(option,'pug'),
                '.scss':_ts.getCompileFn(option,'sass'),
                '.sass':_ts.getCompileFn(option,'sass'),
                '.ts':_ts.getCompileFn(option,'ts'),
                '.tsx':_ts.getCompileFn(option,'ts'),
                '.jsx':_ts.getCompileFn(option,'jsx'),
                // '.js':apis.JsPost,       //js合并
                // '.css':apis.CssPost,     //前缀处理，压缩
                '.es':_ts.getCompileFn(option,'ts'),
                '.es6':_ts.getCompileFn(option,'ts'),
                '.png':_ts.getCompileFn(option,'sprite'),
                '.svg':_ts.getCompileFn(option,'sprite')
            };

        switch (fns[fileType]) {
            case undefined:
                return _ts.copy(option);
            break;
            case null:
                return undefined;
            break;        
            default:
                return fns[fileType]();
            break;
        };
    }
    

    getCompileFn(option,compileType){
        const _ts = this,
            m = _ts.m,
            config = _ts.config;
        let apis = require('../api'),
            promises = {
                pug:()=>{
                    return new apis.Pug2html(option);
                },
                sass:()=>{
                    return new apis.Sass2css(option);
                },
                ts:()=>{
                    return new apis.Ts2(option);
                },
                jsx:()=>{
                    return new apis.Jsx2js(option);
                },
                _sprite:()=>{
                    return new apis.OutSprite(option);
                }
            };
        return promises[compileType];
    }

    /**
     * 拷贝文件
     * @param {object} option 
     * @returns 
     * @memberOf Compile
     */
    copy(option){
        const _ts = this,
            m = _ts.m,
            config = _ts.config;

        option = option || {};

        let src = option.src,
            dist = option.dist;

        return new Promise((resolve,reject)=>{ 
            m.fs.copy(src,dist,(err) => {
                if(err){
                    reject({
                        status:'error',
                        msg:`拷贝失败 ${src}`,
                        info:err
                    });
                }else{
                    resolve({
                        status:'success',
                        msg:`拷贝成功 ${dist}`
                    });
                };
            })
        });
    }

    /**
     * 输出目录路径
     * @memberOf Compile
     */
    distPath(fileName,type){
        const _ts = this,
            m = _ts.m,
            config = _ts.config;
        
            //输出路径
        let distPath = '',

            //声明类型编译对应关系
            inOutFileType = {
                '.pug':'.html',
                '.jade':'.html',
                '.scss':'.css',
                '.ts':'.js',                
                '.tsx':'.jsx',
                '.jsx':'.js',
                '.es':'.js',
                '.es6':'.js'
            },

            //输出文件扩展名
            outExtName = inOutFileType[type] === undefined ? type : inOutFileType[type];
        
        //未指定输出路径
        if(config.dist === undefined){
            distPath = 

                //开发环境，即debug为true的情况下
                config.debug ?
                m.path.join(
                    m.path.dirname(config.src.replace(fws.srcPath,fws.devPath)),
                    fileName + outExtName
                    
                ):

                //生产环境
                m.path.join(
                    m.path.dirname(config.src.replace(fws.srcPath,fws.distPath)),
                    fileName + outExtName
                )
        }else{
            distPath = config.dist;
        };

        //.tsx文件则编译到与文件相同的目录
        // switch (type) {
        //     case '.tsx':
        //         distPath = 
        //             config.debug ? 
        //             distPath.replace(fws.devPath,fws.srcPath):
        //             distPath.replace(fws.distPath,fws.srcPath)
        //     break;
        // };

        return distPath;
    }
};

module.exports = Compile;
