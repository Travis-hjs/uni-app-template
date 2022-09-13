# uni-app 通用模板

> 基于[官方脚手架](https://uniapp.dcloud.io/quickstart-cli.html#%E5%88%9B%E5%BB%BAuni-app)创建。

- [预览地址](http://huangjingsheng.gitee.io/hjs/uni-app)

| 分支 | 版本 | 说明 |
|---|---|---|
| [master](https://github.com/Hansen-hjs/uni-app-template) | vue 3.x + vite | 默认版本 |
| [v2](https://github.com/Hansen-hjs/uni-app-template/tree/v2) | vue 2.6 + webpack | - |

## 功能清单

1. `http`请求封装，具体使用看`api/common.ts`的几个示例。

2. `scss`使用，全局样式`styles/index.scss`的自动导入；注意：建立其他`全局样式`文件时，在`styles/index.scss`里面`@import xxx.scss`即可，部分注意事项请看`uni.scss`代码注释

3. 内置了一些常用的工具函数`utils/index.ts`。

4. 表单验证组件

5. 触底加载更多组件

6. 弹出选择器


后面有新功能再补充

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

<script lang="ts">
import { defineComponent, ref } from "vue";
import UploadImg from '@/components/UploadImg/index.vue';
import UserHK from './components/UserHK/index.vue';
import UserKCH from './components/UserKCH/index.vue';

export default defineComponent({
  components: {
    UploadImg,
    UserHK,
    UserKCH
  },
  ...more
})
</script>
```
**这里有个细节：导入的组件带上完整路径和后缀，才能使用`ctrl + 鼠标点击`跳转到对应组件目录**

## 项目配置相关

当前项目所有配置全部集中写在`utils/config.js`文件中，不用再处理各种配置文件，过于复杂，不利于代理组织和维护，动态配置也应该在该文件集中处理。

项目不使用`eslint`，理由是这个工具不够灵活，电脑性能不好的话可能每次改动代码都要等上不少时间，之后可以根据团队小组约定使用。

默认`vscode`配置代码风格约束：

```json
{
  "editor.detectIndentation": false,
  "editor.tabSize": 2,
  "vetur.format.options.tabSize": 2,
  "typescript.updateImportsOnFileMove.enabled": "always",
  "javascript.updateImportsOnFileMove.enabled": "always",
}
```

