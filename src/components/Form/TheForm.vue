<template>
    <view class="the-form">
        <slot></slot>
    </view>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import TheFormItem from "./TheFormItem.vue";
import utils from "@/utils";
import { TheFormRules, labelPosition, TheFormRulesItem } from "@/utils/interfaces";

@Component({
    name: "TheForm",
    provide() {
        return {
            theFormComponent: this
        }
    }
})
export default class TheForm extends Vue {

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
     * `<TheFromItem>`实例列表
     * @description 非响应式
    */
    private fields!: Array<TheFormItem>;

    /**
     * 设置原始数据
     * @param formData 设置的数据 
     */
    setBeforeModel<T>(formData: T) {
        // 先初始化对象
        this.beforeModel = {};
        if (formData) {
            for (const key in formData) {
                const value = formData[key];
                if (utils.checkType(value) === "array") {
                    this.beforeModel[key] = [...value as any];
                } else {
                    this.beforeModel[key] = formData[key];
                }
            }
        }
    }

    created() {
        this.setBeforeModel(this.model);

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
    onModelChange(res: any) {
        const keys = Object.keys(this.validateInfo);
        if (keys.length && this.rules) {
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                const value = res[key];
                if (value !== "" && value !== null && value !== undefined && value.length !== 0) {
                    this.validateField(key, isValid => {
                        if (isValid) {
                            delete this.validateInfo[key];
                        }
                    })
                }
            }
        }
    }

    /**
     * 表单验证
     * @description 暴露给外部调用的
     * @param callback 验证回调操作
    */
    validate(callback: (isValid: boolean, rules: { [key: string]: Array<TheFormRulesItem> }) => void) {
        if (!this.model) return console.warn(`表单验证缺少 "model" 对象`);
        if (!this.rules) return console.warn(`表单验证缺少 "rules" 对象，无法验证`);
        let rules: TheFormRules = {};
        let adopt = true;
        this.fields.forEach(item => {
            item.validateField((prop, rule) => {
                if (prop && rule.length > 0) {
                    rules![prop] = rule;
                    adopt = false;
                    this.validateInfo[prop] = true;
                }
            })
        })
        callback(adopt, rules);
    }

    /** 
     * 指定验证某个值
     * @param prop 要验证的字段
     */
    validateField(prop: string, callback?: (isValid: boolean, rules: { [key: string]: Array<TheFormRulesItem> }) => void) {
        if (!this.model) return console.warn(`表单验证缺少 "model" 对象`);
        if (!this.rules) return console.warn(`表单验证缺少 "rules" 对象，无法验证`);
        let rules: TheFormRules = {};
        let adopt = true;
        for (let i = 0; i < this.fields.length; i++) {
            const item = this.fields[i];
            if (this.rules && this.rules[prop] && item.prop === prop) {
                item.validateField((prop, rule) => {
                    if (prop && rule.length > 0) {
                        rules![prop] = rule;
                        adopt = false;
                        this.validateInfo[prop] = true;
                    }
                })
                break;
            }
        }
        callback && callback(adopt, rules);
    }

    /**
     * 移除所有校验
     * @description 暴露给外部调用的
     */
    resetFields() {
        if (!this.model) return console.warn(`表单验证缺少 "model" 对象`);
        // console.log(this.model, this.beforeModel);
        // 清空验证对象，减少`watch`的性能开销
        this.validateInfo = {};
        
        // 方式一：
        // this.$emit("change", this.beforeModel); // 这里依然是单向事件触发父组件更新数据，性能最优

        // 方式二；
        // 直接修改对象的引用值
        utils.modifyData(this.model, this.beforeModel);
        
        this.fields.forEach(item => {
            item.resetField();
        })
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