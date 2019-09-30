'use strict';
/**
 * tsx、ts编译为jsx、js
 * 
 * @class Pug2html
 * {
 *  src:'',                 <string> 源文件路径
 *  dist:'',                <string> 输出路径
 *  debug:true              [boolean] 默认:true,debug模式将生成调试信息
 * }
 */
class Ts2{
    constructor(option){
        const _ts = this;

        option = option || {};

        let m = _ts.m = {
                fs:require('fs-extra'),
                path:require('path'),
                ts:require('typescript'),
                pathInfo:require('./getPathInfo'),
                replaceGlobal:require('./replaceGlobal')
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
            let isSupport = (()=>{
                    let extensions = ['ts','tsx','js','es','es6'],
                        fileType = m.pathInfo(config.src).extension;
                    return extensions.some((item,index)=>{
                        return fileType === '.'+item;
                    });
                })();
            if(isSupport){
                try {
                    _ts.init().then(v => {
                        resolve(v);
                    }).catch(e => {
                        reject(e);
                    });
                } catch (error) {
                    reject({
                        status:'error',
                        msg:`初始化失败 ${m.path.join(fwsPath,'lib','ts2.js')}`,
                        info:error
                    });
                };             
            }else{
                reject({
                    status:'error',
                    msg:typeof config.src === 'string' ? `${config.src} 不是有效的文件` : `参数传入错误`
                });
            };
        });
    }

    init(){
        const _ts = this,
            m = _ts.m,
            config = _ts.config;
        
        //编译选项参考
        //https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API
        //https://www.typescriptlang.org/docs/handbook/compiler-options.html
        let option = {
                alwaysStrict:true,                      //是否启用严格模式
                lib: 'ES2016',                          //编译库'ES3','ES5','ES2015','ES2016','ES2017','Latest'
                module:'ES2015',                        //代码生成规范'None','CommonJs','AMD','UMD','System','ES2015'
                experimentalDecorators:true,
                //target:"ES2015",           
                inlineSourceMap:config.debug,           //在文件中嵌入map信息
                inlineSources:config.debug              //生成源码图，需要inlineSourceMap开启
            },
            srcFileName = m.path.basename(config.src),
            fileContent = m.fs.readFileSync(config.src).toString();
        
        //编译方法
        let render = (resolve,reject)=>{
            let result;
            try {
                result = m.ts.transpileModule(
                    fileContent,
                    {
                        compilerOptions:option,
                        fileName:srcFileName
                    }
                );
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
                };
                
                try {
                    if(result.outputText){
                        result.outputText = m.replaceGlobal(result.outputText);
                    };
                    m.fs.writeFileSync(config.dist,result.outputText);
                    resolve({
                        status:'success',
                        msg:`写入 ${config.dist}`,
                        data:result.outputText
                    });
                } catch (err) {
                    reject({
                        status:'error',
                        msg:`写入失败 ${config.dist}`,
                        info:err
                    });
                };
            });
        };

        return new Promise(render);
    }
}
module.exports = Ts2;
