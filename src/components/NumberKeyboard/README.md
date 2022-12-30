# 虚拟数字键盘+验证输入框

## 使用方式

```html
<template>
  <view>
    <NumberKeyboard :total="6" @change="onKeyBoard" />
  </view>
</template>
<script lang="ts" setup>
import NumberKeyboard from "@/components/NumberKeyboard/index.vue";

function onKeyBoard(val: string) {
  console.log("结果 >>", val);
}
</script>
```
