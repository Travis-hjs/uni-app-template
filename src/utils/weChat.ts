import { reactive } from "vue";
import { modifyData } from "./index";
import { showConfirm, showToast } from "./control";

interface AuthorizeInfo {
  /** 是否授权用户信息 */
  userInfo: boolean;
  /** 是否授权地理位置 */
  userLocation: boolean;
  /** 是否授权通讯地址 */
  address: boolean;
  /** 是否授权微信运动步数 */
  werun: boolean;
  /** 是否授权录音功能 */
  record: boolean;
  /** 是否授权保存到相册 */
  writePhotosAlbum: boolean;
  /** 授权手机号 */
  phone: boolean;
}

/** 微信模块封装`promise`响应结果，类似`ApiResult` */
interface WeChatResult {
  /** `code === 1`时为成功 */
  code: number
  /** 响应信息 */
  msg: string
}

interface LocationInfo {
  /** 纬度 */
  latitude: number
  /** 经度 */
  longitude: number
  /** 是否询问过，询问过则不再提示 */
  asked: boolean
}

const useAuthorizeInfo = (): AuthorizeInfo => ({
  userInfo: false,
  userLocation: false,
  address: false,
  werun: false,
  record: false,
  writePhotosAlbum: false,
  phone: false,
});

class WeChat {

  constructor() {
    
  }

  /** 小程序授权信息 */
  readonly authorize = reactive<Readonly<AuthorizeInfo>>(useAuthorizeInfo());

  /** 设置授权信息 */
  private setAuthorize(setting: Partial<UniApp.AuthSetting>) {
    const info: any = setting;
    const res: Partial<AuthorizeInfo> = {};
    for (const key in info) {
      const keyName = key.split(".")[1] as keyof AuthorizeInfo;
      res[keyName] = info[key];
    }
    modifyData(this.authorize, res);
  }

  /** 
   * 初始化微信授权信息
   * - 包括更新/获取当前定位信息
   */
  init() {
    uni.getSetting({
      success: res => {
        if (res.authSetting["scope.userLocation"]) {
          this.updateLocation();
        }
        // TODO: 默认的授权列表，初始化时全部设置为 true，直接调用对应 api 则会自动发起询问
        const defaultAuthorize: UniApp.AuthSetting = {
          "scope.userInfo": true,
          "scope.userLocation": true,
          "scope.address": true,
          "scope.invoiceTitle": true,
          "scope.invoice": true,
          "scope.werun": true,
          "scope.record": true,
          "scope.writePhotosAlbum": true,
          "scope.camera": true,
        }
        const result = Object.assign(defaultAuthorize, res.authSetting);
        // console.log(result);
        this.setAuthorize(result);
      },
    })
  }

  /**
   * 当前定位坐标信息
   * - 每次进入小程序时更新，在`App.vue`中调用`init`时更新
   */
  readonly location: Readonly<LocationInfo> = {
    latitude: 0,
    longitude: 0,
    asked: false
  }

  private setLocation(info: Partial<LocationInfo>) {
    modifyData(this.location, info);
  }

  /** 更新定位信息并写入到内存变量中 */
  private updateLocation() {
    return new Promise<UniApp.GetLocationSuccess & WeChatResult>(resolve => {
      uni.getLocation({
        type: "wgs84",
        geocode: true,
        success: res => {
          this.setLocation(res);
          resolve({ code: 1, msg: "获取定位成功", ...res });
        },
        fail: error => {
          // console.log("getLocation fail >>", error);
          this.setAuthorize({ "scope.userLocation": false }); // 打开下一次弹框询问，不是微信自带的询问
          resolve({ code: 2, msg: "您取消了位置授权" } as any);
        }
      });
    })
  }

  /** 获取当前定位，并返回经纬度信息 */
  getLocation() {
    if (this.authorize.userLocation) {
      return this.updateLocation();
    }
    return new Promise<UniApp.GetLocationSuccess & WeChatResult>(resolve => {
      if (this.location.asked) return resolve({ code: 3, msg: "用户已经取消提示授权，不再询问" } as any);
      showConfirm({
        title: "授权位置提示",
        content: "当前功能需要获取您的位置，请设置允许并继续",
        cancelText: "不再询问",
        confirm: () => {
          uni.openSetting({
            success: async res => {
              // console.log("openSetting >>", res);
              this.setAuthorize(res.authSetting);
              if (this.authorize.userLocation) {
                const location = await this.updateLocation();
                resolve(location);
                return;
              }
              resolve({ code: -1, msg: "获取当前定位地址失败" } as any);
              showToast("您没有成功打开位置允许");
            }
          })
        },
        cancel: () => {
          this.setLocation({ asked: true });
          resolve({ code: 2, msg: "您取消了位置授权" } as any);
        }
      })
    })
  }
  
}

/**
 * 微信模块，包含腾讯地图插件
 */
const weChat = new WeChat();

export default weChat;