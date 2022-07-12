<template>
  <view class="form-special">
    <view class="tip">手动设置验证内容和条件操作；例如：输入两个值相同时的处理</view>
    <view class="line"></view>
    <TheForm :model="formData" :rules="formRules" labelWidth="168rpx" ref="theForm">
      <TheFormItem prop="userName" label="用户名">
        <input class="the-input" type="text" v-model="formData.userName" :placeholder="formRules.userName[0].message">
      </TheFormItem>
      <TheFormItem prop="nickname" label="昵称" ref="itemNickname">
        <input class="the-input" type="text" v-model="formData.nickname" :placeholder="formRules.nickname[0].message">
      </TheFormItem>
    </TheForm>
    <TheButton color="#07c160" @click="onSubmit()">提交表单</TheButton>
  </view>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, watch } from "vue";
import TheForm from "@/components/Form/TheForm.vue";
import TheFormItem from "@/components/Form/TheFormItem.vue";
import TheButton from "@/components/TheButton.vue";
import { showToast } from "@/utils/control";
import { TheFormRules } from "@/types";

export default defineComponent({
  components: {
    TheForm,
    TheFormItem,
    TheButton
  },
  setup(props, context) {
    const formData = reactive({
      userName: "",
      nickname: ""
    })

    const formRules: TheFormRules = {
      userName: [
        { required: true, message: "请输入用户名" }
      ],
      nickname: [
        { required: true, message: "请输入昵称" }
      ],
    }

    /** 是否需求监听昵称 */
    let checkNickname = false;

    const theForm = ref<InstanceType<typeof TheForm>>();

    const itemNickname = ref<InstanceType<typeof TheFormItem>>();

    function onSubmit() {
      theForm.value!.validate((valid, reuls) => {
        if (valid) {
          // 一些特殊情况需要处理两个值不能为相同时处理
          if (formData.nickname && formData.userName === formData.nickname) {
            itemNickname.value!.showValidateField("“用户名” 与 “昵称” 不能相同");
            checkNickname = true;
            return;
          }
          showToast("验证通过，在控制台可以查看表单数据");
          console.log("表单数据 >>", JSON.stringify(formData, null, "\t"));
        } else {
          const keys = Object.keys(reuls);
          const firstProp = keys[0];
          showToast(`${reuls[firstProp][0].message}`);
        }
      })
    }

    watch(() => formData.nickname, function () {
      if (checkNickname) {
        theForm.value!.resetField("nickname");
        checkNickname = false;
      }
    })

    return {
      formData,
      formRules,
      theForm,
      itemNickname,
      onSubmit,
    }
  }
})
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