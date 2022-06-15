/// <reference types="vite/client" />

declare module "*.vue" {
    import { DefineComponent } from "vue"
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
    const component: DefineComponent<{}, {}, any>
    export default component
}

// /**
//  * `vue3`类型扩充
//  * - 弥补官方的类型不足问题
//  */
// declare namespace Vue3 {
//     // "../node_modules/@vue/runtime-core/dist/runtime-core"
//     // import { ComponentInternalInstance } from "vue";
//     /**
//      * `vue`实例上下文
//      * - `vue3`类型文件中貌似没有暴露可以使用的类型，所以自定义补充一个接口代替，和`vue2`中一样的类型一致
//      */
//     interface Ctx {
//         /** 当前组件节点 */
//         readonly $el: HTMLElement
//         /** 父节点 */
//         readonly $parent?: Ctx
//         /** 当前组件实例 */
//         readonly $root: Ctx
//         /** 选项配置 */
//         readonly $options: {
//             name: string
//         }
//     }
//     /**
//      * `hooks: getCurrentInstance()`钩子函数返回的类型扩充
//      */
//     interface Instance extends ComponentInternalInstance {
//         /** 实例上下文对象 */
//         ctx: Ctx
//     }
// }