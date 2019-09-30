const chai = require('chai'),        // 请确保模块已经安装，关于chai使用文档见（http://www.chaijs.com/）
    expect = chai.expect,
    should = chai.should,
    assert = chai.assert;

/**
 * 测试代码编写示例
 * 假设'../dev/js/main.js'文件内容为 `module.exports = (a,b)=>{return a+b;}`
 */
// let sum = require('../dev/js/main');
// describe('main.es6文件测试',()=>{
//     it('# sum 1 + 2 应该等于 3',()=>{
//         expect (sum(1,2)).to.be.equal(3);
//     });
// });