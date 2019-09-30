let string = ()=>{
    let s= '',
        ip = fws.localIp,
        listenPort = fws.listenPort;
    if(ip && listenPort){
        let socketServer = `${ip}:${listenPort}`;
        s = `
<!--fws开发模式start-->
<script id="fws_socket"></script>
<script id="fws_hotLoader"></script>
<script>
    (function(){
        var isOnreadystatechange = (function(){
                var ver = document.documentMode ? document.documentMode : 9999;
                return !!window.ActiveXObject && ver < 9;
            })(),
            origin = location.origin === 'file://' ? 'http://' : '//',
            socketServer = origin +'${socketServer}',
            ofws_socket = document.getElementById('fws_socket'),
            ofws_hotLoader = document.getElementById('fws_hotLoader');
        
        window.socketServer = socketServer;
        ofws_socket.src = socketServer + '/staticfile/socket.io/1.3.7/socket.io.js';
        if(isOnreadystatechange){
            ofws_socket.onreadystatechange = function(){
                var state = this.readyState;
                if(state === 'complete' || state === 'loaded'){
                    ofws_hotLoader.src = socketServer + '/fws_hot_loader.js';
                };
            };
        }else{
            ofws_socket.onload = function(){
                ofws_hotLoader.src = socketServer + '/fws_hot_loader.js';
            };
        };
    })();
</script>
<!--fws开发模式end-->
        `
    };
    return s;
};
module.exports = string;