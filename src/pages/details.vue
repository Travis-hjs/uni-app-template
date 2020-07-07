<template>
    <view class="details">
        <button @click="goback">返回上一页</button>
        <view>页面参数{{ pageParam }}</view>
        
    </view>
</template>

<script>
import apiUser from "../api/user";

export default {
    data() {
        return {
            /** 页面传参接收数据 */
            pageParam: ""
        }
    },
    onLoad(param) {
        this.pageParam = JSON.stringify(param);
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

</style>