<template>
    <view class="personal">
        <button class="box" @click="openDetail">跳转详情页并传参</button>
        <view>userInfo.token: {{ userInfo.token }}</view>
        <button @click="clearToken">修改`userInfo.token = ""`</button>
    </view>    
</template>

<script>
import utils from "../../modules/utils";
import Global from '../../modules/Global';

export default {
    data() {
        return {
            userInfo: Global.userInfo
        }
    },
    onLoad() {
        
    },
    methods: {
        openDetail() {
            uni.navigateTo({
                url: "/pages/details?id=" + utils.ranInt(12, 30)
            })
        },
        clearToken() {
            this.userInfo.token = "";
        }
    }
}
</script>

<style>
.personal{ padding: 30rpx 30rpx 40rpx; }
.list-item{ margin-bottom: 30rpx; }
</style>