<template>
    <view class="personal">
        <view style="margin-bottom: 40rpx; font-size: 30rpx">userInfo: {{ JSON.stringify(userInfo, null, 4) }}</view>
        <button class="button-pink" @click="clearUserInfo()">清空`userInfo`</button>
    </view>
</template>
<script lang="ts">
import store from "@/store";
import { defineComponent } from "vue";

export default defineComponent({
    setup() {
        function clearUserInfo() {
            store.user.reset();
        }

        return {
            clearUserInfo,
            userInfo: store.user.info,
        };
    },
});
</script>
<style lang="scss">
.personal {
    padding: 30rpx 30rpx 40rpx;
}
</style>