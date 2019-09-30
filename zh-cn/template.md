# 自定义项目模版

在`fws安装目录/tpl/_config/`目录中，每一个json配置文件对应着一份项目配置模版。

在执行创建任务时会根据指定的配置文件来生成项目目录结构。

例如：`fws安装目录/tpl/_config/demo.json`，内容如下：

```text
{
    "__name__":"模版名称",                      # 该名称在查看创建帮助任务时（`fws create -h`）出现
    "__files__":[                              # key为`__files__`脚手架将识别为创建文件操作
        ["pug/index.pug","home.pug"]           # 复制fws安装目录/tpl/pug/index.pug文件到根目录，并改名为home.pug
    ],
    "data":{                                   # 创建的目录名
        "__files__":[
            ["data/_public.js","_public.js"],  # 复制fws安装目录/tpl/data/_public.js
            ["data/index.js","index.js"]            
        ]
    },
    "css":{},                                  # key为目录名
    "js":{},
    "images":{
        "home":{}
    }
}
```

执行`fws create Project  -t demo`之后创建的文件结构将如下所示：

```bash
Project
│  home.pug
│
├─css
├─data
│      index.js
│      _public.js
│
├─images
│  └─home
└─js
```

- key为`__name__`指定模版名称
- key为`__files__`脚手架将识别为创建文件，否则将为创建目录

