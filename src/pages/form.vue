<template>
    <view class="form-page">
        <TheForm :model="formData" :rules="formRules" labelWidth="160rpx" labelPosition="left" :border="hasBorder" ref="the-form">
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
                {{ formData.isAdmin ? '是' : '否' }}
            </TheFormItem>
            <TheFormItem prop="multiple" label="多选">
                <checkbox-group @change="onMultiple">
                    <label v-for="item in multipleOptions" :key="item.value">
                        <checkbox :value="item.value" :checked="formData.multiple.includes(item.value)" />
                        {{ item.label }}
                    </label>
                </checkbox-group>
            </TheFormItem>
            <TheFormItem prop="radioValue" label="单选">
                <radio-group @change="onRadio">
                    <label v-for="(item) in radioOptions" :key="item.value">
                        <radio :value="item.value" :checked="item.value === formData.radioValue" />
                        {{ item.label }}
                    </label>
                </radio-group>
            </TheFormItem>
            <TheFormItem prop="description" label="描述" :border="false">
                <input class="the-input" v-model="formData.description" :placeholder="formRules.description[0].message">
            </TheFormItem>
            <view class="flex">
                <TheButton class="f1" color="#07c160" @click="onSubmit()">提交表单</TheButton>
                <view style="width: 30rpx"></view>
                <TheButton class="f1" @click="onReset()">重置</TheButton>
            </view>
            <view style="height: 20px"></view>
            <view class="flex">
                <TheButton class="f1" color="linear-gradient(45deg, #FA8BFF 0%, #2BD2FF 52%, #2BFF88 90%)" @click="validatePhone()">验证手机号码</TheButton>
                <view style="width: 30rpx"></view>
                <TheButton class="f1" color="#eee" textColor="#555" @click="resetPhone()">移除手机验证</TheButton>
            </view>
            <view style="height: 20px"></view>
            <TheButton class="f1" @click="hasBorder = !hasBorder">表单边框切换</TheButton>
        </TheForm>
    </view>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TheForm from "@/components/Form/TheForm.vue";
import TheFormItem from "@/components/Form/TheFormItem.vue";
import UploadImage from "@/components/UploadImage.vue";
import TheButton from "@/components/TheButton.vue";
import utils from "@/utils";

interface FormDataType {
    userName: string,
    phone: "" | number,
    avatar: string,
    isAdmin: boolean,
    multiple: Array<string>,
    radioValue: string,
    description: string
}

@Component({
    components: {
        TheForm,
        TheFormItem,
        UploadImage,
        TheButton
    }
})
export default class FormPage extends Vue {

    hasBorder = true;

    formData: FormDataType = {
        userName: "",
        phone: "",
        avatar: "",
        isAdmin: false,
        multiple: [],
        radioValue: "",
        description: ""
    }

    formRules: TheForm["rules"] = {
        userName: [
            { required: true, message: "请输入用户名" }
        ],
        phone: [
            { required: true, message: "请输入用户手机号" },
            { reg: /^1[345678]\d{9}$/, message: "手机号不正确" }
        ],
        avatar: [
            { required: true, message: "请上传用户头像" }
        ],
        multiple: [
            { required: true, message: "至少选择一个选项" }
        ],
        radioValue: [
            { required: true, message: "请选择单选项" }
        ],
        description: [
            { required: false, message: "请输入描述" }
        ]
    }

    onIsAdmin(res: { detail: { value: boolean } }) {
        this.formData.isAdmin = res.detail.value;
    }

    multipleOptions = [
        { value: "1", label: "多选一" },
        { value: "2", label: "多选二" },
        { value: "3", label: "多选三" },
        { value: "4", label: "多选四" },
    ]

    onMultiple(res: { detail: { value: Array<string> } }) {
        this.formData.multiple = res.detail.value;
    }

    radioOptions = [
        { value: "1", label: "单选一" },
        { value: "2", label: "单选二" },
        { value: "3", label: "单选三" },
        { value: "4", label: "单选四" },
    ]

    onRadio(res: { detail: { value: string } }) {
        this.formData.radioValue = res.detail.value;
    }

    onUpload(res: { id: string, src: string }) {
        this.formData.avatar = res.src;
    }

    onSubmit() {
        const form: TheForm = this.$refs["the-form"] as any;
        
        form.validate(valid => {
            if (valid) {
                console.log(this.formData);
            }
        })
    }

    onReset() {
        const form: TheForm = this.$refs["the-form"] as any;
        form.resetFields();
    }

    /** 验证手机号码 */
    validatePhone() {
        const form: TheForm = this.$refs["the-form"] as any;
        form.validateField("phone", (valid, rules) => {
            if (valid) {
                utils.showToast("手机验证通过");
            } else {
                utils.showToast(rules["phone"][0].message as string);
            }
        })
    }

    /** 移除验证手机号 */
    resetPhone() {
        const form: TheForm = this.$refs["the-form"] as any;
        form.resetField("phone");
    }
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
}
</style>