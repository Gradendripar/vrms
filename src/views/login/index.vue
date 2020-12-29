<template>
  <div class="homepage-hero-module">
      <div class="login-container">
        <div class="login-header"></div>
        <el-form ref="form" :model="user" status-icon class="login-form" :rules="rules">
          <el-form-item prop="name">
            <el-input v-model="user.name" placeholder="请输入账号"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              v-model="user.password"
              placeholder="请输入密码"
              show-password
              :rules="rules"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="onSubmit('user')"
              class="login-right-btn"
              >登录</el-button
            >
            <el-button class="login-middle-btn" @click="resetForm('form')"
              >重置</el-button
            >
			<router-link to="/app"><el-button class="login-right-btn" @click="resetForm('user')"
			  >预约</el-button
			></router-link>
          </el-form-item>
        </el-form>
      </div>
      <!-- 验证码 -->
      <Vcode
        :show="isShow"
        @success="success"
        :canvasWidth="300"
        :canvasHeight="200"
      />
    </div>
  </div>
</template>
<script>
import { mapMutations } from "vuex";
import Vcode from "vue-puzzle-vcode";
export default {
  name: "LoginIndex",
  components: {
    Vcode
  },

  props: {},
  data() {
	  var validateName = (rule, value, callback) => {
	          if (value === '') {
	            callback(new Error('请输入账号'));
	          } else {      
	            callback();
	          }
	        };
	  var validatePassword = (rule, value, callback) => {
	          if (value === '') {
	            callback(new Error('请输入密码'));
	          } else {
	            callback();
	          }
	        };
    return {
      isShow: false,
      user: {
        name: "",
        password: ""
      },
      rules: {
        name: [
          { validator: validateName, trigger: 'blur' }
        ],
        password: [
          { validator: validatePassword, trigger: 'blur' }
        ],
       
      }
    };
  },
  computed: {},
  watch: {},
  created() {},
  methods: {
    ...mapMutations(["changeLogin"]),
    /* canplay() {
      this.vedioCanPlay = true;
    }, */
    resetForm(form) {
      this.$refs[form].resetFields();
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return;
        } else {
          this.isShow = true;
        }
      });
    },
    async success() {
      // 调用post请求
      const { data: res } = await this.$http.post("user/login", this.user);
      if (res.msg == "成功") {
        /* window.sessionStorage.setItem("flag", "ok"); */ // session 放置
        this.token = res.data;
        this.changeLogin({ Authorization: this.token });
        this.getUserInfo();
        this.$message.success("登陆成功！！！");
        this.$router.push({ path: "/welcome" });
      } 
	  if(res.code == 0){
		  this.$message.error(res.msg);
		  this.isShow = false;
	  }
	  if(res.code == 10001){
		  this.$message.error(res.msg);
		  this.isShow = false;
	  }
    },
    async getUserInfo() {
      const { data: res } = await this.$http.get("user/info");
      if (res.code !== 200)
        return this.$message.error("获取用户信息失败:" + res.msg);
      this.userInfo = res.data;
      //保存用户
      this.$store.commit("setUserInfo", res.data);
      //跳转到home
      this.$router.push("/home");
	  this.isShow = false;
    },
  }
};
</script>
<style scoped lang="less">
.homepage-hero-module{
}
/* .video-container {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

.video-container .poster img,
.video-container video {
  z-index: 0;
  position: absolute;
}

.video-container .filter {
  z-index: 1;
  position: absolute;
  background: rgba(0, 0, 0, 0.4);
} */
/* .appoitment{
	position: relative;
	display: flex;
	left: 45%;
	top: -18%;
} */
.login-container {
  z-index: 2;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-size: cover;
  flex-direction: column;
  background: url(../../assets/loginbackground.jpg) no-repeat;
  background-size: cover;
  .login-form {
    padding: 30px;
    padding-top: 10px;
    margin-top: -50;
    min-width: 300px;
  }
  .login-header {
    height: 160px;
    width: 100%;
    background: url(../../assets/logo.png) no-repeat;
    background-position: center;
  }
  .login-right-btn {
    width: 25%;
    position: relative;
    right: 0%;
    margin: 10px 10px 10px 10px;
  }
  .login-left-btn {
    width: 25%;
    position: relative;
    left: 10%;
    margin: 10px, 10px, 10px, 10px;
  }
  .login-middle-btn{
	  width: 25%;
	  position: relative;
	  margin: 10px 10px 10px 10px;
  }
}
</style>