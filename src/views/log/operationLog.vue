<template>
  <div id="operationLog">
    <!-- 面包导航 -->
    <el-breadcrumb
      separator="/"
      style="padding-left:10px;padding-bottom:10px;font-size:16px;"
    >
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>日志管理</el-breadcrumb-item>
      <el-breadcrumb-item>系统日志</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 右侧卡片区域 -->
    <!-- 用户列表卡片区 -->
    <el-card class="box-card">
      <el-form
        :inline="true"
        :model="queryMap"
        size="small"
        class="demo-form-inline"
      >
        <el-form-item label="操作类">
          <el-input
            @keyup.enter.native="search"
            clearable
            @clear="search"
            v-model="queryMap.operateActionclassname"
            placeholder="操作类"
          ></el-input>
        </el-form-item>
        <el-form-item label="操作">
          <el-input
            @keyup.enter.native="search"
            clearable
            @clear="search"
            v-model="queryMap.operateActiondate"
            placeholder="操作"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search" icon="el-icon-search"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button
            @click="deleteFileOrDirectory(sels)"
            :disabled="this.sels.length === 0"
            class="el-icon-delete"
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
          :data="LogData"
          style="width: 100%;"
          :height="460"
          size="small"
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
            prop="operateId"
            label="ID"
            width="50"
          ></el-table-column>
          <el-table-column
            prop="operateActionclassname"
            label="操作类"
            width="235"
          ></el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="operateActiondate"
            label="操作"
            width="125"
          >
          </el-table-column>
          <el-table-column
            prop="operateActionthreadname"
            label="操作线程"
            width="160"
          ></el-table-column>
          <el-table-column prop="operateLevel" label="操作等级" width="100">
            <template slot-scope="scope">
              <el-tag :type="scope.row.operateLevel" close-transition>{{
                scope.row.operateLevel
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="operateLoggername"
            label="操作名"
            sortable
            width="410"
          ></el-table-column>
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
                  type="danger"
                  size="mini"
                  v-hasPermission="'operateLog:delete'"
                  icon="el-icon-delete"
                  @click="del(scope.row.operateId)"
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
        :page-sizes="[7, 10, 15, 20]"
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
      LogData: [],
      total: 0, //总共多少条数据
      queryMap: {
        pageNum: 1,
        pageSize: 9,
        operateActionclassname: "",
        operateActiondate: ""
      } //查询对象
    };
  },
  methods: {
    /**
     * 重置
     */
    reset() {
      this.queryMap = {
        pageNum: 1,
        pageSize: 6,
        operateActionclassname: "",
        operateActiondate: ""
      };
    },
    //备份
    backup() {
      var $this = this;
      const res = axios
        .request({
          url: "/log/excel",
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
          a.download = "操作日志备份.xls";
          a.click();
          window.URL.revokeObjectURL(url);
        });
    },
    async deleteFileOrDirectory() {
      var ids = this.sels.map(item => item.operateId).join(); //获取所有选中行的id组成的字符串，以逗号分隔
      var res = await this.$confirm(
        "此操作将永久批量删除系统日志, 是否继续?",
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
        const { data: res } = await this.$http.delete("log/batchDelete/" + ids);
        if (res.code == 200) {
          this.$message.success("系统日志删除成功");
          this.getLogList();
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
      this.getLogList();
    },

    //加载系统日志列表
    async getLogList() {
      const { data: res } = await this.$http.get("log/findLogList", {
        params: this.queryMap
      });
      if (res.code !== 200) {
        return this.$message.error("获取列表失败");
      } else {
        this.total = res.data.total;
        this.LogData = res.data.rows;
      }
    },
    //删除系统日志
    async del(operateId) {
      var res = await this.$confirm(
        "此操作将永久删除该系统日志, 是否继续?",
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
          "log/delete/" + operateId
        );
        if (res.code == 200) {
          this.$message.success("系统日志删除成功");
          this.getLogList();
        } else {
          this.$message.error(res.msg);
        }
      }
    },

    //改变页码
    handleSizeChange(newSize) {
      this.queryMap.pageSize = newSize;
      this.getLogList();
    },
    //翻页
    handleCurrentChange(current) {
      this.queryMap.pageNum = current;
      this.getLogList();
    }
  },
  created() {
    this.getLogList();
  }
};
</script>

<style lang="less">
.el-tooltip__popper {
  max-width: 400px;
}
/* :filters="[
              { text: 'error', value: 1 },
              { text: 'Info', value: 0 },
              { text: 'sucess', value: 2 }
            ]"
            :filter-method="filter"
            filter-placement="bottom-end" */
</style>
