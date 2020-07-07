<template>
    <view class="personal">
        <view class="box" @click="openDetail">跳转详情页并传参</view>
    </view>    
</template>

<script>
import utils from "../../modules/utils";

export default {
    data() {
        return {
            list: []
        }
    },
    onLoad() {
        
    },
    methods: {
        openDetail() {
            uni.navigateTo({
                url: "/pages/details?id=" + utils.ranInt(12, 30)
            })
        }
    }
}
</script>

<style>
.personal{ padding: 30rpx 30rpx 40rpx; }
.list-item{ margin-bottom: 30rpx; }
</style>