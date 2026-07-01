<template>
  <view :class="['the-picker f-wrap', { 'the-picker-show': layer.transition }]" v-show="layer.visible">
    <view class="f1" @click="onCancel()"></view>
    <view class="picker-content">
      <!-- 操作栏 -->
      <view class="picker-option f-vertical">
        <view class="btn" @click="onCancel()">取消</view>
        <view class="f1 picker-title">{{ title }}</view>
        <view class="btn confirm" @click="onConfirm()">确定</view>
      </view>

      <picker-view class="picker-view" indicator-style="height: 36px;" @change="pickerChange" :value="state.indexes">
        <picker-view-column v-if="['Y-M-D', 'Y-M', 'Y'].includes(type)">
          <view class="picker-item ellipsis-1" v-for="(item, index) in state.years" :key="index">{{ item }}</view>
        </picker-view-column>
        <picker-view-column v-if="['Y-M-D', 'Y-M'].includes(type)">
          <view class="picker-item ellipsis-1" v-for="(item, index) in state.months" :key="index">{{ item }}</view>
        </picker-view-column>
        <picker-view-column v-if="type === 'Y-M-D'">
          <view class="picker-item ellipsis-1" v-for="(item, index) in state.days" :key="index">{{ item }}</view>
        </picker-view-column>
      </picker-view>
    </view>
  </view>
</template>
<script lang="ts">
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
export default {
  name: "PickerDate"
}
</script>
<script lang="ts" setup>
import { watch, type PropType, onMounted } from "vue";
import { isType, findIndex } from "@/utils";
import { useTransitionLayer } from "../index";
import { reactive } from "vue";

const props = defineProps({
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
});

const emit = defineEmits<{
  (event: "cancel"): void
  (event: "confirm", res: string): void
}>();

const state = reactive({
  /** 年份列表 */
  years: [] as Array<number>,
  /** 月份列表 */
  months: [] as Array<string>,
  /** 天数列表 */
  days: [] as Array<string>,
  /** 选中索引 */
  indexes: [] as Array<number>,
});

/** 上一次选中的索引，做优化判断用 */
let beforeSelects: Array<number>;

/** 使用的索引值 */
function getUseIndexes() {
  let indexes = [state.years.length - 1, 0, 0];
  if (props.value && props.value.split("-").length) {
    const list = props.value.split("-");
    const index = findIndex(state.years, item => item === Number(list[0]));
    indexes[0] = index > -1 ? index : 0;
    if (list[1]) {
      const second = Number(list[1]) - 1;
      indexes[1] = isNaN(second) ? 0 : second;
      if (list[2]) {
        const third = Number(list[2]) - 1;
        indexes[2] = isNaN(third) ? 0 : third;
      }
    }
  }
  return indexes;
}

/** 更新日期数据 */
function update() {
  const years = [];
  const startList = formatDateToList(props.startDate);
  const endList = formatDateToList(props.endDate);
  for (let i = startList[0]; i <= endList[0]; i++) {
    years.push(i);
  }
  state.years = years;

  if (props.type === "Y-M-D" || props.type === "Y-M") {
    let start = 1;
    let total = 12;
    const selectYear = state.years[state.indexes[0]];
    if (selectYear === startList[0]) {
      start = startList[1];
    }
    if (selectYear === endList[0]) {
      total = endList[1];
    }
    state.months = getFormatList(start, total);
  }

  if (props.type === "Y-M-D") {
    const selectYear = state.years[state.indexes[0]];
    const selectMonth = Number(state.months[state.indexes[1]]);
    let start = 1;
    let total = new Date(selectYear, selectMonth, 0).getDate();
    if (selectYear === startList[0] && selectMonth === startList[1]) {
      start = startList[2];
    }
    if (selectYear === endList[0] && selectMonth === endList[1]) {
      total = endList[2];
    }
    state.days = getFormatList(start, total);
  }
}

function pickerChange(e: UniAppChangeEvent<Array<number>>) {
  const list = e.detail.value;
  const val1 = isType(list[0], "number") ? list[0] : 0;
  const val2 = isType(list[1], "number") ? list[1] : 0;
  const val3 = isType(list[2], "number") ? list[2] : 0;
  state.indexes = [val1, val2, val3];
  update();
}

function onCancel() {
  // 还原上一次选中的状态
  if (props.value && beforeSelects.toString() !== state.indexes.toString()) {
    setData();
  }
  emit("cancel");
}

function onConfirm() {
  let result = state.years[state.indexes[0]].toString();
  if (props.type === "Y-M-D" || props.type === "Y-M") {
    result = `${result}-${state.months[state.indexes[1]]}`;
  }
  if (props.type === "Y-M-D") {
    result = `${result}-${state.days[state.indexes[2]]}`;
  }
  emit("confirm", result);
}

/** 设置数据并更新 */
function setData() {
  state.indexes = getUseIndexes();
  beforeSelects = state.indexes;
  update();
}

const { layer } = useTransitionLayer(() => props.show);

// 先输出日期选择数据
update();

onMounted(function () {
  // 再更新选中状态
  // setData();
  setTimeout(setData); // TODO: <picker-view> 的 bug，首次需要异步设置 :value="value" 才生效
});

watch(() => props.value, function (now, before) {
  if (now && now != before) {
    setData();
  }
});

</script>
<style lang="scss" src="./picker.scss"></style>
