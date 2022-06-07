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
export type labelPosition = "left" | "right" | "top";

/** 表单验证回调类型 */
export interface TheFormValidateCallback {
    (   
        /** 是否验证通过 */
        isValid: boolean,
        /** 验证不通过的规则列表 */
        rules: { [key: string]: Array<TheFormRulesItem> }
    ): void
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
