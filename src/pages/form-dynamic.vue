<template>
  <view class="form-dynamic">
    <TheForm :model="formData" :rules="formRules" labelWidth="160rpx" ref="the-form">
      <TheFormItem prop="title" label="标题">
        <input class="the-input" type="text" v-model="formData.title" :placeholder="formRules.title[0].message">
      </TheFormItem>
      <TheFormItem prop="email" label="邮箱地址">
        <input class="the-input" type="text" v-model="formData.email" :placeholder="formRules.email[0].message">
      </TheFormItem>

      <TheFormItem prop="list" label="列表">
        <TheButton @click="addListItem()">添加一条列表项</TheButton>
        <view class="marb_20"></view>
        <view class="fvertical" v-for="(item, index) in formData.list" :key="index">
          <TheFormItem :prop="'list.' + index + '.value'" :label="item.label" labelWidth="100rpx" :rules="getListItemRules(item.label)">
            <input class="the-input marb_20" type="text" v-model="item.value" :placeholder="getListItemRules(item.label)[0].message">
            <TheButton color="#f44336" :round="true" @click="removeListItem(index)">删除{{ item.label }}</TheButton>
          </TheFormItem>
        </view>
      </TheFormItem>

      <!-- 动态表单 -->
      <TheFormItem :prop="item" :label="'新增' + item" v-for="(item, index) in addItems" :key="index">
        <input class="the-input marb_20" v-model="formData[item]" :placeholder="formRules[item][0].message">
        <TheButton @click="removeFormItem(index)" color="#f44336" :round="true">删除当前动态表单</TheButton>
      </TheFormItem>

      <view class="grid-box">
        <TheButton color="#07c160" @click="onSubmit()">提交表单</TheButton>
        <TheButton color="#eee" textColor="#555" @click="onReset()">重置</TheButton>
        <TheButton color="linear-gradient(45deg, #FA8BFF 0%, #2BD2FF 52%, #2BFF88 90%)" @click="addFormItem()">添加动态表单</TheButton>
      </view>
    </TheForm>
  </view>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TheForm from "@/components/Form/TheForm.vue";
import TheFormItem from "@/components/Form/TheFormItem.vue";
import TheButton from "@/components/TheButton.vue";
import { showToast } from "@/utils/control";
import { TheFormRulesItem } from "@/types";

interface FormDataType {
  title: string,
  email: string,
  list: Array<{ value: string, label: string }>
}

interface FormDataDynamic extends FormDataType {
  [key: string]: string | Array<{ value: string }>
}

/** 动态表单页 */
@Component({
  components: {
    TheForm,
    TheFormItem,
    TheButton
  }
})
export default class FormDynamic extends Vue {

  formData: FormDataDynamic = {
    title: "",
    email: "",
    list: []
  }

  formRules: TheForm["rules"] = {
    title: [
      { required: true, message: "请输入标题" },
    ],
    email: [
      { required: true, message: "请输入邮箱" },
      { reg: /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.toString(), message: "邮箱地址不正确" },
    ],
    list: [
      { required: true, message: "列表不能为空" },
    ]
  }

  getListItemRules(label: string) {
    const rules: Array<TheFormRulesItem> = [
      { required: true, message: "请输入" + label },
    ]
    return rules;
  }

  $refs!: {
    "the-form": TheForm
  }

  onSubmit() {
    this.$refs["the-form"].validate((valid, reuls) => {
      if (valid) {
        console.log("表单数据 >>", this.formData);
      } else {
        const keys = Object.keys(reuls);
        const firstProp = keys[0];
        showToast(`${reuls[firstProp][0].message}`);
      }
    })
  }

  onReset() {
    this.$refs["the-form"].resetFields((formData, formRules) => {
      this.formData = formData;
      this.formRules = formRules; // 这里因为有动态添加的表单规则，所以需要重置，默认不用
      this.addItems = [];
    });
  }

  /** 动态表单添加列表 */
  addItems: Array<string> = [];

  addFormItem() {
    const key = `add${Date.now()}`;
    // 兼容微信小程序写法
    this.$set(this.formData, key, "");
    this.$set(this.formRules, key, [{ required: true, message: `请输入 ${key}` }]);

    // this.formData[key] = "";
    // this.formRules[key] = [{ required: true, message: `请输入 ${key}` }];
    this.addItems.push(key);
  }

  removeFormItem(index: number) {
    const key = this.addItems[index];
    delete this.formData[key];
    delete this.formRules[key];
    this.addItems.splice(index, 1);
  }

  addListItem() {
    this.formData.list.push({
      label: Math.random().toString(36).slice(2),
      value: ""
    })
  }

  removeListItem(index: number) {
    this.formData.list.splice(index, 1);
  }
}
</script>
<style lang="scss">
.form-dynamic {
  width: 100%;
  padding: 30rpx 30rpx 40rpx;
  .marb_20 {
    margin-bottom: 20rpx;
  }
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
  }
  .line {
    width: 100%;
    padding-top: 40rpx;
    margin-bottom: 40rpx;
    border-bottom: solid 1px #eee;
  }
}
</style>