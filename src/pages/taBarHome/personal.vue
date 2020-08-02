<template>
    <view class="personal">
        <button class="button_pink" @click="openDetail">跳转详情页并传参</button>
        <view>userInfo.token: {{ userInfo.token }}</view>
        <button class="button" @click="clearToken">修改`userInfo.token = ""`</button>
        <upload-image :uploadId="uploadInfo.index" :src="uploadInfo.path" @getImage="setContentImage" />
        <view class="test_include">测试全局 `@include`</view>
    </view>    
</template>

<script>
import utils from "../../modules/utils";
import Global from '../../modules/Global';
import UploadImage from "../../components/UploadImage.vue";

export default {
    components: {
        "upload-image": UploadImage,
    },
    data() {
        return {
            userInfo: Global.userInfo,
            uploadInfo: {
                index: 13,
                path: "",
            }
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
        },
        /**
         * @param {{id: number, src: string}} res
         */
        setContentImage(res) {
            this.uploadInfo.path = res.src;
        },
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