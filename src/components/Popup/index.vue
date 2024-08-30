<template>
  <view :class="['the-popup fvc', { 'the-popup-show': layer.transition }]" v-show="layer.visible" @click="onMask()">
    <view class="the-popup-content" v-if="layer.visible" @click.stop>
      <view class="the-popup-close" @click="onClose()">
        <Cross />
      </view>
      <scroll-view scroll-y="true" class="the-popup-scroll-view">
        <slot></slot>
      </scroll-view>
    </view>
  </view>
</template>
<script lang="ts">
/** 通用弹窗组件 */
export default {
  name: "Popup"
}
</script>
<script lang="ts" setup>
import Cross from "../Icon/Cross.vue";
import { useTransitionLayer } from "../index";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  title: {
    type: [String, Number],
    default: ""
  },
  /** 是否可以点击遮罩关闭 */
  closeByMask: {
    type: Boolean,
    default: false,
  }
});

const emit = defineEmits<{
  (event: "update:show", val: boolean): void
  (event: "close", val: boolean): void
}>()

const { layer } = useTransitionLayer(() => props.show);

function onMask() {
  props.closeByMask && onClose();
}

function onClose() {
  emit("update:show", false);
  emit("close", false);
}

</script>
<style lang="scss">
.the-popup {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.45);
  z-index: 20;
  transition: $duration;
  opacity: 0;
  padding: 0 48rpx;
  .the-popup-content {
    width: 100%;
    background-color: #fff;
    overflow: hidden;
    border-radius: 16rpx;
    padding: 58rpx 40rpx;
    position: relative;
    transition: $duration;
    transform: translate3d(0, 100px, 0);
  }
  .the-popup-scroll-view {
    width: 100%;
    min-height: 300rpx;
    // 196rpx = 58rpx + 40rpx + 58rpx + 40rpx;
    /*  #ifndef H5  */
    max-height: calc(100vh - 196rpx);
    /*  #endif  */
    /*  #ifdef H5  */
    max-height: calc(100vh - 196rpx - 40px);
    /*  #endif  */
  }
  .the-popup-close {
    position: absolute;
    padding: 6px;
    right: 20rpx;
    top: 20rpx;
  }
}
.the-popup-show {
  opacity: 1;
  .the-popup-content {
    transform: translate3d(0, 0, 0);
  }
}
</style>