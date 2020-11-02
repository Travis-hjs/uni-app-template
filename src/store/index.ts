import { ModuleModifyObject } from "../modules/ModifyObject";

const cacheName = "user-info";

export class StoreUserInfo extends ModuleModifyObject {
    /** 用户信息 */
    readonly userInfo = {
        /** 登录凭据 */
        token: "",
        /** 用户手机号 */
        phone: ""
    }

    /** 存储用户信息到本地 */
    saveUserInfo() {
        uni.setStorageSync(cacheName, JSON.stringify(this.userInfo));
    }

    /** 初始化用户数据（从本地获取） */
    initUserInfo() {
        const data = uni.getStorageSync(cacheName);
        if (data) {
            this.modifyData(this.userInfo, JSON.parse(data));
        }
    }

}

/** 状态模块 */
const store = new StoreUserInfo();

export default store;