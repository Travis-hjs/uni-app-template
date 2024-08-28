<template>
  <view class="the-cross" :style="useStyle">
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
    size: String,
    /** 线条的宽度 */
    lineWidth: String,
    /** 线条颜色 */
    color: String,
  },
  computed: {
    // 傻逼小程序不会过滤 undefined 的值，导致默认参数有问题，这里处理一下
    useStyle() {
      const map: BaseObj<string | undefined> = {
        "width": this.size,
        "height": this.size,
        "--line-width": this.lineWidth,
        "--bg-color": this.color
      }
      for (const key in map) {
        if (!map[key]) {
          delete map[key];
        }
      }
      return map;
    }
  }
}
</script>
<style lang="scss">
.the-cross {
  width: 32rpx;
  height: 32rpx;
  position: relative;
  --line-width: 2px;
  --bg-color: #666;
  .the-cross-line {
    background-color: var(--bg-color);
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