export default {
    data() {
        return {
            
        };
    },
    mounted() {
        //如果不是用户手动触发刷新的 就自动刷新  否则页面必须主动调用loadMoreRefresh方法
        if (!this.loadMoreOptions.userRefresh) {
            //首次进页面刷新数据
            this.loadMoreRefresh();
        }
    },
    
    /** 监听下拉 */
    async onPullDownRefresh() {
        if (!this.loadMoreOptions.userPullDownRefresh) {
            await this.loadMoreRefresh();
            uni.stopPullDownRefresh();
            return;
        } else {
            return;
        }
    },
    
    /** 滚动到底部 */
    onReachBottom() {
        this.runLoadMoreFun();
    },
    methods: {
        //刷新数据方法
        async loadMoreRefresh() {
            // this.loadMoreData = new LoadMoreData(this.loadMoreOptions.type);
            await this.runLoadMoreFun();
            return;
        },
        //滚动到底部时获取数据的方法
        async runLoadMoreFun() {
            try {
                if (!this.loadMoreData.hasMoreData) {
                    return
                }
                let res = this.loadMoreFun && await this.loadMoreFun({
                    page: this.loadMoreData.wantPage,
                    per_page: this.loadMoreOptions.pageSize,
                })
                this.loadMoreData.saveData(res.data.data);
                this.getLoadMoreSourceData && this.getLoadMoreSourceData(res);
            }
            catch (e) {
                console.log(e);
            }
            return;
        },
    },
}