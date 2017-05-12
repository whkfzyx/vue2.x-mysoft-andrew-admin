<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-button class="filter-item" style="float:right;" @click="handleCreate" type="primary" icon="edit">
                添加
            </el-button>
        </div>

        <!--table-->
        <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row
                  style="width: 100%">
            <el-table-column align="center" label="" style="width:6%;">
                <template scope="scope">
                    <div><img :src="scope.row.img" :alt="scope.row.name" style="width:40px;height:auto;"></div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="名称" style="width:10%;" prop="name"></el-table-column>
            <el-table-column align="center" label="性质" style="width:8%;" prop="type"></el-table-column>
            <el-table-column align="center" label="隶属部门" style="width:8%;" prop="department"></el-table-column>
            <el-table-column align="center" label="领用频率/时长" style="width:14%;" prop="department">
                <template scope="scope">
                    <span>{{scope.row.frequency || scope.row.duration}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="库存" style="width:10%;" prop="stock"></el-table-column>
            <el-table-column align="center" label="操作" style="width:44%;">
                <template scope="scope">
                    <el-button size="small"
                               @click="handleModifyStatus(scope.row,'published')">修改
                    </el-button>
                    <el-button size="small" type="danger"
                               @click="handleModifyStatus(scope.row,'deleted')">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--pagination-->
        <div v-show="!listLoading" class="pagination-container" style="text-align: right;">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page="listQuery.page" :page-sizes="[10,20,30,50]"
                           :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
        </div>

        <!--modal - insert-->
        <el-dialog :title="textMap[dialogStatus]" v-model="dialogFormVisible">
            <el-form class="small-space" :model="temp" label-position="left" label-width="70px"
                     style='width: 80%;margin:0 auto;'>
                <el-form-item label="物品名称">
                    <el-input v-model="temp.name"></el-input>
                </el-form-item>

                <el-form-item label="上传图片">
                    <el-upload
                            action="https://jsonplaceholder.typicode.com/posts/"
                            :multiple="false"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :file-list="fileList">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>

                <el-form-item label="隶属部门">
                    <el-select class="filter-item" v-model="temp.department" placeholder="请选择">
                        <el-option v-for="item in departmentOptions" :key="item.key" :label="item.display_name"
                                   :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="物品性质">
                    <el-radio-group v-model="temp.type">
                        <el-radio v-for="item in typeOptions" :key="item.key" :label="item.key">
                            {{item.display_name}}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-row v-if="temp.type=='lowValue'">
                    <el-col :span="10">
                        <el-form-item label="领用频率">
                            <el-input v-model.number="temp.frequency"
                                      style="display: inline-block; width: 70%;"></el-input>
                            <span>/人·月</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10" :offset="4">
                        <el-form-item label="库存">
                            <el-input v-model.number="temp.stock">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-else>
                    <el-col :span="10">
                        <el-form-item label="可借时长">
                            <el-input v-model.number="temp.duration"
                                      style="display: inline-block; width: 70%;"></el-input>
                            <span>天</span>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-form-item label="描述">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容"
                              v-model="temp.description">
                    </el-input>
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
    import {fetchList} from 'api/goodsManagement';
    import {parseTime, objectMerge} from 'utils';

    const typeOptions = [
        {key: 'lowValue', display_name: '低值易耗'},
        {key: 'fixedAsset', display_name: '固定资产'},
    ];
    const departmentOptions = [
        {key: 'administration', display_name: '行政'},
        {key: 'it', display_name: 'IT'},
        {key: 'finance', display_name: '财务'},
    ];
    const durationTypeOptions = [
        {key: 'longTerm', display_name: '长期'},
        {key: 'duration', display_name: '时间段'},
    ];

    export default {
        name: 'goodsManagement',
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
                    id: undefined,
                    description: '',
                    department: '',
                    frequency: 0,
                    duration: 0,
                    stock: 0,
                    name: '',
                    type: '',
                    status: 'published'
                },
                typeOptions,
                departmentOptions,
                durationTypeOptions,
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
            statusFilter(status) {
                const statusMap = {
                    published: 'success',
                    draft: 'gray',
                    deleted: 'danger'
                };
                return statusMap[status]
            },
            typeFilter(type) {
                return calendarTypeKeyValue[type]
            }
        },
        methods: {
            getList() {
                this.listLoading = true;
                fetchList(this.listQuery).then(response => {
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
