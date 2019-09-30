module.exports = (string)=>{
    let s = string;
    const fs = require('fs-extra');

    if(global.fws && typeof global.fws.globalReplace === 'object'){
        let obj = global.fws.globalReplace;
        for(let i in obj){
            s = s.replaceAll(i,obj[i]);
        };
    };
    return s;
};