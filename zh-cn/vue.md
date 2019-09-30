# Vue 支持

Vue的编译策略与普通的项目有所差异，因此需要在`fws_config.js`中指定项目类型为`vue`。

FWS的项目创建任务内置了Vue项目创建模版，见后续说明。

## 创建Vue项目

```bash
fws create <项目名称> -t vue
```

## 监听编译

```bash
# 进入到项目目录
cd <项目目录>

# 开启项目监听
fws watch -b -s
```

## 项目编译

```bash
fws build
```

