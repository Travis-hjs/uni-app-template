<template>
  <view
    class="the-arrow"
    :style="{
      width: size,
      height: size,
      '--line-width': lineWidth,
      '--line-color': color
    }"
  >
    <view :class="['the-arrow-icon', type]"></view>
  </view>
</template>
<script lang="ts">
import type { PropType } from "vue";

/** 箭头图标 */
export default {
  name: "Arrow",
  props: {
    type: {
      type: String as PropType<"right"|"left"|"top"|"bottom">,
      default: "right"
    },
    /** 矩阵宽高 */
    size: {
      type: String,
      default: "20rpx"
    },
    /** 线条的宽度 */
    lineWidth: {
      type: String,
      default: "1px"
    },
    /** 线条颜色 */
    color: {
      type: String,
      default: "#999"
    },
  }
}
</script>
<style lang="scss">
.the-arrow {
  // width: 20rpx;
  // height: 20rpx;
  // --line-width: 1px;
  // --line-color: #999;
  .the-arrow-icon {
    width: 100%;
    height: 100%;
    border-right: solid var(--line-width) var(--line-color);
    border-top: solid var(--line-width) var(--line-color);
    transition: 0.24s all;
  }
  .the-arrow-icon.right {
    transform: rotate(45deg) translate3d(-20%, 20%, 0);
  }
  .the-arrow-icon.bottom {
    transform: rotate(135deg) translate3d(-20%, 20%, 0);
  }
  .the-arrow-icon.left {
    transform: rotate(225deg) translate3d(-20%, 20%, 0);
  }
  .the-arrow-icon.top {
    transform: rotate(315deg) translate3d(-20%, 20%, 0);
  }
}
</style>