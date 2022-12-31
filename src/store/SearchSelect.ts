import { modifyData } from "@/utils";

/** 搜索选择页配置项 */
export interface SearchSelectOption {
  /** 页面标题 */
  title?: string
  /**
   * `UI`界面类型
   * | 字段枚举 | 描述说明 |
   * | --- | --- |
   * | default | 默认样式，文字超过一行会自动换行 |
   * | two-row | 两行文字，`title`和`desc` |
   */
  type: "default" | "two-row"
  /**
   * 是否多选
   * - 目前没做，预留字段
   */
  multiple?: boolean
  /** 接口列表`item`配置字段 */
  itemProps: {
    /** 展示选择项标题 */
    title: string
    /** 描述文字，当`type: "two-row"`时需要设置 */
    desc?: string
    /** 列表唯一值，最好设置 */
    key?: string
  }
  /**
   * 搜索关键字
   * - 设置该值时，页面一开始就会请求数据
   */
  keyword?: string
  /**
   * 搜索关键字提示列表
   */
  keywordTips?: Array<string>
  /** 搜索输入框提示字段 */
  placeholder?: string
  /**
   * 接口请求函数
   * - 注意，接口返回的格式必需为`res.data.list`，如果不为该格式，需要自行组装格式然后返回
   * @param searchInfo 搜索对象
   */
  request(searchInfo: PageInfo & { keyword: string }): Promise<ApiResult<ApiResultList>>
  /**
   * 选中之后回调
   * @param selected 选中值，返回的是数据原始对象
   */
  callback(selected: any): void
}

function useSetting() {
  return {
    title: "",
    type: "default",
    multiple: false,
    keyword: "",
    keywordTips: [],
    placeholder: "",
    itemProps: {
      title: "",
      desc: "",
      key: ""
    },
    request: (() => {}) as any,
    callback: () => {}
  } as SearchSelectOption
}
/**
 * 搜索选择页状态模块
 */
export default class ModuleSearchSelect {
  /**
   * 页面配置系信息
   * - 注意！该对象不为响应式
   */
  readonly setting: Readonly<SearchSelectOption> = useSetting();

  private update(val: Partial<SearchSelectOption>) {
    modifyData(this.setting, val);
  }

  /** 重置数据 */
  reset() {
    this.update(useSetting());
  }

  /**
   * 打开搜索页选择，并设置对应信息
   * @param option 配置项
   */
  open(option: SearchSelectOption) {
    this.update(option);
    uni.navigateTo({
      url: "/pages/search-select"
    });
  }
}
