/** 深层递归所有属性为可选 */
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
}

/** 深层递归所有属性为只读 */
export type DeepReadonly<T> = {
    readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
}

/** 深层递归所有属性为必选选（貌似不生效） */
export type DeepRequired<T> = {
    [P in keyof T]-?: T[P] extends object ? Required<T[P]> : T[P];
}

/** 运算符号 */
export type NumberSymbols = "+" | "-"| "*" | "/";

/**
 * `JavaScript`类型
 * - 这里只枚举一些常见类型，后续根据使用场景自行添加即可
 */
export type JavaScriptTypes = "string" | "number" | "array" | "object" | "boolean" | "function" | "null" | "undefined" | "regexp" | "promise" | "formdata";


/** 请求配置项类型，第四个参数 */
export interface RequestOptions extends UniApp.RequestOptions {
    /** 是否在`res.code !== 1`的时候显示提示，默认`false`，传入`true`则用`res.msg`作为提示，也可以传入字符串作为提示内容 */
    showTip: boolean | string
}

/** 上传图片返回结果 */
export interface UploadImageRes {
    /** 和当前上传组件绑定的`id` */
    id: string | number
    /** 图片路径 */
    src: string
}

/** 接口请求基础响应数据 */
export interface ApiResult {
    /** 接口状态；`res.code === 1`为成功） */
    code: number
    /** 接口响应数据 */
    data: any
    /** 接口响应信息 */
    msg: string
}

/** 接口请求列表响应数据 */
export interface ApiListData extends ApiResult {
    data: {
        /** 当前页码 */
        pageIndex: number
        /** 每页条数 */
        pageSize: number
        /** 列表数据 */
        list: Array<any>
    }
}

/** 列表基础请求字段 */
export interface ListParams {
    /** 当前页码 */
    pageIndex: number
    /** 每页条数 */
    pageSize: number
    /** 其他索引签名 */
    [key: string]: any
}

export interface LoadMoreType extends ListParams {
    /** 加载状态 */ 
    state: "wait" | "loading" | "nomore"
    /** 加载的列表数据 */
    list: Array<any>
    /**
     * 请求成功次数
     * @description 成功时才会累加，`requestCount === 1` 时为首次获取数据 
    */
    requestCount: number
}

/** `uni-app`change事件参数 */
export interface UniAppChangeEvent<T> {
    detail: {
        /** `@change`事件触发的值 */
        value: T
    }
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
