/**
 * 判断是否为精灵图
 * 
 * @param {string} filePath 图片路径
 * @returns 
 * 
 * @memberOf Watch
 */
module.exports = (filePath)=>{
    const {path,pathInfo} = {
        path:require('path'),
        pathInfo:require('./getPathInfo')
    };

    let fileType = path.extname(filePath).toLowerCase(),          //文件类型
        isSpriteDir = (()=>{
        let adirNames = path.dirname(filePath).split(path.sep),
            dirName = adirNames[adirNames.length - 1].toLowerCase();
        return dirName.indexOf('_sprite') === 0;
    })(),
    isImg = fileType === '.png' || fileType === '.svg';

    return isSpriteDir && isImg;
};