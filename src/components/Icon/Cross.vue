<template>
  <view
    class="the-cross"
    :style="{
      width: size,
      height: size,
      '--line-width': lineWidth,
      '--line-color': color
    }"
  >
    <view :class="['the-cross-line', type]"></view>
    <view :class="['the-cross-line', type]"></view>
  </view>
</template>
<script lang="ts">
import type { PropType } from "vue";

/**
 * 交叉图标组件
 */
export default {
  name: "Cross",
  props: {
    type: {
      type: String as PropType<"close" | "plus">,
      default: "close"
    },
    /** 矩阵宽高 */
    size: {
      type: String,
      default: "32rpx"
    },
    /** 线条的宽度 */
    lineWidth: {
      type: String,
      default: "2px"
    },
    /** 线条颜色 */
    color: {
      type: String,
      default: "#666"
    },
  },
}
</script>
<style lang="scss">
.the-cross {
  // width: 32rpx;
  // height: 32rpx;
  // --line-width: 2px;
  // --line-color: #666;
  position: relative;
  .the-cross-line {
    background-color: var(--line-color);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: calc(var(--line-width) / 2);
  }
  .the-cross-line:nth-child(1) {
    width: 100%;
    height: var(--line-width);
  }
  .the-cross-line:nth-child(2) {
    width: var(--line-width);
    height: 100%;
  }
  .the-cross-line.close {
    transform: translate(-50%, -50%) rotate(45deg);
  }
}
</style>