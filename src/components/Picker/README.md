# 弹出层选择器

## 日期选择组件

使用示例

```html
<template>
    <view>
        <view>{{ formData.date || "请选择日期" }}</view>
        <button @click="openPickerDate()">打开选择器</button>
        <!-- 默认使用方式，更多配置参数请看组件内部 -->
        <PickerDate :show="showPickerDate" @cancel="closePickerDate" @confirm="onPickerDate" />
    </view>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import PickerDate from "@/components/Picker/Date.vue";

@Component({
    components: {
        PickerDate
    }
})
export default class Demo extends Vue {
    
    formData: {
        date: ""
    }

    showPickerDate = false

    openPickerDate() {
        this.showPickerDate = true;
    }

    closePickerDate() {
        this.showPickerDate = false;
    }

    onPickerDate(val: string) {
        this.formData.date = val;
        this.closePickerDate();
    }

}
</script>
```
