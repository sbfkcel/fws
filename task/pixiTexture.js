/**
 * 生成Pixi.js支持的sprite
 */
class PixiSprite{
    constructor(name,options){
        const _ts = this;

        //自定义模块
        _ts.m = {
            path:require('path'),
            fs:require('fs'),
            spritesmith:require('spritesmith'),
            getPathInfo:require('../lib/getPathInfo'),
            tip:require('../lib/tip')
        };

        _ts.name = name;
        _ts.option = options;

        _ts.srcPath = _ts.name ? _ts.m.path.join(fws.cmdPath,_ts.name) : fws.cmdPath;
    }

    init(){
        const _ts = this,
            m = _ts.m;

        let srcPath = _ts.srcPath;
        _ts.outData(srcPath).then(v => {
            let outDir = m.path.join(srcPath,'../'),
                sjson = (()=>{
                    let json;
                    //如果开启格式化选项，则模式化json文件
                    if(_ts.option.format){
                        json = JSON.stringify(v.data.json,null,2);
                    }else{
                        json = JSON.stringify(v.data.json);
                    };
                    return json;
                })();

            try {
                let jsonPath = m.path.join(outDir,v.data.name+'.json'),
                    imgPath = m.path.join(outDir,v.data.name+'.png');
                
                m.fs.writeFileSync(jsonPath,sjson);
                m.tip.success(`${jsonPath} 生成成功`);
                m.fs.writeFileSync(imgPath,v.data.image);
                m.tip.success(`${imgPath} 生成成功`);
                
            } catch (error) {
                m.tip.error(error);
            }
        }).catch(e => {
            m.tip.error(e.msg);
        });
        
    }
    
    //输出数据
    outData(srcDirPath){
        const _ts = this,
            m = _ts.m;

        return new Promise((resolve,reject)=>{
            if(m.getPathInfo(srcDirPath).type !== 'dir'){
                reject({
                    status:'error',
                    msg:`${srcDirPath} 不是有效的目录`
                });
                return;
            };
    
            let data = {
                frames:{},
                meta:{}
            },
            imgsPath = _ts.getImgsPath(),
            option = {
                src:imgsPath,
                padding:4,
                algorithm:'binary-tree'
            };

            //如果配置中有声明图像处理引擎，则传入引擎到配置中
            if(fws.config.imgEngine !== '' && typeof fws.config.imgEngine === 'string'){
                option.engine = require(fws.config.imgEngine);
            };
            
            //当目录内无图片时则不继续执行
            if(imgsPath.length === 0){
                reject({
                    status:'error',
                    msg:`${srcDirPath} 无可合并的图片文件`
                });
                return;
            };
            
            m.spritesmith.run(option,(err,result)=>{
                if(err){
                    reject({
                        status:'error',
                        msg:`${srcDirPath} 图片合成遇到错误`,
                        data:err
                    });
                }else{
                    let imgs = result.coordinates,  //精灵信息
                        size = result.properties,   //总的大小
                        img = result.image,         //图片buffer
                        filename = (()=>{
                            let dirs = srcDirPath.split(m.path.sep);
                            return dirs[dirs.length - 1];
                        })();
                    
                    for(let i in imgs){
                        let name = m.path.basename(i),
                            item = imgs[i];
    
                        data.frames[name] = {};
    
                        //frame
                        data.frames[name].frame = {
                            x:item.x,
                            y:item.y,
                            w:item.width,
                            h:item.height
                        };
    
                        //spriteSourceSize
                        data.frames[name].spriteSourceSize = {
                            x:0,
                            y:0,
                            w:item.width,
                            h:item.height
                        };
                        
                        //sourceSize
                        data.frames[name].sourceSize = {
                            w:item.width,
                            h:item.height
                        };
                    };
    
                    data.meta.app = 'https://github.com/sbfkcel/fws';
                    data.meta.image = `${filename}.png`;
                    data.meta.size = {
                        w:size.width,
                        h:size.height
                    };
                    data.meta.scale = '1';

                    resolve({
                        status:'success',
                        msg:'合并成功',
                        data:{
                            json:data,
                            image:img,
                            name:filename
                        }
                    });  
                };
            });
        })
    }

    //获取目录内所有图片
    getImgsPath(){
        const _ts = this,
            m = _ts.m;

        let imgs = [],
            dirPath = _ts.srcPath,
            files = m.fs.readdirSync(dirPath),
            filesPath = (()=>{
                files.forEach(item => {
                    let filePath = m.path.join(dirPath,item),
                        extname = m.path.extname(filePath).toLocaleLowerCase(),
                        isImg = ['jpg','jpeg','png'].some(item => {
                            return extname === '.'+item;
                        });
                    if(isImg){
                        imgs.push(filePath);
                    };
                });
            })();

        return imgs;
    }
}

module.exports = {
    regTask:{
        command:'[name]',
        description:'从指定目录创建PixiSprite',
        option:[
            ['-f, --format','格式化输出的 JSON 文件']
        ],
        help:()=>{
            console.log('');
            console.log('   补充说明:');
            console.log('   ------------------------------------------------------------');
            console.log('   暂无');
        },
        action:PixiSprite
    },
    fun:()=>{}
};