<template>
  <view class="form-page">
    <radio-group class="grid-box" @change="onPosition">
      <label class="f-vertical" v-for="(item) in positionOptions" :key="item.value">
        <radio :value="item.value" :checked="item.value === position" />
        <view>{{ item.label }}</view>
      </label>
    </radio-group>
    <view class="line"></view>
    <TheForm :model="formData" :rules="formRules" labelWidth="168rpx" :labelPosition="position" :border="hasBorder" ref="theForm">
      <TheFormItem prop="userName" label="用户名">
        <input class="the-input" type="text" v-model="formData.userName" :placeholder="formRules.userName[0].message">
      </TheFormItem>
      <TheFormItem prop="phone" label="用户手机号">
        <input class="the-input" type="number" v-model="formData.phone" :placeholder="formRules.phone[0].message">
      </TheFormItem>
      <TheFormItem prop="avatar" label="用户头像" :border="false">
        <UploadImage :src="formData.avatar" @change="onUpload" />
      </TheFormItem>
      <TheFormItem prop="isAdmin" label="是否管理员">
        <switch :checked="formData.isAdmin" @change="onIsAdmin" />
        <text style="font-size: 30rpx">{{ formData.isAdmin ? '是' : '否' }}</text>
      </TheFormItem>
      <TheFormItem prop="date" label="日期">
        <TheButton :round="true" @click="openPickerDate()">{{ formData.date || "请选择日期" }}</TheButton>
      </TheFormItem>
      <TheFormItem prop="address" label="地址">
        <TheButton :round="true" @click="openPickerAddress()">{{ addressLabel || "请选择地址" }}</TheButton>
      </TheFormItem>
      <TheFormItem prop="multiple" label="多选项">
        <checkbox-group class="grid-box" @change="onMultiple">
          <label class="f-vertical" v-for="item in multipleOptions" :key="item.value">
            <checkbox :value="item.value" :checked="formData.multiple.includes(item.value)" />
            <view>{{ item.label }}</view>
          </label>
        </checkbox-group>
      </TheFormItem>
      <TheFormItem prop="radioValue" label="单选项">
        <radio-group class="grid-box" @change="onRadio">
          <label class="f-vertical" v-for="(item) in radioOptions" :key="item.value">
            <radio :value="item.value" :checked="item.value === formData.radioValue" />
            <view>{{ item.label }}</view>
          </label>
        </radio-group>
      </TheFormItem>
      <TheFormItem prop="description" label="描述">
        <input class="the-input" v-model="formData.description" :placeholder="formRules.description[0].message">
      </TheFormItem>
      <view class="grid-box">
        <TheButton color="#07c160" @click="onSubmit()">提交表单</TheButton>
        <TheButton color="#eee" textColor="#555" @click="onReset()">重置</TheButton>
        <TheButton color="linear-gradient(45deg, #FA8BFF 0%, #2BD2FF 52%, #2BFF88 90%)" @click="validatePhone()">验证手机号码</TheButton>
        <TheButton color="#eee" textColor="#555" @click="resetPhone()">移除手机验证</TheButton>
        <TheButton @click="switchBorder()">表单边框切换</TheButton>
        <TheButton color="#ffba00" @click="switchDesc()">
          <text class="ellipsis" style="font-size: 28rpx">切换“描述”验证状态</text>
        </TheButton>
      </view>
    </TheForm>
    <PickerDate
      :show="showPickerDate"
      @cancel="closePickerDate"
      @confirm="onPickerDate"
      :value="formData.date"
      startDate="2019-03-12"
      endDate="2021-06-04"
      title="请选择日期"
    />
    <ThePicker
      :show="showPickerAddress"
      @cancel="closePickerAddress"
      @confirm="onPickerAddress"
      :list="addressList"
      title="动态层级变动"
    />
  </view>
</template>
<script lang="ts" setup>
import { reactive, ref } from "vue";
import TheForm from "@/components/Form/TheForm.vue";
import TheFormItem from "@/components/Form/TheFormItem.vue";
import UploadImage from "@/components/Upload/Image.vue";
import ThePicker from "@/components/Picker/index.vue";
import PickerDate from "@/components/Picker/Date.vue";
import TheButton from "@/components/TheButton.vue";
// import { TheForm, TheFormItem } from "@/components/Form";
// import { UploadImage } from "@/components/Upload";
// import { TheButton } from "@/components";
// import { ThePicker, PickerDate } from "@/components/Picker";
import { showToast } from "@/utils/control";
import { useCityData } from "@/hooks";
import type { PickerSelectItem, TheFormRules, LabelPosition, UploadChange } from "@/types";
import { modifyData } from "@/utils";

interface FormDataType {
  userName: string,
  phone: "" | number,
  avatar: string,
  isAdmin: boolean,
  date: string,
  multiple: Array<string>,
  radioValue: string,
  description: string,
  address: Array<number>
}

const formData = reactive<FormDataType>({
  userName: "",
  phone: "",
  avatar: "",
  isAdmin: false,
  date: "2020-06-18",
  multiple: [],
  radioValue: "",
  description: "",
  address: []
});

// 注意！！！这里不需要动态修改则可以不设置为响应式
const formRules = reactive<TheFormRules>({
  userName: [
    { required: true, message: "请输入用户名" }
  ],
  phone: [
    { required: true, message: "请输入用户手机号" },
    { reg: /^1[345678]\d{9}$/.toString(), message: "手机号不正确" }
  ],
  avatar: [
    { required: true, message: "请上传用户头像" }
  ],
  date: [
    { required: true, message: "请选择日期" }
  ],
  multiple: [
    { required: true, message: "至少选择一个选项" }
  ],
  radioValue: [
    { required: true, message: "请选择单选项" }
  ],
  description: [
    { required: false, message: "请输入描述" }
  ],
  address: [
    { required: true, message: "请选择地址" }
  ]
})

const position = ref<LabelPosition>("left");

const positionOptions = [
  { value: "left", label: "靠左排列" },
  { value: "right", label: "靠右排列" },
  { value: "top", label: "靠顶部排列" }
]

function onPosition(e: UniAppChangeEvent<LabelPosition>) {
  position.value = e.detail.value;
}

const hasBorder = ref(true);

function switchBorder() {
  hasBorder.value = !hasBorder.value;
}

const showPickerDate = ref(false);

function openPickerDate() {
  showPickerDate.value = true;
}

function closePickerDate() {
  showPickerDate.value = false;
}

function onPickerDate(val: string) {
  formData.date = val;
  closePickerDate();
}

const addressList = useCityData();
/** 展示的值 */
const addressLabel = ref("");

const showPickerAddress = ref(false);

function openPickerAddress() {
  showPickerAddress.value = true;
}

function closePickerAddress() {
  showPickerAddress.value = false;
}

function onPickerAddress(res: { id: string, value: Array<PickerSelectItem<number>> }) {
  formData.address = res.value.map(item => item.value);
  addressLabel.value = res.value.map(item => item.label).join("-");
  closePickerAddress();
}

function switchDesc() {
  const rules = formRules.description;
  rules[0].required = !rules[0].required;
}

// TODO: 这里Volar类型校验和<switch>的change冲突了，只能用any
// e: UniAppChangeEvent<boolean>
function onIsAdmin(e: any) {
  formData.isAdmin = e.detail.value;
}

const multipleOptions = [
  { value: "1", label: "多选一" },
  { value: "2", label: "多选二" },
  { value: "3", label: "多选三" },
  { value: "4", label: "多选四" },
  { value: "5", label: "多选五" },
]

function onMultiple(e: UniAppChangeEvent<Array<string>>) {
  formData.multiple = e.detail.value;
}

const radioOptions = [
  { value: "1", label: "单选一" },
  { value: "2", label: "单选二" },
  { value: "3", label: "单选三" },
  { value: "4", label: "单选四" },
]

function onRadio(e: UniAppChangeEvent<string>) {
  formData.radioValue = e.detail.value;
}

function onUpload(res: UploadChange) {
  formData.avatar = res.src;
}

const theForm = ref<InstanceType<typeof TheForm>>();

function onSubmit() {
  theForm.value!.validate((valid, rules) => {
    if (valid) {
      showToast("验证通过，在控制台可以查看表单数据");
      console.log("表单数据 >>", JSON.stringify(formData, null, "\t"));
    } else {
      const keys = Object.keys(rules);
      const firstProp = keys[0];
      showToast(`${rules[firstProp][0].message}`);
    }
  })
}

function onReset() {
  theForm.value!.resetFields(data => {
    modifyData(formData, data);
  });
}

/** 验证手机号码 */
function validatePhone() {
  theForm.value!.validateField("phone", (valid, rules) => {
    if (valid) {
      showToast("手机验证通过");
    } else {
      showToast(rules["phone"][0].message!);
    }
  })
}

/** 移除验证手机号 */
function resetPhone() {
  theForm.value!.resetField("phone");
}
</script>
<style lang="scss">
.form-page {
  width: 100%;
  padding: 30rpx 30rpx 40rpx;
  .the-input {
    border: solid 1px #eee;
    border-radius: 4px;
    padding: 8rpx 16rpx;
    height: 80rpx;
  }
  .grid-box {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 20rpx;
    font-size: 32rpx;
    margin-bottom: 20rpx;
  }
  .line {
    width: 100%;
    padding-top: 40rpx;
    margin-bottom: 40rpx;
    border-bottom: solid 1px #eee;
  }
}
</style>