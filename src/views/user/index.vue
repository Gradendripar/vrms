<template>
  <div id="users">
    <el-breadcrumb
      separator="/"
      style="padding-left:10px;padding-bottom:10px;font-size:16px;"
    >
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>信息管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 用户列表卡片区 -->
    <el-card class="box-card">
      <el-form
        :inline="true"
        ref="form"
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
            v-model="queryMap.userName"
            placeholder="请输入姓名查询"
          ></el-input>
        </el-form-item>

        <el-form-item label="性别">
          <el-radio v-model="queryMap.userSex" label="0">男</el-radio>
          <el-radio v-model="queryMap.userSex" label="1">女</el-radio>
          <el-radio v-model="queryMap.userSex" label>全部</el-radio>
        </el-form-item>

        <el-form-item style="margin-left:50px;position: relative;left: 15px;">
          <el-button @click="reset" icon="el-icon-refresh">重置</el-button>
          <el-button type="primary" @click="searchUser" icon="el-icon-search"
            >查询</el-button
          >
          <el-button
            type="success"
            icon="el-icon-plus"
            @click="addDialogVisible = true"
            v-hasPermission="'user:add'"
            >添加</el-button
          >
          <el-button @click="downExcel" icon="el-icon-download">导出</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格区域 -->
      <el-table
        id="userTable"
        v-loading="loading"
        size="small"
        :data="userList"
        border
        style="width: 100%;"
        height="460"
        :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="{ 'text-align': 'center' }"
      >
        <!-- <el-table-column type="selection" width="40"></el-table-column> -->
        <el-table-column label="#" prop="userId" width="50"></el-table-column>
        <el-table-column
          prop="userName"
          label="姓名"
          width="110"
        ></el-table-column>
        <el-table-column
          prop="name"
          label="用户名"
          width="110"
        ></el-table-column>
        <el-table-column
          prop="userSex"
          :formatter="showSex"
          label="性别"
          width="100"
        >
          <template slot-scope="scope">
            <el-tag size="small" type="success" v-if="scope.row.userSex == 0"
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
          prop="userPhone"
          label="电话"
          width="180"
        ></el-table-column>
        <el-table-column prop="isban" label="是否禁用" width="100">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.userStatus"
              @change="changUserStatus(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="信息编辑"
              placement="top"
              :enterable="false"
              ><el-button
                v-hasPermission="'user:update'"
                size="small"
                type="primary"
                icon="el-icon-edit-outline"
                @click="edit(scope.row.userId)"
              ></el-button
            ></el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="用户删除"
              placement="top"
              :enterable="false"
            >
              <el-button
                v-hasPermission="'user:delete'"
                type="danger"
                size="small"
                icon="el-icon-delete"
                @click="del(scope.row.userId)"
              ></el-button>
            </el-tooltip>

            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                size="small"
                icon="el-icon-s-tools"
                @click="assignRoles(scope.row.userId)"
                v-hasPermission="'user:assign'"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="初始密码"
              placement="top"
              :enterable="false"
            >
              <el-button
                v-hasPermission="'user:update'"
                type="danger"
                size="small"
                icon="el-icon-sunset"
                @click="set(scope.row.userId)"
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
        :page-sizes="[6, 10, 20, 30]"
        :page-size="queryMap.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>

      <!-- 添加对话框 -->
      <el-dialog
        title="添加用户"
        @close="closeDialog"
        :visible.sync="addDialogVisible"
        :close-on-click-modal="false"
        width="50%;"
      >
        <!-- 表单 -->
        <span>
          <el-form
            :model="addForm"
            :label-position="labelPosition"
            :rules="addFormRules"
            ref="addFormRef"
            label-width="180px"
          >
            <el-row>
              <el-col :span="16">
                <el-form-item label="用户名" prop="name">
                  <el-input v-model="addForm.name"></el-input>
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
                <el-form-item label="姓名" prop="userName">
                  <el-input v-model="addForm.userName"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="userSex">
                  <el-radio-group v-model="addForm.userSex">
                    <el-radio :label="0">帅哥</el-radio>
                    <el-radio :label="1">美女</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="电话" prop="userPhone">
                  <el-input v-model="addForm.userPhone"></el-input>
                </el-form-item>
                <el-form-item prop="userBirth" label="生日">
                  <el-date-picker
                    type="date"
                    value-format="yyyy-MM-dd"
                    format="yyyy-MM-dd"
                    placeholder="选择出生日期"
                    v-model="addForm.userBirth"
                    style="width: 100%;"
                  ></el-date-picker>
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
        :close-on-click-modal="false"
        width="50%"
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
                  <el-form-item label="用户名" prop="name">
                    <el-input
                      v-model="editForm.name"
                      :disabled="true"
                    ></el-input>
                    <el-input
                      type="hidden"
                      v-model="editForm.userId"
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
                  <el-form-item label="性别" prop="userSex">
                    <el-radio-group v-model="editForm.userSex">
                      <el-radio :label="0">帅哥</el-radio>
                      <el-radio :label="1">美女</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>

            <el-form-item label="联系方式" prop="userPhone">
              <el-input v-model="editForm.userPhone"></el-input>
            </el-form-item>
            <el-form-item prop="userBirth" label="生日">
              <el-col :span="11">
                <el-date-picker
                  type="date"
                  :disabled="true"
                  value-format="yyyy年MM月dd日"
                  placeholder="选择出生日期"
                  v-model="editForm.userBirth"
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
      <!-- 分配角色对话框 -->
      <el-dialog
        center
        title="分配角色"
        :visible.sync="assignDialogVisible"
        :close-on-click-modal="false"
        width="49%"
      >
        <span>
          <template>
            <el-transfer
              filterable
              :titles="['未拥有', '已拥有']"
              :button-texts="['到左边', '到右边']"
              v-model="value"
              :data="roles"
            ></el-transfer>
          </template>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="assignDialogVisible = false" class="el-icon-close"
            >取消分配</el-button
          >
          <el-button
            v-hasPermission="'user:assign'"
            type="primary"
            @click="doAssignRoles"
            class="el-icon-check"
            :loading="btnLoading"
            :disabled="btnDisabled"
            >确定分配</el-button
          >
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import FileSaver from "file-saver";
import XLSX from "xlsx";
export default {
  data() {
    var checkPhone = (rule, value, callback) => {
      const phoneReg = /^1[345789]\d{9}$$/;
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
      btnLoading: false,
      btnDisabled: false,
      departments: [],
      loading: true,
      total: 0,
      addDialogVisible: false, //添加对话框,
      editDialogVisible: false, //修改对话框
      assignDialogVisible: false, //分配角色对话框
      labelPosition: "right", //lable对齐方式
      //查询对象
      queryMap: {
        pageNum: 1,
        pageSize: 6,
        partId: "",
        userName: "",
        userSex: ""
      },
      userList: [],
      addForm: {
        name: "",
        password: "",
        userPhone: "",
        userName: "",
        userSex: "",
        userBirth: ""
      }, //添加表单
      editForm: {}, //更新表单
      addFormRules: {
        name: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 12, message: "长度在 3 到 12 个字符", trigger: "blur" }
        ],
        partId: [{ required: true, message: "请选择部门", trigger: "blur" }],
        sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
        userPhone: [
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
        userName: "",
        userSex: ""
      };
    },

    downExcel() {
      var wb = XLSX.utils.table_to_book(document.querySelector("#userTable")); //mytable为表格的id名
      /* get binary string as output */
      var wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });
      try {
        FileSaver.saveAs(
          new Blob([wbout], { type: "application/octet-stream" }),
          "员工.xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },
    /**
     * 弹出用户分配角色
     */
    async assignRoles(userId) {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      const { data: res } = await this.$http.get("user/" + userId + "/roles");
      if (res.code == 200) {
        this.roles = res.data.roles;
        this.value = res.data.values;
        this.uid = userId;

        setTimeout(() => {
          loading.close();
          this.assignDialogVisible = true;
        }, 400);
      }
    },
    /**
     * 确定分配角色
     */
    async doAssignRoles() {
      this.assignDialogVisible = true;
      this.btnLoading = true;
      this.btnDisabled = true;
      const { data: res } = await this.$http.post(
        "user/" + this.uid + "/assignRoles",
        this.value
      );
      if (res.code == 200) {
        this.$notify.success({
          title: "操作成功",
          message: "用户分配角色成功"
        });
      } else {
        this.$message.error("分配角色失败:" + res.msg);
      }
      this.assignDialogVisible = false;
      this.btnLoading = false;
      this.btnDisabled = false;
    },
    /**
     * 加载用户列表
     */
    async getUserList() {
      const { data: res } = await this.$http.get("user/listData", {
        params: this.queryMap
      });
      if (res.code !== 200) return this.$message.error("获取用户列表失败");
      this.total = res.data.total;
      this.userList = res.data.rows;
      /* console.log(this.userList); */
    },
    showSex(row) {
      return row.sex == 0 ? "帅哥" : "美女";
    },
    /**
     * 重置密码
     */

    async set(id) {
      var res = await this.$confirm(
        "此操作将重置该用户密码, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(() => {
        this.$message({
          type: "info",
          message: "已取消重置"
        });
      });
      if (res == "confirm") {
        const { data: res } = await this.$http.put("user/resetPassword/" + id);
        console.log(res);
        if (res.code == 200) {
          this.$notify.success({
            title: "操作成功",
            message: "用户密码重置成功为（111111）"
          });
          this.getUserList();
          this.getDepartmets();
        } else {
          this.$message.error(res.msg);
        }
      }
    },
    /**
     * 删除用户
     */
    async del(id) {
      var res = await this.$confirm(
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
      if (res == "confirm") {
        const { data: res } = await this.$http.delete("user/delete/" + id);
        /* console.log(res); */
        if (res.code == 200) {
          this.$notify.success({
            title: "操作成功",
            message: "用户删除成功"
          });
          this.getUserList();
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
          const { data: res } = await this.$http.post("user/add", this.addForm);
          if (res.code == 200) {
            this.$message.success({
              title: "操作成功",
              message: "用户添加成功"
            });
            this.addForm = {};
            this.getUserList();
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
            "user/update/" + this.editForm.userId,
            this.editForm
          );
          if (res.code == 200) {
            this.$notify({
              title: "操作成功",
              message: "用户基本信息已更新",
              type: "success"
            });
            this.editForm = {};
            this.getUserList();
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
      this.getUserList();
    },
    /**
     * 修改用户信息
     */
    async edit(id) {
      const { data: res } = await this.$http.get("user/edit/" + id);
      if (res.code == 200) {
        this.editForm = res.data;
        this.editDialogVisible = true;
      } else {
        return this.$notify.error("用户信息编辑失败:" + res.msg);
      }
    },
    /**
     *  改变页码
     */
    handleSizeChange(newSize) {
      this.queryMap.pageSize = newSize;
      this.getUserList();
    },
    /**
     * 翻页
     */
    handleCurrentChange(current) {
      this.queryMap.pageNum = current;
      this.getUserList();
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
     * 禁用启用用户
     */
    async changUserStatus(row) {
      const { data: res } = await this.$http.put(
        "user/updateStatus/" + row.userId + "/" + row.userStatus
      );
      if (res.code !== 200) {
        this.$message.error("更新用户状态失败:" + res.msg);
        row.userStatus = !row.userStatus;
      } else {
        var message = row.userStatus ? "用户状态已禁用" : "用户状态已启用";
        this.$notify.success({
          title: "操作成功",
          message: message
        });
      }
    },
    /**
     * 加载所有部门
     */
    async getDepartmets() {
      const { data: res } = await this.$http.get("part/findAll");
      if (res.code !== 200) return this.$message.error("获取部门列表失败");
      console.log(res);
      this.departments = res.data;
    }
    /**
     * 显示用户性别
     */
    /*  showSex(row) {
      return row.sex == 1 ? "帅哥" : "美女";
    } */
  },
  created() {
    this.getUserList();
    this.getDepartmets();
    setTimeout(() => {
      this.loading = false;
    }, 500);
  }
};
</script>
