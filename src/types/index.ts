import { ComponentInternalInstance } from "vue";

/**
 * `vue3`类型扩充
 * - 弥补官方的类型不足问题
 */
export declare namespace Vue3 {
    /**
     * `vue`实例上下文
     * - `vue3`类型文件中貌似没有暴露可以使用的类型，所以自定义补充一个接口代替，和`vue2`中一样的类型一致
     */
    interface Ctx {
        /** 当前组件节点 */
        readonly $el: HTMLElement
        /** 父节点 */
        readonly $parent?: Ctx
        /** 当前组件实例 */
        readonly $root: Ctx
        /** 选项配置 */
        readonly $options: {
            name: string
        }
    }
    /**
     * `hooks: getCurrentInstance()`钩子函数返回的类型扩充
     */
    interface Instance extends ComponentInternalInstance {
        /** 实例上下文对象 */
        ctx: Ctx
    }
}

/** 上传图片返回结果 */
export interface UploadImageRes {
    /** 和当前上传组件绑定的`id` */
    id: string | number
    /** 图片路径 */
    src: string
}

/** 表单规则类型 */
export interface TheFormRulesItem {
    /** 是否必填项 */
    required?: boolean
    /** 提示字段 */
    message?: string
    /** 指定类型 */
    type?: "number" | "array"
    /**
     * 自定义的校验规则（正则）
     * @description 考虑到微信一些特殊的抽风机制，在微信小程序中，除 number|string|object 这几个基础类型外，其他类型是会被过滤掉，所以这里在写正则的时候，在末尾加上`.toString()`即可
    */
    reg?: string // | RegExp
}

/** 表单规则类型 */
export type TheFormRules = { [key: string]: Array<TheFormRulesItem> };

/** `label`布局位置 */
export type LabelPosition = "left" | "right" | "top";

/** 表单验证回调类型 */
export interface TheFormValidateCallback {
    (   
        /** 是否验证通过 */
        isValid: boolean,
        /** 验证不通过的规则列表 */
        rules: { [key: string]: Array<TheFormRulesItem> }
    ): void
}

/** `<TheForm>`&`<TheFormItem>`通用`props`类型 */
interface TheFormProps {
    /** 表单字段宽度，这里使用字符串，因为可能是`px`或者`rpx` */
    labelWidth: string
    /** 表单字段排版 */
    labelPosition: LabelPosition
    /** 是否需要显示底部边框 */
    border: boolean
}

/** 
 * `<TheForm>`上下文
 * - `vue3`中没有动态识别组件类型，所以需要单独去定义
 */
export interface TheFormCtx extends TheFormProps {
    /** 监听事件表 */
    eventMap: {
        add: string
        remove: string
    }
    /** 表单数据对象 */
    model: BaseObj
    /** 表单校验规则 */
    rules: TheFormRules
    /** 是否需要验证时滚动到对应位置 */
    validateScroll: boolean
    /**
     * 表单验证
     * @param callback 验证回调操作
     */
    validate(callback?: TheFormValidateCallback): void
    /** 
     * 指定验证某个值
     * @param prop 要验证的字段
     * @param callback 验证回调
     */
    validateField(prop: string, callback?: TheFormValidateCallback): void
    /**
     * 移除所有校验
     * @param callback 校验回调（同步），携带了原始数据：表单 和 规则
     */
    resetFields(callback?: (formData: any, rules: TheFormRules) => void): void
    /**
     * 移除某个验证
     * @param prop 指定值
     */
    resetField(prop: string): void
}

/**
 * `<TheFormItem>`上下文
 * - `vue3`中没有动态识别组件类型，所以需要单独去定义
 */
export interface TheFormItemCtx extends TheFormProps {
    /** `<TheFormItem prop="表单数据的键值" >` */
    prop: string
    /** 表单规则 */
    rules: Array<TheFormRulesItem>
    /**
     * 重置当前验证提示
     * @public 暴露给外部组件调用
     */
    resetField(): void
    /**
     * 验证当前`item`
     * @param callback 
     */
    validateField(callback: (prop: string, rules: Array<TheFormRulesItem>) => void): void
    /** 滚动到视图可见位置 */
    scrollIntoView(): void
    /**
     * 设置验证提示
     * @param message 要显示验证的内容，不传则用原来的提示文字
     */
    showValidateField(message: string): void
}

/** 选择器`item`数据 */
export interface PickerSelectItem<T = any> {
    /** 展示字段 */
    label: string
    /** 对应的值 */
    value: T
    /**
     * 下级数据
     * @description 最多三层，选择器栏目数根据当前下级动态显示
    */
    children?: Array<PickerSelectItem>
    /** 其他携带的值 */
    [key: string]: any
}
