# 明源小管家-物品领用-管理后台
> 明源企业号-明源小管家-物品领用-管理后台

## UI 框架说明
- 基于[vue-element-admin](https://github.com/PanJiaChen/vue-element-admin)项目搭建

## 开发
```bash
    # 安装依赖
    npm install

    npm install --registry=https://registry.npm.taobao.org
    
    # node-sass 报错的，请用 cnpm 安装 node-sass
 
    # 本地开发 开启服务
    npm run dev
```
浏览器访问 [http://localhost:9527](http://localhost:9527)

## 发布
```bash
    # 发布测试环境 带webpack ananalyzer
    npm run build:sit-preview

    # 构建生成环境
    npm run build:prod
```

## 目录结构
```shell
├── build                      // 构建相关  
├── config                     // 配置相关
├── src                        // 源代码
│   ├── api                    // 所有请求
│   ├── assets                 // 主题 字体等静态资源
│   ├── components             // 全局公用组件
│   ├── directive              // 全局指令
│   ├── filtres                // 全局filter
│   ├── mock                   // mock数据
│   ├── router                 // 路由
│   ├── store                  // 全局store管理
│   ├── styles                 // 全局样式
│   ├── utils                  // 全局公用方法
│   ├── view                   // view
│   ├── App.vue                // 入口页面
│   └── main.js                // 入口 加载组件 初始化等
├── static                     // 第三方不打包资源
│   ├── jquery
│   └── Tinymce                // 富文本
├── .babelrc                   // babel-loader 配置
├── eslintrc.js                // eslint 配置项
├── .gitignore                 // git 忽略项
├── favicon.ico                // favicon图标
├── index.html                 // html模板
└── package.json               // package.json

```
## 状态管理
后台只有user和app配置相关状态使用vuex存在全局，其它数据都由每个业务页面自己管理。


## About the project name "Andrew"
- 项目名Andrew，音译为安德鲁，人名。1999年的电影“[机器管家](https://zh.wikipedia.org/zh/%E6%9C%BA%E5%99%A8%E7%AE%A1%E5%AE%B6)”，是早期探讨人与机器人之间感情的剧作，剧中主角机器管家就叫Andrew
- 取名 Andrew 向这部影片及主演 *罗宾·威廉姆斯* 致敬。
- 希望我们的【小管家-物品领用】也和 Andrew 一样可靠、可爱。
