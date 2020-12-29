<template>
  <div id="departments">
    <el-breadcrumb
      separator="/"
      style="padding-left:10px;padding-bottom:10px;font-size:16px;"
    >
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>信息管理</el-breadcrumb-item>
      <el-breadcrumb-item>部门管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            size="small"
            clearable
            v-model="queryMap.partName"
            placeholder="请输入部门查询"
            @clear="search"
            class="input-with-select"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="search"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button
            size="small"
            v-hasPermission="'part:add'"
            type="success"
            icon="el-icon-circle-plus-outline"
            @click="addDialogVisible = true"
            >添加</el-button
          >
        </el-col>
        <el-col :span="2">
          <el-button
            size="small"
            v-hasPermission="'part:export'"
            icon="el-icon-download"
            @click="downExcel"
            >导出</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格区域-->
      <template>
        <el-table
          id="partTable"
          border
          size="small"
          v-loading="loading"
          stripe
          :data="departmentData"
          style="width: 100%;margin-top:20px;"
          height="460"
          :header-cell-style="{ 'text-align': 'center' }"
          :cell-style="{ 'text-align': 'center' }"
        >
          <el-table-column
            prop="partid"
            type="index"
            label="ID"
            width="80"
          ></el-table-column>
          <el-table-column
            prop="partName"
            label="部门名"
            width="150"
          ></el-table-column>
          <el-table-column prop="partNumber" label="人数" sortable width="100">
            <template slot-scope="scope">
              <el-tag
                effect="plain"
                v-text="scope.row.partNumber + '人'"
                size="small"
              >
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            sortable
          ></el-table-column>
          <el-table-column
            prop="modifiedTime"
            label="修改时间"
            sortable
          ></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                content="编辑"
                placement="top"
                :enterable="false"
              >
                <el-button
                  v-hasPermission="'part:update'"
                  type="primary"
                  size="small"
                  icon="el-icon-edit"
                  @click="edit(scope.row.partId)"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="删除"
                placement="top"
                :enterable="false"
              >
                <el-button
                  v-hasPermission="'part:delete'"
                  type="danger"
                  size="small"
                  icon="el-icon-delete"
                  @click="del(scope.row.partId)"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <el-pagination
        background
        style="margin-top:10px;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryMap.pageNum"
        :page-sizes="[9, 16, 32, 64]"
        :page-size="queryMap.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      <!--部门添加弹出框-->
      <el-dialog
        title="添加部门"
        :visible.sync="addDialogVisible"
        :close-on-click-modal="false"
        width="50%"
        @close="closeAddDialog"
      >
        <span>
          <el-form
            :model="addRuleForm"
            :rules="addRules"
            ref="addRuleFormRef"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="部门名称" prop="partName">
              <el-input v-model="addRuleForm.partName"></el-input>
            </el-form-item>
          </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="add"
            :disabled="btnDisabled"
            :loading="btnLoading"
            >确定</el-button
          >
        </span>
      </el-dialog>
      <!--部门编辑弹出框-->
      <el-dialog
        title="更新部门"
        :visible.sync="editDialogVisible"
        width="50%"
        :close-on-click-modal="false"
        @close="closeEditDialog"
      >
        <span>
          <el-form
            :model="editRuleForm"
            :rules="addRules"
            ref="editRuleFormRef"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="部门名称" prop="partName">
              <el-input v-model="editRuleForm.partName"></el-input>
            </el-form-item>
          </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="update"
            :disabled="btnDisabled"
            :loading="btnLoading"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
/* import axios from "axios"; */
import FileSaver from "file-saver";
import XLSX from "xlsx";
export default {
  data() {
    return {
      btnLoading: false,
      btnDisabled: false,
      loading: true,
      editDialogVisible: false,
      addDialogVisible: false, //添加弹框是否显示
      total: 0, //总共多少条数据
      departmentData: [], //表格数据
      queryMap: { pageNum: 1, pageSize: 9, partName: "" }, //查询对象
      addRuleForm: {}, //添加表单数据
      editRuleForm: {}, //修改表单数据
      addRules: {
        partName: [
          { required: true, message: "请输入部门名称", trigger: "blur" },
          { min: 3, max: 10, message: "长度在三到十个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    /**
     * 下载表格
     * */
    downExcel() {
      var wb = XLSX.utils.table_to_book(document.querySelector("#partTable")); //mytable为表格的id名
      /* get binary string as output */
      var wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });
      try {
        FileSaver.saveAs(
          new Blob([wbout], { type: "application/octet-stream" }),
          "部门表.xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },
    search() {
      this.queryMap.pageNum = 1;
      this.getDepartmentList();
    },
    /**
     * 更新用户
     */
    update: async function() {
      this.$refs.editRuleFormRef.validate(async valid => {
        if (!valid) {
          return;
        } else {
          (this.btnLoading = true), (this.btnDisabled = true);
          const { data: res } = await this.$http.put(
            "part/update/" + this.editRuleForm.partId,
            this.editRuleForm
          );
          if (res.code === 200) {
            this.$message.success("部门信息更新成功");
            this.getDepartmentList();
          } else {
            this.$message.error("部门信息更新失败:" + res.msg);
          }
          this.editRuleForm = {};
          this.btnDisabled = false;
          this.btnLoading = false;
          this.editDialogVisible = false;
        }
      });
    },
    /**
     * 编辑
     * @param {Object} id
     */
    edit: async function(partId) {
      const { data: res } = await this.$http.get("part/edit/" + partId);
      if (res.code === 200) {
        this.editRuleForm = res.data;
      } else {
        return this.$message.error("部门信息编辑失败" + res.msg);
      }
      this.editDialogVisible = true;
    },
    //添加
    add: function() {
      this.$refs.addRuleFormRef.validate(async valid => {
        if (!valid) {
          return;
        } else {
          (this.btnLoading = true), (this.btnDisabled = true);
          const { data: res } = await this.$http.post(
            "part/add",
            this.addRuleForm
          );
          if (res.code === 200) {
            this.$message.success("部门添加成功");
            this.addRuleForm = {};
            this.getDepartmentList();
          } else {
            return this.$message.error("部门添加失败:" + res.msg);
          }
          this.addDialogVisible = false;
          (this.btnLoading = false), (this.btnDisabled = false);
        }
      });
    },
    async getDepartmentList() {
      const { data: res } = await this.$http.get("part/findPartList", {
        params: this.queryMap
      });
      if (res.code !== 200) {
        return this.$message.error("获取用户列表失败");
      } else {
        this.total = res.data.total;
        this.departmentData = res.data.rows;
      }
    },
    del: async function(id) {
      let res = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
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
      if ("confirm" === res) {
        const { data: res } = await this.$http.delete("part/delete/" + id);
        if (res.code === 200) {
          this.$message.success("部门删除成功");
          this.getDepartmentList();
        } else {
          this.$message.error(res.msg);
        }
      }
    },

    //改变页码
    handleSizeChange(newSize) {
      this.queryMap.pageSize = newSize;
      this.getDepartmentList();
    },

    //翻页
    handleCurrentChange(current) {
      this.queryMap.pageNum = current;
      this.getDepartmentList();
    },
    //关闭弹出框
    closeAddDialog() {
      this.$refs.addRuleFormRef.clearValidate();
      this.addRuleForm = {};
    },
    //关闭弹出框
    closeEditDialog() {
      this.$refs.editRuleFormRef.clearValidate();
      this.editRuleForm = {};
    }
  },
  mounted() {},
  created() {
    this.getDepartmentList();
    setTimeout(() => {
      this.loading = false;
    }, 500);
  }
};
</script>

<style lang="less"></style>
