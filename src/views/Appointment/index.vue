<template>
  <el-container class="app-container">
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
    </el-header>
    <el-main style="height: 656px;">
      <el-row :gutter="16">
        <el-col :span="8">
          <el-card shadow="always" style="margin: 8px;">
            <el-form
              :model="ruleForm"
              :rules="rules"
              ref="ruleForm"
              label-width="100px"
              class="demo-ruleForm"
            >
              <el-form-item label="姓名" prop="orderName">
                <el-input v-model="ruleForm.orderName"></el-input>
              </el-form-item>
              <el-form-item label="身份证号码" prop="orderCnumber">
                <el-input v-model="ruleForm.orderCnumber"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="orderEmail">
                <el-input v-model="ruleForm.orderEmail"></el-input>
              </el-form-item>
              <el-form-item label="手机号" prop="orderPhone">
                <el-input v-model="ruleForm.orderPhone"></el-input>
              </el-form-item>
              <el-form-item label="访问时间" required prop="orderVisittime">
                <el-col :span="11">
                  <el-form-item>
                    <el-date-picker
                      type="datetime"
                      placeholder="选择时间"
                      v-model="ruleForm.orderVisittime"
                      value-format="yyyy-MM-dd HH-mm-ss"
                      format="yyyy-MM-dd HH-mm-ss"
                      style="width: 100%;"
                      :picker-options="pickerOptions0"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-form-item>
              <el-form-item label="被访人姓名" prop="orderInter">
                <el-input v-model="ruleForm.orderInter"></el-input>
              </el-form-item>
              <el-form-item label="部门">
                <el-select
                  clearable
                  v-model="ruleForm.orderPart"
                  placeholder="请选择被访人部门"
                  ><el-option
                    v-for="partment in partList"
                    :label="partment.partName"
                    :key="partment.partId"
                    :value="partment.partId"
                    ><span style="float: left">{{
                      partment.partName
                    }}</span></el-option
                  >
                </el-select>
              </el-form-item>
              <el-form-item label="访问目的">
                <el-input
                  type="textarea"
                  v-model="ruleForm.orderReason"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')"
                  >提交</el-button
                >
                <el-button @click="resetForm('ruleForm')">重置</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
        <el-col :span="16">
          <el-card style="margin: 8px;">
            <el-collapse v-model="activeNames" @change="handleChange" accordion>
              <el-collapse-item title="预约须知" name="1">
                <div>
                  一：凡进入我司辖属各单位检查、考核、评估、参观、交流的访客请认
                  真阅读，认可其要求并签字确认；
                </div>
                <div>
                  二：在您检查、考核、评估、参观、交流的过程中必须由我司人员陪同；
                </div>
              </el-collapse-item>
              <el-collapse-item title="访问须知" name="2">
                <div>
                  一：在我司辖属各单位请严格遵守安全警示标志和我司的安全要求，严
                  禁随意跨越警戒警示线；
                </div>
                <div>
                  二：在您检查、考核、评估、参观、交流的过程中必须由我司人员陪同
                </div>
              </el-collapse-item>
              <el-collapse-item title="车辆管理" name="3">
                <div>
                  一：申请来访预约的车辆必须是公务车辆，禁止私人用途使用“车辆来访预约”功能；
                </div>
                <div>
                  二：各单位使用“车辆来访预约”功能须指定专人负责，禁止随意让他人使用此项功能；
                </div>
              </el-collapse-item>
              <el-collapse-item title="人员管理" name="4">
                <div>
                  一：外来人员不得进入生产区，业务需要，进入生产区需有本公司安排
                  人员陪同；
                </div>
                <div>
                  二：承办部门需邀请参访人员进入非接待区以外地方，需经企管部备
                  案；
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-card>
          <el-card class="box-card" style="margin: 10px 8px 0px 8px;">
            <!-- 用户登入报表 -->
            <el-col :span="13">
              <div id="echartsdemo" style="width: 350px;height:278px;"></div>
            </el-col>
            <el-col :span="10">
              <el-steps :active="active" finish-status="success">
                <el-step title="预约"></el-step>
                <el-step title="访问"></el-step>
                <el-step title="离开"></el-step>
              </el-steps>
            </el-col>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>
<script>
import echarts from "echarts";
export default {
  name: "echarts",
  data() {
    //预约姓名校验规则
    const validateName = (rule, value, callback) => {
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
    //预约手机号校验规则
    const Phone = (rule, value, callback) => {
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
    const VisitedName = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入被访人姓名"));
      } else {
        const reg = /^(?:[\u4e00-\u9fa5·]{2,16})$/;
        if (value.length >= 2 && reg.test(value)) {
          callback();
        } else {
          return callback(new Error("请输入正确的被访人姓名"));
        }
      }
    };
    //预约身份证校验规则
    var idCard = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("身份证号不能为空"));
      }
      if (!/(^\d{15}$)|(^\d{17}(\d|X|x)$)/.test(value)) {
        callback(new Error("你输入的身份证长度或格式错误"));
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
        callback(new Error("你的身份证地区非法"));
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
        callback(new Error("身份证上的出生日期非法"));
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
        callback(new Error("你输入的身份证号非法"));
      }
      callback();
    };
    return {
      active: 0,
      activeNames: ["1"],
      partList: [],
      ruleForm: {
        orderName: "",
        orderCnumber: "",
        orderEmail: "",
        orderVisittime: "",
        orderPhone: "",
        orderInter: "",
        orderReason: "",
        orderPart: ""
      },
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      rules: {
        orderName: [
          { required: true, validator: validateName, trigger: "blur" }
        ],
        orderEmail: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        orderCnumber: [{ required: true, validator: idCard, trigger: "blur" }],
        orderPhone: [{ required: true, validator: Phone, trigger: "blur" }],
        orderInter: [
          { required: true, validator: VisitedName, trigger: "blur" }
        ],
        orderVisittime: [
          {
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    resetForm(ruleForm) {
      this.$refs[ruleForm].resetFields();
    },
    async submitForm(ruleForm) {
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          this.$http.post("order/add", this.ruleForm).then(res => {
            Promise.resolve(res.data);
            if (res.data.code === 200) {
              this.$message.success("成功");
              this.ruleForm = { brand_right: 0 };
              this.$router.push({ path: "/login" });
            }
            if (res.data.code === 0) {
              /* this.$router.push({ path: "/login" }); */
              this.$router.push({ path: "/login" });
              this.$message.error(res.data.msg);
            }
          });
        } else {
          this.$message.error("部分表单未填写");
          return false;
        }
      });
    },
    next() {
      if (this.active++ > 2) this.active = 0;
    },
    handleChange(val) {
      console.log(val);
    },
    //加载部门列表
    async getDepartmets() {
      const { data: res } = await this.$http.get("part/findAll");
      if (res.code !== 200) return this.$message.error("获取部门列表失败");
      console.log(res);
      this.partList = res.data;
    },
    //画图
    draw() {
      var myChart = echarts.init(document.getElementById("echartsdemo"));
      // 指定图表的配置项和数据
      var option = {
        title: {
          text: "访客预约"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["预约人数"]
        },
        toolbox: {
          show: true,
          feature: {
            /* mark: { show: true }, */
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "bar", "stack", "tiled"] },
            /* restore: { show: true }, */
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "预约人数",
            type: "line",
            stack: "总量",
            data: [120, 132, 101, 134, 90, 230, 210]
          }
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    }
  },
  mounted() {
    this.draw();
  },
  created() {
    this.getDepartmets();
  }
};
</script>
<style lang="less">
.el-header {
  background-color: #2b579a;
  display: flex;
  color: #fff;
  font-size: 19px;
  padding-left: 0px;
}
.el-main {
  background-color: #eaedf1;
}
.app-container {
  width: 100%;
  height: 100% !important;
}
.el-input--prefix .el-input__inner {
  width: 320px;
}
.el-form-item__content .el-col .el-col-11 {
  padding-left: 8px !important;
}
</style>
