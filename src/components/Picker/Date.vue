<template>
    <view :class="['the_picker flex', { 'the_picker_show': show }]">
        <view class="f1" @click="clickCancel()"></view>
        <view class="picker_content">
            <!-- 操作栏 -->
            <view class="picker_option flex fvertical">
                <view class="btn" @click="clickCancel()">取消</view>
                <view class="f1"></view>
                <view class="btn confirm" @click="clickConfirm()">确定</view>
            </view>

            <picker-view class="picker_view" indicator-style="height: 36px;" @change="pickerChange">
                <picker-view-column v-if="type === 'Y-M-D' || type === 'Y-M' || type === 'Y'">
                    <view class="picker_item ellipsis_1" v-for="(item, index) in yearList" :key="index">{{item}}</view>
                </picker-view-column>
                <picker-view-column v-if="type === 'Y-M-D' || type === 'Y-M'">
                    <view class="picker_item ellipsis_1" v-for="(item, index) in monthList" :key="index">{{item}}</view>
                </picker-view-column>
                <picker-view-column v-if="type === 'Y-M-D'">
                    <view class="picker_item ellipsis_1" v-for="(item, index) in dayList" :key="index">{{item}}</view>
                </picker-view-column>
            </picker-view>
        </view>
    </view>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { UniAppChangeEvent } from "@/utils/interfaces";

/** 当前时间 */
const now = new Date();

/**
 * 日期选择组件
 */
@Component({})
export default class PickerDate extends Vue {
    @Prop({
        type: Boolean,
        default: false
    })
    show!: boolean

    /** 选择类型 */
    @Prop({
        type: String,
        default: "Y-M-D"
    })
    type!: "Y-M-D" | "Y-M" | "Y"

    /** 开始年份 */
    @Prop({
        type: Number,
        default: now.getFullYear() - 10
    })
    startYear!: number

    /** 结束年份 */
    @Prop({
        type: Number,
        default: now.getFullYear()
    })
    endYear!: number

    /** 月份列表 */
    readonly monthList = new Array(12).fill(0).map((_, index) => ("0" + (index + 1)).slice(-2));
    /** 年份列表 */
    get yearList() {
        const list = [];
        for (let i = this.startYear; i <= this.endYear; i++) {
            list.push(i);
        }
        return list;
    }
    /** 天数列表 */
    dayList: Array<string> = [];

    /** 获取天数列表（这里计算属性不会监听变动，所以需要手动设置） */
    getDayList() {
        const list: Array<string> = [];
        const year = this.selectYear || this.startYear;
        const month = this.selectMonth || this.monthList[0];
        const dayTotal = new Date(year, Number(month), 0).getDate();
        // console.log("dayTotal >>", dayTotal);
        for (let i = 1; i <= dayTotal; i++) {
            list.push(("0" + i).slice(-2));
        }
        return list;
    }

    /** 选中的年份 */
    selectYear!: number;
    /** 选中的月份 */
    selectMonth!: string;
    /** 选中的天数 */
    selectDay!: string;

    created() {
        // 创建的时候要首次设置一下
        this.dayList = this.getDayList();
    }
    
    pickerChange(e: UniAppChangeEvent<Array<number>>) {
        const list = e.detail.value;
        this.selectYear = this.yearList[list[0]];
        if (list.length > 1) {
            this.selectMonth = this.monthList[list[1]];
        }
        // 这里要手动更新一下天数列表
        this.dayList = this.getDayList();
        if (list.length > 2) {
            this.selectDay = this.dayList[list[2]];
        }
    }

    clickCancel() {
        this.$emit("cancel");
    }

    clickConfirm() {
        let result = (this.selectYear || this.startYear).toString();
        if (this.type === "Y-M-D" || this.type === "Y-M") {
            result = `${result}-${this.selectMonth || this.monthList[0]}`
        }
        if (this.type === "Y-M-D") {
            result = `${result}-${this.selectDay || this.dayList[0]}`;
        }
        this.$emit("confirm", result);
    }
}
</script>
<style lang="scss">
@import "./picker.scss";
</style>