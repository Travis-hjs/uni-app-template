import config from "./Config";
import Global from "./Global";

/**
 * 基础请求
 * @description 可使用回调方式使用和`Promise`方式
 * @param {"GET"|"POST"|"DELETE"|"PUT"} method 请求方法
 * @param {string} path 接口路径
 * @param {any} data 传参对象
 * @param {(res: any) => void} success 成功回调
 * @param {(res: RequestSuccessCallbackResult) => void} fail 失败回调
 */
export default function request(method, path, data, success, fail) {
    const domain = process.env.NODE_ENV == "development" ? config.requestUrlDev : config.requestUrl;
    // console.log("request 运行状态：", process.env.NODE_ENV);
    return new Promise(function(resolve, reject) {
        uni.request({
            method: method,
            header: {
                "Authorization": Global.userInfo.token
            },
            url: domain + config.apiPrefix + path,
            data: data,
            success(res) {
                // console.log("request.success", res);
                if (res.data.code == "200") {
                    typeof success === "function" && success(res.data.data);
                    resolve(res.data.data);
                } else {
                    let tip = res.data.message || "服务端错误：" + res.statusCode;
                    if (res.data.code == 403) {
                        tip = "登录已过期";
                        Global.userInfo.token = "";
                    }
                    uni.showToast({
                        title: tip,
                        position: "bottom"
                    });
                    typeof fail === "function" && fail(res);
                }
            },
            fail(err) {
                typeof fail === "function" && fail(err);
                reject(err);
            }
        })
    })
}
