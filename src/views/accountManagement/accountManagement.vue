<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-button class="filter-item" style="float:right;" @click="handleCreate" type="primary" icon="edit">
                添加
            </el-button>
        </div>

        <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row
                  style="width: 100%">
            <el-table-column align="center" label="用户名" prop="username">
            </el-table-column>

            <el-table-column label="管理部门">
                <template scope="scope">
                    <span>{{departmentFilter(scope.row.department)}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="操作">
                <template scope="scope">
                    <el-button size="small"
                               @click="handleUpdate(scope.row)">修改
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
            <el-form class="small-space" :model="temp" label-position="right" label-width="100px"
                     style='width: 400px; margin-left:50px;' :rules="rules" ref="insertAccountForm">
                <el-form-item label="隶属部门" prop="department">
                    <el-select class="filter-item" v-model="temp.department" placeholder="请选择">
                        <el-option v-for="(item,key) in this.$store.state.user.enumValues.departments" :key="key"
                                   :label="item" :value="key">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="用户名" prop="username">
                    <el-input v-model="temp.username" :disabled="dialogStatus==='update'" :maxlength="100"></el-input>
                </el-form-item>

                <el-form-item label="密码" prop="password">
                    <el-input v-model="temp.password" type="password" :maxlength="255"></el-input>
                </el-form-item>

                <el-form-item label="重复密码" prop="passwordRepeat">
                    <el-input v-model="temp.passwordRepeat" type="password" :maxlength="255"></el-input>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" @click="create('insertAccountForm')">确 定
                </el-button>
                <el-button v-else type="primary" @click="update('insertAccountForm')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {getAccountList, createAccount, updateAccount, removeAccount} from 'api/accountManagement';
    import {parseTime, objectMerge} from 'utils';
    import {isMingyuanEmail} from 'utils/validate';

    export default {
        name: 'accountManagement',
        data() {
            const validateEmail = (rule, value, callback) => {
                if (!isMingyuanEmail(value)) {
                    callback(new Error('请输入公司@mingyuanyun.com邮箱'));
                } else {
                    callback();
                }
            };
            const validatePass = (rule, value, callback) => {
                if (this.dialogStatus === 'create' && value.length < 6) {
                    callback(new Error('密码不能小于6位'));
                } else if (this.dialogStatus === 'update') {
                    if (!value.length) {
                        callback();
                    } else if (value.length > 0 && value.length < 6) {
                        callback(new Error('密码不能小于6位'));
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            };
            const validatePasswordRepeat = (rule, value, callback) => {
                if (value !== this.temp.password) {
                    callback(new Error('两次输入密码不一致'));
                } else {
                    callback();
                }
            };
            return {
                list: [],
                total: null,
                listLoading: true,
                listQuery: {
                    page: 1,
                    pageSize: 20,
                    department: '',
                },
                temp: {
                    department: '',
                    username: '@mingyuanyun.com',
                    password: '',
                    passwordRepeat: '',
                },
                dialogFormVisible: false,
                dialogStatus: '',
                textMap: {
                    update: '编辑',
                    create: '创建'
                },
                tableKey: 0,
                rules: {
                    username: [{required: true, trigger: 'blur', validator: validateEmail}],
                    department: [{required: true, message: '请选择管理部门', trigger: 'change'}],
                    password: [{required: this.dialogStatus === 'create', trigger: 'blur', validator: validatePass}],
                    passwordRepeat: [{
                        required: this.dialogStatus === 'create',
                        trigger: 'blur',
                        validator: validatePasswordRepeat
                    }],
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
                getAccountList(this.listQuery).then(response => {
                    this.list = response.data.list;
                    this.total = parseInt(response.data.count);
                    this.listLoading = false;
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
            handleCreate() {
                this.resetTemp();
                this.dialogStatus = 'create';
                this.dialogFormVisible = true;
            },
            handleUpdate(row) {
                this.resetTemp();
                objectMerge(this.temp, {username: row.username, department: row.department, id: row.id});
                this.dialogStatus = 'update';
                this.dialogFormVisible = true;
            },
            handleDelete(row) {
                removeAccount({id: row.id}).then(resp => {
                    this.getList();
                    this.$notify({
                        title: '成功',
                        message: '删除成功',
                        type: 'success',
                        duration: 2000
                    });
                });
            },
            create(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        createAccount({
                            username: this.temp.username,
                            password: this.temp.password,
                            re_password: this.temp.passwordRepeat,
                            department: this.temp.department,
                        }).then(resp => {
                            this.getList();
                            this.dialogFormVisible = false;
                            this.$notify({
                                title: '成功',
                                message: '创建成功',
                                type: 'success',
                                duration: 2000
                            });
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            update(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        updateAccount({
                            id: this.temp.id,
                            username: this.temp.username,
                            password: this.temp.password,
                            re_password: this.temp.passwordRepeat,
                            department: this.temp.department,
                        }).then(resp => {
                            this.getList();
                            this.dialogFormVisible = false;
                            this.$notify({
                                title: '成功',
                                message: '修改成功',
                                type: 'success',
                                duration: 2000
                            });
                            this.dialogFormVisible = false;
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetTemp() {
                this.$refs['insertAccountForm'] && this.$refs['insertAccountForm'].resetFields();
                this.temp = {
                    department: '',
                    username: '@mingyuanyun.com',
                    password: '',
                    passwordRepeat: '',
                };
            },
        }
    }
</script>
