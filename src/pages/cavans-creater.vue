<template>
    <view class="cavans-creater">
        <canvas class="banner-box" id="the-cavans" canvas-id="the-cavans" :width="cavansSize.width" :height="cavansSize.width"></canvas>
        <view class="line"></view>
        <TheButton color="#07c160" @click="createBanner()">生成 cavans 海报图</TheButton>
    </view>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TheButton from "@/components/TheButton.vue";
import cavansCreater from "@/utils/cavansCreater";

@Component({
    components: {
        TheButton
    }
})
export default class PageCavansCreater extends Vue {

    onLoad() {

    }

    cavansSize = {
        width: 300,
        height: 500
    }

    createBanner() {
        cavansCreater({
            el: uni.createCanvasContext(`the-cavans`),
            ...this.cavansSize,
            list: [
                {
                    type: "box",
                    width: 40,
                    height: 40,
                    backgroundColor: "#07c160",
                    borderRadius: 1000,
                    borderColor: "orange",
                    borderWidth: 10,
                    left: 20,
                    top: 20,
                    zIndex: 10,
                },
                {
                    type: "box",
                    width: 40,
                    height: 40,
                    backgroundColor: "#07c160",
                    borderRadius: 1000,
                    borderColor: "orange",
                    borderWidth: 10,
                    right: 20,
                    top: 20,
                    zIndex: 10,
                },
                {
                    type: "box",
                    width: 40,
                    height: 40,
                    backgroundColor: "orange",
                    borderRadius: 1000,
                    borderColor: "#07c160",
                    borderWidth: 10,
                    left: 20,
                    bottom: 20,
                    zIndex: 10,
                },
                {
                    type: "box",
                    width: 40,
                    height: 40,
                    backgroundColor: "orange",
                    borderRadius: 1000,
                    borderColor: "#07c160",
                    borderWidth: 10,
                    right: 20,
                    bottom: 20,
                    zIndex: 10,
                },
                {
                    type: "box",
                    width: 300,
                    height: 500,
                    backgroundColor: "#eee",
                    borderRadius: 60
                },
                {
                    type: "img",
                    src: "https://muse-ui.org/img/img3.6e264e66.png",
                    width: 300,
                    height: 217,
                }
            ]
        })
    }
}
</script>
<style lang="scss">
.cavans-creater {
    width: 100%;
    padding: 30rpx;
    .banner-box {
        width: 300px;
        height: 500px;
        display: block;
        // display: none;
        margin: 0 auto;
        border: solid 1px #eee;
    }
}
</style>