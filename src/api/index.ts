import { RequestParams } from "../utils/interfaces";
import request from "../utils/request";

class ModuleApiUser {
    /**
     * 用户登录 （回调用法）
     * @param form 
     * @param success 成功回调
     * @param fail 失败回调
     */
    login(form: {account: string | number, password: string | number}, success?: RequestParams["success"], fail?: RequestParams["fail"]) {
        request("POST", "/login", form, success, fail);
    }

    /**
     * 查询用户类型 （Promise用法）
     * @param value 用户标识
     */
    searchUserType(value: "admin"|"vip"|"normal") {
        return request("POST", "/Logout", { type: value });
    }
}

/** 用户接口模块 */
const apiUser = new ModuleApiUser();

export default apiUser;