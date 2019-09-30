/**
 * 获取图片信息，支持png、jpg、jpeg、gif
 * 
 * @param {any} imgPath
 * @returns 
 * 
 * @memberOf Watch
 */
module.exports = (imgPath)=>{
    const path = require('path'),
        fs = require('fs-extra'),
        // Pixelsmith = require('pixelsmith'),
        sizeOf = require('image-size'),
        pathInfo = require('./getPathInfo');

    // let pix = new Pixelsmith(),
    //     imgInfo = {};
    let imgInfo = {};
    
    return new Promise((resolve,reject)=>{
        let dimensions = sizeOf(imgPath),
            info = pathInfo(imgPath);

        

        imgInfo.width = dimensions.width;
        imgInfo.height = dimensions.height;
        imgInfo.name = info.name;
        // imgInfo.type = info.extension.replace(/\./g,'');
        imgInfo.type = dimensions.type;
        imgInfo.path = imgPath;

        resolve({
            'status':'success',
            'msg':`${imgPath} 信息获取成功`,
            'data':imgInfo
        });


        // pix.createImages([imgPath],(err,imgs)=>{
        //     if(err){
        //         reject({
        //             'status':'error',
        //             'msg':`${imgPath} 信息获取错误`,
        //             'data':err
        //         });
        //         return;
        //     };
        //     let img = imgs[0],
        //         info = pathInfo(imgPath);
        //     imgInfo.width = img.width;
        //     imgInfo.height = img.height;
        //     // 转为base64会导致内存占用过大
        //     // imgInfo.base64 = fs.readFileSync(imgPath).toString('base64');
        //     imgInfo.name = info.name;
        //     imgInfo.type = info.extension.replace(/\./g,'');
        //     imgInfo.path = imgPath;

        //     resolve({
        //         'status':'success',
        //         'msg':`${imgPath} 信息获取成功`,
        //         'data':imgInfo
        //     });
        // });
    });
};