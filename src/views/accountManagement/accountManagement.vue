<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-button class="filter-item" style="float:right;" @click="handleCreate" type="primary" icon="edit">
                添加
            </el-button>
        </div>

        <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row
                  style="width: 100%">
            <el-table-column align="center" label="用户名" style="width:6%;">
                <template scope="scope">
                    <span>{{scope.row.username}}</span>
                </template>
            </el-table-column>

            <el-table-column label="管理部门" style="width:6%;">
                <template scope="scope">
                    <span>{{scope.row.department | departmentFilter}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="操作" style="width:44%;">
                <template scope="scope">
                    <el-button size="small"
                               @click="handleModifyStatus(scope.row,'published')">修改
                    </el-button>
                    <el-button size="small" type="danger"
                               @click="handleDelete(scope.row)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--pagination-->
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page="listQuery.page" :page-sizes="[10,20,30,50]"
                           :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
        </div>

        <!--insert and update modal-->
        <el-dialog :title="textMap[dialogStatus]" v-model="dialogFormVisible">
            <el-form class="small-space" :model="temp" label-position="left" label-width="70px"
                     style='width: 400px; margin-left:50px;'>
                <el-form-item label="隶属部门">
                    <el-select class="filter-item" v-model="temp.department" placeholder="请选择">
                        <el-option v-for="item in departmentOptions" :key="item.key" :label="item.display_name"
                                   :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="用户名">
                    <el-input v-model="temp.username"></el-input>
                </el-form-item>

                <el-form-item label="密码">
                    <el-input v-model="temp.password" type="password"></el-input>
                </el-form-item>

                <el-form-item label="重复密码">
                    <el-input v-model="temp.passwordRepeat" type="password"></el-input>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" @click="create">确 定</el-button>
                <el-button v-else type="primary" @click="update">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {getAccountList} from 'api/accountManagement';
    import {parseTime, objectMerge} from 'utils';

    const departmentOptions = [
        {key: 'administration', display_name: '行政'},
        {key: 'it', display_name: 'IT'},
        {key: 'finance', display_name: '财务'},
    ];

    export default {
        name: 'accountManagement',
        data() {
            return {
                list: null,
                total: null,
                listLoading: true,
                listQuery: {
                    page: 1,
                    pageSize: 20,
                    title: undefined,
                    type: undefined,
                },
                temp: {
                    department: '',
                    username: '',
                    password: '',
                    passwordRepeat: '',
                },
                departmentOptions,
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
            departmentFilter(key) {
                return departmentOptions.find(item => item.key === key).display_name
            },
        },
        methods: {
            getList() {
                this.listLoading = true;
                getAccountList(this.listQuery).then(response => {
                    this.list = response.data.list;
                    this.total = response.data.total;
                    this.listLoading = false;
                })
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
            handleCreate() {
                this.resetTemp();
                this.dialogStatus = 'create';
                this.dialogFormVisible = true;
            },
            handleUpdate(row) {
                objectMerge(this.temp, row)
                this.dialogStatus = 'update';
                this.dialogFormVisible = true;
            },
            handleDelete(row) {
                this.$notify({
                    title: '成功',
                    message: '删除成功',
                    type: 'success',
                    duration: 2000
                });
                const index = this.list.indexOf(row);
                this.list.splice(index, 1);
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
            resetTemp() {
                this.temp = {
                    department: '',
                    username: '',
                    password: '',
                    passwordRepeat: '',
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
