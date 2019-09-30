'use strict';
/**
 * 文件签名处理
 * 
 * @class Pug2html
 * {
 *  src:'',                 <string> 源文件路径
 *  dist:'',                <string> 输出路径
 * }
 */

module.exports = fileType => {
    let signature;

        //如果获取不到项目的创建时间则为当前时间
    let createDate = fws.config.createTime === undefined ? new Date() : new Date(fws.config.createTime),

        //格式化时间，不足两位前面补0
        formatDate = date => {
            let format = number => {
                    if(+number < 10){
                        return '0'+number;
                    };
                    return number;
                },
                year = date.getFullYear(),
                month = format(date.getMonth() + 1),
                day = format(date.getDate()),
                hours = format(date.getHours()),
                minutes = format(date.getMinutes());
            return year+'.'+month+'.'+day+' '+hours+':'+minutes;
        },
        sCreateDate = formatDate(createDate),       //项目创建时间
        sUpdateDate = formatDate(new Date()),       //项目更新时间
        sCreateAuthor = fws.config.author,
        sCreateMail = fws.config.mail,
        sUpateAuthor = fws.config.update_author,
        sProjectName = fws.config.projectName === undefined ? '无' : fws.config.projectName,

        //sUpateMail = fws.config.update_mail,
        sSignature = (()=>{
            let s = `Project:${sProjectName}, Create:${sCreateAuthor} ${sCreateDate}, Update:${sUpateAuthor} ${sUpdateDate}`;
            return s;
        })();

    switch (fileType) {
        case '.html':
            signature = `<meta name="signature" content="${sSignature}">`;
        break;

        case '.js':case '.css':
            signature = `/*! ${sSignature} */ \r\n`;
        break;
    
    };
    return signature;
};
