'use strict';
/**
 * css文件处理
 * - opacity透明兼容
 * - 前缀处理
 * - 文件签名
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
                signature:require('../lib/signature')
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
            let html,            //html内容               
                signature,       //签名
                sTitle,
                reTitle = /<title>.*<\/title>/,                
                reDev = /<!--fws开发模式start-->(.|\r|\n)*<!--fws开发模式end-->/,
                reJsx = / type="text\/babel"/ig,
                reScript = /<script(.)*<\/script>/ig;
            
            //读取文件内容
            if(m.pathInfo(config.src).extension === '.html'){
                html = m.fs.readFileSync(config.src).toString();
                signature = m.signature('.html');
            }else{
                reject({
                    status:'error',
                    msg:`${config.src} 不是有效的 HTML 文件`
                });
            };

            sTitle = html.match(reTitle);
            
            //如果匹配到页面有title标签，则需要给文件添加签名
            if(sTitle){
                //html签名
                html = html.replace(reTitle,sTitle[0] + '\r\n    ' + signature);
            };

            //替换html开发模式添加的脚本
            html = html.replace(reDev,'');

            //替换jsx类型为js
            html = html.replace(reJsx,'');

            //去掉browser相关的js库
            html = html.replace(reScript,word => {
                if(word.indexOf('browser') > -1){
                    return '';
                };
                return word;
            });

            //写入文件之前先创建好对应的目录
            let distDir = m.path.dirname(config.dist);

            m.fs.ensureDir(distDir,err => {
                if(err){
                    reject({
                        status:'error',
                        msg:`${distDir} 创建失败`,
                        info:err
                    });
                };

                //写入文件
                try{
                    m.fs.writeFileSync(config.dist,html);
                    resolve({
                        status:'success',
                        msg:`写入 ${config.dist}`,
                        data:html
                    });
                }catch(err){
                    reject({
                        status:'error',
                        msg:`${config.dist} 创建失败`,
                        info:err
                    });
                };                    
            })
        });
    }
}
module.exports = Compile;
