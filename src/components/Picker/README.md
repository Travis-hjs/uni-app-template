# 弹出层选择器

参数说明：

| props |  类型 | 是否必选 | 说明 |
| --- | --- | --- | --- | 
| show | boolean | 是 | 是否显示弹出选择器 |
| title | string,number | 否 | 选择器标题 |
| list | `Array<PickerSelectItem>` | 是 | 选择器数据，最多显示三层 |
| pickerId | string,number | 否 | `change`事件携带的`id`，一个页面有多个组件的时候用来区分用 |

`PickerSelectItem`说明：

```js
/** 选择器`item`数据 */
interface PickerSelectItem<T = any> {
    /** 展示字段 */
    label: string
    /** 对应的值 */
    value: T
    /**
     * 下级数据
     * @description 最多三层，选择器栏目数根据当前下级动态显示
    */
    children?: Array<PickerSelectItem>
    /** 其他携带的值 */
    [key: string]: any
}
```

**使用示例**

```html
<template>
    <view>
        <view>{{ selectLabel || "请选择" }}</view>
        <button @click="openPicker()">打开选择器</button>
        
        <ThePicker :show="showPicker" @cancel="closePicker" @confirm="onPicker" :list="options" />
    </view>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ThePicker from "@/components/Picker/index.vue";

@Component({
    components: {
        ThePicker
    }
})
export default class Demo extends Vue {
    
    options = [
        { label: "选项一", value: 1 },
        { label: "选项二", value: 2 },
        {
            label: "两级选项", value: 3,
            children: [
                { label: "二级-1", value: 1 },
                { label: "二级-2", value: 2 },
            ]
        },
    ];

    showPicker = false;

    /** 展示的值 */
    selectLabel = "";

    /** 选中的值 */
    selectValue = [];

    openPicker() {
        this.showPicker = true;
    }

    closePicker() {
        this.showPicker = false;
    }

    onPicker(res: { id: string, value: Array<PickerSelectItem<number>> }) {
        this.selectValue = res.value.map(item => item.value);
        this.selectLabel = res.value.map(item => item.label).join("-");
        this.closePicker();
    }

}
</script>
```

## 日期选择组件

| props |  类型 | 是否必选 | 说明 |
| --- | --- | --- | --- | 
| show | boolean | 是 | 是否显示弹出选择器 |
| title | string,number | 否 | 选择器标题 |
| type | string: `Y-M-D`,`Y-M`,`Y` | 否，默认`Y-M-D` | 分别对应年月日 |
| value | string | 否 | 初始化选中值，格式和`type`对应 |
| startDate | string | 否 | 开始日期，格式和`type`对应 |
| endDate | string | 否 | 结束日期，格式和`type`对应 |

细心看过`index.vue`的可以发现，其实可以二次封装一下日期数据就可以复用上面的组件，这里我单独抽出来的理由是：因为上面的组件需要依赖固定的上下级数据，如果日期选择两个年份差较大的话，会导致庞大的日期数据；另外日期的范围逻辑也跟其他的选项数据不太一样，所以这里单独抽出来性能会好很多。

**使用示例**

```html
<template>
    <view>
        <view>{{ selectLabel || "请选择" }}</view>
        <button @click="openPicker()">打开选择器</button>
        <!-- 默认使用方式 -->
        <PickerDate :show="showPickerDate" @cancel="closePickerDate" @confirm="onPickerDate" />

        <!-- 设置范围和初始值 -->
        <!-- <PickerDate :show="showPickerDate" @cancel="closePickerDate" @confirm="onPickerDate" value="2020-06-08" startDate="2019-03-12" endDate="2021-02-04" /> -->
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

    selectLabel = "";
    
    showPickerDate = false;

    openPickerDate() {
        this.showPickerDate = true;
    }

    closePickerDate() {
        this.showPickerDate = false;
    }

    onPickerDate(val: string) {
        this.selectLabel = val;
        this.closePickerDate();
    }

}
</script>
```