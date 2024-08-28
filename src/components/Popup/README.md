# 弹出窗组件

## 使用示例

```html
<template>
  <view>
    <button @click="showPopup = !showPopup">打开弹框</button>

    <Popup v-model:show="showPopup" closeByMask>
      <div style="width: 100%; height: 300px; background-color: orange">内容</div>
    </Popup>
  </view>
</template>
<script lang="ts" setup>
import Popup from "@/components/Popup/index.vue";
import { ref } from "vue";

const showPopup = ref(false);
</script>
```
