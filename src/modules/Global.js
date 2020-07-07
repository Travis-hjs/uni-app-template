import ModuleAppOption from "./AppOption";

class ModuleGlobal extends ModuleAppOption {

    icon = {
        /** 金币 */
        gold: "/static/gold.png",
        /** 红包 */
        redpack: "/static/redpack.png",
        /** 微信logo */
        logo_wx: "/static/logo_wx.png",
        /** 支付宝logo */
        logo_zfb: "/static/logo_zfb.png",
        /** 签到icon */
        sign_in: "/static/icon_signin.png",
        
    }

    images = {
        /** 默认头像 */
        default_head: "/static/default_head.png",
        /** 暂无数据 */
        none_data: "/static/none_data.png",
    }

}

/** 
 * 全局模块 
 * @deprecated - 继承了 `AppOption`模块、`Store` 模块
*/
const Global = new ModuleGlobal();

export default Global;