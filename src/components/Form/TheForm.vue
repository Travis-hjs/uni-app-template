<template>
    <view class="the-form">
        <slot></slot>
    </view>
</template>
<script lang="ts">
import { Component, Prop, Watch } from "vue-property-decorator";
import Emitter from "@/mixins/Emitter";
import TheFormItem from "./TheFormItem.vue";
// import utils from "@/utils";
import { TheFormRules, labelPosition, TheFormValidateCallback } from "@/utils/interfaces";
import utils from "@/utils";

@Component({
    name: "TheForm",
    provide() {
        return {
            theFormComponent: this
        }
    }
})
export default class TheForm extends Emitter {

    /** 是否需要验证时滚动到对应位置 */
    @Prop({
        type: Boolean,
        default: true
    })
    validateScroll!: boolean;

    /** 表单字段宽度，这里使用字符串，因为可能是`px`或者`rpx` */
    @Prop({
        type: String,
        default: ""
    })
    labelWidth!: string;

    /** 表单字段排版 */
    @Prop({
        type: String,
        default: "left"
    })
    labelPosition!: labelPosition;

    /** 是否需要显示底部边框 */
    @Prop({
        type: Boolean,
        default: false
    })
    border!: boolean;

    /** 表单数据对象 */
    @Prop({
        type: Object,
        required: true
    })
    model!: any;

    /**
     * `model`原始数据，重置时用到
     * @description 非响应式
    */
    private beforeModel!: any;

    /** 表单校验规则 */
    @Prop({
        type: Object,
        default: {}
    })
    rules!: TheFormRules;

    /**
     * `rules`原始数据，重置时用
     * @description 非响应式
     */
    private beforeRules!: any;

    /**
     * `<TheFromItem>`实例列表
     * @description 非响应式
    */
    private fields!: Array<TheFormItem>;

    /**
     * 设置原始数据
     * @param formData 设置的表单数据
     * @param formRules 设置的表单规则
     */
    setBeforeData<T>(formData: T, forRules: T) {
        // 先初始化对象
        this.beforeModel = {};
        this.beforeRules = {};

        if (formData) {
            // 这里可以直接暴力深拷贝，因为表单字段类型只能是常用那几个
            this.beforeModel = JSON.parse(JSON.stringify(formData));
        }

        if (forRules) {
            this.beforeRules = JSON.parse(JSON.stringify(forRules));
            // 这里其实也是可以用上面的来深拷贝，考虑到后面可能有 function 或者其他类型，这样处理会比较好
            // for (const key in forRules) {
            //     const value = forRules[key];
            //     if (utils.checkType(value) === "array") {
            //         this.beforeRules[key] = [...value as any];
            //     } else {
            //         this.beforeRules[key] = forRules[key];
            //     }
            // }
        }
    }

    created() {
        this.setBeforeData(this.model, this.rules || {});

        // 初始化清空
        this.fields = [];

        // 监听`<TheFromItem>`创建传进来的自身组件
        this.$on("theFormAddField", (field: TheFormItem) => {
            // console.log("addField >>", field);
            this.fields.push(field);
        })

        // 监听对应的`<TheFromItem>`移除操作
        this.$on("theFormRemoveField", (field: TheFormItem) => {
            // console.log("removeField >>", field);
            field.prop && this.fields.splice(this.fields.indexOf(field), 1);
        })
    }

    /** 执行验证之后，储存的对象 */
    private validateInfo: { [key: string]: boolean } = {};

    // 监听验证不通过，之后有值变动且验证通过后就移除验证提示
    @Watch("model", {
        deep: true
    })
    private onModelChange(res: any) {
        const keys = Object.keys(this.validateInfo);
        if (keys.length) {
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                const value = utils.getDeepLevelValue(res, key);
                if (value !== "" && value !== null && value !== undefined && value.length !== 0) {
                    this.validateField(key, isValid => {
                        if (isValid) {
                            delete this.validateInfo[key];
                        }
                    }, true);
                }
            }
        }
    }

    /**
     * 滚动到指定`item`位置
     * @param item `item`实例
    */
    private scrollToItem(item: TheFormItem) {
        // #ifdef H5
        const top = (item.$el as HTMLElement).offsetTop;
        uni.pageScrollTo({
            scrollTop: top - 50, // 这里 50 是顶部导航高度
            duration: 100
        });
        // #endif

        // #ifndef H5
        let scrollTop = 0;
        uni.createSelectorQuery().in(item).selectViewport().scrollOffset(res => {
            // console.log(res);
            scrollTop = res.scrollTop;
        }).select('.the-form-item').boundingClientRect(res => {
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
     * 表单验证
     * @description 暴露给外部调用的
     * @param callback 验证回调操作
    */
    validate(callback?: TheFormValidateCallback) {
        if (!this.model) return console.warn(`表单验证缺少 "model" 对象`);
        if (!this.rules) return console.warn(`表单验证缺少 "rules" 对象，无法验证`);
        let rules: TheFormRules = {};
        let failItems: Array<TheFormItem> = [];
        let adopt = true;
        this.fields.forEach(item => {
            item.validateField((prop, rule) => {
                if (prop && rule.length > 0) {
                    rules[prop] = rule;
                    adopt = false;
                    failItems.push(item);
                    this.validateInfo[prop] = true;
                }
            })
        });
        if (this.validateScroll && failItems.length > 0) {
            this.scrollToItem(failItems[0]);
        }
        callback && callback(adopt, rules);
    }

    /** 
     * 指定验证某个值
     * @param prop 要验证的字段
     * @param isWatch 是否内部 `watch` 方法调用
     */
    validateField(prop: string, callback?: TheFormValidateCallback, isWatch = false) {
        if (!this.model) return console.warn(`表单验证缺少 "model" 对象`);
        if (!this.rules) return console.warn(`表单验证缺少 "rules" 对象，无法验证`);
        let rules: TheFormRules = {};
        let failItems: Array<TheFormItem> = [];
        let adopt = true;
        for (let i = 0; i < this.fields.length; i++) {
            const item = this.fields[i];
            if (((this.rules && this.rules[prop]) || (item.rules && item.rules.length)) && item.prop === prop) {
                item.validateField((prop, rule) => {
                    if (prop && rule.length > 0) {
                        rules[prop] = rule;
                        adopt = false;
                        failItems.push(item);
                        this.validateInfo[prop] = true;
                    }
                });
                break;
            }
        }
        if (this.validateScroll && !isWatch && failItems.length > 0) {
            this.scrollToItem(failItems[0]);
        }
        callback && callback(adopt, rules);
    }

    /**
     * 移除所有校验
     * @description 暴露给外部调用的
     * @param callback 校验回调（同步），携带了原始数据：表单 和 规则
     */
    resetFields(callback?: (formData: any, rules: any) => void) {
        if (!this.model) return console.warn(`表单验证缺少 "model" 对象`);
        // console.log(this.model, this.beforeModel);
        // 清空验证对象，减少`watch`的性能开销
        this.validateInfo = {};

        // 方式一：
        // 直接修改对象的引用值，这种方式在微信小程序里面会失效，原因是微信把所有数据都 JSON 格式化了，导致某些引用终端，而且传参类型也只能是 string | number | object
        // utils.modifyData(this.model, this.beforeModel);
        
        this.fields.forEach(item => {
            item.resetField();
        })

        // 方式二：单向事件触发父组件更新数据，性能最优
        callback && callback(JSON.parse(JSON.stringify(this.beforeModel)), JSON.parse(JSON.stringify(this.beforeRules)));
    }

    /**
     * 移除某个验证
     * @param prop 指定值
     */
    resetField(prop: string) {
        for (let i = 0; i < this.fields.length; i++) {
            const item = this.fields[i];
            if (item.prop === prop) {
                if (Object.prototype.hasOwnProperty.call(this.validateInfo, prop)) {
                    delete this.validateInfo[prop];
                }
                item.resetField();
                break;
            }
        }
    }

}
</script>
<style lang="scss">
.the-form {
    width: 100%;
}
</style>