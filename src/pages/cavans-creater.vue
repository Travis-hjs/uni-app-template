<template>
    <view class="cavans-creater">
        <canvas class="banner-box" id="the-cavans" canvas-id="the-cavans" :width="cavansSize.width" :height="cavansSize.height"></canvas>
        <view class="line"></view>
        <TheButton color="#07c160" @click="createBanner()">生成 cavans 海报图</TheButton>
        <view :class="['img-mask flex', { 'img-mask-hide': !showMask }]">
            <view class="img-content">
                <img class="img" :src="canvasUrl" :style="{ width: cavansSize.width + 'px', height: cavansSize.height + 'px' }">
                <TheButton @click="closeMask()">关闭</TheButton>
            </view>
        </view>
    </view>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TheButton from "@/components/TheButton.vue";
import cavansCreater from "@/utils/cavansCreater";
import utils from "@/utils";

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
        utils.showLoading("生成中...");
        cavansCreater({
            cavansId: "the-cavans",
            // fileType: "jpg",
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
                    // borderRadius: 100
                },
                {
                    type: "img",
                    src: "https://game.gtimg.cn/images/lol/act/img/champion/Talon.png",
                    width: 60,
                    height: 60,
                    borderRadius: 10,
                    bottom: 50,
                    left: 50,
                    // zIndex: 12
                },
                {
                    type: "img",
                    src: "https://game.gtimg.cn/images/lol/act/img/champion/Zed.png",
                    // src: "../static/logo.png",
                    width: 60,
                    height: 60,
                    borderRadius: 50,
                    bottom: 50,
                    right: 50,
                    // zIndex: 12
                },
                {
                    type: "text",
                    text: "向右对齐的文字",
                    color: "green",
                    textAlign: "right",
                    fontSize: 16,
                    top: this.cavansSize.height / 2,
                    right: 10,
                    zIndex: 20,
                },
                {
                    type: "text",
                    text: "底部居中文字",
                    fontSize: 16,
                    color: "orange",
                    textAlign: "center",
                    textBaseline: "middle",
                    bottom: 20,
                    left: this.cavansSize.width / 2
                }
            ],
            success: (res) => {
                uni.hideLoading();
                console.log("生成的图片信息 >>", res);
                // #ifdef H5
                this.canvasUrl = res.tempFilePath;
                this.openMask();
                // #endif

                // #ifndef H5
                uni.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success() {
                        utils.showToast("图片已下载至【图库】，请打开【图库】查看");
                    }
                });
                // #endif
            },
            fail(err) {
                console.log("错误信息 >>", err);
                uni.hideLoading();
                utils.showAlert(err.type === "load" ? `图片加载失败` : `canvas导出图片失败`);
            }
        })
    }

    /** `canvas`生成的图片地址 */
    canvasUrl = "";

    showMask = false;

    closeMask() {
        this.showMask = false;
    }

    openMask() {
        this.showMask = true;
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
    .img-mask {
        position: fixed;
        left: 0;
        top: 0;
        background-color: rgba(0,0,0,0.45);
        width: 100%;
        height: 100%;
        transition: 0.3s all;
        opacity: 1;
        .img-content {
            margin: auto;
            width: 320px;
            padding: 10px;
            .img {
                margin: 0 auto 20rpx;
            }
        }
    }
    .img-mask-hide {
        visibility: hidden;
        opacity: 0;
    }
}
</style>