<template>
  <div id="LoginLogs">
    <!-- 面包导航 -->
    <el-breadcrumb
      separator="/"
      style="padding-left:10px;padding-bottom:10px;font-size:16px;"
    >
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>日志管理</el-breadcrumb-item>
      <el-breadcrumb-item>登录日志</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 右侧卡片区域 -->
    <!-- 用户列表卡片区 -->
    <el-card class="box-card">
      <el-form
        size="small"
        :inline="true"
        :model="queryMap"
        class="demo-form-inline"
      >
        <el-form-item label="用户名">
          <el-input
            v-model="queryMap.loginUsername"
            placeholder="请输入用户名查询"
          ></el-input>
        </el-form-item>
        <el-form-item label="IP地址">
          <el-input
            v-model="queryMap.loginIp"
            placeholder="请输入IP查询"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" @click="search" type="primary"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button
            @click="deleteFileOrDirectory(sels)"
            icon="el-icon-delete"
            :disabled="this.sels.length === 0"
            >批量</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button
            @click="backup"
            v-hasPermission="'operateLog:update'"
            class="el-icon-document-copy"
            type="success"
            >备份</el-button
          >
        </el-form-item>
      </el-form>
      <!-- 表格区域 -->
      <template>
        <el-table
          border
          stripe
          size="mini"
          :data="LoginLogData"
          style="width: 100%;"
          height="460"
          @selection-change="selsChange"
          :header-cell-style="{ 'text-align': 'center' }"
          :cell-style="{ 'text-align': 'center' }"
        >
          <el-table-column
            type="selection"
            width="55"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="loginId"
            type="index"
            label="ID"
            width="50"
          ></el-table-column>
          <el-table-column
            prop="loginUsername"
            label="登入用户"
            width="150"
          ></el-table-column>
          <el-table-column
            prop="loginTime"
            label="登入时间"
            width="190"
          ></el-table-column>
          <el-table-column prop="loginIp" label="IP地址"></el-table-column>
          <el-table-column
            prop="loginSystem"
            label="操作系统"
            width="150"
          ></el-table-column>
          <el-table-column prop="loginBrowser" label="浏览器"></el-table-column>
          <el-table-column label="操作" width="100px;">
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                content="删除"
                placement="top"
                :enterable="false"
              >
                <el-button
                  v-hasPermission="'loginLog:delete'"
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="del(scope.row.loginId)"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 分页 -->
      <el-pagination
        style="margin-top:10px;"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="this.queryMap.pageNum"
        :page-sizes="[10, 15, 20]"
        :page-size="this.queryMap.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      sels: [], //选中的值显示
      LoginLogData: [],
      total: 0, //总共多少条数据
      queryMap: { pageNum: 1, pageSize: 10, loginUsername: "", loginIp: "" } //查询对象
    };
  },
  methods: {
    //备份
    backup() {
      var $this = this;
      const res = axios
        .request({
          url: "/loginLog/excel",
          method: "post",
          responseType: "blob"
        })
        .then(res => {
          if (res.headers["content-type"] === "application/json") {
            return $this.$message.error(
              "Subject does not have permission [operateLog:update]"
            );
          }
          const data = res.data;
          let url = window.URL.createObjectURL(data); // 将二进制文件转化为可访问的url
          var a = document.createElement("a");
          document.body.appendChild(a);
          a.href = url;
          a.download = "登录日志备份.xls";
          a.click();
          window.URL.revokeObjectURL(url);
        });
    },
    async deleteFileOrDirectory() {
      var ids = this.sels.map(item => item.loginId).join(); //获取所有选中行的id组成的字符串，以逗号分隔
      var res = await this.$confirm(
        "此操作将永久批量删除登录日志, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
      if (res == "confirm") {
        const { data: res } = await this.$http.delete(
          "loginLog/batchDelete/" + ids
        );
        if (res.code == 200) {
          this.$message.success("系统日志删除成功");
          this.getLoginLogList();
        } else {
          this.$message.error(res.msg);
        }
      }
    },
    selsChange(sels) {
      this.sels = sels;
    },
    //搜索
    search() {
      this.queryMap.pageNum = 1;
      this.getLoginLogList();
    },

    //加载登入日志列表
    async getLoginLogList() {
      const { data: res } = await this.$http.get("loginLog/findLoginLogList", {
        params: this.queryMap
      });
      if (res.code !== 200) {
        return this.$message.error("获取列表失败");
      } else {
        this.total = res.data.total;
        this.LoginLogData = res.data.rows;
      }
    },
    //删除登入日志
    async del(loginId) {
      var res = await this.$confirm(
        "此操作将永久删除该登入日志, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
      if (res === "confirm") {
        const { data: res } = await this.$http.delete(
          "loginLog/delete/" + loginId
        );
        if (res.code === 200) {
          this.$message.success("登入日志删除成功");
          this.getLoginLogList();
        } else {
          this.$message.error(res.msg);
        }
      }
    },

    //改变页码
    handleSizeChange(newSize) {
      this.queryMap.pageSize = newSize;
      this.getLoginLogList();
    },
    //翻页
    handleCurrentChange(current) {
      this.queryMap.pageNum = current;
      this.getLoginLogList();
    }
  },
  created() {
    this.getLoginLogList();
  }
};
</script>
