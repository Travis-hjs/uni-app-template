# 通用组件目录

局部/业务组件不建议在这里面

- **按需导入组件**：大写开头 + 驼峰式命名

- **全局组件**：全小写 + 横杆连接命名

## 差异化行为

组件中的`index.ts`导出的组件字段，可以在任意地方输入对应的关键字然后`vscode`就会自动导入，如果是`export default`则没有智能提示。
不过这种写法只仅限在`H5`环境下才生效，因为小程序中注册的组件实现方式和`H5`有差异性行为

- 在`h5`中

```html
<template>
  ... other
  <LoadMoreTip :info="loadMoreData" />
</template>
<script setup>
import { LoadMoreTip, useLoadMore } from "@/components/LoadMoreTip";

const { loadMoreData, setRequestListFn, refreshData } = useLoadMore();

</script>
```

- 其他端中

```html
<template>
  ... other
  <LoadMoreTip :info="loadMoreData" />
</template>
<script setup>
import LoadMoreTip from "@/components/LoadMoreTip/index.vue";
import useLoadMore from "@/hooks/loadMore";

const { loadMoreData, setRequestListFn, refreshData } = useLoadMore();

</script>
```
