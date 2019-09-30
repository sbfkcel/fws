/**
 * 检查是否为需要过滤的文件
 * 
 * @param {string} filePath 文件路径
 * @returns 
 * 
 * @memberOf Watch
 */
module.exports = (filePath)=>{
    const {path,getFileInfo} = {
        path:require('path'),
        getFileInfo:require('./getFileInfo')
    };

        //需要过滤的文件类型
    let filterTypes = ['tmp','_mp','syd','ftg','gid','---','bak','old','chk','ms','diz','wbk','xlk','cdr_','nch'],

        //需要过滤需要包含的目录
        filterDirs = ['node_modules','.vscode','.fwsbackup','.temp'];

    //检查是否为需要过滤的文件
    let fileInfo = getFileInfo(filePath),
        fileType = fileInfo.type,
        fileName = fileInfo.name,
        isFilterType = filterTypes.some((item,index)=>{
            return '.'+item === fileType || fileName === '.DS_Store';
        });
    if(isFilterType){
        return true;
    };

    //检查是否有需要过滤的目录
    let filePathDirs = filePath.split(path.sep),
        isFilterDir = filterDirs.some((item,index)=>{
            return filePathDirs.some((dir,i)=>{
                return dir.toLowerCase() === item;
            });
        });
    if(isFilterDir){
        return true;
    };
    return false;
};