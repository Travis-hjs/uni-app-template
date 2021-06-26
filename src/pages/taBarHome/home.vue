<template>
    <view class="home">
        <button class="button_pink" @click="addCount">当前页面`count`：{{ count }}</button>
        <view>userInfo.token: {{ userInfo.token }}</view>
        <button class="button" @click="setToken">修改`userInfo.token = "123"`</button>
        <view class="line"></view>
        <TheButton color="#07c160" @click="openForm()">打开表单验证页</TheButton>
        <view class="line"></view>
        <image class="logo" :src="imageInfo.logo"></image>
        <view class="line"></view>
        <!-- 这样写：/static/xxx.png 不能兼容小程序端（ios不行，Android可以）和生产环境（开发环境可以，应该是环境路径问题），必需require(`@/static/xxx.png`) -->
        <!-- <view class="bg flex fcenter fvertical" :style="{ 'background-image': `url(${imageInfo.logo})` }">背景图测试</view> -->
        <!-- 这样配合 css 设置背景图可以兼容任何环境 -->
        <view class="bg flex fcenter fvertical">背景图测试</view>
        <view class="line"></view>
        <TheButton :loading="loading" @click="setLoading(2)">加载 2 秒</TheButton>
        <view class="line"></view>
        <TheButton :round="true" :height="120" color="linear-gradient(45deg, #FA8BFF 0%, #2BD2FF 52%, #2BFF88 90%)" style="width: 70%" :loading="loading" @click="setLoading(3)">圆角按钮 加载 3 秒</TheButton>
        <view class="line"></view>
        <TheButton color="#020202" textColor="#f04e7d" :loading="loading" @click="setLoading(4)">自定义字体颜色 加载 4 秒</TheButton>
    </view>    
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import store from "../../store";
import TheButton from "../../components/TheButton.vue";

@Component({
    components: {
        TheButton
    }
})
export default class Home extends Vue {
    imageInfo = store.imageInfo;

    readonly userInfo = store.userInfo;

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

    loading = false;

    setLoading(val: number) {
        // console.log("执行");
        this.loading = true;
        setTimeout(() => this.loading = false, val * 1000);
    }

    openForm() {
        uni.navigateTo({
            url: "/pages/form"
        })
    }
}
</script>

<style lang="scss">
.home{ 
    padding: 30rpx 30rpx 40rpx; 
    .logo{ width: 100px; height: 100px; margin: 0 auto; display: block; }
    .line { width: 100%; padding-top: 40rpx; margin-bottom: 40rpx; border-bottom: solid 1px #eee; }
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
}

</style>