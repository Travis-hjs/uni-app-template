<template>
  <view class="form-special">
    <view class="tip">手动设置验证内容和条件操作；例如：输入两个值相同时的处理</view>
    <view class="line"></view>
    <TheForm :model="formData" :rules="formRules" labelWidth="168rpx" ref="the-form">
      <TheFormItem prop="userName" label="用户名">
        <input class="the-input" type="text" v-model="formData.userName" :placeholder="formRules.userName[0].message">
      </TheFormItem>
      <TheFormItem prop="nickname" label="昵称" ref="item-nickname">
        <input class="the-input" type="text" v-model="formData.nickname" :placeholder="formRules.nickname[0].message">
      </TheFormItem>
    </TheForm>
    <TheButton color="#07c160" @click="onSubmit()">提交表单</TheButton>
  </view>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import TheForm from "@/components/Form/TheForm.vue";
import TheFormItem from "@/components/Form/TheFormItem.vue";
import TheButton from "@/components/TheButton.vue";
import { showToast } from "@/utils/control";

@Component({
  components: {
    TheForm,
    TheFormItem,
    TheButton
  }
})
export default class SpecialForm extends Vue {
  formData = {
    userName: "",
    nickname: ""
  }

  formRules: TheForm["rules"] = {
    userName: [
      { required: true, message: "请输入用户名" }
    ],
    nickname: [
      { required: true, message: "请输入昵称" }
    ],
  }

  $refs!: {
    "the-form": TheForm,
    "item-nickname": TheFormItem
  }

  /** 是否需求监听昵称 */
  checkNickname = false;

  @Watch("formData.nickname")
  onDetails() {
    if (this.checkNickname) {
      this.$refs["the-form"].resetField("nickname");
      this.checkNickname = false;
    }
  }

  onSubmit() {
    this.$refs["the-form"].validate((valid, reuls) => {
      if (valid) {
        // 一些特殊情况需要处理两个值不能为相同时处理
        if (this.formData.nickname && this.formData.userName === this.formData.nickname) {
          this.$refs["item-nickname"].showValidateField("“用户名” 与 “昵称” 不能相同");
          this.checkNickname = true;
          return;
        }
        showToast("验证通过，在控制台可以查看表单数据");
        console.log("表单数据 >>", JSON.stringify(this.formData, null, "\t"));
      } else {
        const keys = Object.keys(reuls);
        const firstProp = keys[0];
        showToast(`${reuls[firstProp][0].message}`);
      }
    })
  }
}
</script>
<style lang="scss">
.form-special {
  width: 100%;
  padding: 30rpx 30rpx 40rpx;
  .the-input {
    border: solid 1px #eee;
    border-radius: 4px;
    padding: 8rpx 16rpx;
    height: 80rpx;
  }
  .tip {
    font-size: 28rpx;
    color: #555;
  }
}
</style>