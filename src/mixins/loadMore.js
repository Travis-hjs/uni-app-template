 import { Component } from "vue";

 /**
  * 加载更多数据 
  * @description 示例文件，非正式用
  * @type {Component}
  */
 const LoadMore = {
    // data() {
    //     return {
    //         loadMoreOption: {
    //             /** 主动触发刷新 */
    //             refresh: false,
    //             /** 是否加载中 */
    //             loading: false,
    //         },
            
    //     };
    // },
    // mounted() {
    //     // 如果不是用户手动触发刷新的 就自动刷新 否则页面必须主动调用loadMoreRefresh方法
    //     if (!this.loadMoreOption.refresh) {
    //         // 首次进页面刷新数据
    //         this.loadMoreRefresh();
    //     }
    // },

    // onPullDownRefresh() {
    //     if (!this.loadMoreOption.userPullDownRefresh) {
    //         await this.loadMoreRefresh();
    //         uni.stopPullDownRefresh();
    //         return;
    //     } else {
    //         return;
    //     }
    // },
    // onReachBottom() {
    //     this.runLoadMoreFun();
    // },
    // methods: {
    //     //刷新数据方法
    //     async loadMoreRefresh() {
    //         // this.loadMoreData = new LoadMoreData(this.loadMoreOption.type);
    //         await this.runLoadMoreFun();
    //         return;
    //     },
    //     /** 滚动到底部时获取数据的方法 */
    //     async runLoadMoreFun() {
    //         try {
    //             if (!this.loadMoreData.hasMoreData) {
    //                 return
    //             }
    //             let res = this.loadMoreFun && await this.loadMoreFun({
    //                 page: this.loadMoreData.wantPage,
    //                 per_page: this.loadMoreOption.pageSize,
    //             })
    //             this.loadMoreData.saveData(res.data.data);
    //             this.getLoadMoreSourceData && this.getLoadMoreSourceData(res);
    //         }
    //         catch (e) {
    //             console.log(e);
    //         }
    //         return;
    //     },
    // }
}

export default LoadMore;

export const LoadMoreData = {
    /** 加载更多数据 */
    loadMore: {
        /** 页数 */
        page: 1
    }
}

/** 加载更多-方法 */
export const LoadMoreMethods = {
    /** 加载更多 */
    addPage() {
        this.loadMore.page ++;
    },
    /**
     * 设置页数
     * @param {number} value 
     */
    setPage(value) {
        this.loadMore.page = value;
    }
}