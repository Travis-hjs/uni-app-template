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

    /** <TheFormItem prop="xxx" > */
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
        default: ""
    })
    border!: boolean;

    /** 表单字段排版 */
    @Prop({
        type: String,
        default: ""
    })
    labelPosition!: labelPosition;

    /** 父组件实例 */
    @Inject("theFormComponent")
    parentComponent!: TheForm;

    /** 是否验证 */
    get isRequired() {
        let value = false;
        const rules = this.parentComponent.rules;
        if (rules && rules[this.prop] && rules[this.prop].length) {
            value = rules[this.prop].some(item => item.required);
        }
        return value;
    }

    // 监听父组件`labelPosition`变动
    @Watch("parentComponent.labelPosition", { immediate: true })
    onLabelPosition(val: labelPosition) {
        this.setUsePosition(val);
    }

    /** 视图中使用的定位属性值 */
    usePosition: labelPosition = "left";

    /** 设置视图中使用的定位属性值 */
    setUsePosition(val: labelPosition) {
        let value = this.labelPosition;
        if (!value) {
            value = val;
        }
        this.usePosition = value;
    }

    // 监听父组件`labelWidth`变动
    @Watch("parentComponent.labelWidth", { immediate: true })
    onLabelWidth(val: string) {
        this.setUseLabelWidth(val);
    }

    /** 视图中使用的`label`宽度值 */
    useLabelWidth = "";

    /** 设置视图中使用的`label`宽度值 */
    setUseLabelWidth(val: string) {
        let value = this.labelWidth;
        if (!value) {
            value = val;
        }
        this.useLabelWidth = value;
    }

    // 监听父组件`border`变动
    @Watch("parentComponent.border", { immediate: true })
    onBorder(val: boolean) {
        this.setUseBorder(val);
    }

    /** 视图中使用的`border`值 */
    useBorder = false;

    /** 设置视图中使用的`border`值 */
    setUseBorder(val: boolean) {
        let value = this.border;
        if (utils.checkType(value) !== "boolean") {
            value = val;
        }
        this.useBorder = value;
    }

    mounted() {
        if (this.prop) {
            this.dispatch("TheForm", "theFormAddField", [this]);
        }
        // console.log(this.parentComponent.labelPosition);
    }

    beforeDestroy() {
        this.dispatch("TheForm", "theFormRemoveField", [this]);
    }

    validateText = "-";
    
    showValidate = false;

    /** 重置当前验证提示 */
    resetField() {
        this.showValidate = false;
    }

    /**
     * 暴露给外部验证当前`item`
     * @param callback 校验回调
    */
    validateField(callback: (prop: string, rules: Array<TheFormRulesItem>) => void) {
        let info = null;
        const rules = this.parentComponent.rules;
        const model = this.parentComponent.model;
        const value = model[this.prop];
        const tip = "校验不通过";
        
        if (this.prop && rules && rules[this.prop] && this.isRequired) {
            const rulesItem = rules[this.prop];
            for (let i = 0; i < rulesItem.length; i++) {
                const item = rulesItem[i];
                if (item.type) {
                    if (utils.checkType(value) !== item.type) {
                        info = item;
                        this.validateText = item.message || tip;
                        this.showValidate = true;
                        break;
                    }
                    // this.validateText = "";
                    this.showValidate = false;
                }
                if (item.reg) {
                    if (!item.reg.test(value.toString())) {
                        info = item;
                        this.validateText = item.message || tip;
                        this.showValidate = true;
                        break;
                    }
                    // this.validateText = "";
                    this.showValidate = false;
                }
                // 最后判断是否为空值
                if (value === "" || value === null || value === undefined || value.length === 0) {
                    info = item;
                    this.validateText = item.message || tip;
                    this.showValidate = true;
                    break;
                }
                // this.validateText = "";
                this.showValidate = false;
            }
        }

        callback(this.prop || "", info ? [info] : []);
    }
}
</script>
<style lang="scss">
.the-form-item {
    width: 100%;
    .the-form-label {
        font-size: 28rpx;
        font-weight: bold;
        color: #555;
        margin-right: 24rpx;
        height: 80rpx;
        line-height: 80rpx;
        text-align: left;
        .the-form-symbol {
            color: #f0341b;
            padding-right: 4rpx;
        }
    }
    .the-form-label-right {
        text-align: right;
    }
    // .the-form-value-box {
    //     padding: 0 0 50rpx 0;
    // }
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