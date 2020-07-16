const cacheName = "user-info";

export default class StoreUserInfo {
    /** 用户信息 */
    userInfo = {
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
            this.userInfo = JSON.parse(data);
        } 
    }

}