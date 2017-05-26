<template>
    <div class="app-container calendar-list-container">
        <!--query form-->
        <div class="filter-container">
            <el-date-picker class="filter-item"
                            v-model="listQuery.dateRange"
                            type="daterange"
                            align="right"
                            placeholder="选择日期范围"
                            :picker-options="pickerOptions">
            </el-date-picker>

            <el-select clearable class="filter-item" v-model="listQuery.department"
                       placeholder="隶属部门">
                <el-option v-for="(item,key) in this.$store.state.user.enumValues.departments" :key="key"
                           :label="item" :value="key">
                </el-option>
            </el-select>

            <el-select clearable class="filter-item" v-model="listQuery.type"
                       placeholder="物品性质">
                <el-option v-for="item in this.$store.state.user.enumValues.categores" :key="item.id"
                           :label="item.name" :value="item.id">
                </el-option>
            </el-select>

            <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">查询</el-button>
            <el-button class="filter-item" type="primary" icon="document" @click="handleDownload">导出</el-button>
        </div>

        <!--list table-->
        <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row
                  style="width: 100%">
            <el-table-column align="center" label="">
                <template scope="scope">
                    <div v-if="scope.row.thumb_img"><img :src="scope.row.thumb_img" :alt="scope.row.name"
                                                         style="width:40px;height:auto;"></div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="物品名称" prop="name"></el-table-column>
            <el-table-column align="center" label="物品性质" prop="categore_name"></el-table-column>
            <el-table-column align="center" label="隶属部门">
                <template scope="scope">
                    <span>{{departmentFilter((scope.row.department).toString())}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="领用数量 or 次数" prop="num_taken">
            </el-table-column>
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
    import {fetchStatistics, fetchStatisticsExcelData} from 'api/statistics';
    import {parseTime, objectMerge} from 'utils';

    export default {
        name: 'statistics',
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
                    dateRange: ['', ''],
                },
                tableKey: 0,
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
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
                fetchStatistics({
                    ...this.listQuery, dateRange: [
                        this.listQuery.dateRange[0] ? (new Date(this.listQuery.dateRange[0])).valueOf().toString().slice(0, 10) : '',
                        this.listQuery.dateRange[1] ? (new Date(this.listQuery.dateRange[1])).valueOf().toString().slice(0, 10) : '',
                    ]
                }).then(response => {
                    this.list = response.data.list;
                    this.total = parseInt(response.data.count);
                    this.listLoading = false;
                })
            },
            handleFilter() {
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
            handleDownload() {
                fetchStatistics().then(response => {
                    this.list = response.data.list;
                    this.total = parseInt(response.data.count);
                    this.listLoading = false;
                });

                require.ensure([], () => {
                    const {export_json_to_excel} = require('vendor/Export2Excel');
                    const tHeader = ['物品名称', '物品性质', '隶属部门', '领用数量 or 次数'];
                    const filterVal = ['name', 'categore_name', 'type', 'title'];
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
