/**
 * 判断是否为Fws项目目录
 * 
 * @param {string} dirPath 目录路径
 * @returns 
 * 
 * @memberOf Watch
 */
module.exports = (dirPath)=>{
    const {path,pathInfo} = {
        path:require('path'),
        pathInfo:require('./getPathInfo')
    };
    let fwsConfigFile = path.join(dirPath,'fws_config.js');
    return pathInfo(dirPath).type === 'dir' && pathInfo(fwsConfigFile).type === 'file';
};