import { ModuleModifyObject } from "../modules/ModifyObject";
import { 
    DeepPartial,
    UserInfoType 
} from "../utils/interfaces";

const cacheName = "user-info";

export class StoreUserInfo extends ModuleModifyObject {
    /** 用户信息 */
    readonly userInfo: UserInfoType = {
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