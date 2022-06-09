<template>
     <view class="cavans-creater">
        <canvas class="banner-box" id="the-cavans" canvas-id="the-cavans" :width="cavansSize.width" :height="cavansSize.height"></canvas>
        <view class="line"></view>
        <TheButton color="#07c160" @click="createBanner()">生成 cavans 海报图</TheButton>
        <view :class="['img-mask flex', { 'img-mask-hide': !showMask }]">
            <view class="img-content">
                <img class="img" :src="canvasUrl" :style="{ width: cavansSize.width + 'px', height: cavansSize.height + 'px' }">
                <!-- #ifndef H5 -->
                <view class="flex">
                    <TheButton :round="true" class="f1" @click="closeMask()">关闭</TheButton>
                    <view style="width: 10px"></view>
                    <TheButton :round="true" color="#07c160" class="f1" @click="download()">保存图片</TheButton>
                </view>
                <!-- #endif -->
                <!-- #ifdef H5 -->
                <TheButton :round="true" @click="closeMask()">关闭（长摁图片保存）</TheButton>
                <!-- #endif -->
            </view>
        </view>
    </view>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import TheButton from "@/components/TheButton.vue";
import cavansCreater from "@/utils/cavansCreater";
import { showToast, showLoading, showAlert } from "@/utils/control";

export default defineComponent({
    components: {
        TheButton
    },
    setup() {
        const cavansSize = {
            width: 300,
            height: 500
        }

        /** `canvas`生成的图片地址 */
        const canvasUrl = ref("");

        function createBanner() {
            showLoading("生成中...");
            cavansCreater({
                cavansId: "the-cavans",
                // fileType: "jpg",
                ...cavansSize,
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
                        // src: "../static/logo.png",
                        width: 300,
                        height: 217,
                        // borderRadius: 100
                    },
                    {
                        type: "img",
                        src: "https://game.gtimg.cn/images/lol/act/img/champion/Talon.png",
                        // src: "../static/logo.png",
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
                        top: cavansSize.height / 2,
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
                        left: cavansSize.width / 2
                    }
                ],
                success(res) {
                    uni.hideLoading();
                    console.log("生成的图片信息 >>", res);
                    canvasUrl.value = res.tempFilePath;
                    openMask();
                },
                fail(err) {
                    console.log("错误信息 >>", err);
                    uni.hideLoading();
                    showAlert(err.type === "load" ? `图片加载失败` : `canvas导出图片失败`);
                }
            })
        }

        const showMask = ref(false);

        function closeMask() {
            showMask.value = false;
        }

        function openMask() {
            showMask.value = true;
        }

        function download() {
            uni.saveImageToPhotosAlbum({
                filePath: canvasUrl.value,
                success() {
                    showToast("图片已下载至【图库】，请打开【图库】查看");
                }
            });
        }

        return {
            cavansSize,
            canvasUrl,
            createBanner,
            showMask,
            closeMask,
            openMask,
            download
        }
    }
})
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
        // #ifdef MP-WEIXIN
        transform: translateY(-200%);
        // #endif
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
            transition: 0.3s all;
            transform: translate3d(0, 0%, 0);
            .img {
                margin: 0 auto 20rpx;
            }
        }
    }
    .img-mask-hide {
        visibility: hidden;
        opacity: 0;
        .img-content {
            transform: translate3d(0, 100%, 0);
        }
    }
}
</style>