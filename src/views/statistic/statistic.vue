<template>
    <div class="app-container calendar-list-container">
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
                <el-option v-for="item in departmentOptions" :key="item.key" :label="item.display_name"
                           :value="item.key">
                </el-option>
            </el-select>

            <el-select clearable class="filter-item" v-model="listQuery.type"
                       placeholder="物品性质">
                <el-option v-for="item in typeOptions" :key="item.key" :label="item.display_name" :value="item.key">
                </el-option>
            </el-select>

            <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">查询</el-button>
            <el-button class="filter-item" type="primary" icon="document" @click="handleDownload">导出</el-button>
        </div>

        <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row
                  style="width: 100%">
            <el-table-column align="center" label="" style="width:6%;">
                <template scope="scope">
                    <div><img :src="scope.row.img" :alt="scope.row.name" style="width:40px;height:auto;"></div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="名称" style="width:10%;" prop="name"></el-table-column>
            <el-table-column align="center" label="性质" style="width:8%;">
                <template scope="scope">
                    <span>{{scope.row.type | typeFilter}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="隶属部门" style="width:8%;">
                <template scope="scope">
                    <span>{{scope.row.department | departmentFilter}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="领用数量 or 次数" style="width:8%;">
                <template scope="scope">
                    <span>{{scope.row.count}}</span>
                </template>
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
    import {fetchStatistics} from 'api/statistics';
    import {parseTime, objectMerge} from 'utils';

    const typeOptions = [
        {key: 'lowValue', display_name: '低值易耗'},
        {key: 'fixedAsset', display_name: '固定资产'},
        {key: 'loveHouse', display_name: '爱心屋'},
    ];
    const departmentOptions = [
        {key: 'administration', display_name: '行政'},
        {key: 'it', display_name: 'IT'},
        {key: 'finance', display_name: '财务'},
    ];

    export default {
        name: 'table_demo',
        data() {
            return {
                list: null,
                total: null,
                listLoading: true,
                listQuery: {
                    page: 1,
                    pageSize: 20,
                    department: undefined,
                    type: undefined,
                    dateRange: undefined,
                },
                typeOptions,
                departmentOptions,
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
        filters: {
            typeFilter(key) {
                return typeOptions.find(item => item.key === key).display_name
            },
            departmentFilter(key) {
                return departmentOptions.find(item => item.key === key).display_name
            },
        },
        methods: {
            getList() {
                this.listLoading = true;
                fetchStatistics(this.listQuery).then(response => {
                    this.list = response.data.list;
                    this.total = response.data.total;
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
            timeFilter(time) {
                if (!time[0]) {
                    this.listQuery.start = undefined;
                    this.listQuery.end = undefined;
                    return;
                }
                this.listQuery.start = parseInt(+time[0] / 1000);
                this.listQuery.end = parseInt((+time[1] + 3600 * 1000 * 24) / 1000);
            },
            create() {
                this.temp.id = parseInt(Math.random() * 100) + 1024;
                this.temp.timestamp = +new Date();
                this.temp.author = '原创作者';
                this.list.unshift(this.temp);
                this.dialogFormVisible = false;
                this.$notify({
                    title: '成功',
                    message: '创建成功',
                    type: 'success',
                    duration: 2000
                });
            },
            update() {
                this.temp.timestamp = +this.temp.timestamp;
                for (const v of this.list) {
                    if (v.id === this.temp.id) {
                        objectMerge(v, this.temp);
                        break;
                    }
                }
                this.dialogFormVisible = false;
                this.$notify({
                    title: '成功',
                    message: '更新成功',
                    type: 'success',
                    duration: 2000
                });
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
