'use strict';
/**
 * 拷贝文件
 * 
 * @class Pug2html
 * {
 *  src:'',                 <string> 源文件路径
 *  dist:'',                <string> 输出路径
 * }
 */
class Copy{
    constructor(option){
        const _ts = this;

        option = option || {};

        let m = _ts.m = {
                fs:require('fs-extra')
            },            
            config = _ts.config = {};

        //配置写入到_ts.config
        for(let i in option){
            config[i] = option[i];
        };
        let src = config.src,
            dist = config.dist;

        return new Promise((resolve,reject)=>{
            m.fs.copy(src,dist,(err) => {
                if(err){
                    reject({
                        status:'error',
                        msg:`拷贝 ${src}`,
                        info:err
                    });
                }else{
                    resolve({
                        status:'success',
                        msg:`拷贝 ${dist}`,
                        distPath:dist
                    });
                };
            })
        });
    }
}
module.exports = Copy;
