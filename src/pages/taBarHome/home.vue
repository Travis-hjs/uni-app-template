<template>
    <view class="home">
        <button class="button_pink" @click="addCount">当前页面`count`：{{ count }}</button>
        <view>userInfo.token: {{ userInfo.token }}</view>
        <button class="button" @click="setToken">修改`userInfo.token = "123"`</button>
        <image class="logo" :src="logo"></image>
    </view>    
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import store from "../../store";

@Component({})
export default class Home extends Vue {
    logo = store.images.logo;

    readonly userInfo = store.userInfo;

    count = 0

    onLoad() {
        console.log("执行");
    }

    setToken() {
        this.userInfo.token = "123";
    }

    addCount() {
        this.count ++;
    }
}
</script>

<style lang="scss">
.home{ 
    padding: 30rpx 30rpx 40rpx; 
    .logo{ width: 100px; height: 100px; margin: 0 auto; display: block; }
}

</style>