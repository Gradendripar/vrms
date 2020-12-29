<template>
    <div id="appointment">
        <el-breadcrumb
                separator="/"
                style="padding-left:10px;padding-bottom:10px;font-size:16px;"
        >
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>访客管理</el-breadcrumb-item>
            <el-breadcrumb-item>预约管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-form
                    :inline="true"
                    ref="queryMap"
                    :model="queryMap"
                    label-width="80px"
                    size="small"
            >
                <el-form-item label="身份证">
                    <el-input
                            clearable
                            v-model="queryMap.orderCnumber"
                            placeholder="请输入身份证号码查询"
                    ></el-input>
                </el-form-item>
                <el-form-item label="开始时间">
                    <el-date-picker
                            clearable
                            v-model="queryMap.startTime"
                            type="datetime"
                            value-format="yyyy-MM-dd HH-mm-ss"
                            format="yyyy-MM-dd HH-mm-ss"
                            placeholder="请选择查询开始日期时间"
                            style="width: auto;"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间">
                    <el-date-picker
                            clearable
                            value-format="yyyy-MM-dd HH-mm-ss"
                            format="yyyy-MM-dd HH-mm-ss"
                            v-model="queryMap.endTime"
                            type="datetime"
                            placeholder="请选择查询结束日期时间"
                            style="width: auto;"
                    >
                    </el-date-picker>
                </el-form-item>

                <el-form-item style="margin-left:50px;position: relative;left:5%;">
                    <el-button @click="reset" icon="el-icon-refresh">重置</el-button>
                    <el-button type="primary" @click="searchUser" icon="el-icon-search"
                    >查询
                    </el-button
                    >
                    <el-button
                            @click="downExcel"
                            v-hasPermission="'inter:export'"
                            icon="el-icon-download"
                    >导出
                    </el-button
                    >
                </el-form-item>
            </el-form>

            <!-- 表格区域 -->
            <el-table
                    id="interTable"
                    v-loading="loading"
                    size="small"
                    :data="AppointmentList"
                    border
                    style="width: 100%;"
                    height="460"
                    :header-cell-style="{ 'text-align': 'center' }"
                    :cell-style="{ 'text-align': 'center' }"
            >
                <el-table-column label="ID" prop="orderId" width="80"></el-table-column>
                <el-table-column
                        prop="orderName"
                        label="姓名"
                        width="120"
                ></el-table-column>
                <el-table-column
                        prop="orderCnumber"
                        label="证件号码"
                        width="180"
                ></el-table-column>
                <el-table-column
                        prop="orderCtype"
                        label="证件类型"
                        width="120"
                ></el-table-column>
                <el-table-column
                        prop="orderPhone"
                        label="电话"
                        width="120"
                ></el-table-column>
                <el-table-column
                        prop="orderEmail"
                        label="邮箱"
                        width="120"
                ></el-table-column>
                <el-table-column
                        prop="orderVisittime"
                        label="访问时间"
                        width="120"
                        sortable
                ></el-table-column>
                <el-table-column
                        prop="orderCreatetime"
                        label="访问创建时间"
                        width="120"
                ></el-table-column>
                <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <el-tooltip
                                class="item"
                                effect="dark"
                                content="同意"
                                placement="top"
                                :enterable="false">
                            <el-button
                                    @click="agree(scope.row.orderId)"
                                    v-hasPermission="'order:pass'"
                                    type="primary"
                                    icon="el-icon-edit"
                                    size="small"
                            ></el-button>
                        </el-tooltip>
                        <el-tooltip
                                class="item"
                                effect="dark"
                                content="不同意"
                                placement="top"
                                :enterable="false">
                            <el-button
                                    v-hasPermission="'order:reject'"
                                    @click="del(scope.row.orderId)"
                                    type="danger"
                                    icon="el-icon-delete"
                                    size="small"
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
                    :page-sizes="[7, 15, 20, 30]"
                    :page-size="queryMap.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
            ></el-pagination>
        </el-card>
    </div>
</template>

<script>
    import FileSaver from "file-saver";
    import XLSX from "xlsx";

    export default {
        data() {
            return {
                btnLoading: false,
                btnDisabled: false,
                departments: [],
                AppointmentList: [],
                loading: true,
                total: 0,
                queryMap: {
                    pageNum: 1,
                    pageSize: 7,
                    orderCnumber: "",
                    startTime: "",
                    endTime: ""
                }
            };
        },
        methods: {
            reset() {
                this.queryMap = {
                    pageNum: 1,
                    pageSize: 7,
                    orderCnumber: "",
                    startTime: "",
                    endTime: ""
                };
            },
            /**
             * 加载用户表格
             */
            downExcel() {
                var wb = XLSX.utils.table_to_book(document.querySelector("#interTable")); //mytable为表格的i
                var wbout = XLSX.write(wb, {
                    bookType: "xlsx",
                    bookSST: true,
                    type: "array"
                });
                try {
                    FileSaver.saveAs(
                        new Blob([wbout], {type: "application/octet-stream"}),
                        "预约表.xlsx"
                    );
                } catch (e) {
                    if (typeof console !== "undefined") console.log(e, wbout);
                }
                return wbout;
            },
            //查找访客预约信息
            async getAppointmentList() {
                const {data: res} = await this.$http.get("order/orderList", {
                    params: this.queryMap
                });
                if (res.code !== 200) return this.$message.error("获取预约人员列表失败");
                this.total = res.data.total;
                this.AppointmentList = res.data.rows;
            },
            //同意申请
            /* async agree(orderId) {}, */
            //不同意用户申请
            async agree(orderId) {
                const {data: res} = await this.$http.post("Mail/" + orderId + "/post");
                console.log(res);
                if (res.code == 200) {
                    this.$notify.success({
                        title: "操作成功",
                        message: "访客预约信息发送成功"
                    });
                    this.getAppointmentList();
                } else {
                    this.$message.error(res.msg);
                }
            },
            async del(orderId) {
                var res = await this.$confirm(
                    "此操作将拒绝该用户预约, 是否继续?",
                    "提示",
                    {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    }
                ).catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消拒绝"
                    });
                });
                if (res == "confirm") {
                    const {data: res} = await this.$http.post(
                        "Mail/" + orderId + "/reject"
                    );
                    console.log(res);
                    if (res.code == 200) {
                        this.$notify.success({
                            title: "操作成功",
                            message: "用户预约请求拒绝成功"
                        });
                        this.getAppointmentList();
                    } else {
                        this.$message.error(res.msg);
                    }
                }
            },
            //搜索访客预约信息
            searchUser() {
                this.queryMap.pageNum = 1;
                this.getAppointmentList();
            },
            handleSizeChange(newSize) {
                this.queryMap.pageSize = newSize;
                this.getAppointmentList();
            },
            /**
             * 翻页
             */
            handleCurrentChange(current) {
                this.queryMap.pageNum = current;
                this.getAppointmentList();
            }
        },
        created() {
            this.getAppointmentList();
            setTimeout(() => {
                this.loading = false;
            }, 500);
        }
    };
</script>

<style lang="less"></style>
