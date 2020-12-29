<template>
  <div id="welcome">
    <el-breadcrumb
      separator="/"
      style="padding-left:10px;padding-bottom:10px;font-size:16px;"
    >
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>欢迎</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row :gutter="15">
      <!-- 左边部分-->
      <el-col :span="13">
        <el-card class="box-card" style="margin: 10px 10px 10px 10px;">
          <div slot="header" class="clearfix">
            <span>用户信息</span>
          </div>
          <el-avatar
            shape="square"
            :size="90"
            :src="userInfo.avater"
            style="float:left;"
            :key="1"
          ></el-avatar>
          <div class="right" style="float:right;width:520px;">
            <el-table :data="tableInfo" border height="120">
              <el-table-column prop="userName" label="姓名"></el-table-column>
              <el-table-column prop="name" label="用户账号"></el-table-column>
              <el-table-column
                prop="partName"
                label="所属部门"
              ></el-table-column>
              <el-table-column
                fixed="right"
                prop="roleName"
                label="用户角色"
                width="150"
              ></el-table-column>
            </el-table>
          </div>
        </el-card>
        <el-card style="margin: 10px 10px 10px 10px;"
          ><div
            id="echartdemo"
            style="width: 520px;height:330px;left: 50px;top: 20px;"
          ></div
        ></el-card>
      </el-col>
      <el-col :span="11" style="margin: 10px 0px 10px 0px;">
        <keep-alive>
          <el-carousel :height="height + 'px'">
            <el-carousel-item v-for="item in img" :key="item.value">
              <img
                :src="item.src"
                ref="bannerHeight"
                alt=""
                @load="imgLoad"
                style="width: 100%"
              />
            </el-carousel-item>
          </el-carousel>
        </keep-alive>
        <el-card style="height: 370px;margin-top: 10px;">
          <el-table
            :data="tableData"
            style="width: 100%"
            height="370px"
            :default-sort="{ prop: 'date', order: 'descending' }"
          >
            <el-table-column
              prop="orderVisittime"
              label="日期"
              width="220px"
              sortable
            >
            </el-table-column>
            <el-table-column prop="orderName" label="姓名" width="120px">
            </el-table-column>
            <el-table-column prop="orderPhone" label="预约电话">
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import echarts from "echarts";
/* import Qs from "qs"; */
export default {
  data() {
    return {
      x1Data: [],
      x2Data: [],
      y1Data: [],
      y2Data: [],
      userInfo: {},
      tableInfo: [],
      tableData: [],
      total: "",
      queryMap: {
        pageNum: 1,
        pageSize: 1000
      },
      bannerHeight: "",
      height: 200,
      img: [
        {
          src: require("../../assets/7.jpg")
        },
        {
          src: require("../../assets/8.jpg")
        },
        {
          src: require("../../assets/9.jpg")
        }
      ]
    };
  },
  mounted: function() {
    this.imgLoad();
    window.addEventListener(
      "resize",
      () => {
        this.bannerHeight = this.$refs.bannerHeight[0].height;
        this.imgLoad();
      },
      false
    );
    this.draw();
    this.loginReport();
  },
  methods: {
    imgLoad() {
      this.$nextTick(() => {
        this.bannerHeight = this.$refs.bannerHeight[0].height;
      });
    },
    //请求今天来访
    async todayList() {
      const { data: res } = await this.$http.get("order/TodayList", {
        params: this.queryMap
      });
      if (res.code !== 200) return this.$message.error("获取今日预约访客失败");
      this.total = res.data.total;
      this.tableData = res.data.rows;
      return this.$message.success("获取今日预约访客成功");
    },
    async loginReport() {
      const { data: res } = await this.$http.post("visitor/VisitorReport");
      if (res.code !== 200) {
        return this.$message.error("获取访客表单失败：" + res.msg);
      } else {
        var $this = this;
        this.x1Data = [];
        this.y1Data = [];
        this.x2Data = [];
        this.y2Data = [];
        res.data.enter.forEach(e1 => {
          $this.x1Data.push(e1.days);
          $this.y1Data.push(e1.count);
        });
        res.data.leave.forEach(e2 => {
          $this.x2Data.push(e2.days);
          $this.y2Data.push(e2.count);
        });
      }
      this.draw();
    },
    //画图
    draw() {
      var myChart = echarts.init(document.getElementById("echartdemo"));
      var option = {
        title: {
          text: "访客登记信息"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["进入", "离去"]
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "bar", "stack", "tiled"] },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        xAxis: [
          {
            type: "category",
            data: this.x2Data
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "进入",
            type: "line",
            smooth: true,
            itemStyle: { normal: { areaStyle: { type: "default" } } },
            data: this.y1Data
          },
          {
            name: "离去",
            type: "line",
            smooth: true,
            itemStyle: { normal: { areaStyle: { type: "default" } } },
            data: this.y2Data
          }
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    }
  },
  created() {
    this.todayList();
    this.userInfo = this.$store.state.userInfo;
    var roles = this.userInfo.isAdmin ? "超级管理员" : this.userInfo.roles;
    this.tableInfo.push({
      userName: this.userInfo.userName,
      name: this.userInfo.name,
      partName: this.userInfo.department,
      roleName: roles
    });
  },
  destroyed() {
    window.removeEventListener("resize", this.imgLoad, false);
  }
};
</script>

<style lang="less"></style>
