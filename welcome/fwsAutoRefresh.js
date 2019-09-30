var socket = io('http://localhost:3000');
!(function(){
    socket.on('refresh', function (data) {
        switch (data.type) {
            case 'refresh':
                
            break;
            case 'updateCss':
                
            break;
            case 'updateJs':
                
            break;
            case 'updateJs':
                
            break;
            case 'updateImg':
                
            break;
            case 'updateReact':
                
            break;
        };
    });

})();