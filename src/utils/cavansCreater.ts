import { checkType } from "./index";

/** `cavans`位置类型 */
interface CavansPosition {
    /** 距离顶部偏移值 */
    top?: number
    /** 距离底部偏移值，会覆盖`top` */
    bottom?: number
    /** 距离左边偏移值 */
    left?: number
    /** 距离右边偏移值，会覆盖`left` */
    right?: number
    /** 位置层级，与`css`行为一致 */
    zIndex?: number
}

/** `cavans`矩阵尺寸类型 */
interface CavansRect {
    /** 生成的图片宽度 */
    width: number
    /** 生成的图片高度 */
    height: number
    /**
     * 边框圆角
     * - 当`width === height`，`borderRadius = width / 2`或者`borderRadius = height / 2`就会变成一个圆形
     */
    borderRadius?: number
    /** 边框厚度 */
    borderWidth?: number
    /** 边框颜色 */
    borderColor?: string
}

interface CavansImg extends CavansPosition, Omit<CavansRect, "borderWidth" | "borderColor"> {
    type: "img"
    /**
     * 生成图片的路径
     * 
     * - 网络图片地址，前提是这个图片可以跨域请求，微信小程序端需要配置`request`域名白名单
     * - （仅限H5端生效）本地相对路径地址
     * - （仅限H5端生效）`base64`图片编码，例如：`data:image/jpge;base64,xxxxxxxx`
     */
    src: string
}

interface CavansBox extends CavansRect, CavansPosition {
    type: "box"
    /** 容器背景颜色 */
    backgroundColor: string
}

interface CavansText extends CavansPosition {
    type: "text"
    /** 文字内容 */
    text: string
    /** 字体大小 */
    fontSize: number
    /** 字体颜色 */
    color: string
    // /** 指定字体的宽度，超过会被挤压 */
    // width?: number
    // /** 与`css`的`font-family`行为一致 */
    // fontFamily?: string
    /**
     * 与`css`的`text-align`行为一致
     * [参考](https://uniapp.dcloud.io/api/canvas/CanvasContext?id=canvascontextsettextalign)
     * - 默认`"left"`
     */
    textAlign?: "left" | "center" | "right"
    /**
     * 用于设置文字的水平对齐
     * [参考](https://uniapp.dcloud.io/api/canvas/CanvasContext?id=canvascontextsettextbaseline)
     * - 默认：`normal`
     */
    textBaseline?:  "top" | "bottom" | "middle" | "normal"
}

interface CavansFail {
    /** 错误信息 */
    errMsg: string
    /**
     * 错误类型
     * - `export`: canvas导出图片路径错误
     * - `load`: 图片加载失败错误
     */
    type: "export" | "load"
    /** 图片加载失败时携带的对象 */
    info?: CavansImg
}

interface CavansCreaterParams {
    /**
     * `cavans`节点`id`
     * @example
     * ```html
     * <cavans id="xxx" canvas-id="xxx"></cavans>
     * ```
    */
    cavansId: string
    /** `cavans`整体宽度 */
    width: number
    /** `cavans`整体高度 */
    height: number
    /** 生成的内容列表 */
    list: Array<CavansImg | CavansBox | CavansText>
    /**
     * 生成的图片类型
     * - 默认`"png"`
     */
    fileType?: "jpg" | "png"
    /** 成功回调 */
    success?: (res: UniApp.CanvasToTempFilePathRes) => void
    /** 图片加载失败回调 */
    fail?: (error: CavansFail) => void
}

/**
 * 计算获取使用半径
 * @param width 宽度
 * @param height 高度
 * @param borderRadius 设置的圆角值
 */
function computedRadius(width: number, height: number, borderRadius?: number) {
    borderRadius = checkType(borderRadius) === "number" ? borderRadius! : 0;
    /** 最小圆角值 */
    const minRadius = Math.min(width, height) / 2;
    /** 半径 */
    const radius = minRadius < borderRadius ? minRadius : borderRadius;
    // console.log(radius, radius, borderRadius);
    return radius;
}

/**
 * 计算定位坐标
 * @param item 
 * @param wrap 
 */
function computedPosition(item: CavansPosition & CavansRect, wrap: CavansCreaterParams) {
    let left = checkType(item.left) === "number" ? item.left! : 0;
    let top = checkType(item.top) === "number" ? item.top! : 0;
    // 判断并计算设置右边值
    if (checkType(item.right) === "number") {
        left = wrap.width - item.width - item.right!;
    }
    // 判断并计算设置底部值
    if (checkType(item.bottom) === "number") {
        top = wrap.height - item.height - item.bottom!;
    }
    return {
        left,
        top
    }
}

/**
 * 绘制圆角路径
 * @param ctx uni-app`canvas`上下文，部分`api`与`web`中的`canvas`有出入，注意看代码提示
 * @param left `x`坐标
 * @param top `y`坐标
 * @param width 宽度
 * @param height 高度
 * @param borderRadius 设置的圆角值
 */
function drawRoundRectPath(ctx: UniApp.CanvasContext, left: number, top: number, width: number, height: number, borderRadius?: number) {
    /** 半径 */
    const radius = computedRadius(width, height, borderRadius);
    // // 路径开始 相当于 <div>
    // ctx.beginPath();
    // // // 因为边缘描边存在锯齿，最好指定使用 transparent 填充 这里是使用 fill 还是 stroke都可以，二选一即可
    // // ctx.setFillStyle("transparent"); // 貌似没用
    // // 从右下角顺时针绘制，弧度从0到1/2PI  
    // ctx.arc(width - radius, height - radius, radius, 0, Math.PI / 2);
    // // 矩形下边线  
    // ctx.lineTo(radius, height);
    // // 左下角圆弧，弧度从1/2PI到PI  
    // ctx.arc(radius, height - radius, radius, Math.PI / 2, Math.PI);
    // //矩形左边线  
    // ctx.lineTo(0, radius);
    // // 左上角圆弧，弧度从PI到3/2PI  
    // ctx.arc(radius, radius, radius, Math.PI, Math.PI * 3 / 2);
    // // 上边线
    // ctx.lineTo(width - radius, 0);
    // // 右上角圆弧 
    // ctx.arc(width - radius, radius, radius, Math.PI * 3 / 2, Math.PI * 2);
    // // 右边线
    // ctx.lineTo(width, height - radius);
    // // 路径结束 相当于 </div>
    // ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(left + radius, top);
    ctx.arcTo(left + width, top, left + width, top + height, radius);
    ctx.arcTo(left + width, top + height, left, top + height, radius);
    ctx.arcTo(left, top + height, left, top, radius);
    ctx.arcTo(left, top, left + width, top, radius);
    ctx.closePath();
}

/**
 * 加载图片
 * @param url 
 * @param callback 加载成功回调
 * @param fail 加载失败
 */
function loadImage(url: string, callback: (val: string) => void, fail: (error: any) => void) {
    // 判断是否为`base64`
    if (url.includes(";base64,")) {
        return callback(url);
    }
    
    /**
     * 处理成图片显示的`base64`数据
     * @param val 
     */
    const handlePath = (val: string) => `data:image/${url.includes(".png") ? "png" : "jpeg"};base64,${val}`;

    // #ifdef MP-WEIXIN
    // 微信端不能直接加载`base64`的图片数据，必需要转为本地路径
    wx.getImageInfo({
        src: url,
        success(res) {
            callback(res.path);
            // wx.getFileSystemManager().readFileSync(url, "base64");
            // wx.getFileSystemManager().readFile({
            //     filePath: res.path,
            //     encoding: "base64",
            //     success(result) {
            //         const base64 = result.data as string;
            //         callback(handlePath(base64));
            //     },
            //     fail
            // })
        },
        fail
    });
    // #endif

    // #ifndef MP-WEIXIN
    uni.request({
        url: url,
        method: "GET",
        responseType: "arraybuffer",
        success(res) {
            const base64 = uni.arrayBufferToBase64(res.data as ArrayBuffer);
            callback(handlePath(base64));
        },
        fail
    });
    // #endif
}

/**
 * `cavans`生成器
 * @param params 传参配置
 */
export default function cavansCreater(params: CavansCreaterParams) {
    /** `canvas`绘图上下文 */
    const context = uni.createCanvasContext(params.cavansId);
    // console.log("context >>", context);
    const list = params.list.sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
    // console.log("list >>", list);
    /** 绘制的索引 */
    let index = 0;

    /**
     * 绘制图片
     * @param item 
     */
    function drawImage(item: CavansImg, success: () => void, fail: (error: any) => void) {
        loadImage(item.src, res => {
            // console.log("getImageInfo >>", res);
            // console.log("item >>", item);
            const { left, top } = computedPosition(item, params);

            context.save();
            if (item.borderRadius) {
                context.fill(); // 关键，这里必须要`fill`一下，不然下面`clip`会无效
                drawRoundRectPath(context, left, top, item.width, item.height, item.borderRadius);
                context.clip();
            }
            context.drawImage(res, left, top, item.width, item.height);
            context.restore();
            context.draw(true);

            success();
        }, fail);
    }

    /**
     * 绘制容器
     * @param item 
     */
    function drawBox(item: CavansBox) {
        const { left, top } = computedPosition(item, params);
        context.save();
        drawRoundRectPath(context, left, top, item.width, item.height, item.borderRadius);
        context.setFillStyle(item.backgroundColor);
        context.setLineWidth(item.borderWidth || 0);
        context.setStrokeStyle(item.borderColor || "rgba(0,0,0,0)");
        context.stroke();
        context.fill();
        context.restore();
        context.draw(true);
    }

    function drawText(item: CavansText) {
        // const height = item.width ? Math.ceil(item.fontSize * item.text.length / item.width) * item.fontSize : item.fontSize;
        const height = item.fontSize;
        const width = item.fontSize * item.text.length;
        const { left, top } = computedPosition({ ...item, width, height }, params);
        const _left = item.textAlign === "right" ? left + width : left;
        context.save();
        context.setFontSize(item.fontSize);
        context.setTextAlign(item.textAlign || "left");
        context.setTextBaseline(item.textBaseline || "normal");
        context.setFillStyle(item.color);
        context.fillText(item.text, _left, top);
        context.fill();
        context.restore();
        context.draw(true);
    }

    function start() {
        const item = list[index];
        function success() {
            if (index === list.length - 1) {
                // context.draw(true);
                // 这里必需要加个延迟，不然在小程序端会有图片缺失的情况，估计是平台 canvas 渲染机制的问题
                setTimeout(function() {
                    uni.canvasToTempFilePath({
                        fileType: params.fileType || "png",
                        canvasId: params.cavansId,
                        quality: 1,
                        success: params.success,
                        fail(err) {
                            params.fail && params.fail({
                                ...err,
                                type: "export"
                            })
                        }
                    })
                }, 500);
            } else {
                index++;
                start();
            }
        }
        function fail(err: any) {
            params.fail && params.fail({
                ...err,
                info: item,
                type: "load"
            });
        }
        switch (item.type) {
            case "box":
                drawBox(item);
                success();
                break;
            
            case "img":
                drawImage(item, success, fail);
                break;

            case "text":
                drawText(item);
                success();
                break;
        }   
    }
    if (list.length > 0) {
        // 先清空再绘制
        // context.clearRect(0, 0, params.width, params.height);
        context.draw(false);
        index = 0;
        start();
    } else {
        console.warn("cavansCreater >> 没有可生成的列表数据");
    }
}
