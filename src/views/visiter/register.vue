<template>
  <div id="register">
    <el-breadcrumb
      separator="/"
      style="padding-left:10px;padding-bottom:10px;font-size:16px;"
    >
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>访客管理</el-breadcrumb-item>
      <el-breadcrumb-item>访客登记</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="main" style="position: relative;left: 10px;">
      <el-row :gutter="12">
        <el-col :span="3">
          <el-card style="height: 590px;">
            <div style="height: 560px;">
              <el-steps direction="vertical" :active="2">
                <el-step title="预约"></el-step>
                <el-step title="访问"></el-step>
                <el-step title="离开"></el-step>
              </el-steps>
            </div>
          </el-card>
        </el-col>
        <el-col :span="20">
          <el-card style="height: 590px;"
            ><p>访客信息</p>
            <el-form ref="form" :model="form" label-width="80px" :rules="rules">
              <el-row :gutter="96">
                <el-col :span="8">
                  <el-form-item label="姓名" prop="visitorName">
                    <el-input v-model="form.visitorName" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="证件类型" prop="visitorCtype">
                    <el-select
                      v-model="form.visitorCtype"
                      placeholder="请选择证件类型"
                      clearable
                    >
                      <el-option label="身份证" value="身份证"></el-option>
                      <el-option label="驾驶证" value="驾驶证"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="手机号" prop="visitorPhone">
                    <el-input v-model="form.visitorPhone" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="证件号码" prop="visitorCnumber">
                    <el-input
                      clearable
                      v-model="form.visitorCnumber"
                      @blur="getName(form.visitorCnumber)"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="事由" prop="visitorReason">
                    <!-- <el-input v-model="form.visitorReason"></el-input> -->
                    <el-select
                      v-model="form.visitorReason"
                      placeholder="请选择访问事由"
                      clearable
                    >
                      <el-option label="找人" value="找人"></el-option>
                      <el-option label="办事" value="办事"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="年龄" prop="visitorAge">
                    <el-input
                      v-model.number="form.visitorAge"
                      disabled
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="性别">
                    <el-radio v-model="form.visitorSex" label="0">男</el-radio>
                    <el-radio v-model="form.visitorSex" label="1">女</el-radio>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="民族">
                    <el-select
                      placeholder="请选择民族"
                      v-model="form.visitorNation"
                      @change="changeNation"
                      clearable
                    >
                      <el-option
                        v-for="item in nationList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                        <span style="float: left">{{ item.label }}</span>
                        <span
                          style="float: right; color: #8492a6; font-size: 13px"
                          >{{ item.value }}</span
                        >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label="单位名称">
                    <el-input
                      v-model="form.visitorCompany"
                      clearable
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <div class="grid-content bg-purple"></div>
                  <el-form-item label="省份" prop="valueProvince">
                    <el-select
                      v-model="addform.valueProvince"
                      placeholder="请选择省"
                      @change="changeProvince"
                      clearable
                    >
                      <el-option
                        v-for="item in provinceList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <div class="grid-content bg-purple-light">
                    <el-form-item label="城市" prop="valueCity">
                      <el-select
                        v-model="addform.valueCity"
                        placeholder="请选择市"
                        @change="changeCity"
                        clearable
                      >
                        <el-option
                          v-for="item in cityOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="grid-content bg-purple">
                    <el-form-item label="区县" prop="valueOrigin">
                      <el-select
                        v-model="addform.valueOrigin"
                        placeholder="请选择区"
                        @change="changeOrigin"
                        clearable
                      >
                        <el-option
                          v-for="item in originOptions"
                          :key="item.label"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>

                <el-col :span="8">
                  <el-form-item label="车牌号" prop="visitorPlate">
                    <el-input v-model="form.visitorPlate" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="备注">
                    <el-input v-model="form.remarks" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8" style="position: relative;left: 40px;">
                  <el-button
                    @click.native="onTake()"
                    icon="el-icon-camera"
                    size="medium"
                    class="bu_possition"
                    type="primary"
                    style="position: relative;left: -40px;"
                  >
                    访客拍照
                  </el-button>
                </el-col>
              </el-row>
              <el-divider><i class="el-icon-mobile-phone"></i></el-divider>
              <el-row :gutter="0">
                <el-col :span="24" style="position: relative;">
                  <p
                    style="margin-top: 0px;position: relative;display: inline-block;"
                  >
                    被访人信息
                  </p>
                  <el-button
                    style="position: relative;left: 80px;"
                    type="success"
                    size="mini"
                    modal-append-to-body="false"
                    @click.native="choose()"
                    >选择</el-button
                  >
                </el-col>
                <el-col :span="6">
                  <el-form-item label="被访人">
                    <el-input v-model="interForm.interName" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="工号">
                    <el-input v-model="interForm.interId" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="手机号">
                    <el-input
                      v-model="interForm.interPhone"
                      disabled
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="部门">
                    <el-input v-model="interForm.partName" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12" style="position: relative;left: 30%;">
                  <el-form-item>
                    <el-button
                      type="primary"
                      style="margin-right: 60px;"
                      @click="submitForm('form')"
                      >提交</el-button
                    >
                    <el-button @click="reset">重置</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-card>
          <!-- 员工表 -->
          <el-dialog
            title="员工表"
            :visible.sync="dialogTableVisible"
            :close-on-click-modal="false"
            center
          >
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

              <el-form-item style="margin-left:20px;position: relative;">
                <el-button
                  type="primary"
                  @click="searchUser"
                  icon="el-icon-search"
                  >查询</el-button
                >
              </el-form-item>
            </el-form>
            <el-table :data="interList">
              <el-table-column
                prop="interName"
                label="被访人"
                width="150"
              ></el-table-column>
              <el-table-column
                prop="interId"
                label="工号"
                width="200"
              ></el-table-column>
              <el-table-column
                prop="interPhone"
                label="手机号"
                width="150"
              ></el-table-column>
              <el-table-column
                prop="partName"
                label="部门"
                width="120"
              ></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    size="small"
                    @click="handleEdit(scope.$index, scope.row)"
                    >选择
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              style="margin-top:10px;"
              background
              @current-change="handleCurrentChange"
              :current-page="queryMap.pageNum"
              :page-size="queryMap.pageSize"
              layout="total, prev, pager, next, jumper"
              :total="total"
            ></el-pagination>
          </el-dialog>
          <el-dialog
            title="拍照上传"
            :visible.sync="visible"
            @close="onCancel"
            width="1065px"
          >
            <div class="box">
              <video
                id="videoCamera"
                class="canvas"
                :width="videoWidth"
                :height="videoHeight"
                autoPlay
              ></video>
              <canvas
                id="canvasCamera"
                class="canvas"
                :width="videoWidth"
                :height="videoHeight"
              ></canvas>
            </div>
            <div slot="footer">
              <el-button @click="drawImage" icon="el-icon-camera" size="small">
                拍照
              </el-button>
              <el-button
                v-if="open"
                @click="getCompetence"
                icon="el-icon-video-camera"
                size="small"
              >
                打开摄像头
              </el-button>
              <el-button
                v-else
                @click="stopNavigator"
                icon="el-icon-switch-button"
                size="small"
              >
                关闭摄像头
              </el-button>
              <el-button
                @click="resetCanvas"
                icon="el-icon-refresh"
                size="small"
              >
                重置
              </el-button>
              <el-button
                @click="onCancel"
                icon="el-icon-circle-close"
                size="small"
              >
                取消
              </el-button>
              <el-button
                @click="onUpload"
                :loading="loading"
                type="primary"
                icon="el-icon-upload2"
                size="small"
              >
                上传
              </el-button>
            </div>
          </el-dialog>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    //证件号码校验规则
    var idCard = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("证号不能为空"));
      }
      if (!/(^\d{15}$)|(^\d{17}(\d|X|x)$)/.test(value)) {
        callback(new Error("你输入的证件长度或格式错误"));
      }
      //身份证城市
      var aCity = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外"
      };
      if (!aCity[parseInt(value.substr(0, 2))]) {
        callback(new Error("你的证件地区非法"));
      }
      // 出生日期验证
      var sBirthday = (
          value.substr(6, 4) +
          "-" +
          Number(value.substr(10, 2)) +
          "-" +
          Number(value.substr(12, 2))
        ).replace(/-/g, "/"),
        d = new Date(sBirthday);
      if (
        sBirthday !=
        d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate()
      ) {
        callback(new Error("证件的出生日期非法"));
      }

      // 身份证号码校验
      var sum = 0,
        weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
        codes = "10X98765432";
      for (var i = 0; i < value.length - 1; i++) {
        sum += value[i] * weights[i];
      }
      var last = codes[sum % 11]; //计算出来的最后一位身份证号码
      if (value[value.length - 1] != last) {
        callback(new Error("你输入的证件号码非法"));
      }
      callback();
    };

    const VisitorPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入手机号"));
      } else {
        const reg = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/;
        if (value.length >= 11 && reg.test(value)) {
          callback();
        } else {
          return callback(new Error("请输入正确的手机号"));
        }
      }
    };

    const VisitorName = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入姓名"));
      } else {
        const reg = /^(?:[\u4e00-\u9fa5·]{2,16})$/;
        if (value.length >= 2 && reg.test(value)) {
          callback();
        } else {
          return callback(new Error("请输入正确的姓名"));
        }
      }
    };

    /* const VisitorAddress = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入住址"));
      } else {
        callback();
      }
    }; */

    const VisitorPlate = (rule, value, callback) => {
      const reg = /^(?:[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领 A-Z]{1}[A-HJ-NP-Z]{1}(?:(?:[0-9]{5}[DF])|(?:[DF](?:[A-HJ-NP-Z0-9])[0-9]{4})))|(?:[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领 A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9 挂学警港澳]{1})$/;
      if (reg.test(value)) {
        callback();
      } else if (!value) {
        callback();
      } else {
        return callback(new Error("请输入正确车牌号"));
      }
    };
    return {
      queryMap: {
        pageNum: 1,
        pageSize: 6,
        partId: "",
        interName: "",
        interSex: ""
      },
      total: 0,
      interList: [],
      dialogTableVisible: false,
      active: 1,
      imgSrc: "",
      visible: false, //弹窗
      loading: false, //上传按钮加载
      open: false, //控制摄像头开关
      thisVideo: null,
      thisContext: null,
      thisCancas: null,
      videoWidth: 500,
      videoHeight: 400,
      type: [],
      resource: "",
      desc: "",
      selectedOptions: [],
      departments: [],
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
      addform: {
        valueProvince: "",
        valueCity: "",
        valueOrigin: "",
        province: "",
        city: "",
        origin: ""
      },
      interForm: {
        partName: "",
        interId: "",
        interName: "",
        interPhone: ""
      },
      rules: {
        visitorCnumber: [
          { required: true, validator: idCard, trigger: "blur" }
        ],

        visitorName: [
          { required: true, validator: VisitorName, trigger: "blur" }
        ],
        visitorSex: [
          { required: true, message: "请选择性别", trigger: "change" }
        ],
        visitorPhone: [
          { required: true, validator: VisitorPhone, trigger: "blur" }
        ],
        visitorPlate: [
          { required: false, validator: VisitorPlate, trigger: "blur" }
        ],
        /* visitorAddress: [
          { required: true, validator: VisitorAddress, trigger: "blur" }
        ], */
        /* valueProvince: [
          { required: true, message: "请输入省份", trigger: "change" }
        ],
        valueCity: [
          { required: true, message: "请输入城市", trigger: "change" }
        ],
        valueOrigin: [
          { required: true, message: "请输入区县", trigger: "change" }
        ], */
        visitorCtype: [
          { required: true, message: "请选择证件类型", trigger: "change" }
        ],
        visitorReason: [
          { required: true, message: "请选择访问原因", trigger: "change" }
        ]
      },
      provinceList: [], // 省列表
      cityList: [], // 市列表
      originList: [], // 区列表
      cityOptions: [], // 市下拉框数据
      originOptions: [], // 区下拉框数据
      nationList: []
    };
  },
  methods: {
    choose() {
      this.dialogTableVisible = true;
    },
	//选择民族
    changeNation(val) {
      this.nationList.forEach((nation, index) => {
        if (val.toString() === this.nationList[index].value) {
          this.form.visitorNation = this.nationList[index].label;
        }
      });
    },
    // 选择省
    changeProvince(val) {
      this.provinceList.forEach((province, index) => {
        if (val.toString() === this.provinceList[index].value) {
          this.cityOptions = this.provinceList[index].children;
          this.addform.valueCity = this.provinceList[index].children[0].value; //设置市的值
          this.addform.city = this.provinceList[index].children[0].label;

          this.addform.valueOrigin = this.provinceList[
            index
          ].children[0].children[0].value; //设置县的值
          this.addform.origin = this.provinceList[
            index
          ].children[0].children[0].label;

          this.originOptions = this.provinceList[index].children[0].children;
          //set value
          this.addform.province = this.provinceList[index].label;
        }
      });
    },
    // 选择市
    changeCity(val) {
      this.cityList.forEach((city, index) => {
        if (val.toString() === this.cityList[index].value) {
          this.originOptions = this.cityList[index].children;
          this.addform.valueOrigin = this.cityList[index].children[0].value; //设置县的值;
          //set value
          this.addform.city = this.cityList[index].label;
        }
      });
    },
    // 选择区
    changeOrigin(val) {
      this.addform.valueOrigin = val;

      this.originList.forEach((origin, index) => {
        if (val.toString() === this.originList[index].value) {
          //set value
          this.addform.origin = this.originList[index].label;
        }
      });
      //添加this.$forceUpdate();进行强制渲染，效果实现。搜索资料得出结果：因为数据层次太多，render函数没有自动更新，需手动强制刷新。
      this.$forceUpdate();
    },
    //根据身份证判断年龄和性别
    getName(iden) {
      let val = iden.length;
      // let sex = null;
      /* let birth = null; */
      let myDate = new Date();
      let month = myDate.getMonth() + 1;
      let day = myDate.getDate();
      let age = 0;
      if (val === 18) {
        age = myDate.getFullYear() - iden.substring(6, 10) - 1;
        // sex = iden.slice(16, 17);
        if (
          iden.substring(10, 12) < month ||
          (iden.substring(10, 12) == month && iden.substring(12, 14) <= day)
        )
          age++;
        /* if (sex % 2 == 0) {
          this.form.visitorSex = 1;
        } else {
          this.form.visitorSex = 0;
        } */
      }
      if (val === 15) {
        age = myDate.getFullYear() - iden.substring(6, 8) - 1901;
        // sex = iden.slice(14, 15);
        if (
          iden.substring(8, 10) < month ||
          (iden.substring(8, 10) == month && iden.substring(10, 12) <= day)
        )
          age++;
        /* if (sex % 2 == 0) {
          this.form.visitorSex = 1;
        } else {
          this.form.visitorSex = 0;
        } */
      }
      this.form.visitorAge = age;
    },
    //重置表单
    reset() {
      this.form = {
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
      };
      this.addform = {
        valueProvince: "",
        valueCity: "",
        valueOrigin: "",
        province: "",
        city: "",
        origin: ""
      };
      this.interForm = {
        partName: "",
        interId: "",
        interName: "",
        interPhone: ""
      };
    },
    //获取部门列表
    async getDepartmets() {
      const { data: res } = await this.$http.get("part/findAll");
      if (res.code !== 200) return this.$message.error("获取部门列表失败");
      console.log(res);
      this.departments = res.data;
    },
    //all 查找
    searchUser() {
      this.queryMap.pageNum = 1;
      this.getinterList();
    },
    //查找内部人员 赋值给表单
    handleEdit: function(index, row) {
      this.interForm = Object.assign({}, row);
      this.dialogTableVisible = false;
    },
    async getinterList() {
      const { data: res } = await this.$http.get("Inter/listData", {
        params: this.queryMap
      });
      if (res.code !== 200) return this.$message.error("获取用户列表失败");
      this.total = res.data.total;
      this.interList = res.data.rows;
    },
    next() {
      if (this.active++ > 2) this.active = 1;
    },
    //提交访客信息
    async submitForm() {
      this.form.visitorAddress =
        this.addform.province +
        "/" +
        this.addform.city +
        "/" +
        this.addform.origin;
      this.form.partName = this.interForm.partName;
      this.form.interName = this.interForm.interName;
      this.form.interPhone = this.interForm.interPhone;
      this.form.interId = this.interForm.interId;
      const { data: res } = await this.$http.post("visitor/regist", this.form);
      if (res.code !== 200) {
        return this.$message.error(res.msg);
      } else {
        this.$message.success("登记成功");
        this.$router.push("/welcome");
      }
    },
    //加载部门列表
    async getDepartments() {
      const { data: res } = await this.$http.get("part/findAll");
      if (res.code !== 200) return this.$message.error("获取部门列表失败");
      this.partList = res.data;
    },
    onTake() {
      this.visible = true;
      this.getCompetence();
    },
    onCancel() {
      this.visible = false;
      this.resetCanvas();
      this.stopNavigator();
    },
    //base64转成文件后上传
    async onUpload() {
      if (this.imgSrc) {
        const file = this.imgSrc; // 把整个base64给file
        const time = new Date().valueOf(); //生成时间戳
        const name = time + ".png"; // 定义文件名字（例如：abc.png ， cover.png）
        const conversions = this.dataURLtoFile(file, name); // 调用base64转图片方法
        const data = new FormData();
        data.append("file", conversions);

        const { data: res } = await this.instance.post("upload/image", data);

        if (res.code !== 200) return this.$message.error("上传失败");
        this.$message.success("上传成功");
        this.form.visitorPhoto = res.data;
      }
    },
    // 调用摄像头权限
    getCompetence() {
      //必须在model中render后才可获取到dom节点,直接获取无法获取到model中的dom节点
      this.$nextTick(() => {
        const _this = this;
        this.open = false; //切换成关闭摄像头
        this.thisCancas = document.getElementById("canvasCamera");
        this.thisContext = this.thisCancas.getContext("2d");
        this.thisVideo = document.getElementById("videoCamera");
        // 旧版本浏览器可能根本不支持mediaDevices，我们首先设置一个空对象
        if (navigator.mediaDevices === undefined) {
          navigator.mediaDevices = {};
        }
        // 一些浏览器实现了部分mediaDevices，我们不能只分配一个对象
        // 使用getUserMedia，因为它会覆盖现有的属性。
        // 这里，如果缺少getUserMedia属性，就添加它。
        if (navigator.mediaDevices.getUserMedia === undefined) {
          navigator.mediaDevices.getUserMedia = function(constraints) {
            // 首先获取现存的getUserMedia(如果存在)
            let getUserMedia =
              navigator.webkitGetUserMedia ||
              navigator.mozGetUserMedia ||
              navigator.getUserMedia;
            // 有些浏览器不支持，会返回错误信息
            // 保持接口一致
            if (!getUserMedia) {
              return Promise.reject(
                new Error("getUserMedia is not implemented in this browser")
              );
            }
            // 否则，使用Promise将调用包装到旧的navigator.getUserMedia
            return new Promise(function(resolve, reject) {
              getUserMedia.call(navigator, constraints, resolve, reject);
            });
          };
        }
        const constraints = {
          audio: false,
          video: {
            width: _this.videoWidth,
            height: _this.videoHeight,
            transform: "scaleX(-1)"
          }
        };
        navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
          // 旧的浏览器可能没有srcObject
          if ("srcObject" in _this.thisVideo) {
            _this.thisVideo.srcObject = stream;
          } else {
            // 避免在新的浏览器中使用它，因为它正在被弃用。
            _this.thisVideo.src = window.URL.createObjectURL(stream);
          }
        });
      });
    },
    //绘制图片
    drawImage() {
      // 点击，canvas画图
      this.thisContext.drawImage(
        this.thisVideo,
        0,
        0,
        this.videoWidth,
        this.videoHeight
      );
      // 获取图片base64链接
      this.imgSrc = this.thisCancas.toDataURL("image/png");
    },
    //base64转文件
    dataURLtoFile(dataurl, filename) {
      let arr = dataurl.split(",");
      let mime = arr[0].match(/:(.*?);/)[1];
      let bstr = atob(arr[1]);
      let n = bstr.length;
      let u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    },
    //清空画布
    clearCanvas(id) {
      let c = document.getElementById(id);
      let cxt = c.getContext("2d");
      cxt.clearRect(0, 0, c.width, c.height);
    },
    //重置画布
    resetCanvas() {
      this.imgSrc = "";
      this.clearCanvas("canvasCamera");
    },
    //关闭摄像头
    stopNavigator() {
      if (this.thisVideo && this.thisVideo !== null) {
        this.thisVideo.srcObject.getTracks()[0].stop();
        this.open = true; //切换成打开摄像头
      }
    },
    _getJsonData() {
      this.$http.get("/json/provinces.json").then(res => {
        this.provinceList = [];
        this.cityList = [];
        this.originList = [];
        res.data.forEach(item => {
          if (item.value.match(/0000$/)) {
            this.provinceList.push({
              value: item.value,
              label: item.name,
              children: []
            });
          } else if (item.value.match(/00$/)) {
            this.cityList.push({
              value: item.value,
              label: item.name,
              children: []
            });
          } else {
            this.originList.push({
              value: item.value,
              label: item.name
            });
          }
        });
        for (let index in this.provinceList) {
          for (let index1 in this.cityList) {
            if (
              this.provinceList[index].value.slice(0, 2) ===
              this.cityList[index1].value.slice(0, 2)
            ) {
              this.provinceList[index].children.push(this.cityList[index1]);
            }
          }
        }
        for (let item1 in this.cityList) {
          for (let item2 in this.originList) {
            if (
              this.originList[item2].value.slice(0, 4) ===
              this.cityList[item1].value.slice(0, 4)
            ) {
              this.cityList[item1].children.push(this.originList[item2]);
            }
          }
        }
      });
    },
    _getNationJsonData() {
      this.$http.get("/json/nation.json").then(res => {
        this.nationList = [];
        res.data.forEach(item => {
          this.nationList.push({
            value: item.name,
            label: item.name
          });
        });
      });
    },
    /**
     * 翻页
     */
    handleCurrentChange(current) {
      this.queryMap.pageNum = current;
      this.getinterList();
    },
    beforeDestroy() {
      this.stopNavigator();
    }
  },
  created() {
    this.getDepartmets();
    this.getinterList();
    this._getJsonData();
    this._getNationJsonData();
  }
};
</script>
<style lang="less">
p {
  font-size: large;
}
#welcome {
  margin: 0px;
  padding: 0px;
}
#register .box {
  display: flex;
  justify-content: space-between;
}
#register .bu_possition {
  margin-left: 81px;
}
#register .canvas {
  border: 1px solid #e8e8e8;
}
#register .test {
  margin-left: 40px;
  text-align: right;
  vertical-align: middle;
  float: left;
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 0;
  box-sizing: border-box;
}
#register .posi {
  position: relative;
  display: flex;
  justify-content: center;
}
#register .el-card__body {
  padding: 10px;
}
#register .el-steps .el-steps--horizontal {
  margin-bottom: 5px;
}
</style>
