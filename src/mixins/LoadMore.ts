import { Component, Vue } from "vue-property-decorator";
import { showToast } from "@/utils/control";

export interface LoadMoreInfo<T = any> extends PageInfo {
    /** 加载状态 */
    state: "wait" | "loading" | "nomore"
    /** 加载的列表数据 */
    list: Array<T>
    /**
     * 请求成功次数
     * - 成功时才会累加，`requestCount === 1` 时为首次获取数据 
    */
    requestCount: number
    /** 
     * 列表数据`key`值，因为每个后台返回的数组字段不一样，所以这里加一个动态设置的字段
     * @example
     * ```js
     * // 假设后台返回的数据是这样的：
     * const res = {
     *    currentPage: 1,
     *    records: [...],
     *    pageSize: 10
     *    ...more
     * }
     * // 那么 listDataKey = 'records';
     * // 默认 listDataKey = 'list';
     * ```
     */
    listDataKey: string
}

/** 加载更多数据对象 */
export function useLoadMoreData(): LoadMoreInfo {
    return {
        state: "wait",
        list: [],
        currentPage: 1,
        pageSize: 10,
        requestCount: 0,
        listDataKey: "list"
    }
}

/** 滚动到底部加载更多 */
@Component({})
export default class LoadMore extends Vue {

    /** 加载数据信息 */
    loadMoreData = useLoadMoreData();

    /** 请求数据的异步函数 */
    requestList?(): Promise<ApiResultList>

    /** 获取数据之后的回调（需要的时候可能会用到） */
    getListCallback?(res: ApiResultList): void;

    /** 重置列表数据 */
    resetListData() {
        this.loadMoreData = useLoadMoreData();
    }

    /**
     * 开始请求获取列表数据
     * @param callback 加载结束回调
     */
    getListData(callback?: () => void) {
        const { state, list } = this.loadMoreData;
        if (state === "nomore" || state === "loading") return;
        if (!this.requestList) return console.log("%c 没有声明【getListData】方法 >>", "color: #4fc08d");
        this.loadMoreData.state = "loading";
        this.requestList().then(result => {
            this.loadMoreData.state = "wait";
            if (result.code === 1) {
                this.loadMoreData.requestCount++;
                this.loadMoreData.list = list.concat(result.data.list);
                // 判断是否没有数据了
                if (result.data.list.length < this.loadMoreData.pageSize) {
                    this.loadMoreData.state = "nomore";
                } else {
                    this.loadMoreData.currentPage++;
                }
                this.getListCallback && this.getListCallback(result);
            } else {
                showToast(result.msg || "加载列表出错");
            }
            callback && callback();
        }).catch(error => {
            console.log("%c getListData error >>", "color: #f04e7d", error);
            this.loadMoreData.state = "wait";
            callback && callback();
        })
    }

    /**
     * 刷新数据
     * @param callback 加载结束回调
     */
    refreshData(callback?: () => void) {
        this.loadMoreData.currentPage = 1;
        this.loadMoreData.list = [];
        this.loadMoreData.state = "wait";
        this.getListData(callback);
    }

    /**
     * 生命周期回调 监听页面隐藏
     *
     * 页面隐藏/切入后台时触发。 如 `navigateTo` 或底部 `tab` 切换到其他页面，应用切入后台等。
     */
    async onReachBottom() {
        this.getListData();
    }
}