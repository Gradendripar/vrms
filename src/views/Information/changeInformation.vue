<template>
  <div id="changeInformation">
    <h3 style="margin: 0px;padding: 0px;">
      基本信息
    </h3>
    <el-form ref="user" :model="user" label-width="80px">
      <el-form-item label="姓名">
        <el-input v-model="user.userName" disabled></el-input>
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="user.name" disabled></el-input>
      </el-form-item>
      <el-form-item label="部门">
        <el-input v-model="user.department" disabled></el-input>
      </el-form-item>
      <el-form-item label="年龄">
        <el-input v-model="user.userAge" disabled></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input
          v-model="user.userPhone"
          v-bind:disabled="disabled"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="button_change">
      <el-button @click="onSubmit" type="primary">提交</el-button>
      <el-button @click="change">修改</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      disabled: true,
      user: {
        userName: "",
        name: "",
        department: "",
        userAge: "",
        userPhone: ""
      }
    };
  },
  methods: {
    async onSubmit() {
      const { data: res } = await this.$http.post("user/editSelf", this.user);
      if (res.code !== 200) return this.$message.error("更新失败");
      this.$message.success("更新成功");
    },
    change() {
      this.disabled = false;
    }
  },
  created() {
    this.user = this.$store.state.userInfo;
  }
};
</script>

<style lang="less">
.el-input {
  width: 350px;
}
.button_change {
  margin: 20px;
  position: relative;
  left: 100px;
}
</style>
