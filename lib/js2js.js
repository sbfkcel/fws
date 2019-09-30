'use strict';
/**
 * Js文件处理
 * 
 * @class Pug2html
 * {
 *  src:'',                 <string> 源文件路径
 *  dist:'',                <string> 输出路径
 * }
 */
class Js{
    constructor(option){
        const _ts = this;

        option = option || {};

        let m = _ts.m = {
                fs:require('fs-extra'),
                path:require('path'),
                replaceGlobal:require('./replaceGlobal')
            },            
            config = _ts.config = {};

        //配置写入到_ts.config
        for(let i in option){
            config[i] = option[i];
        };
        let src = config.src,
            dist = config.dist,
            distDir = m.path.dirname(dist),
            jsContent = m.fs.readFileSync(src).toString();

        return new Promise((resolve,reject)=>{
            if(jsContent){
                jsContent = m.replaceGlobal(jsContent);
                m.fs.ensureDir(distDir,(err)=>{
                    if(err){
                        reject({
                            status:'error',
                            msg:`创建失败 ${distDir}`,
                            info:err
                        });
                    };
                    
                    try {
                        m.fs.writeFileSync(dist,jsContent);
                        resolve({
                            status:'success',
                            msg:`写入 ${dist}`,
                            data:jsContent,
                            distPath:dist
                        });
                    } catch (err) {
                        reject({
                            status:'error',
                            msg:`写入失败 ${dist}`,
                            info:err
                        });
                    };
                });
            }else{
                resolve({
                    status:'success',
                    msg:`为空 ${src} 无需写入`,
                    data:jsContent
                });
            };
        });
    }
}
module.exports = Js;
