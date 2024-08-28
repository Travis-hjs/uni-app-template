<template>
  <view class="the-cross" :style="{ 'width': size, 'height': size, '--line-width': lineWidth }">
    <view :class="['the-cross-line', type]" :style="{ 'background-color': color }"></view>
    <view :class="['the-cross-line', type]" :style="{ 'background-color': color }"></view>
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
    size: String,
    /** 线条的宽度 */
    lineWidth: String,
    /** 线条颜色 */
    color: String,
  }
}
</script>
<style lang="scss">
.the-cross {
  width: 32rpx;
  height: 32rpx;
  position: relative;
  --line-width: 2px;
  .the-cross-line {
    background-color: #666;
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