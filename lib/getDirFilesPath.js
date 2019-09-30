/**
 * 获取指定目录下的所有文件（不包含“_”开头的文件，如果是精灵图则只保存其所属目录）
 * 
 * @param {string} dirPath 目录路径
 * @param {array} ignoreDir 需要过滤的目录，例如“node_module”则会过滤掉“config.src/node_module”目录
 * @returns 
 * 
 * @memberOf Watch
 */
module.exports = (option)=>{
    const {fs,path,pathInfo,isData,isSprite,getFileInfo} = {
        fs:require('fs-extra'),
        path:require('path'),
        pathInfo:require('./getPathInfo'),
        isData:require('./isData'),
        isSprite:require('./isSprite'),
        getFileInfo:require('./getFileInfo')
    };

    let config = {
        srcDir:option.srcDir,
        ignoreDir:option.ignoreDir ? [...option.ignoreDir] : ['node_modules'],
        ignore_:option.ignore_ === undefined ? true : option.ignore_
    };
    
    //先声明文件结构，以编译顺序能根据文件结构来
    let oFiles = {                
            '.pug':{},
            '.jade':{},
            '.ts':{},
            '.tsx':{},
            '.jsx':{},
            '.js':{},
            '.png':{},
            '.svg':{},
            '_sprite':{},
            '.scss':{},
            '.sass':{}
        },
        eachDir,
        
        //检查文件是否为需要过滤的目录内
        isIgnoreDir = (filePath)=>{
            return config.ignoreDir.some((item,index)=>{
                //console.log('文件路径：',filePath);
                return filePath.indexOf(path.sep + item + path.sep) > -1;
            });
        },
        isIgnoreFile = (fileName)=>{
            return ['.DS_Store'].some((item)=>{
                return item === fileName;
            });
        };

    (eachDir = (dir)=>{
        //检查，如果目录存在，则读取目录文件列表并逐层遍历
        let isDir = pathInfo(dir).type === 'dir';
        if(isDir){
            let files = fs.readdirSync(dir);

            files.forEach((item,index)=>{
                let filePath = path.join(dir,item),
                    itemInfo = pathInfo(filePath),
                    isNotIgnore = !isIgnoreDir(filePath);

                if(itemInfo.type === 'dir' && isNotIgnore){
                    eachDir(filePath)
                }else if(itemInfo.type === 'file' && isNotIgnore && !isIgnoreFile(itemInfo.name)){

                    //如果文件是精灵图，保存其所属目录
                    let _isSprite = isSprite(filePath),
                        _isData = isData(filePath);
                    if(_isSprite){
                        oFiles['_sprite'][path.dirname(filePath)] = null;
                    }else if(!_isData){
                        //oFiles[itemInfo.extension].push(_ts.getFileInfo(filePath));
                        let fileInfo = getFileInfo(filePath);

                        //如果开启了排除公共文件
                        if(config.ignore_){
                            //该类型文件没有出现过且不是以“_”开始的公共文件，那么创建一个空的对象用以存储文件列表
                            if(oFiles[itemInfo.extension] === undefined && !fileInfo.isPublic){
                                oFiles[itemInfo.extension] = {};
                            };
                            //文件不是公共文件（即以"_"开头的文件，则保存到对象中）
                            if(!fileInfo.isPublic){
                                oFiles[itemInfo.extension][filePath] = null;
                            }; 
                        }
                        //未开启排除公共文件，则是所有文件都添加到文件列表
                        else{
                            if(oFiles[itemInfo.extension] === undefined){
                                oFiles[itemInfo.extension] = {};
                            };
                            oFiles[itemInfo.extension][filePath] = null;
                        };  
                    };                        
                };
            });
        };
    })(config.srcDir);



    return oFiles;

};