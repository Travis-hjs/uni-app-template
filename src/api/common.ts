import { randomText, ranInt } from "@/utils";
import request from "@/utils/request";

/**
 * 用户登录
 * @param form 
 */
export function login(form: { account: string | number, password: string | number }) {
    return request("POST", "/login", form);
}

/**
 * 查询用户类型
 * @param value 用户标识
 */
export function searchUserType(value: "admin" | "vip" | "normal") {
    return request("POST", "/user/searchType", { type: value });
}

/** 
 * 模拟请求数据 
 * @param params
 */
export function getTestList(params: PageInfo) {
    const delay = ranInt(200, 1000);
    const images = [
        "https://muse-ui.org/img/img1.35d144b4.png",
        "https://muse-ui.org/img/img2.9bd96df4.png",
        "https://muse-ui.org/img/img3.6e264e66.png",
        "https://muse-ui.org/img/sun.a646a52d.jpg",
        "https://muse-ui.org/img/breakfast.f1098290.jpg"
    ]
    const result: ApiResultList = {
        code: 1,
        data: {
            currentPage: params.currentPage,
            pageSize: params.pageSize,
            list: []
        },
        msg: ""
    }
    return new Promise<ApiResultList>(function (resolve, reject) {
        setTimeout(function () {
            if (delay > 900 && params.currentPage !== 0) {
                result.msg = "接口查询超时"
                result.code = 0;
                resolve(result);
            } else {
                let total = params.pageSize;
                if (params.currentPage >= 5) {
                    total = ranInt(2, params.pageSize - 2);
                }
                result.msg = "success"
                result.code = 1;
                result.data.list = new Array(total).fill(0).map(function (_, index) {
                    return {
                        id: params.currentPage * params.pageSize + index + 1,
                        value: randomText(6, 30),
                        img: images[ranInt(0, images.length - 1)]
                    }
                })
                resolve(result);
            }
        }, delay)
    })
}