<template>
  <view class="personal">
    <view style="margin-bottom: 40rpx; font-size: 30rpx">userInfo: {{ JSON.stringify(userInfo, null, 4) }}</view>
    <button class="button-pink" @click="clearUserInfo()">清空`userInfo`</button>
    是否开发环境：{{ config.isDev }}
  </view>
</template>
<script lang="ts" setup>
import store from "@/store";
import config from "@/utils/config";

const userInfo = store.user.info;

function clearUserInfo() {
  store.user.reset();
}
</script>
<style lang="scss">
.personal {
  padding: 30rpx 30rpx 40rpx;
}
</style>