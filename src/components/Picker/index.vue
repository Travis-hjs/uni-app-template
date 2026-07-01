<template>
  <view :class="['the-picker f-wrap', { 'the-picker-show': layer.transition }]" v-show="layer.visible">
    <view class="f1" @click="clickCancel()"></view>
    <view class="picker-content">
      <!-- 操作栏 -->
      <view class="picker-option f-vertical">
        <view class="btn" @click="clickCancel()">取消</view>
        <view class="f1 picker-title">{{ title }}</view>
        <view class="btn confirm" @click="clickConfirm()">确定</view>
      </view>
      <!-- 选择栏 -->
      <picker-view class="picker-view" indicator-style="height: 36px;" :value="state.indexes" @change="pickerChange">
        <picker-view-column v-show="list.length > 0">
          <view class="picker-item ellipsis-1" v-for="(item, index) in list" :key="index">{{ item.label }}</view>
        </picker-view-column>
        <picker-view-column v-show="state.seconds.length > 0">
          <view class="picker-item ellipsis-1" v-for="(item, index) in state.seconds" :key="index">{{ item.label }}</view>
        </picker-view-column>
        <picker-view-column v-show="state.thirds.length > 0">
          <view class="picker-item ellipsis-1" v-for="(item, index) in state.thirds" :key="index">{{ item.label }}</view>
        </picker-view-column>
      </picker-view>
    </view>
  </view>
</template>
<script lang="ts">
/**
 * 底部弹出选择组件
 */
export default {
  name: "ThePicker"
}
</script>
<script lang="ts" setup>
import { type PropType, watch, nextTick } from "vue";
import type { PickerSelectItem } from "@/types";
import { isType } from "@/utils";
import { useTransitionLayer } from "../index";
import { reactive } from "vue";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  /** `change`事件携带的`id` */
  pickerId: {
    type: [Number, String],
    default: "",
  },
  /** 选择列表 */
  list: {
    type: Array as PropType<Array<PickerSelectItem>>,
    default: () => [],
  },
  title: {
    type: [String, Number],
    default: "",
  },
  /** 列数，0-3 */
  column: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits<{
  (event: "cancel"): void
  (event: "confirm", res: { id: any, value: Array<PickerSelectItem<any>> }): void
}>();

const state = reactive({
  /** 选中的索引列表 */
  indexes: [0, 0, 0],
  /** 第二级列表 */
  seconds: [] as Array<PickerSelectItem>,
  /** 第三级列表 */
  thirds: [] as Array<PickerSelectItem>,
});

function update() {
  const list = props.list;
  const indexes = state.indexes;
  const column = props.column;

  const hasSecond = list.length && list[indexes[0]] && list[indexes[0]].children && list[indexes[0]].children!.length > 0;

  if (column >= 2) {
    state.seconds = hasSecond ? list[indexes[0]].children! : [{ label: "-", value: "" }];
  } else if (column === 0) {
    state.seconds = hasSecond ? list[indexes[0]].children! : [];
  }

  const second = state.seconds;
  const hasThird = second.length > 0 && second[indexes[1]] && second[indexes[1]].children && second[indexes[1]].children!.length > 0;

  if (column >= 3) {
    state.thirds = hasThird ? second[indexes[1]].children! : [{ label: "-", value: "" }];
  } else if (column === 0) {
    state.thirds = hasThird ? second[indexes[1]].children! : [];
  }
}

function clickCancel() {
  emit("cancel");
}

function pickerChange(e: UniAppChangeEvent<Array<number>>) {
  // console.log(e.detail.value);
  const list = e.detail.value;
  const val1 = isType(list[0], "number") ? list[0] : 0;
  const val2 = isType(list[1], "number") ? list[1] : 0;
  const val3 = isType(list[2], "number") ? list[2] : 0;
  state.indexes = [val1, val2, val3];
  update();
}

function clickConfirm() {
  const indexes = state.indexes;
  const result = [props.list[indexes[0]]];

  if (state.seconds[indexes[1]]) {
    result.push(state.seconds[indexes[1]]);
  }
  if (state.thirds[indexes[2]]) {
    result.push(state.thirds[indexes[2]]);
  }

  emit("confirm", {
    id: props.pickerId,
    value: result.filter(item => item.value !== ""),
  });
}

const { layer } = useTransitionLayer(() => props.show);

watch(() => props.list, function () {
  nextTick(function () {
    update();
  })
}, {
  immediate: true
});

defineExpose({
  /**
   * 设置当前选择器选中的位置，即索引
   * @param indexes 
   */
  setIndexes(indexes: Array<number>) {
    const current = state.indexes;
    state.indexes = Object.assign(current, indexes);
  }
});

</script>
<style lang="scss" src="./picker.scss"></style>
