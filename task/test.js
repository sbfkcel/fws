class Test{
    constructor(name,options){
        const _ts = this;

        //自定义模块
        _ts.m = {
            path:require('path'),
            getImgInfo:require('../lib/getImgInfo')
        };

        _ts.name = name;
        _ts.option = options;
    }

    init(){
        const _ts = this,
            m = _ts.m;

        let data = {};
        

    }
}

module.exports = {
    regTask:{
        command:'[name]',
        description:'这是一个测试任务。（任务描述）',
        option:[
            //['-p, --param [type]','任务参数（可选）']
            ['-p, --param <type>','任务参数（必选）']
        ],
        help:()=>{
            console.log('');
            console.log('   补充说明:');
            console.log('   ------------------------------------------------------------');
            console.log('   暂无');
        },
        action:Test
    },
    fun:()=>{}
};