import ModuleAppOption from "./AppOption";
import utils from "../utils";
import { 
    DeepPartial,
    DeepReadonly,
    UserInfoType 
} from "../utils/interfaces";

const cacheName = "user-info";

export class ModuleStore extends ModuleAppOption {
    constructor() {
        super();
        this.initUserInfo();
    }

    /** 图片对象集 */
    get imageInfo() {
        // 需要用作背景图的可以用`require`引入
        return {
            iconWx: "/static/logo_wx.png",
            iconZfb: "/static/logo_zfb.png",
            logo: "/static/logo.png",
            defaultHead: "/static/default_head.png",
            noneData: "/static/none_data.png",
            iconArrowRight: "/static/arrow-right.png"
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
        utils.modifyData(this.userInfo, value);
        uni.setStorageSync(cacheName, JSON.stringify(this.userInfo));
    }

    /** 初始化用户数据（从本地获取） */
    private initUserInfo() {
        const data = uni.getStorageSync(cacheName);
        if (data) {
            this.updateUserInfo(JSON.parse(data));
        }
    }

}

/**
 * 状态管理模块
 * - `OOP`单例设计模式
 * - 参考 [你不需要`Vuex`](https://juejin.cn/post/6844903904023429128)
 */
const store = new ModuleStore();

export default store;