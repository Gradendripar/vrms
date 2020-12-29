<template>
  <el-container class="home-container">
    <!--    导航-->
    <el-header>
      <div>
        <span style="margin-left:20px;">
          <img
            src="../../assets/logo.png"
            width="250px;"
            style="margin-left:-10px;"
            height="100%;"
            alt
            srcset
          />
        </span>
      </div>
      <el-dropdown>
        <div class="block">
          <el-avatar
            :size="50"
            :src="this.userInfo.avater"
            style="cursor: pointer;"
          ></el-avatar>
        </div>
        <el-dropdown-menu slot="dropdown" trigger="click">
          <el-dropdown-item>
            <span type="danger" @click="toInform"
              ><span class="el-icon-house"></span> &nbsp;个人中心</span
            >
          </el-dropdown-item>
          <el-dropdown-item>
            <span type="danger" @click="logout"
              ><span class="el-icon-switch-button"></span> &nbsp;退出登入</span
            >
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-header>
    <!--主体-->
    <el-container style="height: 656px;">
      <!--菜单-->
      <el-aside :width="isOpen == true ? '64px' : '200px'">
        <div class="toggle-btn" @click="toggleMenu">|||</div>
        <el-menu
          class="el-menu-vertical-demo"
          :collapse="isOpen"
          :router="true"
          :default-active="activePath"
          background-color="#2B579A"
          :collapse-transition="false"
          text-color="rgba(255,255,255,0.7)"
          unique-opened
        >
          <MenuTree :menuList="this.menuList"></MenuTree>
        </el-menu>
      </el-aside>

      <!--右边主体-->
      <el-main v-loading="loading">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import MenuTree from "../../components/MenuTree.vue";
export default {
  data() {
    return {
      loading: true,
      activePath: "", //激活的路径
      isOpen: false,
      menuList: {},
      userInfo: {}
    };
  },
  components: {
    MenuTree
  },
  methods: {
    /**
     *
     * 退出登入
     */
    async logout() {
      var res = await this.$confirm("此操作将退出系统, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).catch(() => {
        this.$message({
          type: "info",
          message: "已取消退出登入"
        });
      });
      if (res == "confirm") {
        localStorage.clear();
        this.$router.push("/login");
      }
    },
    /**
     * 去系统首页
     */
    toInform() {
      this.$router.push("/sysSystem/inform");
    },
    /**
       加载菜单数据
      */
    async getMenuList() {
      const { data: res } = await this.$http.get("user/findMenu");
      if (res.code !== 200)
        return this.$message.error("获取菜单失败:" + res.msg);
      this.menuList = res.data;
    },
    /**
       获取用户信息
      */
    async getUserInfo() {
      const { data: res } = await this.$http.get("user/info");
      if (res.code !== 200) {
        return this.$message.error("获取用户信息失败:" + res.msg);
      } else {
        this.userInfo = res.data;
        //保存用户
        this.$store.commit("setUserInfo", res.data);
      }
    },
    /**
     * 菜单伸缩
     */
    toggleMenu() {
      this.isOpen = !this.isOpen;
    }
  },
  mounted() {
    this.getUserInfo();
  },
  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem("activePath");
    // if(window.sessionStorage.getItem("activePath")==null){
    //   this.activePath='/welcome';
    // }
    setTimeout(() => {
      this.loading = false;
    }, 500);
  }
};
</script>

<style lang="less">
.el-header {
  background-color: #2b579a;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 19px;

  padding-left: 0px;
}
.el-aside {
  background-color: #2b579a;
}
.el-main {
  background-color: #eaedf1;
}
.home-container {
  width: 100%;
  height: 100% !important;
}
.toggle-btn {
  background-color: #2b579a !important;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
