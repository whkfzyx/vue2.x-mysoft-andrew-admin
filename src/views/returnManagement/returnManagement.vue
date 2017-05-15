<template>
    <div class="app-container calendar-list-container">
        <!--归还-->
        <div class="return-box">
            <el-row>
                <el-col :span="6">
                    <el-input placeholder="固定资产编号 或 流水号" v-model="returnId">
                    </el-input>
                </el-col>
                <el-col :span="2" :offset="1">
                    <el-button class="filter-item" type="primary" v-waves @click="handleReturn">归还
                    </el-button>
                </el-col>
            </el-row>
        </div>

        <!--催还列表-->
        <el-row>
            <el-col>催还列表</el-col>
        </el-row>
        <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row
                  style="width: 100%">
            <el-table-column align="center" label="应还日期" style="width:10%;">
                <template scope="scope">
                    <span>{{scope.row.shouldReturnDate | parseTime('{y}-{m}-{d}')}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="" style="width:6%;">
                <template scope="scope">
                    <div><img :src="scope.row.img" :alt="scope.row.name" style="width:40px;height:auto;"></div>
                </template>
            </el-table-column>

            <el-table-column align="center" label="物品" style="width:10%;">
                <template scope="scope">
                    <span>{{scope.row.name}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="物品隶属" style="width:10%;">
                <template scope="scope">
                    <span>{{scope.row.department | departmentFilter}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="借用者" style="width:10%;">
                <template scope="scope">
                    <span>{{scope.row.borrower}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="员工部门" style="width:10%;">
                <template scope="scope">
                    <span></span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="固定资产编号" style="width:10%;">
                <template scope="scope">
                    <span>{{scope.row.assetSn}}</span>
                </template>
            </el-table-column>
        </el-table>

        <!--pagination-->
        <div v-show="!listLoading" class="pagination-container" style="text-align: right;">
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

    const calendarTypeOptions = [
        {key: 'FD', display_name: '经济数据'},
        {key: 'FE', display_name: '财经大事'},
        {key: 'BI', display_name: '国债发行'},
        {key: 'VN', display_name: '假期报告'}
    ];
    const departmentOptions = [
        {key: 'administration', display_name: '行政'},
        {key: 'finance', display_name: '财务'},
        {key: 'it', display_name: 'IT'},
    ];

    export default {
        name: 'returnManagement',
        data() {
            return {
                list: null,
                total: null,
                listLoading: true,
                returnId: '',
                listQuery: {
                    page: 1,
                    pageSize: 20,
                    title: undefined,
                    type: undefined,
                },
                calendarTypeOptions,
                dialogFormVisible: false,
                dialogStatus: '',
                textMap: {
                    update: '编辑',
                    create: '创建'
                },
                tableKey: 0
            }
        },
        created() {
            this.getList();
        },
        filters: {
            typeFilter(type) {
                return calendarTypeKeyValue[type]
            },
            departmentFilter(key){
                return departmentOptions.find(item => item.key === key).display_name
            }
        },
        methods: {
            getList() {
                this.listLoading = true;
                getShouldReturnList(this.listQuery).then(response => {
                    this.list = response.data.list;
                    this.total = response.data.total;
                    this.listLoading = false;
                })
            },
            handleReturn() {
                this.$notify({
                    title: '成功',
                    message: '归还成功',
                    type: 'success'
                });
                setTimeout(() => this.$notify.error({
                    title: '失败',
                    message: '这是失败提示...',
                }), 500);
                this.getList();
            },
            handleSizeChange(val) {
                this.listQuery.pageSize = val;
                this.getList();
            },
            handleCurrentChange(val) {
                this.listQuery.page = val;
                this.getList();
            },
            handleModifyStatus(row, status) {
                this.$message({
                    message: '操作成功',
                    type: 'success'
                });
                row.status = status;
            },
            resetTemp() {
                this.temp = {
                    id: undefined,
                    importance: 0,
                    remark: '',
                    timestamp: 0,
                    title: '',
                    status: 'published',
                    type: ''
                };
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
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .return-box {
        padding: 15px 20px;
        border-radius: 5px;
        margin-bottom: 20px;
        /*border: 1px solid #999;*/
    }
</style>
