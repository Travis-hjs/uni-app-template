/** 读取文件失败（类型提示用） */
const ReadFail = {
    code: 14,
    message: "路径不存在"
}

/** 读取文件格式（类型提示用） */
const ReadResult = {
	type: "",
	bubbles: false,
	cancelBubble: false,
	cancelable: false,
	lengthComputable: false,
	loaded: 0,
	total: 0,
	target: {
        /** 
         * 文件目录 
         * @example "/storage/emulated/0/Android/data/io.dcloud.HBuilder/apps/HBuilder/doc/the-test.json"
        */
        fileName: "",
        /** 
         * 当前读取文件所处的状态: 0 => 写文件初始化状态; 1 => 正在写入文件状态; 2 => 写文件操作完成状态
         * @type {0|1|2} 
        */
        readyState: 2,
        /** 
         * 文件内容 
         * @example "{\"title\":\"小说章节\",\"content\":\"Hxhdnd\"}"
        */
		result: "",
		error: null,
		onloadstart: null,
		onprogress: null,
		onload: null,
		onabort: null,
		onerror: null
	}
}

/**
 * - 自定义`SDK`模块（APP中才能使用）
 * - 注意：这个和`uni.xxx`调用的系统硬件功能不同
 * @author https://github.com/Hansen-hjs
 */
class ModuleTheSDK {
    constructor() {
        // #ifdef APP-PLUS
        this.isIos = (plus.os.name == "iOS");
        // #endif
    }

    /** 是否为`ios`系统 */
    isIos = false;

    /** 打开`APP`设置 */
    openAppSetting() {
        if (this.isIos) {
            const UIApplication = plus.ios.import("UIApplication");
            const application = UIApplication.sharedApplication();
            const NSURL = plus.ios.import("NSURL");
            // const setting = NSURL.URLWithString("prefs:root=LOCATION_SERVICES");		
            const setting = NSURL.URLWithString("app-settings:");
            application.openURL(setting);
    
            plus.ios.deleteObject(setting);
            plus.ios.deleteObject(NSURL);
            plus.ios.deleteObject(application);
        } else {
            // console.log(plus.device.vendor);
            const Intent = plus.android.importClass("android.content.Intent");
            const Settings = plus.android.importClass("android.provider.Settings");
            const Uri = plus.android.importClass("android.net.Uri");
            const mainActivity = plus.android.runtimeMainActivity();
            const intent = new Intent();
            intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
            const uri = Uri.fromParts("package", mainActivity.getPackageName(), null);
            intent.setData(uri);
            mainActivity.startActivity(intent);
        }
    }

    /**
     * 读取文件
     * @param {string} fileName 文件名
     * @param {(value: ReadResult) => void} success 成功回调
     * @param {(err: ReadFail) => void} fail 失败回调
     */
    fileReader(fileName, success, fail) {
        // 请求本地系统文件对象 plus.io.PRIVATE_WWW：应用运行资源目录常量
        plus.io.requestFileSystem(plus.io.PRIVATE_DOC, function (fobject) {
            // fs.root是根目录操作对象DirectoryEntry
            fobject.root.getFile(fileName, { create: false }, function (fileEntry) {
                fileEntry.file(function (file) {
                    const fileReader = new plus.io.FileReader();
                    // const fileInfo = JSON.stringify(file);
                    fileReader.readAsText(file, "utf-8");
                    fileReader.onloadend = function (result) {
                        // const value = JSON.stringify(result);
                        success(result);
                    }
                });
            }, fail);
        });
    }

    /**
     * 写入文件
     * @param {string} fileName 文件名
     * @param {string} value 写入的内容
     * @param {(value: string) => void} success 成功回调
     * @param {(err: any) => void} fail 失败回调
     */
    fileWriter(fileName, value, success = null, fail = null) {
        // 请求本地系统文件对象 plus.io.PRIVATE_WWW：应用运行资源目录常量
        plus.io.requestFileSystem(plus.io.PRIVATE_DOC, function (fobject) {
            // fs.root是根目录操作对象DirectoryEntry
            fobject.root.getFile(fileName, { create: true }, function (fileEntry) {
                fileEntry.file(function (file) {
                    // create a FileWriter to write to the file
                    fileEntry.createWriter(function (writer) {
                        // Write data to file.
                        // writer.seek(file.size - 1); // 写入操作会从文件的末尾开始。
                        writer.write(value);
                        if (typeof success === "function") success("写入成功");
                    }, function (e) {
                        if (typeof fail === "function") fail(e);
                    });
                });
            }, function(err) {
                if (typeof fail === "function") fail(err);
            });
        });
    }
}

/** 自定义`SDK`模块 */
const theSdk = new ModuleTheSDK();

export default theSdk;