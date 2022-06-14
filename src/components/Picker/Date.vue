<template>
    <view :class="['the-picker flex', { 'the_picker_show': show }]">
        <view class="f1" @click="clickCancel()"></view>
        <view class="picker-content">
            <!-- 操作栏 -->
            <view class="picker-option fvertical">
                <view class="btn" @click="clickCancel()">取消</view>
                <view class="f1 picker-title">{{ title }}</view>
                <view class="btn confirm" @click="clickConfirm()">确定</view>
            </view>

            <picker-view class="picker-view" indicator-style="height: 36px;" @change="pickerChange" :value="selectIndexs">
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
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { checkType, findIndex } from "@/utils";


/** 当前时间 */
const now = new Date();

/**
 * 格式化日期成列表
 * @param val
 */
function formatDateToList(val: string) {
    return val.split("-").map(item => Number(item));
}

/**
 * 获取格式化列表数据
 * @param start
 * @param total
 */
function getFormatList(start: number, total: number) {
    const list = [];
    for (let i = start; i <= total; i++) {
        list.push(("0" + i).slice(-2));
    }
    return list;
}

/**
 * 日期选择组件
 */
@Component({})
export default class PickerDate extends Vue {
    @Prop({
        type: Boolean,
        default: false
    })
    show!: boolean;

    /** 选择器标题 */
    @Prop({
        type: String,
        default: ""
    })
    title!: string;

    /** 选择类型 */
    @Prop({
        type: String,
        default: "Y-M-D"
    })
    type!: "Y-M-D" | "Y-M" | "Y"

    /** 开始日期（Y-M-D） */
    @Prop({
        type: String,
        default: `${now.getFullYear() - 10}-01-01`
    })
    startDate!: string;

    /** 结束日期（Y-M-D） */
    @Prop({
        type: String,
        default: `${now.getFullYear()}-12-${new Date(now.getFullYear(), 12, 0).getDate()}`
    })
    endDate!: string;

    /** 绑定的值 */
    @Prop({
        type: String,
        default: ""
    })
    value!: string;

    /** 是否要实时监听`value`的变动 */
    @Prop({
        type: Boolean,
        default: false
    })
    watchValue!: boolean;

    /** 年份列表 */
    yearList: Array<number> = [];
    /** 月份列表 */
    monthList: Array<string> = [];
    /** 天数列表 */
    dayList: Array<string> = [];
    /** 选中索引 */
    selectIndexs: Array<number> = [0, 0, 0];

    /** 使用的索引值 */
    getUseIndexs() {
        let indexs = [this.yearList.length - 1, 0, 0];
        if (this.value && this.value.split("-").length) {
            const list = this.value.split("-");
            const index = findIndex(this.yearList, item => item === Number(list[0]));
            indexs[0] = index > -1 ? index : 0;
            if (list[1]) {
                const second = Number(list[1]) - 1;
                indexs[1] = second !== NaN ? second : 0;
                if (list[2]) {
                    const third = Number(list[2]) - 1;
                    indexs[2] = third !== NaN ? third : 0;
                }
            }
        }
        return indexs;
    }

    /** 更新日期数据 */
    update() {
        const years = [];
        const startList = formatDateToList(this.startDate);
        const endList = formatDateToList(this.endDate);
        for (let i = startList[0]; i <= endList[0]; i++) {
            years.push(i);
        }
        this.yearList = years;
        
        if (this.type === "Y-M-D" || this.type === "Y-M") {
            let start = 1;
            let total = 12;
            const selectYear = this.yearList[this.selectIndexs[0]];
            if (selectYear === startList[0]) {
                start = startList[1];
            }
            if (selectYear === endList[0]) {
                total = endList[1]
            }
            this.monthList = getFormatList(start, total);
        }

        if (this.type === "Y-M-D") {
            const selectYear = this.yearList[this.selectIndexs[0]];
            const selectMonth = Number(this.monthList[this.selectIndexs[1]]);
            let start = 1;
            let total = new Date(selectYear, selectMonth, 0).getDate();
            if (selectYear === startList[0] && selectMonth === startList[1]) {
                start = startList[2];
            }
            if (selectYear === endList[0] && selectMonth === endList[1]) {
                total = endList[2];
            }
            this.dayList = getFormatList(start, total);
        }
    }

    pickerChange(e: UniAppChangeEvent<Array<number>>) {
        const list = e.detail.value;
        const val1 = checkType(list[0]) === "number" ? list[0] : 0;
        const val2 = checkType(list[1]) === "number" ? list[1] : 0;
        const val3 = checkType(list[2]) === "number" ? list[2] : 0;
        this.selectIndexs = [val1, val2, val3];
        this.update();
    }

    clickCancel() {
        this.$emit("cancel");
    }

    clickConfirm() {
        let result = this.yearList[this.selectIndexs[0]].toString();
        if (this.type === "Y-M-D" || this.type === "Y-M") {
            result = `${result}-${this.monthList[this.selectIndexs[1]]}`;
        }
        if (this.type === "Y-M-D") {
            result = `${result}-${this.dayList[this.selectIndexs[2]]}`;
        }
        this.$emit("confirm", result);
    }

    @Watch("value")
    onValue(val: string) {
        if (val) {
            this.selectIndexs = this.getUseIndexs();
            this.update();
        }
    }

    created() {
        this.update();
        
        // #ifndef MP
        this.selectIndexs = this.getUseIndexs();
        this.update();
        // #endif

        // #ifdef MP
        // 微信小程序需要在下一帧设置索引值
        this.$nextTick(() => {
            this.selectIndexs = this.getUseIndexs();
            this.update();
        })
        // #endif
    }
}
</script>
<style lang="scss">
@import "./picker.scss";
</style>