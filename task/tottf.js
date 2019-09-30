/// <reference path="../typings/globals/node/index.d.ts" />
class Font2{
    constructor(projectPath,options){
        const _ts = this;
        _ts.m = {
           fs:require('fs-extra'),
           path:require('path'),
           tip:require('../lib/tip'),
           Fontmin:require('fontmin'),
           Font:require('fonteditor-core').Font,
           pathInfo:require('../lib/getPathInfo')
        };

        //_ts.init();
        _ts.test();
    }
    test(){
        const _ts = this;
        
        let dir = fws.cmdPath,
            fileNames = _ts.m.fs.readdirSync(dir),
            fontPaths = {
                'otf':[],
                'svg':[],
                'svg2':[]
            };
        
        fileNames.forEach((item,index)=>{
            let filePath = _ts.m.path.join(dir,item),
                fileInfo = _ts.m.pathInfo(filePath);
            if(fileInfo.extension === '.otf'){
                fontPaths.otf.push(filePath);
            }else if(fileInfo.extension === '.svg'){
                fontPaths.svg.push(filePath);
            }else if(fileInfo.extension === '.svg2'){
                fontPaths.svg2.push(filePath);
            };            
        });

        for(let i in fontPaths){
            if(fontPaths[i].length){
                fontPaths[i].forEach(item => {
                    let dir = _ts.m.path.resolve(item,'..'),
                        itemInfo = _ts.m.pathInfo(item);
                    
                    let inBuffer = _ts.m.fs.readFileSync(item),
                        font = _ts.m.Font.create(inBuffer,{
                            type:i,
                            hinting:true
                        }),
                        outBuffer = font.write({
                            type:'ttf',
                            hinting:true
                        });
                    
                    _ts.m.fs.writeFileSync(_ts.m.path.join(dir,itemInfo.name+'.ttf'),outBuffer);
                })
                
            };
        };
    }

    //初始化
    init(){
        const _ts = this,
            fontmin = new _ts.m.Fontmin;
        
        let dir = fws.cmdPath,
            fileNames = _ts.m.fs.readdirSync(dir),
            fontPaths = {
                'otf':[],
                'svg':[],
                'svg2':[]
            };
        
        fileNames.forEach((item,index)=>{
            let filePath = _ts.m.path.join(dir,item),
                fileInfo = _ts.m.pathInfo(filePath);
            if(fileInfo.extension === '.otf'){
                fontPaths.otf.push(filePath);
            }else if(fileInfo.extension === '.svg'){
                fontPaths.svg.push(filePath);
            }else if(fileInfo.extension === '.svg2'){
                fontPaths.svg2.push(filePath);
            };            
        });

        for(let i in fontPaths){
            if(i==='otf' && fontPaths[i].length){
                fontPaths[i].forEach(item => {
                    let dir = _ts.m.path.resolve(item,'..'),
                        itemInfo = _ts.m.pathInfo(item);
                    fontmin
                        .src(item)
                        .use(_ts.m.Fontmin.otf2ttf())
                        //.dest(_ts.m.path.join(dir,itemInfo.name+'.ttf'))
                        .run((err,files)=>{
                            if(err){
                                _ts.m.tip.error(err)
                            }else{
                                _ts.m.fs.writeFileSync(_ts.m.path.join(dir,itemInfo.name+'.ttf'),files[0].contents);
                            };
                        });
                    

                })
                
            };
        };




        
    }
};


module.exports = {
    regTask:{
        command:'[name]',
        description:'otf、svg、svgs字体转换为ttf',
        option:[
            ['-s, --server','开启http server']
        ],
        help:()=>{
            console.log('   补充说明:');
            console.log('   ------------------------------------------------------------');
            console.log('   暂无');
        },
        action:Font2
    }
};