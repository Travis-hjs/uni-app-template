import { PropType } from "vue";
import { LabelPosition } from "@/types";

/**
 * 表单相同`props`
 * @param position 默认排版
 */
export function useFormProps(position: LabelPosition | "" = "") {
    return {
        /** 表单字段宽度，这里使用字符串，因为可能是`px`或者`rpx` */
        labelWidth: {
            type: String,
            default: ""
        },
        /** 表单字段排版 */
        labelPosition: {
            type: String as PropType<LabelPosition>,
            default: position
        },
        /** 是否需要显示底部边框 */
        border: {
            type: [Boolean, String],
            default: "-", // 微信小程序抽风会把空字符串转成 boolean 所以这里随便给个字符串
        },
    }
}