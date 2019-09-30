/**
 * 获取指定文件的相关信息
 * 
 * @param {string} filePath 
 * @returns 
 * 
 * @memberOf Watch
 */
module.exports = (filePath)=>{
    const os = require('os');
    let networkInfo = os.networkInterfaces(),
        ip;
    for(let i in networkInfo){
        let t = networkInfo[i].some((item,index)=>{
            if(item.family === 'IPv4' && item.address !== '127.0.0.1' && item.address !== '0.0.0.0'){
                ip = item.address;
                return true;;
            };
        });
        if(t){
            break;
        };
    };
    return ip ? ip : 'localhost';
};