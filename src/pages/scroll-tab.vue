<template>
  <view class="scroll-tab">

    <scroll-view scroll-x="true" scroll-with-animation :scroll-left="state.scrollLeft1" class="list-1 mgb_50">
      <view class="tab-box flex">
        <view :class="['tab-item fvc', { 'active': state.activeValue1 === item.value }]" v-for="item in list" @click="onTab1(item, $event)" :id="'one-' + item.value" :key="item.value">
          {{ item.label }}
        </view>
      </view>
    </scroll-view>

    <scroll-view scroll-x="true" scroll-with-animation :scroll-left="state.scrollLeft2" class="list-2" id="list-2">
      <view class="tab-box flex">
        <view :class="['tab-item fvc', { 'active': state.activeValue2 === item.value }]" v-for="item in list" @click="onTab2(item, $event, '')" :id="'two-' + item.value" :key="item.value">
          {{ item.label }}
        </view>
      </view>
    </scroll-view>

  </view>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { randomText } from "@/utils";
import { onScrollviewCenter } from "@/utils/control";

@Component({})
export default class ScrollTab extends Vue {
  list = new Array(12).fill(0).map(function (item, index) {
    return {
      label: randomText(2, 6),
      value: index,
    };
  });

  state = {
    activeValue1: 0,
    scrollLeft1: 0,

    activeValue2: 0,
    scrollLeft2: 0,
  };

  onTab1(item: { value: number }, e: Event) {
    this.state.activeValue1 = item.value;
    onScrollviewCenter({
      ctx: this,
      id: "one-" + item.value,
      event: e,
      callback: (left) => {
        this.state.scrollLeft1 = left;
      },
    });
  }

  /** list-2 节点宽度 */
  private list2Width!: number;

  onTab2(item: { value: number }, e: Event) {
    this.state.activeValue2 = item.value;
    onScrollviewCenter({
      ctx: this,
      id: "two-" + item.value,
      event: e,
      wrapWidth: this.list2Width,
      callback: (left) => {
        this.state.scrollLeft2 = left;
      },
    });
  }

  onReady() {
    const node = uni.createSelectorQuery().in(this).select("#list-2");
    node
      .boundingClientRect((info) => {
        this.list2Width = info.width!;
      })
      .exec();

    // 页面初始化选中某个选项
    this.state.activeValue1 = 5;
    onScrollviewCenter({
      ctx: this,
      id: "one-" + 5,
      scrollValue: this.state.scrollLeft1,
      callback: (left) => {
        this.state.scrollLeft1 = left;
      },
    });
  }
}
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