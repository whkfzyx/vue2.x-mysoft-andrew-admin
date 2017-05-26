<template>
    <div class="app-container calendar-list-container">
        <!--归还-->
        <div class="return-box">
            <el-form :model="form" :rules="rules" ref="returnForm"
                     label-position="right" label-width="200px">
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="固定资产编号 或 流水号" prop="returnId">
                            <el-input v-model="form.returnId"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4" :offset="1">
                        <el-button style="width:90px;" type="primary" @click="handleReturn('returnForm')">归 还
                        </el-button>
                    </el-col>
                </el-row>
            </el-form>
        </div>

        <!--催还列表-->
        <el-row>
            <el-col><h4>催还列表</h4></el-col>
        </el-row>
        <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row
                  style="width: 100%">
            <el-table-column align="center" label="应还日期">
                <template scope="scope">
                    <span>{{new Date((parseInt(scope.row.return_time) * 1000)) | parseTime('{y}-{m}-{d}')}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="">
                <template scope="scope">
                    <div v-if="scope.row.good_img"><img :src="scope.row.good_img" :alt="scope.row.good_name"
                                                        style="width:40px;height:auto;"></div>
                </template>
            </el-table-column>

            <el-table-column align="center" label="物品" prop="good_name"></el-table-column>

            <el-table-column align="center" label="流水号" prop="order_no"></el-table-column>

            <el-table-column align="center" label="固定资产编号" prop="asset_sn"></el-table-column>

            <el-table-column align="center" label="物品隶属" prop="good_department"></el-table-column>

            <el-table-column align="center" label="借用者" prop="user_name"></el-table-column>

            <el-table-column align="center" label="借用者电话" prop="user_phone"></el-table-column>

            <el-table-column align="center" label="借用者Email" prop="user_email"></el-table-column>
        </el-table>

        <!--pagination-->
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page="listQuery.page" :page-sizes="[10,20,30, 50]"
                           :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import {returnFixedAsset, getShouldReturnList} from 'api/returnManagement';
    import {parseTime, objectMerge} from 'utils';

    export default {
        name: 'returnManagement',
        data() {
            return {
                list: [],
                total: null,
                listLoading: true,
                listQuery: {
                    page: 1,
                    pageSize: 20,
                    department: '',
                    type: '',
                },
                form: {
                    returnId: '',
                },
                tableKey: 0,
                rules: {
                    returnId: [
                        {required: true, message: '请输入固定资产编号 或 流水号', trigger: 'blur'}
                    ],
                },
            }
        },
        created() {
            this.getList();
        },
        filters: {},
        methods: {
            departmentFilter(key) {
                return this.$store.state.user.enumValues.departments[key]
            },
            getList() {
                this.listLoading = true;
                getShouldReturnList(this.listQuery).then(response => {
                    this.list = response.data.list;
                    this.total = parseInt(response.data.count);
                    this.listLoading = false;
                })
            },
            handleReturn(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        returnFixedAsset(this.form.returnId).then(response => {
                            this.$notify({
                                title: '成功',
                                message: '归还成功',
                                type: 'success'
                            });
                            this.getList();
                            this.$refs[formName].resetFields();
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            handleSizeChange(val) {
                this.listQuery.pageSize = val;
                this.getList();
            },
            handleCurrentChange(val) {
                this.listQuery.page = val;
                this.getList();
            },
            handleDownload() {
                require.ensure([], () => {
                    const {export_json_to_excel} = require('vendor/Export2Excel');
                    const tHeader = ['时间', '地区', '类型', '标题', '重要性'];
                    const filterVal = ['timestamp', 'province', 'type', 'title', 'importance'];
                    const data = this.formatJson(filterVal, this.list);
                    export_json_to_excel(tHeader, data, 'table数据');
                })
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => {
                    if (j === 'timestamp') {
                        return parseTime(v[j])
                    } else {
                        return v[j]
                    }
                }))
            },
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .return-box {
    }
</style>
