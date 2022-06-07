# 触底加载更多组件

使用示例

```html
<template>
    <view>
        <view v-for="(item, index) in loadMoreData.list" :key="index">列表-item</view>
        <LoadMoreTip :info="loadMoreData" />
    </view>
</template>
<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import LoadMore from "@/mixins/LoadMore";
import LoadMoreTip from "@/components/LoadMoreTip/index.vue";
import { getApiList } from "@/api/common";
import { ApiListData } from "@/utils/interfaces";

@Component({
    components: {
        LoadMoreTip
    }
})
export default class Demo extends Mixins(LoadMore) {
    
    // 可选操作，具体看代码提示
    getListCallback(res: ApiListData) {
        console.log("获取数据之后的回调", res);
    }

    // 方式一：
    requestList() {
        // 设置请求接口
        return getApiList({
            currentPage: this.loadMoreData.currentPage,
            pageSize: this.loadMoreData.pageSize,
            // ...其他参数
        })
    }
    
    // 方式二：
    async requestList() {
        // 设置请求接口
        const res = await getApiList({
            currentPage: this.loadMoreData.currentPage,
            pageSize: this.loadMoreData.pageSize,
            // ...其他参数
        })
        if (res.code === 1) {
            // 这里就相当于上面 getListCallback() 执行的回调了
        }
        return res;
    }

    onLoad() {
        // 页面一开始用 getListData 和 refreshData都是一样的，因为变量一开始都一样
        this.getListData();
    }
    
    // 可选操作，监听下拉刷新-没有下拉就去掉
    onPullDownRefresh() {
        this.refreshData(() => {
            uni.stopPullDownRefresh();
        });
    }

}
</script>
```
