<template>
  <view class="scroll-tab">

    <scroll-view scroll-x="true" scroll-with-animation :scroll-left="state.scrollLeft1" class="list-1 mgb-50">
      <view class="tab-box flex">
        <view :class="['tab-item fvc', { 'active': state.activeValue1 === item.value }]" v-for="item in list" @click="onTab1(item, $event)" :id="'one-' + item.value" :key="item.value">
          {{ item.label }}
        </view>
      </view>
    </scroll-view>

    <scroll-view scroll-x="true" scroll-with-animation :scroll-left="state.scrollLeft2" class="list-2" id="list-2">
      <view class="tab-box flex">
        <view :class="['tab-item fvc', { 'active': state.activeValue2 === item.value }]" v-for="item in list" @click="onTab2(item, $event)" :id="'two-' + item.value" :key="item.value">
          {{ item.label }}
        </view>
      </view>
    </scroll-view>

  </view>
</template>
<script lang="ts" setup>
import { getCurrentInstance, reactive } from "vue";
import { onReady } from "@dcloudio/uni-app";
import { randomText } from "@/utils";
import { onScrollviewCenter } from "@/utils/control";

const instance = getCurrentInstance();

const list = new Array(12).fill(0).map(function (item, index) {
  return {
    label: randomText(2, 6),
    value: index,
  };
});

const state = reactive({
  activeValue1: 0,
  scrollLeft1: 0,

  activeValue2: 0,
  scrollLeft2: 0,
});

function onTab1(item: { value: number }, e: Event) {
  state.activeValue1 = item.value;
  onScrollviewCenter({
    ctx: instance,
    id: "one-" + item.value,
    event: e,
    callback(left) {
      state.scrollLeft1 = left;
    },
  });
}

/** list-2 节点宽度 */
let list2Width = 0;

function onTab2(item: { value: number }, e?: Event) {
  state.activeValue2 = item.value;
  onScrollviewCenter({
    ctx: instance,
    id: "two-" + item.value,
    event: e,
    wrapWidth: list2Width,
    callback(left) {
      state.scrollLeft2 = left;
    },
  });
}

onReady(function () {
  const node = uni.createSelectorQuery().in(instance).select("#list-2");
  node.boundingClientRect(function (info) {
    list2Width = Array.isArray(info) ? info[0].width! : info.width!;
  }).exec();

  // 页面初始化选中某个选项
  state.activeValue1 = 5;
  onScrollviewCenter({
    ctx: instance,
    id: "one-" + 5,
    scrollValue: state.scrollLeft1,
    callback(left) {
      state.scrollLeft1 = left;
    },
  });
});

</script>
<style lang="scss">
.scroll-tab {
  width: 100%;
  .tab-box {
    .tab-item {
      white-space: nowrap;
      padding: 0 30rpx;
      font-size: 30rpx;
      color: #555;
      height: 90rpx;
    }
    .tab-item.active {
      color: orange;
      border-bottom: solid 2px orange;
    }
  }

  .list-1 {
    width: 100%;
    height: 90rpx;
    background-color: #eee;
  }

  .list-2 {
    width: 80%;
    height: 90rpx;
    margin: 0 auto;
    background-color: #eee;
    .tab-item.active {
      color: #2c72f3;
      border-color: #2c72f3;
    }
  }
}
</style>