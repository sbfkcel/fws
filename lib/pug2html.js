'use strict';
/**
 * pug文件编译成为html
 * 
 * @class Pug2html
 * {
 *  src:'',                 <string> jade文件路径
 *  dist:'',                <string> html输出路径
 *  data:'',                [object] 页面对应的json数据
 *  debug:true,             [boolean] 默认:true，debug模式将会在页面底部添加fws开发模式额外信息，用于页面的自动刷新等……
 * }
 */
class Pug2html{
    constructor(option){
        const _ts = this;

        option = option || {};

        let m = _ts.m = {
                path:require('path'),
                fs:require('fs-extra'),
                pug:require('pug'),
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

        //页面数据
        config.data = config.data || {};

        return new Promise((resolve,reject)=>{
            let fileType = m.pathInfo(config.src).extension;
            if(fileType === '.pug' || fileType === '.jade'){
                try {
                    _ts.init().then(v => {
                        resolve(v);
                    }).catch(e => {
                        reject(e);
                    });
                } catch (error) {
                    reject({
                        status:'error',
                        msg:`初始化失败 ${m.path.join(fwsPath,'lib','pug2html.js')}`,
                        info:error
                    });
                };
            }else{
                reject({
                    status:'error',
                    msg:typeof config.src === 'string' ? `${config.src} 不是有效的Jade文件` : `参数传入错误`
                });
            };
        }); 
    }
    init(){
        const _ts = this,
            m = _ts.m,
            config = _ts.config;
        
        let jadeRender = (resolve,reject)=>{
            let fn,
                html;
            try {
                fn = m.pug.compileFile(config.src,{
                    doctype:'html',
                    compileDebug:false,
                    pretty:true
                });
                html = fn(config.data);

                if(config.debug && html){
                    html += require('./echoHtmlDebug')();
                };
            } catch (err) {
                reject({
                    status:'error',
                    msg:`编译出错 ${config.src}`,
                    info:err
                });
            };
            if(html){
                html = m.replaceGlobal(html);

                //创建目录并写入文件
                let distDir = m.path.dirname(config.dist);
                m.fs.ensureDir(distDir,err => {
                    if(err){
                        reject({
                            status:'error',
                            msg:`创建失败 ${distDir}`,
                            info:err
                        });
                    };
                    
                    //写入html文件
                    try {
                        m.fs.writeFileSync(config.dist,html);
                        resolve({
                            status:'success',
                            msg:`写入 ${config.dist}`,
                            distPath:config.dist,
                            data:html,
                        });
                    } catch (err) {
                        reject({
                            status:'error',
                            msg:`写入失败 ${config.dist}`,
                            distPath:config.dist,
                            info:err
                        });
                    };
                });
            };
        };

        return new Promise(jadeRender);
    }
};
module.exports = Pug2html;