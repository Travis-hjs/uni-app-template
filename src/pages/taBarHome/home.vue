<template>
    <view class="home">
        <button @click="addCount">当前页面`count`：{{ count }}</button>
        <view>userInfo.token: {{ userInfo.token }}</view>
        <button @click="setToken">修改`userInfo.token = "123"`</button>
        <image class="logo" :src="logo"></image>
    </view>    
</template>

<script>
import Global from "../../modules/Global"

export default {
    data() {
        return {
            logo: Global.images.logo,
            userInfo: Global.userInfo,
            count: 0
        }
    },
    onLoad() {
        
    },
    methods: {
        setToken() {
            this.userInfo.token = "123";
        },
        addCount() {
            this.count ++;
        }
    }
}
</script>

<style>
.home{ padding: 30rpx 30rpx 40rpx; }
.logo{ width: 100px; height: 100px; margin: 0 auto; display: block; }
.list-item{ margin-bottom: 30rpx; }
</style>