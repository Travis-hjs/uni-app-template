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
