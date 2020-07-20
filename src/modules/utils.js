class ModuleUtils{
    /**
     * 范围随机整数
     * @param {number} min 最小数
     * @param {number} max 最大数
     */
    ranInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * 随机生成中文
     * @param {number} min 
     * @param {number} max 
     */
    randomText(min, max) {
        const len = parseInt(Math.random() * max) + min;
        const base = 20000;
        const range = 1000;
        let str = "";
        let i = 0;
        while (i < len) {
            i++;
            const lower = parseInt(Math.random() * range);
            str += String.fromCharCode(base + lower);
        }
        return str;
    }

    /**
     * 打开其他应用
     * @param {"qq"|"wx"|"zfb"|"sina"|"taobao"} name 应用名
     * @param {(result: any) => void} callback 错误回调
     */
    openApp(name, callback) {
        // #ifdef APP-PLUS
        // learn: https://ask.dcloud.net.cn/article/35621
        const data = {
            qq: 'mqq://',
            wx: 'weixin://',
            zfb: 'alipay://',
            sina: 'sinaweibo://',
            taobao: 'taobao://',
        }
        plus.runtime.openURL(data[name], callback);
        // #endif
    }
    
    /**
     * 显示提示条（app端从底部弹起）
     * @param {string} tip 提示文字
     * @param {string} src 图片路径
     */
    showToast(tip, src = null) {
        uni.showToast({
            title: tip,
            position: 'bottom',
            icon: "none",
            duration: 2000,
            image: src
        });
    }

    /**
     * 显示提示框
     * @param {string} content 提示的内容 
     * @param {Function} success 确认回调 
     * @param {string} title 提示标题 
     */
    showAlert(content, success = null, title = "操作提示") {
        uni.showModal({
            title: title,
            content: content,
            showCancel: false,
            success: success
        })
    }

    /**
     * 显示确认框
     * @param {string} content 提示的内容
     * @param {Function} success 确认回调
     * @param {Function} fail 取消回调
     * @param {string} title 提示标题
     */
    showConfirm(content, success = null, fail = null, title = "操作提示") {
        uni.showModal({
            title: title,
            content: content,
            showCancel: false,
            success(res) {
                if (res.confirm) {
                    typeof success === 'function' && success();
                } else {
                    typeof fail === 'function' && fail();
                }
            }
        })
    }

    /**
     * 复制文本
     * @param {string} value 复制的内容 
     * @param {Function} success 成功回调
     */
    copyText(value, success = null) {
        value = value.replace(/(^\s*)|(\s*$)/g, "");
        if (!value) {
            return this.showToast("复制的内容不能为空！");
        }

        // #ifndef H5
        const THAT = this;
        uni.setClipboardData({
            data: value,
            success() {
                THAT.showToast("复制成功", "success");
                typeof success === "function" && success();
            }
        });
        // #endif

        // #ifdef H5
        const id = "the-clipboard";
        let clipboard = document.getElementById(id);
        if (!clipboard) {
            clipboard = document.createElement("textarea");
            clipboard.id = id;
            clipboard.style.cssText = "font-size: 15px; position: fixed; top: -1000%; left: -1000%;";
            document.body.appendChild(clipboard);
        }
        clipboard.value = value;
        clipboard.select();
        clipboard.setSelectionRange(0, clipboard.value.length);
        document.execCommand("copy");
        typeof success === "function" && success();
        this.showToast("复制成功", "success");
        // #endif
    }
}

/** 工具类模块 */
const utils = new ModuleUtils();

export default utils;