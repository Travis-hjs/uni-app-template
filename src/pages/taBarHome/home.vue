<template>
    <view class="home">
        <view class="pdl_30 pdr_30 mgb_30">
            <button class="button_pink" @click="addCount">当前页面`count`：{{ count }}</button>
            <view>userInfo.token: {{ userInfo.token }}</view>
            <button class="button" @click="setToken">修改`userInfo.token = "123"`</button>
            <view class="line"></view>
            <image class="logo" :src="imageInfo.logo"></image>
            <view class="line"></view>
            <!-- 这样写：/static/xxx.png 不能兼容小程序端（ios不行，Android可以）和生产环境（开发环境可以，应该是环境路径问题），必需require(`@/static/xxx.png`) -->
            <!-- <view class="bg flex fcenter fvertical" :style="{ 'background-image': `url(${imageInfo.logo})` }">背景图测试</view> -->
            <!-- 这样配合 css 设置背景图可以兼容任何环境 -->
            <view class="bg flex fcenter fvertical">背景图测试</view>
        </view>
        <view class="cell">
            <view class="cell-item" v-for="(item, index) in menuList" :key="index" @click="openMenu(item.path)">
                <view class="f1">{{ item.label }}</view>
                <img class="cell-icon" :src="imageInfo.iconArrowRight">
            </view>
        </view>
    </view>    
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import store from "@/store";

@Component({})
export default class Home extends Vue {
    imageInfo = store.imageInfo;

    readonly userInfo = store.userInfo;

    menuList = [
        { label: "ui-按钮组件", path: "/pages/button" },
        { label: "form-表单组件", path: "/pages/form" },
        { label: "form-表单组件（动态表单）", path: "/pages/form-dynamic" },
        { label: "form-表单组件（特殊/边缘处理）", path: "/pages/form-special" },
        { label: "加载更多列表", path: "/pages/list" },
        { label: "cavans-生成海报", path: "/pages/cavans-creater" }
    ]

    count = 0

    onLoad() {
        // console.log("执行");
    }

    setToken() {
        store.updateUserInfo({ token: "123" });
    }

    addCount() {
        this.count ++;
    }

    openMenu(path: string) {
        uni.navigateTo({
            url: path
        })
    }
}
</script>

<style lang="scss">
.home{ 
    padding: 30rpx 0 40rpx;
    .logo { width: 100px; height: 100px; margin: 0 auto; display: block; }
    .bg {
        width: 140px;
        height: 100px;
        background-size: cover;
        margin: 0 auto;
        font-size: 32rpx;
        color: $pink;
        background-position: center center;
        background-image: url('@/static/logo.png');
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
            @include flex();
            @include fvertical();
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