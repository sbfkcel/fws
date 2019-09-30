/**
 * 获取编译方法
 * 
 * @param {object} option 
 * @param {string} type 文件扩展名，例如：“.svg”或“_sprite”精灵图
 * 
 * @memberOf Watch
 */
module.exports = (type)=>{
    let api = require('../api'),
        UpdateImg = require('./updateImg'),
        fns = {
            '.pug':api.Pug2html,
            '.jade':api.Pug2html,
            '.scss':api.Sass2css,
            '.sass':api.Sass2css,
            '.ts':api.Es2,
            // '.d.ts':api.Es2,
            '.tsx':api.Es2,
            '.es':api.Es2,
            '.es6':api.Es2,
            '.js':api.js2js,
            '.jsx':api.Es2,
            '.html':api.html2html,
            '.htm':api.html2html,
            '_sprite':api.OutSprite,
            '_img':UpdateImg
        };
    return fns[type] === undefined ? api.Copy : fns[type];
};