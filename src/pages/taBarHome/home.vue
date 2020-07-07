<template>
    <view class="home">
        <view>userInfo.token: {{ userInfo.token }}</view>
        <button @click="setToken">修改`userInfo.token = "123"`</button>
    </view>    
</template>

<script>
import Global from '../../modules/Global'

export default {
    data() {
        return {
            userInfo: Global.userInfo
        }
    },
    onLoad() {
        
    },
    methods: {
        setToken() {
            this.userInfo.token = "123";
        }
    }
}
</script>

<style>
.home{ padding: 30rpx 30rpx 40rpx; }
.list-item{ margin-bottom: 30rpx; }
</style>