function moduleConfig() {
  /** 当前开发环境 */
  const env = process.env.NODE_ENV === "development" ? "dev" : "prod";

  return {
    get requestOvertime() {
      return 8000;
    },
    get apiUrl() {
      return env === "dev" ? `${location.origin}/api` : "https://huangjingsheng.com/api"
    }
  }
}

/** 配置模块 */
const config = moduleConfig();

export default config;

