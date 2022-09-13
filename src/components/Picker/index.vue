<template>
  <view :class="['the-picker fwrap', { 'the-picker-show': show }]">
    <view class="f1" @click="clickCancel()"></view>
    <view class="picker-content">
      <!-- 操作栏 -->
      <view class="picker-option fvertical">
        <view class="btn" @click="clickCancel()">取消</view>
        <view class="f1 picker-title">{{ title }}</view>
        <view class="btn confirm" @click="clickConfirm()">确定</view>
      </view>
      <!-- 选择栏 -->
      <picker-view class="picker-view" indicator-style="height: 36px;" @change="pickerChange">
        <picker-view-column v-show="list.length > 0">
          <view class="picker-item ellipsis_1" v-for="(item, index) in list" :key="index">{{ item.label }}</view>
        </picker-view-column>
        <picker-view-column v-show="secondList.length > 0">
          <view class="picker-item ellipsis_1" v-for="(item, index) in secondList" :key="index">{{ item.label }}</view>
        </picker-view-column>
        <picker-view-column v-show="thirdList.length > 0">
          <view class="picker-item ellipsis_1" v-for="(item, index) in thirdList" :key="index">{{ item.label }}</view>
        </picker-view-column>
      </picker-view>
    </view>
  </view>
</template>
<script lang="ts">
import { defineComponent, PropType, ref, watch, nextTick } from "vue";
import { PickerSelectItem } from "@/types";
import { checkType } from "@/utils";

/**
 * 底部弹出选择组件
 */
export default defineComponent({
  name: "ThePicker",
  props: {
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
  },
  setup(props, context) {
    /** 选中的索引列表 */
    let selectIndexs = [0, 0, 0];
    /** 第二级列表 */
    const secondList = ref<Array<PickerSelectItem>>([]);
    /** 第三级列表 */
    const thirdList = ref<Array<PickerSelectItem>>([]);

    function update() {
      const list = props.list;
      const indexs = selectIndexs;
      const column = props.column;

      const hasSecond = list.length && list[indexs[0]] && list[indexs[0]].children && list[indexs[0]].children!.length > 0;

      if (column >= 2) {
        secondList.value = hasSecond ? list[indexs[0]].children! : [{ label: "-", value: "" }];
      } else if (column === 0) {
        secondList.value = hasSecond ? list[indexs[0]].children! : [];
      }

      const second = secondList.value;
      const hasThird = second.length > 0 && second[indexs[1]] && second[indexs[1]].children && second[indexs[1]].children!.length > 0;

      if (column >= 3) {
        thirdList.value = hasThird ? second[indexs[1]].children! : [{ label: "-", value: "" }];
      } else if (column === 0) {
        thirdList.value = hasThird ? second[indexs[1]].children! : [];
      }
    }

    function clickCancel() {
      context.emit("cancel");
    }

    function pickerChange(e: UniAppChangeEvent<Array<number>>) {
      // console.log(e.detail.value);
      const list = e.detail.value;
      const val1 = checkType(list[0]) === "number" ? list[0] : 0;
      const val2 = checkType(list[1]) === "number" ? list[1] : 0;
      const val3 = checkType(list[2]) === "number" ? list[2] : 0;
      selectIndexs = [val1, val2, val3];
      update();
    }

    function clickConfirm() {
      const indexs = selectIndexs;
      const result = [props.list[indexs[0]]];

      if (secondList.value[indexs[1]]) {
        result.push(secondList.value[indexs[1]]);
      }
      if (thirdList.value[indexs[2]]) {
        result.push(thirdList.value[indexs[2]]);
      }

      context.emit("confirm", {
        id: props.pickerId,
        value: result.filter(item => item.value !== ""),
      });
    }

    watch(() => props.list, function () {
      nextTick(function () {
        update();
      })
    }, { immediate: true });

    return {
      secondList,
      thirdList,
      clickCancel,
      pickerChange,
      clickConfirm,
    };
  }
})
</script>
<style lang="scss">
@import "./picker.scss";
</style>
