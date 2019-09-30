'use strict';

/**
 * 获取数据类型
 * 
 * @param {any} obj 需要获取类型的数据
 * @returns {string} number|string|array|date|object|boolean|regExp|function|null|undefined
 */
let fun = (obj)=>{
    let sType;
    try {
        let objType = obj.constructor.name;
        sType = objType.substr(0,1).toLowerCase() + objType.substr(1);
    } catch (err) {
        sType = obj+''.toLowerCase();
    };
    return sType;
};

module.exports = fun;