# 自定义任务

在`fws安装目录/task/`目录中，每一个js文件对应着一个任务。

例如：

`fws安装目录/task/demo.js`，内容如下。

```javascript
class Demo{
    constructor(name,options){
        const _ts = this;

        _ts.name = name;
        _ts.option = options;
    }

    init(){
        const _ts = this;

        console.log(_ts.name,_ts.option.param);

        console.log('============================')
        console.log(fws);
    }
}

module.exports = {
    regTask:{
        command:'[name]',

        //任务描述
        description:'这是一个测试任务。（任务描述）',

        //任务参数
        option:[
            ['-a, --param [type]','任务参数（可选）']
            ['-b, --param <type>','任务参数（必选）']
        ],

        //任务额外的帮助说明
        help:()=>{
            console.log('');
            console.log('   补充说明:');
            console.log('   ------------------------------------------------------------');
            console.log('   暂无');
        },
        action:Demo
    },
    fun:()=>{}
};
```

- 任务必须为一个有效的`类`且有`init`方法
- 任务文件名即为** 任务名 **，如上所示的代码。执行`fws demo taskname -a 1 -b 2`即会打印出`taskname`和传入的两个参数