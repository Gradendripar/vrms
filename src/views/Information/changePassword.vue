<template>
  <div id="changePassword">
    <p style="font-size:18px;">修改密码</p>
    <div class="input_active">
      <el-form
        :model="ruleForm"
        status-icon
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="原密码" prop="password">
          <el-input
            type="password"
            v-model="ruleForm.password"
            autocomplete="off"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="newPassword">
          <el-input
            type="password"
            v-model="ruleForm.newPassword"
            autocomplete="off"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >提交</el-button
          >
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Qs from "qs";
export default {
  data() {
    return {
      ruleForm: {
        password: "",
        newPassword: ""
      }
    };
  },
  methods: {
    async submitForm() {
      const { data: res } = await this.$http.post(
        "user/editPassword",
        Qs.stringify(this.ruleForm)
      );
      if (res.code == 200) {
        this.$message.success("修改成功请重新登录");
      }
      if (res.code == 0) {
        return this.$message.error("原密码输入错误");
      }
    },
    resetForm() {
      this.ruleForm = {
        password: "",
        newPassword: ""
      };
    }
  }
};
</script>
<style lang="less">
.el-input {
  width: 300px;
}
.input_active {
  position: relative;
  left: 50px;
}
.el-collapse-item__header {
  font-size: 16px;
}
.el-collapse-item__arrow {
  margin: 0px 60px 0 auto;
}
</style>
