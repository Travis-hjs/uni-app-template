import ModuleAppOption from "./AppOption";
import { 
    DeepPartial,
    UserInfoType 
} from "../utils/interfaces";

const cacheName = "user-info";

export class StoreUserInfo extends ModuleAppOption {
    
    readonly icon = {
        /** 微信logo */
        logo_wx: "/static/logo_wx.png",
        /** 支付宝logo */
        logo_zfb: "/static/logo_zfb.png",
    }

    readonly images = {
        logo: "/static/logo.png",
        /** 默认头像 */
        default_head: "/static/default_head.png",
        /** 暂无数据 */
        none_data: "/static/none_data.png",
    }

    /** 用户信息 */
    readonly userInfo: UserInfoType = {
        id: "",
        token: "",
        phone: ""
    }

    /**
     * 更新用户信息字段
     * @param value 
     */
    updateUserInfo(value: DeepPartial<UserInfoType>) {
        this.modifyData(this.userInfo, value);
        uni.setStorageSync(cacheName, JSON.stringify(this.userInfo));
    }

    /** 初始化用户数据（从本地获取） */
    initUserInfo() {
        const data = uni.getStorageSync(cacheName);
        if (data) {
            this.updateUserInfo(JSON.parse(data));
        }
    }

}

/** 状态模块 */
const store = new StoreUserInfo();

export default store;