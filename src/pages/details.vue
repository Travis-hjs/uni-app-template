<template>
    <view class="details">
        <button class="goback_btn" :style="{ 'top': appOption.statusBarHeight + 10 + 'px' }" @click="goback">返回上一页</button>
        <view class="box" :style="{ 'padding-top': appOption.statusBarHeight + 90 + 'px' }">
            <view>页面参数{{ pageParam }}</view>
        </view>
        <view :class="['footer flex fvertical fcenter',isIPhoneX ? 'iphonex_bottom' : '' ]">
            <view>footer</view>
        </view>
    </view>
</template>

<script>
import apiUser from "../api/user";
import Global from '../modules/Global';

export default {
    data() {
        return {
            appOption: Global.appOption,
            isIPhoneX: Global.appOption.isIPhoneX,
            /** 页面传参接收数据 */
            pageParam: "",
        }
    },
    onLoad(param) {
        this.pageParam = JSON.stringify(param);
        // console.log(Global.appOption);
    },
    methods: {
        goback() {
            uni.navigateBack();
        },
        getData() {
            apiUser.searchUserType("vip").then(res => {
                console.log(res);
                
            })
        }
    }
}
</script>

<style>
.goback_btn{ width: 300rpx; height: 88rpx; border-radius: 4px; background-color: tomato; color: #fff; font-size: 32rpx; position: fixed; left: 20rpx; }
.box{ width: 100%; height: 300vh; }
.footer { width: 100%; height: 88rpx; background-color: #181818; position: fixed; bottom: 0; left: 0; font-size: 32rpx; color: #fff; }

</style>