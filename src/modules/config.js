class ModuleConfig {

    /**
     * 项目类型
     * @type {"H5"|"APP"|"miniprogram"}
     */
    projectType = "miniprogram";

    /** 请求域名（正式） */
    requestUrl = "";

    /** 请求域名（测试） */
    requestUrlDev = "";

    /** 
     * 接口前缀
     * @description 和`manifest.json`中的`H5: {devServer, ...}`中定义的跨域代理匹配
     */
    apiPrefix = "/api/"

}

const config = new ModuleConfig();

export default config;