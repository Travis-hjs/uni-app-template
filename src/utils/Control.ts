import Vue from "vue";

interface ShowConfirmOptions {
    /** 内容 */
    content: string 
    /** 标题 */
    title?: string
    /** 确认回调 */
    callback?(): void
    /** 取消回调 */
    cancel?(): void 
    /** 确认按钮文字 */
    text?: string
}

interface ScrollviewOption {
    /** 当前实例 */
    ctx: Vue
    /** 要滚动的目标节点`id` */
    id: string
    /** `<scrollview>`的宽度，默认是屏幕宽度 */
    wrapWidth: number
    /** 点击事件 */
    event: Event
    /** 是否首次设置偏移到中心位置，设置为`true`时，只需要传入`id`即可 */
    first: boolean
    /** 回调 */
    callback(left: number, node: UniApp.NodeInfo): void
}

/** 控件模块 */
export default class ModuleControl {

    /**
     * 打开其他应用
     * @param name 应用名
     * @param callback 错误回调
     */
    openApp(name: "qq" | "wx" | "zfb" | "sina" | "taobao", callback?: (result: any) => void) {
        // #ifdef APP-PLUS
        // learn: https://ask.dcloud.net.cn/article/35621
        const data = {
            qq: "mqq://",
            wx: "weixin://",
            zfb: "alipay://",
            sina: "sinaweibo://",
            taobao: "taobao://",
        }
        plus.runtime.openURL(data[name], callback);
        // #endif
    }

    /**
     * 显示加载提示
     * @param text 提示文字
     */
    showLoading(text: string = "加载中..") {
        uni.showLoading({
            title: text,
            mask: true
        });
    }

    /**
     * 显示提示条
     * @param tip 提示文字
     * @param duration 持续时间
     */
    showToast(tip: string, duration = 2000) {
        uni.showToast({
            title: tip,
            // position: "bottom",
            icon: "none",
            duration: duration,
            // image: src
        });
    }

    /**
     * 显示提示框
     * @param content 提示的内容 
     * @param success 确认回调 
     * @param title 提示标题 
     */
    showAlert(content: string, success?: (res: UniApp.ShowModalRes) => void, title: string = "操作提示") {
        uni.showModal({
            title: title,
            content: content,
            showCancel: false,
            success: success
        })
    }

    /**
     * 确认弹窗
     * @param options 传参对象
     */
    showConfirm(options: ShowConfirmOptions) {
        uni.showModal({
            title: options.title || "操作提示",
            content: options.content,
            showCancel: true,
            confirmText: options.text || "确认",
            success(res) {
                if (res.confirm) {
                    options.callback && options.callback();
                } else if (res.cancel) {
                    options.cancel && options.cancel();
                }
            },
        });
    }

    /**
     * 复制文本
     * @param value 复制的内容 
     * @param success 成功回调
     */
    copyText(value: string, success?: () => void) {
        value = value.replace(/(^\s*)|(\s*$)/g, "");
        if (!value) {
            return this.showToast("复制的内容不能为空！");
        }

        // #ifndef H5
        const THAT = this;
        uni.setClipboardData({
            data: value,
            success() {
                THAT.showToast("复制成功");
                success && success();
            }
        });
        // #endif

        // #ifdef H5
        const id = "the-clipboard";
        let clipboard = document.getElementById(id) as HTMLTextAreaElement;
        if (!clipboard) {
            clipboard = document.createElement("textarea");
            clipboard.id = id;
            clipboard.readOnly = true;
            clipboard.style.cssText = "font-size: 15px; position: fixed; top: -1000%; left: -1000%;";
            document.body.appendChild(clipboard);
        }
        clipboard.value = value;
        clipboard.select();
        clipboard.setSelectionRange(0, clipboard.value.length);
        const state = document.execCommand("copy");
        if (state) {
            this.showToast("复制成功");
            success && success();
        } else {
            this.showToast("复制失败");
        }
        // #endif
    }

    /**
     * 监听或设置`<scrollview>`组件指定元素滚动到视图中心的偏移值
     * ## 使用示例
     * 
     * **template**部分
     * 
     * ```html
     * <scroll-view scroll-x scroll-with-animation :scroll-left="scrollLeft">
     *      <view @click="onClick(item, $event)" v-for="item in list" :id="'scroll-' + item.id" :key="item.id">
     *          <text>{{ item.label }}</text>
     *      </view>
     * </scroll-view>
     * ```
     * 
     * **js部分**
     * 
     * ```ts
     * // ...省略前置代码
     * export default class Demo extends Vue {
     *      list: Array<{ id: number, label: string }> = [];
     *      
     *      scrollLeft = 0;
     * 
     *      onClick(item: { id: number }, e: Event) {
     *          utils.onScrollviewCenter({
     *              ctx: this,
     *              event: e,
     *              id: 'scroll-' + item.id,
     *              callback: left => this.scrollLeft = left
     *          })
     *      }
     * }
     * 
     * ```
     */
    onScrollviewCenter(option: ScrollviewOption) {
        if (option.first) {
            const el = document.getElementById(option.id);
            if (el) {
                el.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                    inline: "center"
                });
            }
        } else {
            const width = option.wrapWidth || uni.getSystemInfoSync().windowWidth;
            option.ctx.$nextTick(function () {
                const node = uni.createSelectorQuery().in(option.ctx).select(`#${option.id}`);
                const left = option.event ? (option.event.currentTarget as HTMLElement).offsetLeft : 0;
                node.boundingClientRect(function (nodeInfo) {
                    let result = 0;
                    if (nodeInfo) {
                        result = left + nodeInfo.width / 2 - width / 2;
                    }
                    typeof option.callback === "function" && option.callback(result, nodeInfo);
                }).exec();
            });
        }
    }

}
