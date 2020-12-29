<template>
  <div id="visiter">
    <!-- 面包导航 -->
    <el-breadcrumb
      separator="/"
      style="padding-left:10px;padding-bottom:10px;font-size:16px;"
    >
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>访客管理</el-breadcrumb-item>
      <el-breadcrumb-item>访客查询</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片主体 -->
    <el-card class="box-card">
      <!-- 上面工具栏 -->
      <el-form
        :inline="true"
        ref="queryMap"
        :model="queryMap"
        label-width="70px"
        size="small"
      >
        <el-col :span="24">
          <el-form-item label="访客姓名" style="margin-right: 60px;">
            <el-input
              @keyup.enter.native="searchVisitor"
              @clear="searchVisitor"
              clearable
              v-model="queryMap.visitorName"
              placeholder="请输入访客姓名查询"
            ></el-input>
          </el-form-item>
          <el-form-item label="访客电话" style="margin-right: 60px;">
            <el-input
              @keyup.enter.native="searchVisitor"
              @clear="searchVisitor"
              clearable
              v-model="queryMap.visitorPhone"
              placeholder="请输入访客电话查询"
            ></el-input>
          </el-form-item>
          <el-form-item label="访客性别" style="margin-right: 60px;">
            <el-radio v-model="queryMap.visitorSex" label="0">男</el-radio>
            <el-radio v-model="queryMap.visitorSex" label="1">女</el-radio>
            <el-radio v-model="queryMap.visitorSex" label>全部</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            label="开始时间"
            style="margin-right: 42px;margin-bottom: 8px;"
          >
            <el-date-picker
              @keyup.enter.native="searchVisitor"
              @clear="searchVisitor"
              clearable
              v-model="queryMap.startTime"
              type="datetime"
              value-format="yyyy-MM-dd HH-mm-ss"
              format="yyyy-MM-dd HH-mm-ss"
              placeholder="请选择查询开始日期时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item
            label="结束时间"
            style="margin-bottom: 8px;margin-left:5px"
          >
            <el-date-picker
              @keyup.enter.native="searchVisitor"
              @clear="searchVisitor"
              clearable
              value-format="yyyy-MM-dd HH-mm-ss"
              format="yyyy-MM-dd HH-mm-ss"
              v-model="queryMap.endTime"
              type="datetime"
              placeholder="请选择查询结束日期时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item
            label="民族"
            style="margin-right: 60px;margin-bottom: 8px;"
          >
            <el-input
              @keyup.enter.native="searchVisitor"
              @clear="searchVisitor"
              clearable
              v-model="queryMap.visitorNation"
              placeholder="请输入访客民族查询"
            ></el-input>
          </el-form-item>
          <el-form-item
            style="position: relative;left: 2.3%;margin-bottom: 8px;"
          >
            <el-button @click="reset" icon="el-icon-refresh">重置</el-button>
            <el-button
              type="primary"
              @click="searchVisitor"
              icon="el-icon-search"
              >查询</el-button
            >
            <el-button
              @click="downExcel"
              v-hasPermission="'visitor:export'"
              icon="el-icon-download"
              >导出</el-button
            >
          </el-form-item>
        </el-col>
      </el-form>
      <!-- 表格区域 -->
      <template>
        <el-table
          id="visitorTable"
          v-loading="loading"
          :data="visitorData"
          border
          style="width: 100%;margin-top:20px;"
          height="420"
          size="small"
          :default-sort="{ prop: 'etime', order: 'descending' }"
          :header-cell-style="{ 'text-align': 'center' }"
          :cell-style="{ 'text-align': 'center' }"
        >
          <el-table-column
            prop="visitorId"
            label="ID"
            width="60"
          ></el-table-column>
          <el-table-column
            prop="visitorName"
            label="访客姓名"
            width="80"
          ></el-table-column>
          <el-table-column
            prop="visitorCtype"
            label="证件类型"
            width="100"
          ></el-table-column>
          <el-table-column
            prop="visitorNation"
            label="民族"
            width="120"
          ></el-table-column>
          <el-table-column
            prop="visitorPhone"
            label="访客电话"
            width="120"
          ></el-table-column>
          <el-table-column prop="visitorPhoto" label="图片" width="100%">
            <template slot-scope="scope">
              <el-popover placement="right" title="" trigger="hover">
                <img
                  :src="scope.row.visitorPhoto"
                  style="max-height: 200px;max-width: 280px"
                />
                <img
                  slot="reference"
                  :src="scope.row.visitorPhoto"
                  :alt="scope.row.visitorPhoto"
                  style="width: 50px; height: 50px; border-radius: 50%;"
                />
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            prop="etime"
            label="访问时间"
            width="138"
            sortable
          ></el-table-column>
          <el-table-column
            prop="ltime"
            label="离开时间"
            width="138"
            sortable
          ></el-table-column>
          <el-table-column
            prop="interName"
            label="被访人"
            width="120"
          ></el-table-column>
          <el-table-column
            prop="interPhone"
            label="被访人电话"
            width="120"
          ></el-table-column>
          <el-table-column
            prop="partName"
            label="被访人部门"
            width="120"
          ></el-table-column>
          <el-table-column fixed="right" label="操作" width="180">
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                content="详细"
                placement="top"
                :enterable="false"
                ><el-button
                  @click="detail(scope.row.visitorId)"
                  v-hasPermission="'visitor:detail'"
                  type="primary"
                  icon="el-icon-edit-outline"
                  size="small"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="离开"
                placement="top"
                :enterable="false"
              >
                <el-button
                  @click="edit(scope.row.visitorId)"
                  v-hasPermission="'visitor:update'"
                  type="success"
                  icon="el-icon-edit"
                  size="small"
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
                  v-hasPermission="'visitor:delete'"
                  @click="del(scope.row.visitorId)"
                  type="danger"
                  icon="el-icon-delete"
                  size="small"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!--访客详细信息-->
      <el-dialog title="访客详细信息" :visible.sync="dialogFormVisible">
        <el-row :gutter="24">
          <el-col :span="12">
            <div class="demo-fit" style="position: relative;left:10%;">
              <div class="block">
                <el-avatar
                  shape="square"
                  style="width: 120px;height: 140px;"
                  :src="this.form.visitorPhoto"
                ></el-avatar>
              </div>
            </div>
            <el-card style="margin-top: 28px;">
              <el-form
                :model="form"
                size="small"
                label-width="140px"
                style="margin-top: 30px;position: relative;left: -50px;"
                disabled
              >
                <el-form-item label="访客姓名">
                  <el-input v-model="form.visitorName"></el-input>
                </el-form-item>
                <el-form-item label="证件类型">
                  <el-input v-model="form.visitorCtype"></el-input>
                </el-form-item>
                <el-form-item label="访客地址">
                  <el-input v-model="form.visitorAddress"></el-input>
                </el-form-item>
              </el-form>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card>
              <el-form :model="form" size="small" label-width="140px" disabled>
                <el-form-item label="访客年龄">
                  <el-input v-model="form.visitorAge"></el-input>
                </el-form-item>
                <el-form-item label="访客民族">
                  <el-input v-model="form.visitorNation"></el-input>
                </el-form-item>
                <el-form-item label="访客车牌号">
                  <el-input v-model="form.visitorPlate"></el-input>
                </el-form-item>
                <el-form-item label="访客原因">
                  <el-input v-model="form.visitorReason"></el-input>
                </el-form-item>
                <el-form-item label="被访人ID">
                  <el-input v-model="form.interId"></el-input>
                </el-form-item>
                <el-form-item label="被访人姓名">
                  <el-input v-model="form.interName"></el-input>
                </el-form-item>
                <el-form-item label="被访人电话">
                  <el-input v-model="form.interPhone"></el-input>
                </el-form-item>
              </el-form>
            </el-card>
          </el-col>
        </el-row>
      </el-dialog>

      <!-- 分页部分 -->
      <el-pagination
        background
        style="margin-top:10px;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryMap.pageNum"
        :page-sizes="[5, 10, 20, 40]"
        :page-size="queryMap.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
/* import Qs from "qs"; */
import FileSaver from "file-saver";
import XLSX from "xlsx";
export default {
  data() {
    return {
      btnLoading: false,
      btnDisabled: false,
      dialogFormVisible: false,
      loading: true,
      total: 0,
      queryMap: {
        pageNum: 1,
        pageSize: 5,
        visitorName: "",
        visitorNation: "",
        visitorSex: "",
        visitorAddress: "",
        interId: "",
        startTime: "",
        endTime: "",
        partId: ""
      }, //查询条件
      form: {
        visitorCnumber: "",
        visitorAddress: "",
        visitorCtype: "",
        visitorId: "",
        visitorName: "",
        visitorAge: "",
        visitorNation: "",
        visitorPlate: "",
        visitorReason: "",
        remarks: "",
        visitorSex: "",
        visitorPhoto: "",
        partName: "",
        interId: "",
        interName: "",
        interPhone: ""
      },
      formLabelWidth: "100px",
      visitorData: [], //访客表格数据
      departments: [],
      fileList: [],
      editForm: {}, //编辑数据
      addDialogVisible: false, //添加弹框的显示
      editDialogVisible: false, //编辑弹框
      grantDialogVisible: false, //授权弹出框
      data: [],
      open: [], //展开
      grantId: "",
      defaultProps: {
        children: "children",
        label: "permissionName"
      },
      addFormVisitor: {
        visitorName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ]
      } //添加验证规则
    };
  },
  methods: {
    reset() {
      this.queryMap = {
        pageNum: 1,
        pageSize: 6,
        visitorName: "",
        visitorNation: "",
        visitorSex: "",
        visitorAddress: "",
        interId: "",
        startTime: "",
        endTime: ""
      };
    },
    /**
     *   下载表格
     * */
    downExcel() {
      var wb = XLSX.utils.table_to_book(
        document.querySelector("#visitorTable")
      ); //mytable为表格的id名
      /* get binary string as output */
      var wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });
      try {
        FileSaver.saveAs(
          new Blob([wbout], { type: "application/octet-stream" }),
          "访客.xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },
    /**
     * 加载菜单表格
     */
    //加载所有部门
    async getDepartmets() {
      const { data: res } = await this.$http.get("part/findAll");
      if (res.code !== 200) return this.$message.error("获取部门列表失败");
      console.log(res);
      this.departments = res.data;
    },

    //加载用户列表
    async getVisitorList() {
      const { data: res } = await this.$http.get("visitor/listData", {
        params: this.queryMap
      });
      if (res.code == 200) {
        this.visitorData = res.data.rows;
        this.total = res.data.total;
      }
    },
    //查看详细信息
    async detail(visitorId) {
      this.dialogFormVisible = true;
      this.btnLoading = true;
      this.btnDisabled = true;
      const { data: res } = await this.$http.get("visitor/detail/" + visitorId);
      if (res.code == 200) {
        this.form = res.data;
      } else {
        this.$message.error("获取详细信息失败");
      }
    },
    //删除用户
    async del(visitorId) {
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
          "visitor/delete/" + visitorId
        );
        /* console.log(res); */
        if (res.code == 200) {
          this.$notify.success({
            title: "操作成功",
            message: "用户删除成功"
          });
          this.getVisitorList();
          this.getDepartmets();
        } else {
          this.$message.error(res.msg);
        }
      }
    },
    //编辑用户信息
    //搜索
    searchVisitor() {
      this.queryMap.pageNum = 1;
      this.getVisitorList();
    },
    //关闭添加弹框
    closeAdd() {
      this.$refs.addFormRef.clearValidate();
      this.addForm = {};
    },
    closeEdit() {
      this.$refs.editFormRef.clearValidate();
      this.editForm = {};
    },
    //离开
    async edit(visitorId) {
      const { data: res } = await this.$http.put("visitor/set/" + visitorId);
      if (res.code == 200) {
        this.$message.success("访客信息编辑成功");
        /* this.editDialogVisible = true; */
      } else {
        return this.$message.error("访客信息编辑失败:" + res.msg);
      }
    },
    /**
     *  改变页码
     */
    handleSizeChange(newSize) {
      this.queryMap.pageSize = newSize;
      this.getVisitorList();
    },
    /**
     * 翻页
     */
    handleCurrentChange(current) {
      this.queryMap.pageNum = current;
      this.getVisitorList();
    },
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
    //上传文件
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-3);
    }
  },
  created() {
    this.getVisitorList();
    this.getDepartmets();
    setTimeout(() => {
      this.loading = false;
    }, 500);
  }
};
</script>

<style lang="less">
.el-input--prefix .el-input__inner {
  width: 204px;
}
</style>
