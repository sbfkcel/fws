/**
 * 判断是否为pug对应的数据文件
 * 
 * @param {string} filePath 文件路径
 * 
 * @memberOf Watch
 */
module.exports = (filePath)=>{
    const {path,getFileInfo} = {
        path:require('path'),
        getFileInfo:require('./getFileInfo')
    };

    let fileInfo = getFileInfo(filePath),
        dataDir = path.join(fws.srcPath,'data'+path.sep);

    return filePath.indexOf(dataDir) === 0 && fileInfo.type === '.js';
}