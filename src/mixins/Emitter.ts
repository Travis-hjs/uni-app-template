import utils from "@/utils";
import { Component, Vue } from "vue-property-decorator";

/** 自定义事件派发 */
@Component({})
export default class Emitter extends Vue {
    /**
     * 指定派发组件监听的事件
     * @description 通过递归遍历来找到对应的父组件并且将当前组件属性方法和参数带到父组件方便调用
     * @param componentName 指定的组件名
     * @param eventName 事件名
     * @param params 派发的参数
     */
    protected dispatch(componentName: string, eventName: string, params: Array<Vue>) {
        let parent = this.$parent || this.$root;
        let name = parent.$options.name;

        while (parent && (!name || name !== componentName)) {
            parent = parent.$parent;
            if (parent) {
                name = parent.$options.name;
            }
        }
        if (parent) {
            parent.$emit.apply(parent, [eventName].concat(params as any) as any);
        }
    }

    /**
     * 获取一些深层`key`的对象值
     * @param target 目标对象
     * @param key
     * @example 
     * ```js
     * const info = {
     *     list: [
     *         { value: "hjs" }
     *     ]
     * }
     * getKeyValue(info, "list.0.value");
     * ```
     */
    protected getKeyValue(target: any, key: string) {
        const keys = key.split(".");
        let result;
        for (let i = 0; i < keys.length; i++) {
            const prop = keys[i];
            result = target[prop];
            const type = utils.checkType(result);
            if (type !== "object" && type !== "array") {
                break;
            } else {
                target = target[prop];
            }
        }
        return result;
    }
}