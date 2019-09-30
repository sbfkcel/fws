const typescript = require('typescript');
module.exports = (option)=>{
    option = option || {
        alwaysStrict:true,                      //是否启用严格模式
        lib:typescript.ScriptTarget.ES3,        //编译库'ES3','ES5','ES2015','ES2016','ES2017','Latest'
        module:typescript.ModuleKind.ES2015,    //代码生成规范'None','CommonJs','AMD','UMD','System','ES2015'
        sourceMap:true                          //生成map文件
        //sourceRoot:'',                        //源文件位置              
        //inlineSourceMap:true,                   //在文件中嵌入map信息
        //inlineSources:true                      //生成源码图，需要inlineSourceMap开启
    };
    
    return {
        transform: function transform ( code, id ) {
            let transformed = typescript.transpileModule(
                code,
                {
                    compilerOptions:option,
                    //moduleName:"test",
                    fileName:id
                }
            );
    
            return {
                // Always append an import for the helpers.
                code: transformed.outputText,
    
                // Rollup expects `map` to be an object so we must parse the string
                map: transformed.sourceMapText ? JSON.parse(transformed.sourceMapText) : null
            };
        }
    };
};