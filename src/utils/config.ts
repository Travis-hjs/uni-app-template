function moduleConfig() {
  /** 当前项目运行地址 */
  let url = location.origin;
  /** 当前环境 */
  let env: "dev" | "test" | "prod" = "dev";
  /** 请求域名 */
  let requestUrl = "";
  
  // 测试环境
  if (location.hostname === "test.com") {
    env = "test";
    requestUrl = `https://api.test.com`;
    url = "https://test.com";
  }

  // 正式环境
  if (location.hostname === "prod.com") {
    env = "prod";
    requestUrl = "https://api.prod.com";
    url = "https://prod.com";
  }

  // 非`H5`端可以用`uni.getSystemInfoSync().platform`去做环境条件判断

  return {
    /** 请求超时毫秒 */
    get requestTimeout() {
      return 8000;
    },
    /** `api`请求域名 */
    get apiUrl() {
      return requestUrl;
    },
    /** 是否开发环境 */
    get isDev() {
      return env === "dev";
    },
    /** 当前项目运行地址 */
    get webUrl() {
      return url;
    },
    /** 上传图片地址 */
    get uploadUrl() {
      return "http://xxx.com/upload"
    }
  }
}

/** 配置模块 */
const config = moduleConfig();

export default config;
