# uni-app 通用模板

- 基于[官方脚手架](https://uniapp.dcloud.io/quickstart-cli.html#%E5%88%9B%E5%BB%BAuni-app)创建。

- [预览地址](https://travis-hjs.github.io/uni-app)

| 分支 | 版本 | 说明 |
|---|---|---|
| [master](https://github.com/Hansen-hjs/uni-app-template) | vue 3.x + vite | 默认版本 |
| [v2](https://github.com/Hansen-hjs/uni-app-template/tree/v2) | vue 2.6 + webpack | - |

## 功能清单

- `http`请求封装 [使用示例](./src/api/README.md)，在使用时，`request`函数始终返回`Promise.resolve`，所以在调用时只需要判断`res.code`即可，不需要在外部再包多一层`try catch`，这样的好处在`Promise.all([ ... ])`的使用场景时非常明显。

- `scss`使用，全局样式`styles/index.scss`的自动导入；注意：建立其他`全局样式`文件时，在`styles/index.scss`里面`@import xxx.scss`即可，部分注意事项请看`uni.scss`代码注释

- 内置了一些常用的工具函数 [utils/index.ts](./src/utils/index.ts)。

- 表单验证组件 [使用示例](./src/components/Form/README.md)

- 触底加载更多组件 + 组合函数 [使用示例](./src/components/LoadMoreTip/README.md)

- 弹出选择器 [使用示例](./src/components/Picker/README.md)

- 状态管理：当前没有使用`Vuex`或者`Pinia`，因为这些库始终会随着版本更新而不断调整或被抛弃，`Vuex`就是后者，而且每出一个库，开发者都要去翻对应的文档学一遍。所以在`vue 2.x`的时候我就抛弃了这种繁琐而不适用未来的状态库，而是采用程序设计模式去代替库的方案：参考 [你不需要vuex](https://juejin.im/post/5d425a83f265da03d8719cb8)。

## 自定义组件使用大写+驼峰

在`<template>`中，自己写的组件建议使用大写的方式，理由有两点

1. 便于区分一些第三方库或者框架类的组件，这些就用小写+`-`连接，自定义的组件使用大写+驼峰式；

2. 页面标签很多时，能快速定位组件和排查组件问题所在，因为`import`进来使用的时候，就是大写+驼峰式，所以直接双击变量然后`ctrl + D`就可以找到对应位置了，而且编辑器颜色对大写开头的组件也有颜色区分；

示例：

```html
<template>
  <div>
    ...一些其他标签
    <!-- 默认使用方式 -->
    <UploadImg :src="formData.pageAdImg" @change="onUpload" tip="尺寸规格：750px * 391px" />
    ...一些其他标签
    <UserHK :show="showUserHK" @close="closeUserHK" :pageType="pageType" @update="getHkUsers" />
    ...一些其他标签
    <UserKCH :show="showUserKCH" @close="closeUserKCH" :pageType="typeKCH" @update="getKchUsers" :info="infoUserKCH" />
    ...一些其他标签
  </div>
</template>

<script setup lang="ts">
import { defineComponent, ref } from "vue";
import UploadImg from '@/components/UploadImg/index.vue';
import UserHK from './components/UserHK/index.vue';
import UserKCH from './components/UserKCH/index.vue';
</script>
```

**在H5中一些导出组件写法和其他端有差异，具体看[组件描述文件](./src/components/README.md);**

## 项目配置相关

当前项目所有配置全部集中写在`utils/config.js`文件中，不用再处理各种配置文件，过于复杂，不利于代码组织和维护，动态配置也应该在该文件集中处理。

当前模板只提供必需的功能，功能模块之间尽可能保证低耦合性，这对所有开发者都是一件非常有利的事情，例如你无需担心替换、修改某一功能时影响到其他。另外更为重要的是：当前所有已实现功能都不依赖任何第三方库（`vue-router`除外），这意味着你可以无需关心`package.json`的依赖版本，因为根本就没有其他依赖，所以根据自己的喜好去引入第三方库的时候会非常舒服。

像前端工程化配置`ESLint`、`StyleLint`、`git-husky`等这类开发约束工具这里一律不使用，理由有以下几点：

- 规则的东西不适用作为通用型项目，因为有很多自由开发者、初学者、后端开发者等，他们在使用时并不需要，这些工具只会使其在初次接触中变得束手无策，所以这违背了我写这个项目的初衷。

- 其次就是这些约束工具对开发效率的提升通常为 **0**，因为在提交代码的时候需要进行全局检查或者对部分文件检查，所以要花费大量的时间去干等；另外`ESlint`这个东西在实际的开发场景中，并不能有效地提高代码质量，因为爱写垃圾的人不管用什么工具都始终会写垃圾代码，有了这些工具只不过是让写出来的垃圾代码变得好看而已，而且在`ts`中，只要不是写的过多`any`，基本都有语法和写法的报错检查，所以`ESlint`的作用就显得很鸡肋，在过去`js`项目中或许有用，但在`ts`中真的可有可无，不如来一个`Prettier`代码格式化工具来得实际。

- 代码约束的工具运行时会消耗过大的内存，在一些电脑性能不那么高的设备上会非常卡顿，这使得开发过程十分笨重。更重要的是，有时候过多的工具检测报错会导致进程崩溃，尽管你的代码可以正常运行。

## tsc 类型检查

强烈建议在每个平台的开发环境中使用，理由可以全面检查一些遗漏的报红未处理操作，例如

```json
{
  "scripts": {
    // "dev:mp-weixin": "uni -p mp-weixin" // 没加 tsc 前
    "dev:mp-weixin": "vue-tsc --noEmit && uni -p mp-weixin"
  }
}
```
