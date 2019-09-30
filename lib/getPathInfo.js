'use strict';


/**
 * 用于获取目标路径的文件或目录相关信息
 * @param {string} fileOrDirPath 目标路径
 */
let pathInfo = (fileOrDirPath)=>{
    const {fs,path,tip} = {
        fs:require('fs'),
        path:require('path'),
        tip:require('./tip')
    };

    let info = {
        'type':undefined,               //类型 'dir'|'file'
        'extension':undefined,          //扩展名 'undefined|空|.xxx'
        'name':undefined                //文件名 不包含扩展名部分
    };

    try {
        let stat = fs.statSync(fileOrDirPath);

        //如果路径是一个目录，则返回目录信息
        if(stat.isDirectory()){
            info.type = 'dir';

            let backPath = path.resolve(fileOrDirPath,'../'),       //跳到路径上一级目录
                dirName = fileOrDirPath.replace(backPath,''),       //去除上级目录路径
                re = /[/]|[\\]/g;

            info.name = dirName.replace(re,'');                     //去除处理路径后的/\符号
        };

        //如果是文件则返回文件信息
        if(stat.isFile()){
            info.type = 'file';
            info.extension = path.extname(fileOrDirPath);
            info.name = path.basename(fileOrDirPath,info.extension);
        };
    } catch (error) {
        //tip.error(error);
    };

    return info;
};

module.exports = pathInfo;



