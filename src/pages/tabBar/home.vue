<template>
  <view class="home">
    <view class="pdl_30 pdr_30 pdt_30 mgb_30">
      <image class="logo" :src="imageInfo.logo"></image>
      <view class="line"></view>
      <view style="margin-bottom: 40rpx; font-size: 30rpx">userInfo: {{ JSON.stringify(userInfo, null, 4) }}</view>
      <button class="button-dark" @click="setUserInfo()">修改`userInfo`</button>
    </view>
    <view class="cell">
      <view class="cell-item f-vertical" v-for="(item, index) in menuList" :key="index" @click="openMenu(item.path)">
        <view class="f1">{{ item.label }}</view>
        <img class="cell-icon" :src="imageInfo.iconArrowRight">
      </view>
    </view>
  </view>
</template>
<script lang="ts" setup>
import store from "@/store";

const menuList = [
  { label: "ui-按钮组件", path: "/pages/button" },
  { label: "form-表单组件", path: "/pages/form" },
  { label: "form-表单组件（动态表单）", path: "/pages/form-dynamic" },
  { label: "form-表单组件（特殊/边缘处理）", path: "/pages/form-special" },
  { label: "加载更多列表", path: "/pages/load-more-list" },
  { label: "cavans-生成海报", path: "/pages/cavans-creater" },
  { label: "滚动tab居中示例", path: "/pages/scroll-tab" },
];

let count = 0;

function setUserInfo() {
  count++;
  store.user.update({
    id: count,
    phone: Date.now(),
    token: Math.random().toString(36).slice(2),
  });
}

function openMenu(path: string) {
  uni.navigateTo({
    url: path,
  });
}

const imageInfo = store.imageInfo;

const userInfo = store.user.info;

</script>
<style lang="scss">
.home {
  .logo {
    width: 100px;
    height: 100px;
    margin: 0 auto;
    display: block;
  }
  .cell {
    width: 100%;
    .cell-item {
      width: 100%;
      height: 88rpx;
      border-bottom: solid 1px #eee;
      font-size: 28rpx;
      color: #323233;
      background-color: #fff;
      padding: 0 30rpx;
      &:active {
        background-color: #f2f3f5;
      }
      &:first-child {
        border-top: solid 1px #eee;
      }
      .cell-icon {
        width: 38rpx;
        height: 38rpx;
      }
    }
  }
}
</style>