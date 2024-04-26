import { randomText, ranInt } from '@/utils';
import request from '@/utils/request';
import mockList from "./mock.json";
// ============================= 常用接口模块 =============================

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
 * 图片前缀
 * [图片来源](https://lol.qq.com/data/info-heros.shtml)
 */
const photoPrefix = "https://game.gtimg.cn/images/lol/act/img/item/";

const testList = new Array(52).fill(0).map((_, index) => {
  const mock = mockList[ranInt(0, mockList.length - 1)];
  return {
    id: mock.icon.replace(".png", ""),
    content: randomText(6, 30),
    icon: photoPrefix + mock.icon,
    name: mock.name
  }
});

/** 列表数据结构 */
export type TestItem = typeof testList[0];

/** 
 * 模拟请求数据 
 * @param params
 */
export function getTestList(params: PageInfo & { id: number }) {
  const delay = ranInt(20, 2000);

  const result: ApiResult<ApiResultList<TestItem>> = {
    code: -1,
    data: {
      currentPage: params.currentPage,
      pageSize: params.pageSize,
      list: [],
      total: testList.length
    },
    msg: ""
  }

  return new Promise<typeof result>(function (resolve) {
    setTimeout(function () {
      if (delay > 1900) {
        result.msg = "接口查询超时"
        resolve(result);
      } else {
        result.msg = "success";
        result.code = 1;
        const index = (params.currentPage - 1) * params.pageSize;
        result.data.list = [...testList].splice(index, params.pageSize);
        resolve(result);
      }
    }, delay)
  })
}
