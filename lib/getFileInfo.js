/**
 * 获取指定文件的相关信息
 * 
 * @param {string} filePath 
 * @returns 
 * 
 * @memberOf Watch
 */
let getFileInfo = (filePath)=>{
    const {path} = {
        path:require('path')
    };

    let tempObj = {};
    // extname = (()=>{
    //     let name = path.extname(filePath).toLowerCase();
    //     return filePath.toLocaleLowerCase().substr(-5) === '.d.ts' ? '.d.ts' : name;
    // })();

    tempObj.path = filePath;
    tempObj.type = path.extname(filePath).toLowerCase();          // 文件扩展名，例如：".png"（.d.ts文件则不为.ts）
    tempObj.name = path.basename(filePath,tempObj.type);          // 文件名称不包含扩展名
    tempObj.isPublic = tempObj.name.substr(0,1) === '_';          // 取文件名第一个字符,判断是否为公共文件 
    return tempObj; 
};

module.exports = getFileInfo;