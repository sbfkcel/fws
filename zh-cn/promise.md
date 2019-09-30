# 项目文件结构及命名约定

FWS项目目录结构不限于后续栏目中所列出的结果。

!> 但是，一个有效的FWS项目必须包含`fws_config.js`（项目配置文件）和`src/`源文件目录。


## 项目文件结构

FWS默认创建的项目目录结构大致如下:

```bash
项目目录名称
│  fws_config.js            # 项目配置文件
├─dev                       # 开发目录
├─dist                      # 生产目录
└─src                       # 源文件目录
    │  index.pug
    │  _header.pug          # 以'_'开始，则为pug公共文件
    ├─css
    │  │  style.scss
    │  │  _header.scss      # 以'_'开始，则为scss公共文件
    │  └─_fws               # 由脚手架自动创建的sass依赖文件（如：精灵图数据...）
    ├─data                  # pug数据目录
    │      index.js         # 页面数据文件，与项目中的'index.pug'页面对应
    │      _public.js       # '_'公共数据文件
    ├─images
    │  │  logo.png
    │  └─_spritexxx         # 精灵图目录，以'_sprite'开始的目录则识别为精灵图目录
    │          a.png
    │          b.png
    ├─js                    # javascript目录
    │      main.es6
    │
    └─media                 # 多媒体资源目录
```
?> `fws_config.js`为项目配置文件


## 命名空间

- 以`_`开始的文件，则识别为同类型的公共文件。不会被编译出独立的文件；
- 以`_sprite`开始的目录名则为精灵图目录。目录下的`png`、`svg`文件都会合成为**sprite**精灵图；
- 以`_`开始的目录名为保留的命名空间，通常项目中此类目录都由FWS自动创建；
- `.js`、`.html`、`.css`文件不会被编译处理，但在构建过程中还是会进行压缩和签名处理；
- `.ts`、`.tsx`、`.jsx`、`.es6`、`.es`会被编译成符合es2015规范的`.js`文件；
- `src/data/`是pug数据目录，不能被更换路径；
- `src/css/`是样式目录，FWS内置的sass mixin、sass function、精灵图数据都依赖于该目录，不能被更换路径；




!> 所有编译出的`.js`文件仅转换语法，es6新增加的函数（forEach、Promise...）不会作转换，请自行引入`babel-polyfill`到项目。
