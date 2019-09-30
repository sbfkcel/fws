/**
 * 获取文件输出路径
 * 
 * @param {any} src 
 * @param {any} isDebug 
 * @returns 
 * 
 * @memberOf Watch
 */
module.exports = (src,isDebug)=>{
    const {path} = {
        path:require('path')
    };

    let correspondence = {
            '.pug':'.html',
            '.html':'.html',
            '.htm':'.htm',
            '.scss':fws.config.projectType === 'wxapp' ? '.wxss':'.css',
            '.ts':'.js',                
            '.tsx':'.js',
            '.jsx':'.js',
            '.es':'.js',
            '.es6':'.js'
        },
        //fileType = path.extname(src).toLowerCase(),
        fileType = path.extname(src),
        fileName = path.basename(src,fileType),

        //输出文件扩展名，如果上面的对应关系中有指定从对应关系中取，否则为原始扩展名
        outExtName = correspondence[fileType] === undefined ? fileType : correspondence[fileType],
        dist = '';

    if(isDebug){
        dist = path.join(path.dirname(src.replace(fws.srcPath,fws.devPath)),fileName + outExtName);
    }else{
        dist = path.join(path.dirname(src.replace(fws.srcPath,fws.distPath)),fileName + outExtName);
    };

    return dist;

};
