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
import TheForm from "./TheForm.vue";
import { useFormProps } from "./hooks";
import { TheFormRulesItem, Vue3 } from "@/types";
import { computed, defineComponent, getCurrentInstance, inject, onMounted, onUnmounted, PropType, ref } from "vue";
import { checkType, getDeepLevelValue } from "@/utils";

/**
 * 指定派发组件监听的事件
 * - 通过递归遍历来找到对应的父组件并且将当前组件属性方法和参数带到父组件方便调用
 * @param componentName 指定的组件名
 * @param eventName 事件名
 * @param ctx 当前实例
 */
function dispatch(componentName: string, eventName: string, ctx: Vue3.Ctx) {
    let parent = ctx.$parent || ctx.$root;
    let name = parent.$options.name;

    while (parent && (!name || name !== componentName)) {
        parent = parent.$parent!;
        if (parent) {
            name = parent.$options.name;
        }
    }
    if (name === componentName) {
        uni.$emit(eventName, ctx);
    }
}

export default defineComponent({
    name: "TheFormItem",
    props: {
        label: {
            type: String,
            default: ""
        },
        /** `<TheFormItem prop="表单数据的键值" >` */
        prop: {
            type: String,
            default: ""
        },
        rules: {
            type: Array as PropType<Array<TheFormRulesItem>>,
            default: () => []
        },
        ...useFormProps(true)
    },
    setup(props, context) {
        const instance = getCurrentInstance() as Vue3.Instance;
        /** 当前实例 */
        let ctx: Vue3.Ctx;
        /**
         * 父组件实例对象
         * - 注入形式
         */
        const parentComponent = inject("theFormComponent") as InstanceType<typeof TheForm>;
        
        /** 是否验证 */
        const isRequired = computed(function() {
            let result = false;
            const rules = parentComponent.rules;
            if (rules && rules[props.prop] && rules[props.prop].length) {
                result = rules[props.prop].some(item => item.required);
            }
            // 自身组件的规则
            if (props.rules && props.rules.length > 0) {
                result = props.rules.some(item => item.required);
            }
            return result;
        })

        /** 视图中使用的定位属性值 */
        const usePosition = computed(function() {
            return props.labelPosition || parentComponent.labelPosition;
        })

        /** 视图中使用的`label`宽度值 */
        const useLabelWidth = computed(function() {
            return props.labelWidth || parentComponent.labelWidth;
        })

        /** 视图中使用的`border`值 */
        const useBorder = computed(function() {
            return checkType(props.border) === "boolean" ? props.border : parentComponent.border;
        })

        /** 
         * 验证提示文字
         * - 这个值不要给空，因为要撑开元素的高度，为空的话没有结束过渡动画
         */
        const validateText = ref("-");
        /** 是否显示验证提示 */
        const showValidate = ref(false);
        /**
         * 重置当前验证提示
         * @public 暴露给外部组件调用
         */
        function resetField() {
            showValidate.value = false;
        }
        /**
         * 验证当前`item`
         * @public 暴露给外部组件调用
         * @param callback 校验回调
         */
        function validateField(callback: (prop: string, rules: Array<TheFormRulesItem>) => void) {
            let info;
            const currentProp = props.prop;
            const parentRules = parentComponent.rules;
            const model = parentComponent.model;
            const value = getDeepLevelValue(model, currentProp);
            const tip = "校验不通过";
            if (isRequired.value && currentProp) {

                /** 自身规则列表 */
                const selfRules = props.rules;
                /** 要校验的规则列表 */
                const rulesList = [];
                // 先判断父组件有没有校验规则
                if (parentRules && parentRules[currentProp]) {
                    rulesList.push(...parentRules[currentProp]);
                }
                // 然后把自身的规则列表加进去
                if (selfRules && selfRules.length > 0) {
                    rulesList.push(...selfRules);
                }
                // 最后遍历检测
                for (let i = 0; i < rulesList.length; i++) {
                    const item = rulesList[i];
                    if (item.type) {
                        if (checkType(value) !== item.type) {
                            info = item;
                            validateText.value = item.message || tip;
                            showValidate.value = true;
                            break;
                        }
                        showValidate.value = false;
                    }
                    if (item.reg) {
                        // const reg = new RegExp(item.reg.replace(/\//g, ""));
                        const reg = new RegExp(item.reg.slice(1, item.reg.length - 1));

                        if (checkType(reg) === "regexp") {
                            if (!reg.test(value.toString())) {
                                info = item;
                                validateText.value = item.message || tip;
                                showValidate.value = true;
                                break;
                            }
                            showValidate.value = false;
                        } else {
                            console.warn("validateField >> ruls 传入的 reg 非正则，已跳过验证");
                        }
                    }
                    // 最后判断是否为空值
                    if (value === "" || value === null || value === undefined || value.length === 0) {
                        info = item;
                        validateText.value = item.message || tip;
                        showValidate.value = true;
                        break;
                    }
                    showValidate.value = false;
                }
            }

            callback(currentProp || "", info ? [info] : []);
        }
        /**
         * 滚动到视图可见位置
         * @public 暴露给外部调用的方法
         */
        function scrollIntoView() {
            // #ifdef H5
            const top = ctx.$el.offsetTop;
            uni.pageScrollTo({
                scrollTop: top - 50, // 这里 50 是顶部导航高度
                duration: 100
            });
            // #endif

            // #ifndef H5
            let scrollTop = 0;
            uni.createSelectorQuery().in(ctx).selectViewport().scrollOffset(res => {
                // console.log(res);
                scrollTop = res.scrollTop!;
            }).select(".the-form-item").boundingClientRect(res => {
                // console.log(res);
                const top = scrollTop + res.top!;
                uni.pageScrollTo({
                    scrollTop: top - 50, // 这里 50 是顶部导航高度
                    duration: 100
                });
            }).exec();
            // #endif
        }

        /**
         * 设置验证提示
         * @public 暴露给外部调用的方法，与`resetField`是相反的功能
         * @param message 要显示验证的内容，不传则用原来的提示文字
         */
        function showValidateField(message?: string) {
            if (message) {
                validateText.value = message;
            }
            showValidate.value = true;
            parentComponent.validateScroll && scrollIntoView();
        }

        onMounted(function() {
            // console.clear();
            // console.log("context >>", context);
            // console.log("parentComponent >>", parentComponent);
            
            ctx = instance.ctx;
            if (props.prop) {
                dispatch("TheForm", parentComponent.eventMap.add, ctx);
            }
        })

        onUnmounted(function() {
            dispatch("TheForm", parentComponent.eventMap.remove, ctx);
        })


        return {
            isRequired,
            usePosition,
            useLabelWidth,
            useBorder,
            showValidate,
            validateText,
            resetField,
            validateField,
            scrollIntoView,
            showValidateField
        }
    }
})
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