import config from "./Config";
import store from "../store";
import { ApiResult, RequestOptions } from "./interfaces";

function getResultInfo(result: { statusCode: number, data: any }) {
    const info: ApiResult = { code: -1, msg: "", data: null }
    switch (result.statusCode) {
        case 999:
            info.msg = "网络出错了";
            break;
        case 200:
            info.code = 1;
            info.msg = "ok";
            info.data = result.data;
            break;
        case 400:
            info.msg = "接口传参不正确";
        case 403:
            info.msg = "登录已过期";
            store.updateUserInfo({ token: "" });
            break;
        case 404:
            info.msg = "接口不存在";
            break;
        default:
            break;
    }
    if (result.statusCode >= 500) {
        info.msg = "服务器闹脾气了";
    }
    return info;
}

/**
 * 基础请求
 * @param method 请求方法
 * @param path 请求路径
 * @param data 请求参数
 * @param options 其他配置参数
 */
export default function request(method: "GET" | "POST" | "DELETE" | "PUT", path: string, data?: any, options: Partial<RequestOptions> = {}) {
    const headers = options.header || {};
    const showTip = typeof options.showTip === "boolean" ? options.showTip : true;
    return new Promise<ApiResult>(function(resolve, reject) {
        uni.request({
            method: method,
            header: {
                "Authorization": store.userInfo.token,
                ...headers
            },
            url: config.apiUrl + path,
            data: data,
            timeout: config.requestOvertime,
            success(res) {
                // console.log("request.success", res);
                const info = getResultInfo(res);
                if (info.code !== 1 && showTip) {
                    uni.showToast({
                        title: info.msg,
                        position: "bottom",
                        icon: "none",
                        duration: 2400
                    });
                }
                resolve(info);
            },
            fail(err) {
                const info = getResultInfo({ statusCode: 999, data: null });
                info.msg = err.errMsg;
                resolve(info);
            }
        })
    })
}
