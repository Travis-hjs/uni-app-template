<template>
    <view :class="['the_picker flex', { 'the_picker_show': show }]">
        <view class="f1" @click="clickCancel()"></view>
        <view class="picker_content">
            <!-- 操作栏 -->
            <view class="picker_option flex fvertical">
                <view class="btn" @click="clickCancel()">取消</view>
                <view class="f1 picker_title">{{ title }}</view>
                <view class="btn confirm" @click="clickConfirm()">确定</view>
            </view>
            <!-- 选择栏 -->
            <picker-view class="picker_view" indicator-style="height: 36px;" @change="pickerChange">
                <picker-view-column v-show="list.length > 0">
                    <view class="picker_item ellipsis_1" v-for="(item, index) in list" :key="index">{{ item.label }}</view>
                </picker-view-column>
                <picker-view-column v-show="secondList.length > 0">
                    <view class="picker_item ellipsis_1" v-for="(item, index) in secondList" :key="index">{{ item.label }}</view>
                </picker-view-column>
                <picker-view-column v-show="thirdList.length > 0">
                    <view class="picker_item ellipsis_1" v-for="(item, index) in thirdList" :key="index">{{ item.label }}</view>
                </picker-view-column>
            </picker-view>
        </view>
    </view>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { PickerSelectItem, UniAppChangeEvent } from "@/utils/interfaces";
import utils from "@/utils";

/**
 * 弹出选择组件
 */
@Component({})
export default class ThePicker extends Vue {
    
    @Prop({
        type: Boolean,
        default: false
    })
    show!: boolean

    /** 选择器标题 */
    @Prop({
        type: String,
        default: ""
    })
    title!: string;

    /** `change`事件携带的`id` */
    @Prop({
        type: [Number, String],
        default: ""
    })
    pickerId!: string | number

    /** 选择列表 */
    @Prop({
        type: Array,
        default: () => []
    })
    list!: Array<PickerSelectItem>

    /** 选中的索引列表 */
    private selectIndexs = [0, 0, 0];

    @Watch("list", { immediate: true })
    onListChange() {
        this.update();
    }

    /** 第二级列表 */
    secondList: Array<PickerSelectItem> = [];

    /** 第三级列表 */
    thirdList: Array<PickerSelectItem> = [];

    private update() {
        const list = this.list;
        const indexs = this.selectIndexs;

        if (list.length > 0 && list[indexs[0]] && list[indexs[0]].children && list[indexs[0]].children!.length > 0) {
            this.secondList = list[indexs[0]].children!;
        } else {
            this.secondList = [];
        }

        const second = this.secondList;

        if (second.length > 0 && second[indexs[1]] && second[indexs[1]].children && second[indexs[1]].children!.length > 0) {
            this.thirdList = second[indexs[1]].children!;
        } else {
            this.thirdList = [];
        }
    }
    
    pickerChange(e: UniAppChangeEvent<Array<number>>) {
        // console.log(e.detail.value);
        const list = e.detail.value;
        const val1 = utils.checkType(list[0]) === "number" ? list[0] : 0;
        const val2 = utils.checkType(list[1]) === "number" ? list[1] : 0;
        const val3 = utils.checkType(list[2]) === "number" ? list[2] : 0;
        this.selectIndexs = [val1, val2, val3];
        this.update();
    }

    clickCancel() {
        this.$emit("cancel");
    }

    clickConfirm() {
        const indexs = this.selectIndexs;
        const result = [this.list[indexs[0]]];

        if (this.secondList[indexs[1]]) {
            result.push(this.secondList[indexs[1]]);
        }
        if (this.thirdList[indexs[2]]) {
            result.push(this.thirdList[indexs[2]]);
        }
        this.$emit("confirm", {
            id: this.pickerId,
            value: result
        });
    }
}
</script>
<style lang="scss">
@import "./picker.scss";
</style>