<template>
  <view class="the-arrow" :style="useStyle">
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
        "--line-color": this.color
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
.the-arrow {
  width: 20rpx;
  height: 20rpx;
  --line-width: 1px;
  --line-color: #999;
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