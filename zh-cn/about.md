# FWS

> FWS是front-end Workspace的简称。

## 前言

FWS是一个高效、便捷的前端开发工作流脚手架。

随着前端技术的发展，逐渐改变了front-end Web developer的代码编写习惯，顺之也成为推动前端工程化的基础。

前端脚手架工具有很多（yeoman、Grunt、Gulp、Webpack...），但多少都有一堆烦杂的配置。且经常在脚手架搭建的过程中因为再次被包装过的插件会造成一些奇奇怪怪的问题。

FWS希望能解决一些烦琐的过程（脚手架环境搭建、项目配置等...），尽可能最大限度的照顾到主流工作习惯。

由于FWS是基于Node.js的，所以跨平台支持是理所应当的了。FWS具有较强的可扩展性，也可根据团队需要自行定义任务流。

?> FWS提供编译&压缩策略API。可部署在集成服务器来处理项目发布策略，又或是用于优化业务环节。



## 功能

- 自动化

    - Sass -> css 编译
    - Pug -> html 编译
    - Typescript、Es6、Es、Jsx -> javascript 编译
    - javascript 文件打包合并，统一封装规范
    - CSS Autoprefixer 前缀自动补全
    - CSS Sprite 雪碧图自动合并，并生成sass数据
    - CSS Opacity 透明度自动兼容
    - 文件压缩（css、javascript、png、jpg、gif）
    - 文件签名（css、javascript、html）
    - 字体精简（css Font-face）


- 开发调试

    - 开发过程中。脚手架会自动监听文件改动，自动刷新页面或热更页面资源
    - 开发模式下完整的调集信息

## License

![License](https://img.shields.io/badge/license-MIT License-f8458a.svg)


