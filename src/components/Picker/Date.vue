<template>
    <view :class="['the-picker fwrap', { 'the-picker-show': show }]">
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
                    <view class="picker-item ellipsis_1" v-for="(item, index) in yearList" :key="index">{{ item }}</view>
                </picker-view-column>
                <picker-view-column v-if="type === 'Y-M-D' || type === 'Y-M'">
                    <view class="picker-item ellipsis_1" v-for="(item, index) in monthList" :key="index">{{ item }}</view>
                </picker-view-column>
                <picker-view-column v-if="type === 'Y-M-D'">
                    <view class="picker-item ellipsis_1" v-for="(item, index) in dayList" :key="index">{{ item }}</view>
                </picker-view-column>
            </picker-view>
        </view>
    </view>
</template>
<script lang="ts">
import { defineComponent, ref, watch, nextTick, PropType, onMounted } from "vue";
import { checkType, findIndex } from "@/utils";

/** 当前时间 */
const now = new Date();

/**
 * 格式化日期成列表
 * @param val
 */
function formatDateToList(val: string) {
    return val.split("-").map((item) => Number(item));
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
export default defineComponent({
    name: "PickerDate",
    props: {
        show: {
            type: Boolean,
            default: false,
        },
        title: {
            type: [String, Number],
            default: "",
        },
        /** 绑定的值（索引）,非双向绑定 */
        value: {
            type: String,
            default: "",
        },
        /** 选择类型 */
        type: {
            type: String as PropType<"Y-M-D" | "Y-M" | "Y">,
            default: "Y-M-D",
        },
        /** 开始日期（Y-M-D） */
        startDate: {
            type: String,
            default: `${now.getFullYear() - 10}-01-01`,
        },
        /** 结束日期（Y-M-D） */
        endDate: {
            type: String,
            default: `${now.getFullYear()}-12-${new Date(now.getFullYear(), 12, 0).getDate()}`,
        },
    },
    setup(props, context) {
        /** 年份列表 */
        const yearList = ref<Array<number>>([]);
        /** 月份列表 */
        const monthList = ref<Array<string>>([]);
        /** 天数列表 */
        const dayList = ref<Array<string>>([]);
        /** 选中索引 */
        const selectIndexs = ref<Array<number>>([]);

        /** 使用的索引值 */
        function getUseIndexs() {
            let indexs = [yearList.value.length - 1, 0, 0];
            if (props.value && props.value.split("-").length) {
                const list = props.value.split("-");
                const index = findIndex(yearList.value, item => item === Number(list[0]));
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
        function update() {
            const years = [];
            const startList = formatDateToList(props.startDate);
            const endList = formatDateToList(props.endDate);
            for (let i = startList[0]; i <= endList[0]; i++) {
                years.push(i);
            }
            yearList.value = years;

            if (props.type === "Y-M-D" || props.type === "Y-M") {
                let start = 1;
                let total = 12;
                const selectYear = yearList.value[selectIndexs.value[0]];
                if (selectYear === startList[0]) {
                    start = startList[1];
                }
                if (selectYear === endList[0]) {
                    total = endList[1];
                }
                monthList.value = getFormatList(start, total);
            }

            if (props.type === "Y-M-D") {
                const selectYear = yearList.value[selectIndexs.value[0]];
                const selectMonth = Number(monthList.value[selectIndexs.value[1]]);
                let start = 1;
                let total = new Date(selectYear, selectMonth, 0).getDate();
                if (selectYear === startList[0] && selectMonth === startList[1]) {
                    start = startList[2];
                }
                if (selectYear === endList[0] && selectMonth === endList[1]) {
                    total = endList[2];
                }
                dayList.value = getFormatList(start, total);
            }
        }

        function pickerChange(e: UniAppChangeEvent<Array<number>>) {
            const list = e.detail.value;
            const val1 = checkType(list[0]) === "number" ? list[0] : 0;
            const val2 = checkType(list[1]) === "number" ? list[1] : 0;
            const val3 = checkType(list[2]) === "number" ? list[2] : 0;
            selectIndexs.value = [val1, val2, val3];
            update();
        }

        function clickCancel() {
            // 还原上一次选中的状态
            if (props.value) {
                selectIndexs.value = getUseIndexs();
                update();
            }
            context.emit("cancel");
        }

        function clickConfirm() {
            let result = yearList.value[selectIndexs.value[0]].toString();
            if (props.type === "Y-M-D" || props.type === "Y-M") {
                result = `${result}-${monthList.value[selectIndexs.value[1]]}`;
            }
            if (props.type === "Y-M-D") {
                result = `${result}-${dayList.value[selectIndexs.value[2]]}`;
            }
            context.emit("confirm", result);
        }

        // 先更新一下日期数据，之后再设置选中值最后再更新一次
        update();

        onMounted(function() {
            selectIndexs.value = getUseIndexs();
            update();
        })

        watch(() => props.value, val => {
            if (val) {
                selectIndexs.value = getUseIndexs();
                update();
            }
        });

        return {
            yearList,
            monthList,
            dayList,
            selectIndexs,
            pickerChange,
            clickCancel,
            clickConfirm,
        };
    },
});
</script>
<style lang="scss">
@import "./picker.scss";
</style>
