export default class ModuleAppOption {
    
    /** `APP`操作信息 */
    readonly appOption = {
        /** `小程序`导航栏高度 */
        navBarHeight: 0,
        /** `小程序`胶囊距右方间距（方保持左、右间距一致） */
        menuRight: 0, 
        /** `小程序`胶囊距底部间距（保持底部间距一致） */
        menuBottom: 0, 
        /** `小程序`胶囊高度（自定义内容可与胶囊高度保证一致） */
        menuHeight: 0,
        /** `小程序`胶囊宽度 */
        menuWidth: 0,
        /** 状态栏高度 */
        statusBarHeight: 0,
        /** 原生底部`tabbar`高度 */
        tabBarHeight: 0,
        /** 可使用窗口高度 */
        windowHeight: 0,
        /** 是否为`iPhoneX`系列（做底部`UI`判断） */
        isIPhoneX: false
    }

    /** 
     * 初始化`APP`操作信息 
     * @learn 条件编译 https://uniapp.dcloud.io/platform
    */
    initAppOption() {
        const systemInfo = uni.getSystemInfoSync();
        
        this.appOption.statusBarHeight = (systemInfo.statusBarHeight as number);
        this.appOption.tabBarHeight = (systemInfo.screenHeight as number) - (systemInfo.windowHeight as number) - (systemInfo.statusBarHeight as number);
        this.appOption.windowHeight = (systemInfo.windowHeight as number);

        const isIos = (systemInfo.system  as string).toLocaleLowerCase().includes("ios");
        const vaule = ((systemInfo.screenWidth as number) / (systemInfo.screenHeight as number)) < 0.5;
        this.appOption.isIPhoneX = (isIos && vaule);

        // #ifdef H5
        this.appOption.tabBarHeight = 50;
        this.appOption.isIPhoneX = false; // 网页端不需要判断底部UI判断
        // #endif

        // #ifdef MP
        const menuButtonInfo = uni.getMenuButtonBoundingClientRect();
        // 导航栏高度 = 状态栏到胶囊的间距（胶囊距上距离-状态栏高度） * 2 + 胶囊高度 + 状态栏高度
        this.appOption.navBarHeight = ((menuButtonInfo.top as number) - (systemInfo.statusBarHeight as number)) * 2 + (menuButtonInfo.height as number) + (systemInfo.statusBarHeight as number);
        this.appOption.menuRight = (systemInfo.screenWidth as number) - (menuButtonInfo.right as number);
        this.appOption.menuBottom = (menuButtonInfo.top as number) - (systemInfo.statusBarHeight as number);
        this.appOption.menuHeight = (menuButtonInfo.height as number);
        this.appOption.menuWidth = (menuButtonInfo.width as number);
        // #endif
    }   
}