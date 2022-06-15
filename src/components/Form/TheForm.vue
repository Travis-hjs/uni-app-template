<template>
    <view class="the-form">
        <slot></slot>
    </view>
</template>
<script lang="ts">
import { defineComponent, PropType, provide, getCurrentInstance, watch } from "vue";
import { TheFormRules, TheFormItemCtx, TheFormValidateCallback, Vue3 } from "@/types";
import { useFormProps } from "./hooks";
import { getDeepLevelValue } from "@/utils";

export default defineComponent({
    name: "TheForm",
    props: {
        /** 表单数据对象 */
        model: {
            type: Object as PropType<BaseObj>,
            required: true
        },
        /** 表单校验规则 */
        rules: {
            type: Object as PropType<TheFormRules>,
            default: () => {}
        },
        /** 是否需要验证时滚动到对应位置 */
        validateScroll: {
            type: Boolean,
            default: true
        },
        ...useFormProps()
    },
    setup(props, context) {
        const instance = getCurrentInstance() as Vue3.Instance;

        /** `model`原始数据，重置时用到 */
        let beforeModel: BaseObj;

        /** `rules`原始数据，重置时用 */
        let beforeRules: TheFormRules;

        /** `<TheFromItem>`实例列表 */
        const items: Array<TheFormItemCtx> = [];

        /**
         * 设置原始数据
         * @param formData 设置的表单数据
         * @param formRules 设置的表单规则
         */
        function setBeforeData(formData: BaseObj, forRules: TheFormRules) {
            // 先初始化对象
            beforeModel = {};
            beforeRules = {};

            if (formData) {
                // 这里可以直接暴力深拷贝，因为表单字段类型只能是常用那几个
                beforeModel = JSON.parse(JSON.stringify(formData));
            }

            if (forRules) {
                beforeRules = JSON.parse(JSON.stringify(forRules));
            }
        }

        setBeforeData(props.model, props.rules || {});
        
        // 监听`<TheFromItem>`创建传进来的自身组件
        uni.$on("addTheFormItem", function(res: [TheFormItemCtx, number]) {
            // console.log("addField >>", res);
            if (res[1] === instance.uid) {
                items.push(res[0]);
            }
        })

        // 监听对应的`<TheFromItem>`移除操作
        uni.$on("removeTheFormItem", function(res: [TheFormItemCtx, number]) {
            // console.log("removeField >>", res);
            if (res[1] === instance.uid) {
                res[0].prop && items.splice(items.indexOf(res[0]), 1);
            }
        })
        
        provide("theFormComponent", instance.ctx);

        /** 执行验证之后，储存的对象 */
        let validateInfo: BaseObj<boolean> = {};

        watch(() => props.model, function(res: BaseObj<string | number>) {
            const keys = Object.keys(validateInfo);
            if (keys.length) {
                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i];
                    const value = getDeepLevelValue(res, key);
                    if (value !== "" && value !== null && value !== undefined && value.length !== 0) {
                        validateField(key, isValid => {
                            if (isValid) {
                                delete validateInfo[key];
                            }
                        }, true);
                    }
                }
            }
        }, { deep: true });

        /** 
         * 指定验证某个值
         * @param prop 要验证的字段
         * @param callback 验证回调
         * @param isWatch 是否内部 `watch` 方法调用
         */
        function validateField(prop: string, callback?: TheFormValidateCallback, isWatch = false) {
            if (!props.model) return console.warn(`表单验证缺少 "model" 对象`);
            if (!props.rules) return console.warn(`表单验证缺少 "rules" 对象，无法验证`);
            let rules: TheFormRules = {};
            let failItems: Array<TheFormItemCtx> = [];
            let adopt = true;
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                if (((props.rules && props.rules[prop]) || (item.rules && item.rules.length)) && item.prop === prop) {
                    item.validateField(function(prop, rule) {
                        if (prop && rule.length > 0) {
                            rules[prop] = rule;
                            adopt = false;
                            failItems.push(item);
                            validateInfo[prop] = true;
                        }
                    });
                    break;
                }
            }
            if (props.validateScroll && !isWatch && failItems.length > 0) {
                failItems[0].scrollIntoView();
            }
            callback && callback(adopt, rules);
        }

        /**
         * 表单验证
         * @public 暴露给外部调用的
         * @param callback 验证回调操作
         */
        function validate(callback?: TheFormValidateCallback) {
            if (!props.model) return console.warn(`表单验证缺少 "model" 对象`);
            if (!props.rules) return console.warn(`表单验证缺少 "rules" 对象，无法验证`);
            let rules: TheFormRules = {};
            let failItems: Array<TheFormItemCtx> = [];
            let adopt = true;
            items.forEach(function(item) {
                item.validateField(function(prop, rule) {
                    if (prop && rule.length > 0) {
                        rules[prop] = rule;
                        adopt = false;
                        failItems.push(item);
                        validateInfo[prop] = true;
                    }
                })
            });
            if (props.validateScroll && failItems.length > 0) {
                failItems[0].scrollIntoView();
            }
            callback && callback(adopt, rules);
        }
        
        /**
         * 移除所有校验
         * @description 暴露给外部调用的
         * @param callback 校验回调（同步），携带了原始数据：表单 和 规则
         */
        function resetFields(callback?: (formData: any, rules: TheFormRules) => void) {
            if (!props.model) return console.warn(`表单验证缺少 "model" 对象`);
            // 清空验证对象，减少`watch`的性能开销
            validateInfo = {};

            // 方式一：
            // 直接修改对象的引用值，这种方式在微信小程序里面会失效，原因是微信把所有数据都 JSON 格式化了，导致某些引用终端，而且传参类型也只能是 string | number | object
            // modifyData(this.model, this.beforeModel);
            
            items.forEach(item => {
                item.resetField();
            })

            // 方式二：单向事件触发父组件更新数据，性能最优
            callback && callback(JSON.parse(JSON.stringify(beforeModel)), JSON.parse(JSON.stringify(beforeRules)));
        }

        /**
         * 移除某个验证
         * @param prop 指定值
         */
        function resetField(prop: string) {
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                if (item.prop === prop) {
                    if (Object.prototype.hasOwnProperty.call(validateInfo, prop)) {
                        delete validateInfo[prop];
                    }
                    item.resetField();
                    break;
                }
            }
        }
        
        return {
            validate,
            validateField,
            resetFields,
            resetField
        }
    }
})
</script>
<style lang="scss">
.the-form {
    width: 100%;
}
</style>