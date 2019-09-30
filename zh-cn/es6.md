# Es6 编译策略

凡是有效的FWS项目，在构建过程中会编译目录下所有可被脚手架支持的文件。这包括：`ts`、`tsx`、`es`、`es6`、`jsx`、`scss`、`pug`。

## js 封装规范


在编译之前，会检查代码是否为一个有效的Es module（包含：`export `关键字），则会编译成 ** umd ** 规范，否则会编译为 ** iife **规范。


** iife **规范
```javascript
(function(){
'use strict'

// code...
}());
```

** umd **规范
```javascript
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';
// code...
})));
```

## 相关链接

规范参考

[rollup repl：https://rollupjs.org/repl](https://rollupjs.org/repl)