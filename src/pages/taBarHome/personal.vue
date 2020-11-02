<template>
    <view class="personal">
        <button class="button_pink" @click="openDetail">跳转详情页并传参</button>
        <view>userInfo.token: {{ userInfo.token }}</view>
        <button class="button" @click="clearToken">修改`userInfo.token = ""`</button>
        <UploadImage :uploadId="uploadInfo.index" :src="uploadInfo.path" @change="setContentImage" />
        <view class="test_include">测试全局 `@include`</view>
    </view>    
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import utils from "../../utils";
import store from '../../store';
import UploadImage from "../../components/UploadImage.vue";
import { UploadImageRes } from "../../utils/interfaces";

@Component({
    components: {
        UploadImage
    }
})
export default class Personal extends Vue {
    
    readonly userInfo = store.userInfo;

    uploadInfo = {
        index: 13,
        path: "",
    }

    openDetail() {
        uni.navigateTo({
            url: "/pages/details?id=" + utils.ranInt(12, 30)
        })
    }

    clearToken() {
        this.userInfo.token = "";
    }

    setContentImage(res: UploadImageRes) {
        this.uploadInfo.path = res.src;
    }
}

</script>

<style lang="scss">
.personal{ 
    padding: 30rpx 30rpx 40rpx; 
    .test_include{ 
        @include button(); 
    }
    .value { color: $pink; }
}
</style>