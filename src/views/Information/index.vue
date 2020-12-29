<template>
  <div id="Inform">
    <el-breadcrumb
      separator="/"
      style="padding-left:10px;padding-bottom:10px;font-size:16px;"
    >
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>个人中心</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="main">
      <el-row :gutter="14">
        <el-col :span="4">
          <el-card style="height: 500px;">
            <div class="demo-basic--circle">
              <div class="block">
                <el-avatar
                  style="width: 120px;height: 120px;"
                  :src="userInfo.avater"
                ></el-avatar>
              </div>
            </div>
            <div class="el-image__place">
              <el-button
                size="small"
                type="primary"
                @click="centerDialogVisible = true"
                >更改头像
                <i class="el-icon-upload el-icon--right"></i>
              </el-button>
            </div>
            <div class="text_place">
              <p style="position:relative;left: 45px; font-size: large;">
                账号管理
              </p>
              <el-divider></el-divider>
              <div class="container">
                <router-link
                  to="/sysSystem/changeInformation"
                  style="text-decoration: none;"
                  ><el-button
                    size="larger"
                    type="primary"
                    icon="el-icon-reading"
                    style="display: block; margin: 10px 10px 30px 10px;"
                    >基本信息</el-button
                  ></router-link
                >
                <router-link
                  to="/sysSystem/changePassword"
                  style="text-decoration: none;"
                  ><el-button
                    size="larger"
                    type="primary"
                    icon="el-icon-house"
                    style="display: block; margin: 10px 10px 10px 10px;"
                    >修改信息</el-button
                  ></router-link
                >
              </div>
            </div>
            <el-dialog
              title="更改图片"
              @close="closeUpload"
              :visible.sync="centerDialogVisible"
              width="38%"
              center
            >
              <span>
                <el-upload
                  accept="image/*"
                  :auto-upload="false"
                  :multiple="true"
                  ref="upload"
                  :limit="1"
                  class="upload-demo"
                  :headers="{ Authorization: token }"
                  drag
                  :action="'http://8.129.111.24:8880/upload/avater'"
                >
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">
                    将文件拖到此处，或
                    <em>点击上传</em>
                  </div>
                  <div class="el-upload__tip" slot="tip">
                    只能上传jpg/png文件，且不超过500kb,最多支持1张图片
                  </div>
                </el-upload>
              </span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="closeUpload" size="small"
                  >取消返回</el-button
                >
                <el-button
                  style="margin-left: 10px;"
                  size="small"
                  type="success"
                  @click="submitUpload"
                  >上传</el-button
                >
              </span>
            </el-dialog>
          </el-card>
        </el-col>
        <el-col :span="16">
          <el-card style="height: 500px;">
            <router-view></router-view>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      token: localStorage.getItem("Authorization"),
      centerDialogVisible: false,
      loading: true,
      userInfo: {}
    };
  },
  methods: {
    /**
     * 取消上传
     */
    closeUpload() {
      this.centerDialogVisible = false;
      this.$refs.upload.clearFiles();
    },
    /**
     * 上传之后的回调
     */
    /**
     *
     * 点击上传到服务器
     */
    submitUpload() {
      this.$refs.upload.submit();
    }
  },
  created() {
    this.userInfo = this.$store.state.userInfo;
  }
};
</script>

<style lang="less">
.demo-basic--circle {
  display: flex;
  justify-content: center;
}
.el-image__place {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
.text_place {
  margin-top: 20px;
  height: 360px;
}
.el-upload-dragger {
  width: 530px !important;
}
.container {
  position: relative;
  top: 30px;
  left: 15px;
}
.main {
  position: relative;
  left: 100px;
  top: 20px;
}
</style>
