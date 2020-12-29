<template>
  <div id="users">
    <el-breadcrumb
      separator="/"
      style="padding-left:10px;padding-bottom:10px;font-size:16px;"
    >
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>信息管理</el-breadcrumb-item>
      <el-breadcrumb-item>人员管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 用户列表卡片区 -->
    <el-card class="box-card">
      <el-form
        :inline="true"
        ref="queryMap"
        :model="queryMap"
        label-width="70px"
        size="small"
      >
        <el-form-item label="部门">
          <el-select
            clearable
            @change="searchUser"
            @clear="searchUser"
            v-model="queryMap.partId"
            placeholder="请选择所属部门"
          >
            <el-option
              v-for="department in departments"
              :label="department.partName"
              :key="department.partId"
              :value="department.partId"
            >
              <span style="float: left">{{ department.partName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">
                <el-tag size="small" effect="plain" type="success">
                  {{ department.partNumber }}人
                </el-tag>
              </span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input
            @keyup.enter.native="searchUser"
            @clear="searchUser"
            clearable
            v-model="queryMap.interName"
            placeholder="请输入姓名查询"
          ></el-input>
        </el-form-item>

        <el-form-item label="性别">
          <el-radio v-model="queryMap.interSex" label="0">男</el-radio>
          <el-radio v-model="queryMap.interSex" label="1">女</el-radio>
          <el-radio v-model="queryMap.interSex" label>全部</el-radio>
        </el-form-item>

        <el-form-item style="margin-left:50px;left: 0.4%;position: relative;">
          <el-button @click="reset" icon="el-icon-refresh">重置</el-button>
          <el-button type="primary" @click="searchUser" icon="el-icon-search"
            >查询</el-button
          >
          <el-button
            type="success"
            icon="el-icon-plus"
            @click="addDialogVisible = true"
            v-hasPermission="'inter:add'"
            >添加</el-button
          >
          <el-button
            @click="downExcel"
            v-hasPermission="'inter:update'"
            icon="el-icon-download"
            >导出</el-button
          >
        </el-form-item>
        <el-upload
          class="upload-demo inline-block margin-right-10"
          action="http://8.129.111.24:8880/File/upload"
          :on-change="handleChange"
          style="position: relative;right: -91.5%;"
          :headers="Authorization"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip"></div>
        </el-upload>
        <el-link target="_blank" :href="fileURL" :underline="false">
          <el-button
            type="default"
            size="small"
            style="position: relative;left: 975%;"
            icon="el-icon-star-on"
            width="100%"
            >样表下载</el-button
          >
        </el-link>
      </el-form>

      <!-- 表格区域 -->
      <el-table
        id="interTable"
        v-loading="loading"
        size="small"
        :data="interList"
        border
        style="width: 100%;"
        height="420"
        :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="{ 'text-align': 'center' }"
      >
        <!-- <el-table-column type="selection" width="40"></el-table-column> -->
        <el-table-column
          label="ID"
          prop="interId"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="interName"
          label="姓名"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="interSex"
          :formatter="showSex"
          label="性别"
          width="150"
        >
          <template slot-scope="scope">
            <el-tag size="small" type="success" v-if="scope.row.interSex == 0"
              >帅哥</el-tag
            >
            <el-tag size="small" type="warning" v-else>美女</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="partName"
          label="所属部门"
          width="180"
          sortable
        ></el-table-column>
        <el-table-column
          prop="interPhone"
          label="电话"
          width="180"
        ></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="信息编辑"
              placement="top"
              :enterable="false"
            >
              <el-button
                v-hasPermission="'inter:update'"
                size="small"
                type="primary"
                icon="el-icon-edit-outline"
                @click="edit(scope.row.interId)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="用户删除"
              placement="top"
              :enterable="false"
            >
              <el-button
                v-hasPermission="'inter:delete'"
                type="danger"
                size="small"
                icon="el-icon-delete"
                @click="del(scope.row.interId)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        style="margin-top:10px;"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryMap.pageNum"
        :page-sizes="[8, 14, 20, 30]"
        :page-size="queryMap.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>

      <!-- 添加对话框 -->
      <el-dialog
        title="添加人员"
        @close="closeDialog"
        :visible.sync="addDialogVisible"
        width="50%;"
        :close-on-click-modal="false"
      >
        <!-- 表单 -->
        <span>
          <el-form
            :model="addForm"
            :label-position="labelPosition"
            :rules="addFormRules"
            ref="addFormRef"
            label-width="80px"
          >
            <el-row>
              <el-col :span="12">
                <el-form-item label="用户名" prop="interName">
                  <el-input v-model="addForm.interName"></el-input>
                </el-form-item>
                <el-form-item label="部门" prop="partId">
                  <el-select
                    v-model="addForm.partId"
                    placeholder="请选择所属部门"
                  >
                    <el-option
                      v-for="department in departments"
                      :key="department.partId"
                      :label="department.partName"
                      :value="department.partId"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="性别" prop="interSex">
                  <el-radio-group v-model="addForm.interSex">
                    <el-radio :label="0">帅哥</el-radio>
                    <el-radio :label="1">美女</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="手机" prop="interPhone">
                  <el-input v-model="addForm.interPhone"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </span>

        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="addUser"
            :loading="btnLoading"
            :disabled="btnDisabled"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <!-- 修改对话框 -->
      <el-dialog
        title="修改用户"
        :visible.sync="editDialogVisible"
        width="50%"
        :close-on-click-modal="false"
        @close="editClose"
      >
        <span>
          <el-form
            :model="editForm"
            :label-position="labelPosition"
            :rules="addFormRules"
            ref="editFormRef"
            label-width="80px"
          >
            <el-row>
              <el-col :span="10">
                <div class="grid-content bg-purple">
                  <el-form-item label="用户名" prop="interName">
                    <el-input
                      v-model="editForm.interName"
                      :disabled="true"
                    ></el-input>
                    <el-input
                      type="hidden"
                      v-model="editForm.interId"
                      :disabled="true"
                      style="display:none;"
                    ></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple-light">
                  <el-form-item label="部门" prop="partId">
                    <el-select
                      v-model="editForm.partId"
                      placeholder="请选择所属部门"
                    >
                      <el-option
                        v-for="department in departments"
                        :key="department.partId"
                        :label="department.partName"
                        :value="department.partId"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <div class="grid-content bg-purple-light">
                  <el-form-item label="性别" prop="interSex">
                    <el-radio-group v-model="editForm.interSex">
                      <el-radio :label="0">帅哥</el-radio>
                      <el-radio :label="1">美女</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>

            <el-form-item label="联系方式" prop="interPhone">
              <el-input v-model="editForm.interPhone"></el-input>
            </el-form-item>
            <el-form-item prop="birth" label="生日">
              <el-col :span="11">
                <el-date-picker
                  type="date"
                  value-format="yyyy年MM月dd日"
                  placeholder="选择出生日期"
                  v-model="editForm.interBirth"
                  :disabled="true"
                  style="width: 100%;"
                ></el-date-picker>
              </el-col>
            </el-form-item>
          </el-form>
        </span>

        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="updateUser"
            :loading="btnLoading"
            :disabled="btnDisabled"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import axios from "axios";
/* import FileSaver from "file-saver";
import XLSX from "xlsx"; */
export default {
  data() {
    var checkPhone = (rule, value, callback) => {
      const phoneReg = /^1[34578]\d{9}$$/;
      if (!value) {
        return callback(new Error("电话号码不能为空"));
      }
      setTimeout(() => {
        // Number.isInteger是es6验证数字是否为整数的方法,实际输入的数字总是识别成字符串
        // 所以在前面加了一个+实现隐式转换

        if (!Number.isInteger(+value)) {
          callback(new Error("请输入数字值"));
        } else {
          if (phoneReg.test(value)) {
            callback();
          } else {
            callback(new Error("电话号码格式不正确"));
          }
        }
      }, 100);
    };
    return {
      Authorization: { Authorization: localStorage.getItem("Authorization") },
      fileURL:
        "http://8.129.111.24:8888/group1/M00/00/00/rBjpe1_OGCaAb6oVAAAjrgYx-4E76.xlsx",
      btnLoading: false,
      btnDisabled: false,
      departments: [],
      loading: true,
      total: 0,
      addDialogVisible: false, //添加对话框,
      editDialogVisible: false, //修改对话框
      assignDialogVisible: false, //分配角色对话框
      labelPosition: "right", //lable对齐方式
      fileList: [],
      //查询对象
      queryMap: {
        pageNum: 1,
        pageSize: 7,
        partName: "",
        interName: "",
        interSex: ""
      },
      interList: [],
      addForm: {
        interName: "",
        interPhone: "",
        interSex: ""
      }, //添加表单
      editForm: {}, //更新表单
      addFormRules: {
        interName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        partId: [{ required: true, message: "请选择部门", trigger: "blur" }],
        sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
        interPhone: [
          {
            required: true,
            message: "请输入联系方式",
            validator: checkPhone,
            trigger: "blur"
          }
        ]
      }, //添加表单验证规则
      roles: [], //角色
      value: [], //用户拥有的角色
      uid: ""
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
        interName: "",
        interSex: ""
      };
    },
    /**
     * 加载用户表格
     */
    downExcel() {
      var $this = this;
      const res = axios
        .request({
          url: "/Inter/excel",
          method: "post",
          responseType: "blob"
        })
        .then(res => {
          if (res.headers["content-type"] === "application/json") {
            return $this.$message.error(
              "Subject does not have permission [inter:export]"
            );
          }
          const data = res.data;
          let url = window.URL.createObjectURL(data); // 将二进制文件转化为可访问的url
          var a = document.createElement("a");
          document.body.appendChild(a);
          a.href = url;
          a.download = "内部人员列表.xls";
          a.click();
          window.URL.revokeObjectURL(url);
        });
    },
    /**
     * 加载用户列表
     */
    async getinterList() {
      const { data: res } = await this.$http.get("Inter/listData", {
        params: this.queryMap
      });
      if (res.code !== 200) return this.$message.error("获取用户列表失败");
      this.total = res.data.total;
      this.interList = res.data.rows;
      /* console.log(this.interList); */
    },
    showSex(row) {
      return row.sex == 0 ? "帅哥" : "美女";
    },
    /**
     * 删除用户
     */
    async del(interId) {
      var res = await this.$confirm(
        "此操作将永久删除该人员, 是否继续?",
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
          "Inter/delete/" + interId
        );
        console.log(res);
        if (res.code == 200) {
          this.$notify.success({
            title: "操作成功",
            message: "用户删除成功"
          });
          this.getinterList();
          this.getDepartmets();
        } else {
          this.$message.error(res.msg);
        }
      }
    },
    /**
     * 添加用户
     */
    async addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return;
        } else {
          this.btnLoading = true;
          this.btnDisabled = true;
          const { data: res } = await this.$http.post(
            "Inter/add",
            this.addForm
          );
          if (res.code == 200) {
            this.$notify.success({
              title: "操作成功",
              message: "用户添加成功"
            });
            this.addForm = {};
            this.getinterList();
            this.getDepartmets();
          } else {
            return this.$message.error("用户添加失败:" + res.msg);
          }
          this.addDialogVisible = false;
          this.btnLoading = false;
          this.btnDisabled = false;
        }
      });
    },
    /**
     * 更新用户
     */
    async updateUser() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return;
        } else {
          this.btnLoading = true;
          this.btnDisabled = true;
          const { data: res } = await this.$http.put(
            "Inter/update/" + this.editForm.interId,
            this.editForm
          );
          if (res.code == 200) {
            this.$notify({
              title: "操作成功",
              message: "用户基本信息已更新",
              type: "success"
            });
            this.editForm = {};
            this.getinterList();
            this.getDepartmets();
          } else {
            this.$message.error("用户信息更新失败:" + res.msg);
          }
          this.editDialogVisible = false;
          this.btnLoading = false;
          this.btnDisabled = false;
        }
      });
    },
    /**
     * 搜索用户
     */
    searchUser() {
      this.queryMap.pageNum = 1;
      this.getinterList();
    },
    /**
     * 修改用户信息
     */
    async edit(interId) {
      const { data: res } = await this.$http.get("Inter/edit/" + interId);
      if (res.code == 200) {
        this.editForm = res.data;
        this.editDialogVisible = true;
      } else {
        return this.$message.error("用户信息编辑失败:" + res.msg);
      }
    },
    /**
     *  改变页码
     */
    handleSizeChange(newSize) {
      this.queryMap.pageSize = newSize;
      this.getinterList();
    },
    /**
     * 翻页
     */
    handleCurrentChange(current) {
      this.queryMap.pageNum = current;
      this.getinterList();
    },

    /**
     * 关闭添加弹出框
     */
    closeDialog() {
      this.$refs.addFormRef.clearValidate();
      this.addForm.birth = "";
      this.addForm = {};
    },
    /**
     * 关闭编辑弹出框
     */
    editClose() {
      this.$refs.editFormRef.clearValidate();
      this.editForm = {};
    },
    /**
     * 加载所有部门
     */
    async getDepartmets() {
      const { data: res } = await this.$http.get("part/findAll");
      if (res.code !== 200) return this.$message.error("获取部门列表失败");
      console.log(res);
      this.departments = res.data;
    },
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-3);
    }
  },
  created() {
    this.getinterList();
    this.getDepartmets();
    setTimeout(() => {
      this.loading = false;
    }, 500);
  }
};
</script>
<style lang="less">
.inline-block {
  display: inline-block;
}
</style>
