'use strict';

/**
 * tsx、ts编译为jsx、js
 * 
 * @class Jsx2js
 * {
 *  src:'',                 <string> 源文件路径
 *  dist:'',                <string> 输出路径
 *  debug:true              [boolean] 默认:true,debug模式将生成调试信息
 * }
 */
class Jsx2js{
    constructor(option){
        const _ts = this;

        option = option || {};

        let m = _ts.m = {
                fs:require('fs-extra'),
                path:require('path'),
                babel:require("babel-core"),
                preset_react:require("babel-preset-react"),
                preset_es2015:require("babel-preset-es2015"),
                preset_stage_0:require("babel-preset-stage-0"),
                hot_loader:require("./babel_plugin_react_hot_loader"),
                syntax_jsx:require("babel-plugin-syntax-jsx"),
                transform_react_jsx:require("babel-plugin-transform-react-jsx"),
                pathInfo:require('./getPathInfo')                       //获取目标路径信息
            },
            config = _ts.config = {};
        
        //配置写入到_ts.config
        for(let i in option){
            config[i] = option[i];
        };

        //默认开启debug模式
        config.debug = config.debug === undefined ? true : config.debug;

        return new Promise((resolve,reject)=>{
            //检查文件是否为有效的类型
            if(m.pathInfo(config.src).extension === '.jsx'){
                try {
                    _ts.init().then(v => {
                        resolve(v);
                    }).catch(e => {
                        reject(e);
                    });
                } catch (error) {
                    reject({
                        status:'error',
                        msg:`初始化失败 ${m.path.join(fwsPath,'lib','jsx2js.js')}`,
                        info:error
                    });
                };
            }else{
                reject({
                    status:'error',
                    msg:typeof config.src === 'string' ? `${config.src} 不是有效的Jsx文件` : `参数传入错误`
                });
            };
        });
    }
    init(){
        const _ts = this,
            m = _ts.m,
            config = _ts.config;

        let render = (resolve,reject)=>{
            let result;
            try {
                let presets = [m.preset_react,m.preset_stage_0],
                    plugins = [m.syntax_jsx,m.transform_react_jsx],
                    outMap = false;

                if(config.debug){
                    plugins.push(m.hot_loader);
                    outMap = 'inline';
                };

                result = m.babel.transformFileSync(config.src,{
                    presets:presets,
                    plugins:plugins,
                    sourceMaps:outMap
                }); 
            } catch (err) {
                reject({
                    status:'error',
                    msg:`编译出错 ${config.src}`,
                    info:err
                });
            };
            
            //将结果写入文件
            let distDir = m.path.dirname(config.dist);
            m.fs.ensureDir(distDir,(err)=>{
                if(err){
                    reject({
                        status:'error',
                        msg:`创建失败 ${distDir}`,
                        info:err
                    });
                }else{
                    try {
                        m.fs.writeFileSync(config.dist,result.code);
                        resolve({
                            status:'success',
                            msg:`写入 ${config.dist}`,
                            distPath:config.dist,
                            data:result.code
                        });
                    } catch (err) {
                        reject({
                            status:'error',
                            msg:`写入失败 ${config.dist}`,
                            distPath:config.dist,
                            info:err
                        });
                    };
                };
            });
        };
        return new Promise(render);
    }
}

module.exports = Jsx2js;
