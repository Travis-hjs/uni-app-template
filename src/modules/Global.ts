import ModuleAppOption from "./AppOption";

class ModuleGlobal extends ModuleAppOption {

    icon = {
        /** 微信logo */
        logo_wx: "/static/logo_wx.png",
        /** 支付宝logo */
        logo_zfb: "/static/logo_zfb.png",
    }

    images = {
        logo: "/static/logo.png",
        /** 默认头像 */
        default_head: "/static/default_head.png",
        /** 暂无数据 */
        none_data: "/static/none_data.png",
    }

}

/** 
 * 全局模块 
 * @description - 继承了 `AppOption`模块
*/
const Global = new ModuleGlobal();

export default Global;