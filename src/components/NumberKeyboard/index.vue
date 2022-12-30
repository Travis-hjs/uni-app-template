<template>
  <view class="number-verify-box">
    <view
      v-for="(item, index) in numbers"
      :class="['verify-item fcc', { 'actived': index === inputIndex }]"
      :key="index"
      @click="showKeyboard = true"
    >{{ item }}</view>
  </view>
  <view :class="['number-keyboard', { 'show': showKeyboard }, { 'spacing': appOption.isIPhoneX }]">
    <view
      class="keyboard-item fcc"
      v-for="item in keyboardList"
      :key="item.value"
      @click="onKeyboard(item)"
    >
      <text :class="item.icon" v-if="item.icon"></text>
      <text v-else>{{ item.label }}</text>
    </view>
  </view>
</template>
<script lang="ts">
/** 虚拟验证码 + 键盘 */
export default {
  name: "NumberKeyboard"
}
</script>
<script lang="ts" setup>
import { ref, watch } from "vue";
import store from "@/store";

const appOption = store.appOption;

const props = defineProps({
  total: {
    type: Number,
    default: 4
  }
});

const emit = defineEmits<{
  (event: "change", val: string): void
}>();

const numbers = ref<Array<number|"">>([]);

const showKeyboard = ref(false);

const inputIndex = ref(0);

const keyboardList = [
  { label: 1, value: 1 },
  { label: 2, value: 2 },
  { label: 3, value: 3 },
  { label: 4, value: 4 },
  { label: 5, value: 5 },
  { label: 6, value: 6 },
  { label: 7, value: 7 },
  { label: 8, value: 8 },
  { label: 9, value: 9 },
  { label: "", value: "hide", icon: "iconfont icon-keyboard-hide" },
  { label: 0, value: 0 },
  { label: "", value: "clear", icon: "iconfont icon-keyboard-delete" },
];

function onKeyboard(item: typeof keyboardList[0]) {
  switch (item.value) {
    case "hide":
      showKeyboard.value = false;
      break;

    case "clear":
      if (!inputIndex.value) return;
      inputIndex.value--;
      numbers.value[inputIndex.value] = "";
      emit("change", numbers.value.toString().replace(/,/g, ""));
      break;

    default:
      if (inputIndex.value >= props.total) {
        showKeyboard.value = false;
        return;
      }
      numbers.value[inputIndex.value] = item.value as number;
      inputIndex.value++;
      if (inputIndex.value >= props.total) {
        showKeyboard.value = false;
      }
      emit("change", numbers.value.toString().replace(/,/g, ""));
      break;
  }
}

watch(() => props.total, function(val) {
  numbers.value = new Array(val).fill(0).map(_ => "");
  inputIndex.value = 0;
}, {
  immediate: true
});


defineExpose({
  showKeyboard
})

</script>
<style lang="scss">
.number-verify-box {
  width: 100%;
  display: flex;
  justify-content: space-between;
  .verify-item {
    width: 96rpx;
    height: 96rpx;
    background-color: #fff;
    border-radius: 8rpx;
    border: solid 1px #dbdbdb;
    font-size: 48rpx;
    color: #333;
    font-weight: bold;
    transition: 0.3s all;
    position: relative;
  }
  .verify-item.actived {
    border-color: $blue;
    &::after {
      position: absolute;
      content: "";
      top: 25%;
      left: 50%;
      width: 1px;
      height: 50%;
      background-color: #333;
      animation: lineMove 1s infinite;
    }
  }
}

@keyframes lineMove {
  0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
}

.number-keyboard {
  padding: 12rpx 12rpx 30rpx;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 12rpx;
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 100;
  transform: translateY(100%);
  transition: 0.3s all;
  background-color: #eff2f5;
  .keyboard-item {
    height: 88rpx;
    background-color: #fff;
    font-size: 48rpx;
    color: #333;
    font-weight: bold;
    border-radius: 8rpx;
    &:active {
      background-color: #f8f8f8;
      color: #666;
    }
    .iconfont {
      font-size: 54rpx;
      font-weight: normal;
    }
  }
}
.number-keyboard.show {
  transform: translateY(0);
}
.number-keyboard.spacing {
  padding-bottom: 40px;
}
</style>