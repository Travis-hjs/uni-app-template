# 上传组件

## 上传图片组件

使用示例

```html
<template>
  <view>
    <!-- 多个组件时，可以加 uploadId 来区分 -->
    <UploadImage :src="formData.avatar" @change="onUpload" />
  </view>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import UploadImage from "@/components/Upload/Image.vue";

@Component({
  components: {
    LoadMoreTip
  }
})
export default class Demo extends Vue {
    
  formData = {
    avatar: ""
  }

  onUpload(res: { id: string, src: string }) {
    this.formData.avatar = res.src;
  }

}
</script>
```
