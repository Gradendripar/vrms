<template>
  <div id="chart">
    <el-breadcrumb
      separator="/"
      style="padding-left:10px;padding-bottom:10px;font-size:16px;"
    >
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>访客管理</el-breadcrumb-item>
      <el-breadcrumb-item>访客统计</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row :gutter="16">
      <el-col :span="23">
        <div style="position: relative;left: 40px;">
          <el-form
            :inline="true"
            ref="queryMap"
            :model="queryMap"
            label-width="70px"
            size="small"
          >
            <el-form-item label="开始时间">
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
              style="position: relative;left: 100px; margin-right: 240px;"
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
            <el-form-item style="margin-left:20px;">
              <el-button @click="reset" icon="el-icon-refresh">重置</el-button>
              <el-button
                type="primary"
                @click="searchVisitor"
                icon="el-icon-search"
                >查询</el-button
              >
              <el-button
                type="success"
                @click="downExcel"
                v-hasPermission="'statistics:update'"
                icon="el-icon-download"
                >下载</el-button
              >
            </el-form-item>
          </el-form>
        </div>
        <el-card style="margin-left: 40px;position: relative;"
          ><div
            id="echartdemo"
            style="height: 460px;position: relative;margin-top: 30px;"
          ></div
        ></el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import echarts from "echarts";
import axios from "axios";
export default {
  data() {
    return {
      queryMap: {
        startTime: "",
        endTime: ""
      },
      bannerHeight: "",
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
  methods: {
    downExcel() {
      var $this = this;
      let res = axios
        .request({
          url: "/statistics/export",
          method: "post",
          responseType: "blob"
        })
        .then(res => {
          if (res.headers["content-type"] === "application/json") {
            return $this.$message.error(
              "Subject does not have permission [statistics:export]"
            );
          }
          const data = res.data;
          let url = window.URL.createObjectURL(data);
          // 将二进制文件转化为可访问德url
          var a = document.createElement("a");
          document.body.appendChild(a);
          a.href = url;
          a.download = "访客信息统计表.xls";
          a.click();
          window.URL.revokeObjectURL(url);
        });
    },
    reset() {
      this.queryMap = {
        startTime: "",
        endTime: ""
      };
    },
    searchVisitor() {
      this.draw();
    },
    //画图
    async draw() {
      const { data: res } = await this.$http.get("statistics//getAll", {
        params: this.queryMap
      });
      if (res.code !== 200) {
        return this.$message.error("获取访客数据失败");
      } else {
        var $this = this;
        (this.names = []),
          (this.brower = []),
          res.data.forEach(function(item) {
            $this.names.push(item.name);
            $this.brower.push({
              name: item.name,
              value: item.value
            });
          });
      }
      var myChart = echarts.init(document.getElementById("echartdemo"));
      var option = {
        title: {
          text: "访客信息统计",
          x: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          x: "left",
          data: this.names
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: {
              show: true,
              type: ["pie", "funnel"],
              option: {
                funnel: {
                  x: "5%",
                  width: "50%",
                  funnelAlign: "left",
                  max: 1548
                }
              }
            },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        series: [
          {
            name: "访课数据",
            type: "pie",
            radius: "45%",
            center: ["30%", "50%"],
            data: this.brower
          }
        ]
      };
      //======饼图数据1=====
      var pieSeries1 = {
        name: "访客数据",
        type: "pie",
        radius: "45%",
        center: ["65%", "50%"],
        roseType: "area", //zxj玫瑰饼图//位置确定：左下角
        data: this.brower
      };

      option.series.push(pieSeries1);

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option, false);
    }
  },
  mounted() {
    this.draw();
  }
};
</script>

<style lang="less"></style>
