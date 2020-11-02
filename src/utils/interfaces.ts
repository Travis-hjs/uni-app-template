/** 深层递归所有属性为可选 */
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
}

/** 运算符号 */
export type NumberSymbols = "+" | "-"| "*" | "/";

/** JavaScript类型 */
export type JavaScriptTypes = "string" | "number" | "array" | "object" | "function" | "null" | "undefined";

export interface ShowConfirmOptions {
    /** 内容 */
    content: string 
    /** 标题 */
    title?: string
    /** 确认回调 */
    callback?: () => void
    /** 取消回调 */
    cancel?: () => void 
    /** 确认按钮文字 */
    text: string
}

export interface RequestParams {
    /** 请求方法 */
    method: "GET"|"POST"|"DELETE"|"PUT"
    /** 接口路径 */
    path: string
    /** 传参对象 */
    data: any
    /** 请求成功回调 */
    success: (res: any) => void
    /** 请求失败回调 */
    fail: (res: any) => void
}

/** 上传图片返回结果 */
export interface UploadImageRes {
    /** 和当前上传组件绑定的`id` */
    id: string | number
    /** 图片路径 */
    src: string
}

export interface UserInfoType {
    /** 登录凭据 */
    token: string
    /** 用户手机号 */
    phone: number | ""
}