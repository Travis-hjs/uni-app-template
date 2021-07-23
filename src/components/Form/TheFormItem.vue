<template>
    <view :class="['the-form-item', { 'the-form-item-border': useBorder }]">
        <view :class="[{ 'flex': usePosition !== 'top' }]">
            <view :class="['the-form-label ellipsis', { 'the-form-label-right': usePosition === 'right' }]" :style="{ 'width': useLabelWidth }">
                <text class="the-form-symbol" v-if="isRequired">*</text>
                <text>{{ label }}</text>
            </view>
            <view :class="['the-form-value-box', { 'f1': usePosition !== 'top' }]">
                <slot></slot>
                <view class="validate-text">
                    <view :class="['validate-tip ellipsis', { 'validate-tip-show': showValidate }]">{{ validateText }}</view>
                </view>
            </view>
        </view>
    </view>
</template>
<script lang="ts">
import { Component, Prop, Inject, Watch } from "vue-property-decorator";
import TheForm from "./TheForm.vue";
import Emitter from "@/mixins/Emitter";
import utils from "@/utils";
import { TheFormRulesItem, labelPosition } from "@/utils/interfaces";

@Component({
    name: "TheFormItem"
})
export default class TheFormItem extends Emitter {
    @Prop({
        type: String,
        default: ""
    })
    label!: string;

    /** `<TheFormItem prop="表单数据的键值" >` */
    @Prop({
        type: String,
        default: ""
    })
    prop!: string;

    /** 表单字段宽度，这里使用字符串，因为可能是`px`或者`rpx` */
    @Prop({
        type: String,
        default: ""
    })
    labelWidth!: string;

    /** 是否需要显示底部边框 */
    @Prop({
        type: [Boolean, String],
        default: "-", // 微信小程序抽风会把空字符串转成 boolean 所以这里随便给个字符串
    })
    border!: boolean;

    /** 表单字段排版 */
    @Prop({
        type: String,
        default: ""
    })
    labelPosition!: labelPosition;

    /** 表单规则 */
    @Prop({
        type: Array,
        default: () => []
    })
    rules!: Array<TheFormRulesItem>;

    /** 父组件实例 */
    @Inject("theFormComponent")
    private parentComponent!: TheForm;

    /** 是否验证 */
    private get isRequired() {
        let result = false;
        // 父组件的规则
        const rules = this.parentComponent.rules;
        if (rules && rules[this.prop] && rules[this.prop].length) {
            result = rules[this.prop].some(item => item.required);
        }
        // 自身组件的规则
        if (this.rules && this.rules.length > 0) {
            result = this.rules.some(item => item.required);
        }
        return result;
    }

    /** 视图中使用的定位属性值 */
    private usePosition: labelPosition = "left";

    // 监听父组件`labelPosition`变动
    @Watch("parentComponent.labelPosition", { immediate: true })
    private onLabelPosition(val: labelPosition) {
        let result = this.labelPosition;
        if (!result) {
            result = val;
        }
        this.usePosition = result;
    }

    /** 视图中使用的`label`宽度值 */
    private useLabelWidth = "";

    // 监听父组件`labelWidth`变动
    @Watch("parentComponent.labelWidth", { immediate: true })
    private onLabelWidth(val: string) {
        let result = this.labelWidth;
        if (!result) {
            result = val;
        }
        this.useLabelWidth = result;
    }

    /** 视图中使用的`border`值 */
    private useBorder = false;

    // 监听父组件`border`变动
    @Watch("parentComponent.border", { immediate: true })
    onBorder(val: boolean) {
        let result = this.border;
        if (utils.checkType(result) !== "boolean") {
            result = val;
        }
        this.useBorder = result;
    }

    mounted() {
        if (this.prop) {
            this.dispatch("TheForm", "addTheFormItem", [this]);
        }
        // console.log(this.parentComponent.labelPosition);
    }

    beforeDestroy() {
        this.dispatch("TheForm", "removeTheFormItem", [this]);
    }

    /**
     * 验证提示文字
     * @description 这个值不要给空，因为要撑开元素的高度，为空的话没有结束过渡动画
     */
    private validateText = "-";
    
    /** 是否显示验证提示 */
    private showValidate = false;

    /** 重置当前验证提示 */
    resetField() {
        this.showValidate = false;
    }

    /**
     * 验证当前`item`
     * @description 暴露给外部调用的方法
     * @param callback 校验回调
    */
    validateField(callback: (prop: string, rules: Array<TheFormRulesItem>) => void) {
        let info = null;
        /** 父组件的规则列表 */
        const parentRules = this.parentComponent.rules;
        const model = this.parentComponent.model;
        const value = utils.getDeepLevelValue(model, this.prop);
        const tip = "校验不通过";

        // console.log("this.prop >>", this.prop);
        // console.log("parentRules >>", parentRules);
        // console.log("model >>", model);
        // console.log("value >>", value);
        // console.log(this.parentComponent);

        if (this.isRequired && this.prop) {
            /** 自身规则列表 */
            const selfRules = this.rules;
            /** 要校验的规则列表 */
            const rulesList = [];
            // 先判断父组件有没有校验规则
            if (parentRules && parentRules[this.prop]) {
                rulesList.push(...parentRules[this.prop]);
            }
            // 然后把自身的规则列表加进去
            if (selfRules && selfRules.length > 0) {
                rulesList.push(...selfRules);
            }
            // 最后遍历检测
            for (let i = 0; i < rulesList.length; i++) {
                const item = rulesList[i];
                if (item.type) {
                    if (utils.checkType(value) !== item.type) {
                        info = item;
                        this.validateText = item.message || tip;
                        this.showValidate = true;
                        break;
                    }
                    this.showValidate = false;
                }
                if (item.reg) {
                    // const reg = new RegExp(item.reg.replace(/\//g, ""));
                    const reg = new RegExp(item.reg.slice(1, item.reg.length - 1));

                    if (utils.checkType(reg) === "regexp") {
                        if (!reg.test(value.toString())) {
                            info = item;
                            this.validateText = item.message || tip;
                            this.showValidate = true;
                            break;
                        }
                        this.showValidate = false;
                    } else {
                        console.warn("validateField >> ruls 传入的 reg 非正则，已跳过验证");
                    }
                }
                // 最后判断是否为空值
                if (value === "" || value === null || value === undefined || value.length === 0) {
                    info = item;
                    this.validateText = item.message || tip;
                    this.showValidate = true;
                    break;
                }
                this.showValidate = false;
            }
        }

        callback(this.prop || "", info ? [info] : []);
    }

    /**
     * 滚动到视图可见位置
     * @description 暴露给外部调用的方法
     */
    scrollIntoView() {
        // #ifdef H5
        const top = (this.$el as HTMLElement).offsetTop;
        uni.pageScrollTo({
            scrollTop: top - 50, // 这里 50 是顶部导航高度
            duration: 100
        });
        // #endif

        // #ifndef H5
        let scrollTop = 0;
        uni.createSelectorQuery().in(this).selectViewport().scrollOffset(res => {
            // console.log(res);
            scrollTop = res.scrollTop;
        }).select(".the-form-item").boundingClientRect(res => {
            // console.log(res);
            const top = scrollTop + res.top;
            uni.pageScrollTo({
                scrollTop: top - 50, // 这里 50 是顶部导航高度
                duration: 100
            });
        }).exec();
        // #endif
    }

    /**
     * 设置验证提示
     * @description 暴露给外部调用的方法，与`resetField`是相反的功能
     * @param message 要显示验证的内容，不传则用原来的提示文字
     */
    showValidateField(message?: string) {
        message && (this.validateText = message);
        this.showValidate = true;
        this.parentComponent.validateScroll && this.scrollIntoView();
    }
}
</script>
<style lang="scss">
$height: 80rpx;

.the-form-item {
    width: 100%;
    .the-form-label {
        font-size: 28rpx;
        font-weight: bold;
        color: #555;
        height: $height;
        line-height: $height;
        text-align: left;
        .the-form-symbol {
            color: #f0341b;
            padding-right: 4rpx;
        }
    }
    .flex .the-form-label {
        margin-right: 24rpx;
    }
    .the-form-label-right {
        text-align: right;
    }
    .the-form-value-box {
        min-height: $height;
        // padding: 0 0 50rpx 0;
    }
    .validate-text {
        height: 54rpx;
        .validate-tip {
            font-size: 24rpx;
            line-height: 50rpx;
            color: #f0341b;
            font-weight: 400;
            transition: 0.24s all;
            opacity: 0;
            transform: scaleY(0);
            transform-origin: top;
        }
        .validate-tip-show {
            transform: scaleY(1);
            opacity: 1;
        }
    }
    
}
.the-form-item-border {
    border-bottom: solid 1px #eee;
    margin-bottom: 50rpx;
}
</style>