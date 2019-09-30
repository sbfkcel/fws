# Sass 扩展

FWS内置了一些sass函数和mixin。


## rem单位转换

** `rem` REM单位转换 **

```scss
/**
 * REM单位转换
 * @param   {object} $size        <必填> 像素大小
 * @returns {string}              转换之后的rem，例如：0.5rem
 */
rem($size)
```

## 精灵图

** `map-url` 获取精灵图路径 **

```scss
/**
 * 获取精灵图路径
 * @param   {object} $sprite      <必填> 精灵图名称对象
 * @param   {string} $addedPath   [选填] 精灵图的相对路径，默认'../'
 * @returns {string}              合并之后的精灵图路径。如：'../images/_spritexxx.png'
 */
map-url($sprite)
```


** `map-width` 获取精灵图总宽 **

```scss
/**
 * 获取精灵图总宽
 * @param   {object} $sprite      <必填> 精灵图名称对象
 * @param   {string} $unit        [选填] 单位，默认'number'，选项'px'、'rem'、'number'
 * @returns {number}              精灵图宽度
 */
map-width($sprite,$unit)
```


** `map-height` 获取精灵图总高 **

```scss
/**
 * 获取精灵图总高
 * @param   {object} $sprite      <必填> 精灵图名称对象
 * @param   {string} $unit        [选填] 单位，默认'number'，选项'px'、'rem'、'number'
 * @returns {number}              精灵图高度
 */
map-height($sprite,$unit)
```


** `sprite-list` 获取精灵图列表 **
```scss
/**
 * 获取精灵图列表
 * @param   {object} $sprite      <必填> 精灵图名称对象
 * @returns {object}              精灵图中所包含的元素名。如：a,b
 */
sprite-list($sprite)
```


** `sprite-width` 获取精灵元素宽 **
```scss
/**
 * 获取精灵元素宽
 * @param   {object} $sprite      <必填> 精灵图名称对象
 * @param   {object} $element     <必填> 精灵元素名。如：a
 * @param   {string} $unit        [选填] 单位，默认'number'，选项'px'、'rem'、'number'
 * @returns {number}              精灵元素宽。如：64
 */
sprite-width($sprite,$element,$unit)
```


** `sprite-height` 获取精灵元素高 **
```scss
/**
 * 获取精灵元素高
 * @param   {object} $sprite      <必填> 精灵图名称对象
 * @param   {object} $element     <必填> 精灵元素名。如：a
 * @param   {string} $unit        [选填] 单位，默认'number'，选项'px'、'rem'、'number'
 * @returns {number}              精灵元素高。如：64
 */
sprite-height($sprite,$element,$unit)
```


** `sprite-x` 获取精灵元素X坐标 **
```scss
/**
 * 获取精灵元素X坐标
 * @param   {object} $sprite      <必填> 精灵图名称对象
 * @param   {object} $element     <必填> 精灵元素名。如：a
 * @param   {string} $unit        [选填] 单位，默认'number'，选项'px'、'rem'、'number'
 * @returns {number}              精灵元素水平起始坐标。如：128
 */
sprite-x($sprite,$element,$unit)
```


** `sprite-y` 获取精灵元素Y坐标 **
```scss
/**
 * 获取精灵元素Y坐标
 * @param   {object} $sprite      <必填> 精灵图名称对象
 * @param   {object} $element     <必填> 精灵元素名。如：a
 * @param   {string} $unit        [选填] 单位，默认'number'，选项'px'、'rem'、'number'
 * @returns {number}              精灵元素水平起始坐标。如：128
 */
sprite-y($sprite,$element,$unit)
```

## 图片相关

** `image-width` 获取图片宽度 **
```scss
/**
 * 获取图片宽度（仅限于src/images内非精灵图图片）
 * @param   {string} $imgPath     <必填> 图片路径
 * @param   {string} $unit        [选填] 返回的单位，默认'number'，选项'px'、'rem'、'number'
 * @returns {string}              图片宽度
 */
image-width($imgPath,$unit)
```
示例：
```scss
width:image-width('../images/logo.png','rem');
```
```css
width:1rem;
```

** `image-height` 获取图片高度 **
```scss
/**
 * 获取图片高度（仅限于src/images/内非精灵图目录图片）
 * @param   {string} $imgPath     <必填> 图片路径
 * @param   {string} $unit        [选填] 返回的单位，默认'number'，选项'px'、'rem'、'number'
 * @returns {string}              图片高度
 */
image-height($imgPath,$unit)
```
示例：
```scss
height:image-height('../images/logo.png','rem');
```
```css
height:1rem;
```

** `inline-image` 将图片转换为base64 **
```scss
/**
 * 将图片转换为base64（仅限于src/images/内非精灵图目录图片）
 * @param   {string} $imgPath     <必填> 图片路径
 * @returns {string}              css图片base64
 */
inline-image($imgPath)
```
示例：
```scss
background-image:inline-image('../images/logo.png','rem');
```
```css
background-image:url('data:image/png;base64,iVBORw0...===');
```

## Mixin

** 输出精灵元素大小 **
```scss
/**
 * 输出精灵元素大小
 * @param   {object} $sprite      <必填> 精灵图名称对象
 * @param   {object} $element     <必填> 精灵元素名。如：a
 * @param   {string} $unit        [选填] 单位，默认'px'，选项'px'、'rem'
 */
@include sprite-size($sprite,$element,$unit);
```

示例结果：
```css
width:64px; height:64px;
```

** 输出精灵元素背景坐标 **
```scss
/**
 * 输出精灵元素背景坐标
 * @param   {object} $sprite      <必填> 精灵图名称对象
 * @param   {object} $element     <必填> 精灵元素名。如：a
 * @param   {number} $offectX     [选填] 横向偏移量，默认0
 * @param   {number} $offectY     [选填] 纵向偏移量，默认0
 * @param   {string} $unit        [选填] 单位，默认'px'，选项'px'、'rem'
 */
@include sprite-position($sprite,$element,$unit,$offectX,$offectY);
```

示例结果：
```css
background-position:-128px -128px;
```

** 输出精灵图背景图像 **
```scss
/**
 * 输出精灵图背景图像
 * @param   {object} $sprite      <必填> 精灵图名称对象
 * @param   {string} $addedPath   [选填] 精灵图的相对路径，默认'../'
 */
@include sprite-url($sprite,$addedPath);
```

示例结果：
```css
background-image:url('../images/_spritexxx.png');
```


** 自定义字体 **
```scss
/**
 * 用于快速定义css webFont
 * @param   {string} $fontName    <必填> 字体名称，例如“hello.ttf”，则为“hello”
 * @param   {string} $addedPath   [选填] 字体相对路径，默认'../images/'
 */
@include font-face($fontName,$addedPath);
```

示例结果：
```css
@font-face {
  font-family: "hello";
  src: url("../images/hello.eot");
  src: url("../images/hello.eot?#images-spider") format("embedded-opentype"), url("../images/hello.woff") format("woff"), url("../images/hello.ttf") format("truetype"), url("../images/hello.svg") format("svg");
  font-weight: normal;
  font-style: normal;
}
```

** 渐变 **
```scss
/**
 * 用于快速定义渐变
 * @param   {string} $colorFrom   <必填> 开始颜色，例如"#ff0000"
 * @param   {string} $colorTo     <必填> 结束颜色，例如"#00ff00"
 * @param   {string} $addedPath   [选填] 渐变方式（'vertical'、'horizontal'、'diagonal1'、'diagonal2'）
 */
@include linear-gradient($colorFrom,$colorTo,$type);
```

** inline-block **

```scss
/**
 * 用于设置元素为inline-block
 */
@include inline-block();
```

示例结果：
```css
display:inline-block; _zoom:1; *zoom:1; _display:inline; *display:inline;
```


** 设置同宽大小 **
```scss
/**
 * 用于一个正方形元素
 * @param   {string} $size        <必填> 元素大小，例如"24px"
 */
@include size($size);
```

示例结果：
```css
width:24px; height:24px;
```


** 等高设置 **
```scss
/**
 * 用于设置元素高&行高
 * @param   {string} $height      <必填> 元素大小，例如"24px"
 */
@include hl($height);
```

示例结果：
```css
height:24px; line-height:24px;
```


**  水平翻转&垂直翻转  **
```scss
/**
 * 用于设置元素水平/垂直翻转
 * @param   {string} $mode        <必填> 翻转方式，(x、y)
 */
@include flip(x);
```

示例结果：
```css
-moz-transform:scaleX(-1); -webkit-transform:scaleX(-1); -o-transform:scaleX(-1); transform:scaleX(-1); filter:FlipH;
```

**  清除浮动  **
```scss
/**
 * 清除浮动
 */
@include clearfix();
```

示例结果：
```css
zoom:1;
&:after {
  content: "."; display: block; height: 0; clear: both; visibility: hidden;
};
```


**  CSS小箭头  **
```scss
/**
 * CSS小箭头
 * @param   {object} $color       <必填> 箭头颜色
 * @param   {object} $size        <必填> 大小
 * @param   {string} $mode        [选填] 箭头指向，默认：b。（t、r、b、l）分别为上、右、下、左
 */
@include arrow($color,$size,$mode);
```

示例结果：
```css
width:0px; height:0px; font-size:0; overflow:hidden; border-width:$size; vertical-align:middle; border-color:transparent transparent $color transparent; border-style:dashed dashed solid dashed;
```

