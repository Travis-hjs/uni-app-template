import ModuleAppOption from "./AppOption";
import ModuleUser from "./User";
import { getImageByName } from "@/utils";
export class ModuleStore extends ModuleAppOption {
  constructor() {
    super();
  }

  /** 图片对象集 */
  get imageInfo() {
    // 需要用作背景图的可以用`import`引入
    return {
      // iconWx: "/static/logo_wx.png",
      // iconZfb: "/static/logo_zfb.png",
      // logo: "/static/logo.png",
      // defaultHead: "/static/default_head.png",
      // noneData: "/static/none_data.png",
      // iconArrowRight: "/static/arrow-right.png"
      iconWx: getImageByName("logo_wx.png"),
      iconZfb: getImageByName("logo_zfb.png"),
      logo: getImageByName("logo.png"),
      defaultHead: getImageByName("default_head.png"),
      noneData: getImageByName("none_data.png"),
    }
  }

  /** 用户状态 */
  readonly user = new ModuleUser();

}

/**
 * 状态管理模块
 * - `OOP`单例设计模式
 * - 参考 [你不需要`Vuex`](https://juejin.cn/post/6844903904023429128)
 */
const store = new ModuleStore();

export default store;