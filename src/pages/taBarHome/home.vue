<template>
    <view class="home">
        <button @click="addCount">当前页面`count`：{{ count }}</button>
        <view>userInfo.token: {{ userInfo.token }}</view>
        <button @click="setToken">修改`userInfo.token = "123"`</button>
    </view>    
</template>

<script>
import Global from '../../modules/Global'

export default {
    data() {
        return {
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
.list-item{ margin-bottom: 30rpx; }
</style>