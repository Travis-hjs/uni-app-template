<template>
    <view class="page-button">
        <TheButton :loading="loading" @click="setLoading(2)">加载 2 秒</TheButton>
        <view class="line"></view>
        <TheButton
            :round="true"
            :height="120"
            color="linear-gradient(45deg, #FA8BFF 0%, #2BD2FF 52%, #2BFF88 90%)"
            style="width: 70%"
            :loading="loading"
            @click="setLoading(3)"
        >圆角按钮 加载 3 秒</TheButton>
        <view class="line"></view>
        <TheButton color="#020202" textColor="#f04e7d" :loading="loading" @click="setLoading(4)">自定义字体颜色 加载 4 秒</TheButton>
    </view>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TheButton from "@/components/TheButton.vue";

@Component({
    components: {
        TheButton
    }
})
export default class PageButton extends Vue {
    
    loading = false;

    setLoading(val: number) {
        // console.log("执行");
        this.loading = true;
        setTimeout(() => this.loading = false, val * 1000);
    }

}
</script>
<style lang="scss">
.page-button {
    width: 100%;
    padding: 30rpx;
}
</style>