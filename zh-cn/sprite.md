# 精灵图合并

遵循FWS目录命名约定，脚手架会自动完成图片合并。同时自动完成精灵图数据的更新。

而这一切都是基于sass标准之上的，意味着即使脱离FWS也能完成编译。

## Sprite 快速开始

首先需要在源文件目录`src/`下任意地方，创建一个以`_sprite`开头的精灵图目录。譬如：

```bash
└─src
    └─images
       └─_spritexxx             # 精灵图目录
               a.png
               b.png
```

如果脚手架有开启监听任务，此时会在开发目录`dev/`下生成合并好的精灵图
```bash
└─dev
    └─images
       └─_spritexxx.png         # 合并出来的精灵图
```

?> **FWS内置了处理相关精灵图的函数，见后续说明。**

使用精灵图。在`src/css/`目录下创建一个sass文件。
```bash
└─src
    └─css
        style.scss              # 精灵图目录
```

style.scss内容
```scss
@charset "utf-8";
@import "fws";                              //需要引入FWS的sass库

$img:map-url($_spritexxx);                  //获取精灵图url
$imgList:sprite-list($_spritexxx);          //获取精灵图列表


```

## Sprite Sass 函数

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

## Sprite Sass Mixin

内置的Sprite Sass Mixin有助于快捷设置元素信息

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
 * @param   {string} $unit        [选填] 单位，默认'px'，选项'px'、'rem'
 * @param   {number} $offectX     [选填] 横向偏移量，默认0
 * @param   {number} $offectY     [选填] 纵向偏移量，默认0
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

## Sprite 规则自定义

允许通过『精灵图目录』命名规则来自定义精灵图排序方式及间距设置。

** 目录命名示例： **

```bash
_spriteImg_lr_0       # 从左到右排序，精灵图间距为0
_spriteImg_lr         # 从左到右排序，精灵图间距使用默认值4
_spriteImg_6          # 自动排序 ，精灵图间距为6
```

** 排序方式： **

```bash
td                    # top-down
lr                    # left-right
d                     # diagonal
ad                    # alt-diagonal
bt                    # binary-tree
```
|         `top-down`        |          `left-right`         |         `diagonal`        |           `alt-diagonal`          |          `binary-tree`          |
|---------------------------|-------------------------------|---------------------------|-----------------------------------|---------------------------------|
| ![top-down][top-down-img] | ![left-right][left-right-img] | ![diagonal][diagonal-img] | ![alt-diagonal][alt-diagonal-img] | ![binary-tree][binary-tree-img] |

[top-down-img]: https://raw.githubusercontent.com/twolfson/layout/2.0.2/docs/top-down.png
[left-right-img]: https://raw.githubusercontent.com/twolfson/layout/2.0.2/docs/left-right.png
[diagonal-img]: https://raw.githubusercontent.com/twolfson/layout/2.0.2/docs/diagonal.png
[alt-diagonal-img]: https://raw.githubusercontent.com/twolfson/layout/2.0.2/docs/alt-diagonal.png
[binary-tree-img]: https://raw.githubusercontent.com/twolfson/layout/2.0.2/docs/binary-tree.png
