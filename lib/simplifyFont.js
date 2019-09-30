/**
 * 字体精简
 * @memberOf Watch
 */
let simplifyFont = (option)=>{
    const {fs,path,pathInfo,getDirFilesPath,tip} = {
        fs:require('fs-extra'),
        path:require('path'),
        pathInfo:require('./getPathInfo'),
        getDirFilesPath:require('./getDirFilesPath'),
        tip:require('./tip'),
        font:require('font-spider')
    };

    let src = option.src;


    return ()=>{
        return new Promise((resolve,reject)=>{
            console.log(font);
            resolve(1);
        });
    };

};

module.exports = simplifyFont;