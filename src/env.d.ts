/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

/**
 * `vue`实例上下文
 * - `vue3`类型文件中貌似没有暴露可以使用的类型，所以自定义补充一个接口代替，和`vue2`中一样的类型一致
 */
interface VueCtx {
    /** 当前组件节点 */
    readonly $el: HTMLElement
    /** 父节点 */
    readonly $parent?: VueCtx
    /** 当前组件实例 */
    readonly $root: VueCtx
    /** 选项配置 */
    readonly $options: {
        name: string
    }
} 
