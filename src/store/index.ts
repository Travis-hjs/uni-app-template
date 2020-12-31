import ModuleAppOption from "./AppOption";
import { 
    DeepPartial,
    DeepReadonly,
    UserInfoType 
} from "../utils/interfaces";

const cacheName = "user-info";

export class ModuleStore extends ModuleAppOption {
    /** 图片对象集 */
    get imageInfo() {
        // 需要用作背景图的可以用`require`引入
        return {
            iconWx: "/static/logo_wx.png",
            iconZfb: "/static/logo_zfb.png",
            logo: "/static/logo.png",
            defaultHead: "/static/default_head.png",
            noneData: "/static/none_data.png",
        }
    }

    /** 用户信息 */
    readonly userInfo: DeepReadonly<UserInfoType> = {
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
const store = new ModuleStore();

export default store;