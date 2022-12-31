<template>
  <view class="search-select-page">
    <view class="header fvertical">
      <view class="search-input fvertical">
        <input
          class="input f1"
          type="text"
          v-model="pageData.keyword"
          :placeholder="pageData.placeholder"
          @confirm="onSearch"
          @input="onInput"
        >
        <view class="btn fvc" @click="onSearch()">搜索</view>
      </view>
    </view>
    <view v-if="pageData.keywordTips.length > 0 && loadMoreData.requestCount === 0 && loadMoreData.state === 'wait'" class="tips-box">
      <view class="tips-title">推荐搜索关键词</view>
      <view class="fwrap">
        <view class="tips fvertical" v-for="(item, index) in pageData.keywordTips" :key="'val-' + index" @click="onTips(item)">{{ item }}</view>
      </view>
    </view>
    <view :class="['select-list', { 'has-list': loadMoreData.list.length > 0 }]">
      <view
        v-for="(item, index) in loadMoreData.list"
        :key="pageData.itemProps.key ? item[pageData.itemProps.key] : `item-${index}`"
        class="select-item"
        @click="onSelect(item)"
      >
        <template v-if="pageData.type === 'default'">
          <view class="title">{{ item[pageData.itemProps.title] }}</view>
        </template>
        <template v-else-if="pageData.type === 'two-row'">
          <view class="title mgb_10">{{ item[pageData.itemProps.title] }}</view>
          <view class="desc">{{ item[pageData.itemProps.desc!] }}</view>
        </template>
      </view>
      <LoadMoreTip :info="loadMoreData" />
    </view>
  </view>
</template>
<script lang="ts" setup>
// ================= 通用搜索选择页，调用方式：Global.searchSelect.open() =================
import { reactive } from "vue";
import LoadMoreTip from "@/components/LoadMoreTip/index.vue";
import useLoadMore from "@/hooks/loadMore";
import Global from "@/store";
import { onLoad, onPullDownRefresh, onUnload } from "@dcloudio/uni-app";
import { SearchSelectOption } from "@/store/SearchSelect";
import { modifyData } from "@/utils";
import { showToast } from "@/utils/control";

type Option = Required<SearchSelectOption>;

const setting = Global.searchSelect.setting;

const { loadMoreData, setRequestListFn, refreshData } = useLoadMore();

/** 页面数据 */
const pageData = reactive<Omit<Option, "title"|"request"|"callback">>({
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
});

/** 防抖计时器 */
let timer: NodeJS.Timeout;

function onSearch() {
  if (!pageData.keyword) return showToast("请输入字段再进行搜索~");
  timer && clearTimeout(timer);
  refreshData();
}

function onInput() {
  timer && clearTimeout(timer);
  if (!pageData.keyword) return;
  timer = setTimeout(function() {
    refreshData();
  }, 800);
}

function onSelect(item: any) {
  setting.callback(JSON.parse(JSON.stringify(item)));
  Global.searchSelect.reset();
  uni.navigateBack({});
}

function onTips(val: string) {
  pageData.keyword = val;
  onSearch();
}

onLoad(function() {
  setting.title && uni.setNavigationBarTitle({
    title: setting.title
  });
  modifyData(pageData, setting as any);
  pageData.placeholder = setting.placeholder || "请输入关键字检索";

  setRequestListFn(function () {
    return setting.request({
      keyword: pageData.keyword,
      pageSize: loadMoreData.pageSize,
      currentPage: loadMoreData.currentPage,
    });
  });
  
  if (pageData.keyword) {
    refreshData();
  }
});

onUnload(function() {
  timer && clearTimeout(timer);
});

onPullDownRefresh(function () {
  if (pageData.keyword) return uni.stopPullDownRefresh();
  refreshData(() => {
    uni.stopPullDownRefresh();
  });
});

</script>
<style lang="scss">
.search-select-page {
  width: 100%;
  min-height: 100vh;
  background-color: #F8F8F8;
  .header {
    width: 100%;
    position: sticky;
    top: 0;
    left: 0;
    background: linear-gradient(180deg, #68a1f7, #F8F8F8);
    padding: 0 30rpx;
    height: 160rpx;
    z-index: 10;
  }
  .tips-box {
    background-color: #fff;
    background: linear-gradient(180deg, #F8F8F8, #fff);
    padding: 30rpx 30rpx 10rpx;
    font-size: 0;
    .tips-title {
      font-size: 30rpx;
      color: $blue;
      font-weight: 500;
      margin-bottom: 40rpx;
    }
    .tips {
      font-size: 28rpx;
      height: 56rpx;
      border-radius: 28rpx;
      padding: 0 24rpx;
      background-color: #eee;
      color: #555;
      margin: 0 26rpx 26rpx 0;
    }
  }
  .select-list {
    width: 100%;
    margin-bottom: 30rpx;
    .select-item {
      width: 100%;
      padding: 28rpx 30rpx;
      border-top: solid 1px #eee;
      background-color: #fff;
      &:active {
        background-color: #eee;
      }
      &:nth-child(1) {
        border-top: none;
      }
      .title {
        font-size: 30rpx;
        color: #555;
        font-weight: 500;
      }
      .desc {
        font-size: 26rpx;
        color: #999;
      }
    }
  }
  .select-list.has-list {
    min-height: 100vh;
  }
  .search-input {
    width: 100%;
    height: 80rpx;
    border-radius: 38rpx;
    // border: solid 1px #eee;
    padding: 0 8rpx 0 30rpx;
    background-color: #fff;
    .input {
      height: 100%;
      font-size: 28rpx;
      color: #666;
      margin-right: 20rpx;
    }
    .btn {
      width: 130rpx;
      background: $blue;
      height: 64rpx;
      border-radius: 32rpx;
      // line-height: 1;
      color: #fff;
      font-size: 28rpx;
      // letter-spacing: 1px;
    }
  }
}
</style>