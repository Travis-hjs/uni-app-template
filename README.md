# uni-app 通用模板

** 官网地址 ** [https://uniapp.dcloud.io/](https://uniapp.dcloud.io/ "点击跳转")

** 平台兼容说明 ** [https://uniapp.dcloud.io/use](https://uniapp.dcloud.io/use "点击跳转")

### 模板说明：
1. 轻量化项目模板，只保留`vue`最基础的使用方式，保证打包到多端时不需要作太多判断处理

2. 状态管理不建议使用`vuex`,因为会导致代码变得冗余，而且在编辑器中失去代码静态追踪和提示“[被忽略的官方说明](https://vuex.vuejs.org/zh/#%E4%BB%80%E4%B9%88%E6%83%85%E5%86%B5%E4%B8%8B%E6%88%91%E5%BA%94%E8%AF%A5%E4%BD%BF%E7%94%A8-vuex%EF%BC%9F)”所以这边使用一个`Global.js`的模块文件作为全局状态管理，然后逐个继承各个`store`模块来导出使用，使用方式可参考：[你不需要vuex](https://juejin.im/post/5d425a83f265da03d8719cb8) 

3. 模板为了轻量化只保留了`uni-icons`的icon组件，需要其他组件自行添加，[官方扩展组件](https://uniapp.dcloud.io/component/README?id=uniui)，这里推荐使用官方的扩展组件，这样可以确保打包成多端的兼容问题

4. 模板集成了官方的语法声明文件，在常规的`vue`语法中终于有正确的`this`指向了（增加`computed`会失去提示，估计是声明文件的问题）；代码注释建议使用标准的[JSDoc注释](https://blog.csdn.net/qq_40028324/article/details/95623401)，这样的好处是让`JavaScript`项目中也有`TypeScript`一样的代码提示

5. 已经配置好在`manifest.json`文件中h5端请求代理，不需要可剔除

### 目录说明

> `api` 所有接口模块目录

> `components` 通用组件目录

> `mixins` 混入对象目录（混入会使编辑器失去代码追踪提示，谨慎使用）

> `modules` 基础模块目录

> `pages` 主程序页面目录，需要分包自行新建其他页面目录

> `static` 图片或一些静态文件目录

> `store` 各个状态管理类模块目录，全部都由`Global.js`继承 -> 实例化 -> 导出使用

> `styles` 不说了...


## 初始化项目
```
npm install
```

### 运行项目
```
npm run serve
```

### 打包项目，这边建议用官方 HBuildX IDE 去打包
```
npm run build
```

### 在 HBuildX 控制台中出现版本更新提示需要手动升级一下项目
```
npm update
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/)