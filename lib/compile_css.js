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
                signature:require('../lib/signature'),
                postcss:require('postcss'),
                opacity:require('postcss-opacity'),
                CleanCSS:require('clean-css'),
                autoprefixer:require('autoprefixer'),
                filterGradient:require('postcss-filter-gradient')
            },            
            config = _ts.config = {};

        //配置写入到_ts.config
        for(let i in option){
            config[i] = option[i];
        };
        // let src = config.src,
        //     dist = config.dist,
        //     isMobile = config.isMobile;

        return _ts.taskList();
    }

    taskList(){
        const _ts = this,
            m = _ts.m,
            config = _ts.config;

        return new Promise((resolve,reject)=>{
            let css,            //css内容                
                cleaner,                
                signature;      //签名

            //设置postcss相关插件及选项，移动端下无需处理透明兼容，前缀添加使用默认选项
            if(config.isMobile){
                cleaner = m.postcss([
                    m.autoprefixer({
                        add:true
                    })
                ]);
            }else{
                cleaner = m.postcss([
                    m.opacity({
                        legacy:true
                    }),
                    m.filterGradient(),
                    m.autoprefixer({
                        add:true,
                        browsers: ['Last 40 versions']
                        //browsers: ['ie >= 6', 'Chrome >= 40', 'Last 40 versions']
                    })
                ]);
            };
            
            //读取文件内容
            if(m.pathInfo(config.src).extension === '.css' || m.pathInfo(config.src).extension === '.wxss'){
                css = m.fs.readFileSync(config.src).toString();
            }else{
                reject({
                    status:'error',
                    msg:`${config.src} 不是有效的 CSS 文件`
                });
            };

            cleaner.process(css,{from:config.src,to:config.dist}).then(function (cleaned) {
                return new m.CleanCSS({
                    compatibility:'ie7',
                    format:config.isBeautify ? 'keep-breaks' : false
                }).minify(cleaned.css);
            }).then(function (result) {
                //设置文件签名
                signature = m.signature('.css');

                //css内容为签名+处理过的css内容
                let cssContent = '@charset "UTF-8";\r\n'+signature+result.styles.replace(/@charset "UTF-8";/g,'');
                
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
                        m.fs.writeFileSync(config.dist,cssContent);
                        resolve({
                            status:'success',
                            msg:`写入 ${config.dist}`,
                            data:cssContent
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
        });
    }
}
module.exports = Compile;
