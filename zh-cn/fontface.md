# WebFont 字体压缩

脚手架在编译项目的过程中会自动分析HTML及CSS文件。

如果检测到页面有使用WebFont，会从字体文件（须`.ttf`格式）中提取有使用到的字符。从而进行字体精简及多格式转换。

这一切都是自动处理的。



## WebFont示例

** src/index.html 文件 **
```html
<!DOCTYPE html>
<html>
  <head>
    <title>WebFont</title>
    <link rel="stylesheet" href="./css/style.css">
  </head>
  <body>
    <div class="fontFace">特殊字体</div>
  </body>
</html>
```

** src/css/style.css 文件**
```css
@font-face {
    font-family:'fzmw';
    src:url('../images/fzmw.eot'); /* IE9 Compat Modes */
    src:url('../images/fzmw.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
        url('../images/fzmw.woff') format('woff'), /* Modern Browsers */
        url('../images/fzmw.ttf')  format('truetype'), /* Safari, Android, iOS */
        url('../images/fzmw.svg') format('svg'); /* Legacy iOS */
}
.fontFace {font-family:'fzmw'; font-size:50px;}
```

!> @font-face src 定义的`.ttf`文件必须存在，其它字体格式将自动生成。

## WebFont Mixin

FWS 的Sass库已经内置了 WebFont Mixn。下方的scss代码与前面示例的css代码等价。

```scss
@charset "utf-8";
@import "fws";              //需要引入FWS的sass库

@include font-face('fzmw');
.fontFace {font-family:'fzmw'; font-size:50px;}
```

** 附 FWS WebFont Mixin 参数： **

```scss
/**
 * 定义WebFont
 * @param   {string} $fontName         <必填> 字体名称，无需扩展名
 * @param   {string} $addedPath        [选填] 字体文件的相对路径，默认'../images/'
 */
@include font-face($fontName,$addedPath)
```

