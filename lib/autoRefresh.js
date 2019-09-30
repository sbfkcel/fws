'use strict';
/**
 * {}
 * 
 * @class autoRefresh
 * {
 *  type:refresh、updateCss、updateJs、updateReact、updateImg
 *  listenPort:3000
 * }
 */
class autoRefresh{
    constructor(option){
        const _ts = this;

        option = option || {};

        let m = _ts.m = {
                path:require('path'),
                net:require('net'),
                fs:require('fs-extra'),
                Koa:require('koa'),
                Io:require('koa-socket'),
                static:require('koa-static'),
                range:require('koa-range'),
                Router:require('koa-router')
            },
            config = _ts.config = {};
        
        

        for(let i in option){
            config[i] = option[i];
        };

        _ts.listenPort = typeof _ts.listenPort === 'number' ? _ts.listenPort : fws.config.listenPort ? fws.config.listenPort : 3000;

        config.listen = +config.listenPort > 0 ? fws.config.listenPort : 3000;

        _ts.app = new m.Koa();
        _ts.app.use(m.range);
        _ts.io = new m.Io();
        _ts.router = new m.Router();
        
        //return new Promise(_ts.init());
    }
    init(){
        const _ts = this;
        let m = _ts.m,
            config = _ts.config;
        return new Promise((resolve,reject)=>{
            //_ts.app.use(m.static(m.path.join(fws.fwsPath,'staticfile')));
        
            //_ts.app.use(m.static(m.path.join(fws.cmdPath,'staticfile')));
            //_ts.app.use(m.static(m.path.join(fws.fwsPath)));
            
            // m.router.get('/',(ctx,next)=>{
            //     let content = m.fs.readFileSync(m.path.join(fws.fwsPath,'staticfile','index.html')).toString();
            //     ctx.body = content;
            // });

            //静态页面到
            _ts.app.use(m.static(m.path.join(fws.fwsPath,'welcome')));
        
            //当前项目
            _ts.app.use(m.static(m.path.join(fws.srcPath,'..')));
    
            _ts.io.attach(_ts.app);
            // _ts.io.on('connection',(ctx,data) => {
            //     console.log('客户端有新的响应');
            // });

            _ts.io.on('pageLoad',(ctx,data)=>{
                console.log('加载 '+data.url);
            });
    
            // setInterval(function(){
            //     //广播
            //     _ts.io.broadcast('news',111);
            // },1000);
            
            // _ts.io.on('my other event',(ctx,data)=>{
            //     console.log(data);
            // });
    
            _ts.app
                .use(_ts.router.routes())
                .use(_ts.router.allowedMethods());
            
            let initialNumber = 0,            //初始次数
                maxTryNumber = 20;            //如果端口被占用，最多允许尝试的次数

            
            let testServer;            
            (testServer = ()=>{
                var s = m.net.createServer().listen(_ts.listenPort);
                s.on('listening',()=>{
                    //测试端口可用，则关闭当前端口并启动server
                    s.close();
                    _ts.app.listen(_ts.listenPort);
                    resolve({
                        status:'success',
                        msg:'启动 http Server',
                        data:{
                            listenPort:_ts.listenPort
                        }
                    });
    
                });

                s.on('error',err => {
                    //端口被占用
                    if(err.code === 'EADDRINUSE'){
                        initialNumber++;
                        _ts.listenPort++;
                        if(initialNumber < maxTryNumber){
                            testServer();
                        }else{
                            reject({
                                status:'error',
                                msg:'启动 http Server 失败',
                                info:err
                            });
                        };
                    };
                });
            })();
            

            
            
            // try {
            //     _ts.app.listen(_ts.listenPort);
            //     resolve({
            //         status:'success',
            //         msg:'启动 http Server',
            //         data:{
            //             listenPort:_ts.listenPort
            //         }
            //     });
            // } catch (error) {
            //     if(addNumber < 10){
            //         addNumber++;
            //         _ts.listenPort++;
            //         _ts.app.listen(_ts.listenPort);
            //     }else{
            //         reject({
            //             status:'error',
            //             msg:'启动 http Server 失败',
            //             info:error
            //         });
            //     };
            // };
        })
        
        
        
    }
};

module.exports = autoRefresh;