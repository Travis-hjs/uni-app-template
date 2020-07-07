import request from "../modules/request";

class ModuleApiUser {
    /**
     * 用户登录 （回调用法）
     * @param {{account: string|number}, password: string|number} form 
     * @param {(res: any) => void} success 成功回调
     * @param {(res: RequestSuccessCallbackResult) => void} fail 失败回调
     */
    login(form, success, fail) {
        request("POST", "/login", form, success, fail);
    }

    /**
     * 查询用户类型 （Promise用法）
     * @param {"admin"|"vip"|"normal"} value 用户标识
     */
    searchUserType(value) {
        return request("POST", "/Logout", { type: value });
    }
}

/** 用户接口模块 */
const apiUser = new ModuleApiUser();

export default apiUser;