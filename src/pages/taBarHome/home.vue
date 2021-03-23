<template>
    <view class="home">
        <button class="button_pink" @click="addCount">当前页面`count`：{{ count }}</button>
        <view>userInfo.token: {{ userInfo.token }}</view>
        <button class="button" @click="setToken">修改`userInfo.token = "123"`</button>
        <div class="line"></div>
        <image class="logo" :src="imageInfo.logo"></image>
        <div class="line"></div>
        <TheButton :loading="loading" @click="setLoading(2)">加载 2 秒</TheButton>
        <div class="line"></div>
        <TheButton :round="true" :height="120" color="linear-gradient(45deg, #FA8BFF 0%, #2BD2FF 52%, #2BFF88 90%)" style="width: 70%" :loading="loading" @click="setLoading(3)">圆角按钮 加载 3 秒</TheButton>
        <div class="line"></div>
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
}
</script>

<style lang="scss">
.home{ 
    padding: 30rpx 30rpx 40rpx; 
    .logo{ width: 100px; height: 100px; margin: 0 auto; display: block; }
    .line { width: 100%; padding-top: 40rpx; margin-bottom: 40rpx; border-bottom: solid 1px #eee; }
}

</style>