!(function(){
    var Fws = function(){
        var _ts = this;
        _ts.socket = io(socketServer);
        
        _ts.socket.on('refresh',function(result){
            if(result && result.status === 'success'){
                var pathInfo = _ts.getPathInfo(result.path);

                switch (pathInfo.fileType) {
                    case 'html':
                        _ts.refresh();
                    break;
                    case 'css':
                        _ts.updateCss();
                    break;
                    case 'js':
                        _ts.refresh();
                        //_ts.updateJs();
                    break;
                    default:
                        _ts.log('更新信息：',result);
                    break;                    
                };                
            };
            // _ts.socket.emit('my other event',{my:'data'});
        });
        _ts.socket.emit('pageLoad',{
            url:location.href
        });
    };

    Fws.prototype = {
        log:function(){
            var arg = arguments;
            if(typeof window.console === 'object' && typeof window.console.log === 'function'){
                console.log.apply(null,arguments);
            };
        },
        //获取path信息
        getPathInfo:function(path){
            path = path || '';
            var aDir = path.split('\\');
            if(aDir.length === 1){
                aDir = path.split('/');
            };

            var fileName = aDir[aDir.length - 1].toLowerCase(),
                afileType = fileName.split('.'),
                fileType = afileType[afileType.length - 1];

            return {
                fileName:fileName,
                fileType:fileType
            }; 
        },
        //获取url信息
        getUrlInfo:function(url){
            var aFile = url.split('?')[0].split('/'),
                fileName = aFile[aFile.length - 1].toLowerCase(),
                afileType = fileName.split('.'),
                fileType = afileType[afileType.length - 1];
            return {
                fileName:fileName,
                fileType:fileType
            };            
        },
        //获取新的url
        newUrl:function(url){
            var re = /ver=(\d)*/,
                newVer = 'ver='+ new Date().valueOf();

            if(re.test(url)){
                return url.replace(re,newVer);
            }else if(url.indexOf('?') > -1){
                return url + '&' + newVer;
            }else{
                return url + '?' + newVer;
            };
        },
        //刷新页面
        refresh:function(){
            var _ts = this;
            location.reload(true);
        },
        //更新样式
        updateCss:function(){
            var _ts = this,
                obj = document.getElementsByTagName('link');

            for(var i = 0,len = obj.length; i < len; i++){
                var href = obj[i].href;
                obj[i].href = _ts.newUrl(href);
            };
        },
        //更新js
        updateJs:function(){
            var _ts = this,
                obj = document.getElementsByTagName('script');

            for(var i = 0,len = obj.length; i < len; i++){
                var src = obj[i].src;
                obj[i].src = _ts.newUrl(src);
            };
        },
        //更新React
        updateReact:function(){
            var _ts = this,
                obj = document.getElementsByTagName('img');
            for(var i = 0,len = obj.length; i < len; i++){
                var src = obj[i].src;
                obj[i].src = _ts.newUrl(src);
            };
        }
    };
    var init = new Fws();
})();
