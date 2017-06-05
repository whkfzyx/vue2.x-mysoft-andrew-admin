<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-button class="filter-item" style="float:right;" @click="handleCreate" type="primary" icon="edit">
                添加
            </el-button>
        </div>

        <!--table-->
        <el-table :key='tableKey' :data="list" v-loading.body="listLoading"
                  border fit highlight-current-row style="width: 100%">
            <el-table-column align="center" label="">
                <template scope="scope">
                    <div v-if="scope.row.thumb_img">
                        <img :src="scope.row.thumb_img" :alt="scope.row.name" style="width:40px;height:auto;">
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="名称" prop="name"></el-table-column>
            <el-table-column align="center" label="性质" prop="categore_name"></el-table-column>
            <el-table-column align="center" label="隶属部门">
                <template scope="scope">
                    <span>{{departmentFilter(scope.row.department)}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="领用频率 or 时长" prop="department">
                <template scope="scope">
                    <span>{{scope.row.need_return ? (scope.row.duration == 0 ? '长期' : (parseInt(scope.row.duration) / 86400).toFixed(1) + ' 天') : scope.row.frequency + ' /人·月'}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="库存" prop="stock"></el-table-column>
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

        <!--modal - insert-->
        <el-dialog :title="textMap[dialogStatus]" v-model="dialogFormVisible">
            <el-form class="small-space" :model="temp" :rules="rules" ref="goodsDetailForm"
                     label-position="right" label-width="100px"
                     style='width: 85%;margin:0 auto;'>
                <el-form-item label="物品名称" prop="name">
                    <el-input v-model="temp.name" :maxlength="255"></el-input>
                </el-form-item>

                <el-form-item label="上传图片" prop="img">
                    <el-upload
                            class="avatar-uploader"
                            action=""
                            :multiple="false"
                            :show-file-list="false"
                            :before-upload="beforeImgUpload">
                        <img v-if="temp.img_url" :src="temp.img_url" class="avatar">
                        <i class="el-icon-plus avatar-uploader-icon" v-else></i>
                        <div slot="tip" class="el-upload__tip">只能上传jpg、png文件，且不超过500KB，推荐尺寸750x560px</div>
                    </el-upload>
                </el-form-item>

                <el-form-item label="隶属部门" prop="department">
                    <el-select class="filter-item" v-model="temp.department" placeholder="请选择">
                        <el-option v-for="(item,key) in enumValues.departments" :key="key"
                                   :label="item" :value="key">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="物品性质" prop="categore">
                    <el-radio-group v-model="temp.categore">
                        <el-radio v-for="(item,key) in enumValues.categores" :key="key"
                                  :label="key">
                            {{item.name}}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="是否需归还" prop="need_return">
                    <el-radio-group v-model="temp.need_return">
                        <el-radio :label="0">否</el-radio>
                        <el-radio :label="1">是</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-row>
                    <el-col :span="14">
                        <el-form-item label="领用频率" prop="frequency" v-if="temp.need_return===0">
                            <el-input-number v-model.number="temp.frequency" :min="0" :max="255"
                                             style="display: inline-block; width: 60%;"></el-input-number>
                            <span style="display: inline-block;line-height: 36px;vertical-align: top;">/人·月 <span
                                    style="color:#ccc;font-size: 10px;">0为不限</span></span>
                        </el-form-item>
                        <el-form-item label="可借时长" v-else-if="temp.need_return===1">
                            <el-input-number v-model.number="temp.duration" :min="0" :max="255"
                                             style="display: inline-block; width: 60%;"></el-input-number>
                            <span style="display: inline-block;line-height: 36px;vertical-align: top;">天 <span
                                    style="color:#ccc;font-size: 10px;">0为不限</span></span>
                        </el-form-item>
                    </el-col>

                    <el-col :span="10">
                        <el-form-item label="库存" prop="stock">
                            <el-input-number v-model.number="temp.stock" :min="0" :max="65535"></el-input-number>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-form-item label="描述">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}"
                              placeholder="请输入内容" :maxlength="1000"
                              v-model="temp.description">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary"
                           @click="create('goodsDetailForm')">确 定
                </el-button>
                <el-button v-else type="primary" @click="update('goodsDetailForm')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {fetchList, addGoods, uploadImg, editgoods, removeGoods} from 'api/goodsManagement';
    import {parseTime, objectMerge} from 'utils';
    import store from 'store';
    import {mapGetters} from 'vuex';

    export default {
        name: 'goodsManagement',
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
                temp: {
                    goodsId: undefined,
                    img: '',
                    img_url: '',
                    description: '',
                    department: '',
                    frequency: 0,
                    duration: 0,
                    stock: 0,
                    name: '',
                    categore: '',
                    need_return: 0,
                },
                rules: {
                    name: [{required: true, message: '请输入物品名称', trigger: 'blur'}],
                    department: [{required: true, message: '请选择隶属部门', trigger: 'change'}],
                    categore: [{required: true, message: '请选择物品性质', trigger: 'change'}],
                },
                typeOptions: this.$store.state.user.enumValues.categores,
                departmentOptions: this.$store.state.user.enumValues.departments,
                dialogFormVisible: false,
                dialogStatus: '',
                textMap: {
                    update: '编辑',
                    create: '创建'
                },
                tableKey: 0
            }
        },
        computed: {
            ...mapGetters([
                'enumValues',
            ]),
        },
        created() {
            this.getList();
        },
        methods: {
            departmentFilter(key) {
                return this.$store.state.user.enumValues.departments[key]
            },
            getList() {
                this.listLoading = true;
                fetchList(this.listQuery).then(response => {
                    this.list = response.data.list;
                    this.total = parseInt(response.data.count);
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
            handleCreate() {
                this.resetTemp();
                this.dialogStatus = 'create';
                this.dialogFormVisible = true;
            },
            handleUpdate(row) {
                this.resetTemp();
                objectMerge(this.temp, {
                    ...row,
                    department: (row.department).toString(),
                    categore: (row.categore).toString(),
                    duration: (parseInt(row.duration) / 86400).toFixed(1),
                });
                this.dialogStatus = 'update';
                this.dialogFormVisible = true;
            },
            handleDelete(row) {
                this.$confirm('确认删除该物品?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    removeGoods({id: row.id}).then(response => {
                        this.getList();
                        this.$notify({
                            title: '成功',
                            message: '删除成功',
                            type: 'success',
                            duration: 1500
                        });
                    }, err => {
                        this.$notify({
                            message: err.message,
                            type: 'error',
                            duration: 1500
                        });
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            create(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        addGoods({
                            ...this.temp,
                            duration: (this.temp.duration * 86400).toString(),
                            frequency: (this.temp.frequency).toString(),
                            categore: parseInt(this.temp.categore),
                            department: parseInt(this.temp.department),
                        }).then(response => {
                            this.getList();
                            this.dialogFormVisible = false;
                            this.$notify({
                                title: '成功',
                                message: '添加成功',
                                type: 'success',
                                duration: 1500
                            });
                        }, err => {
                            this.$notify({
                                message: err.message,
                                type: 'error',
                                duration: 1500
                            });
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            update() {
                editgoods({
                    ...this.temp,
                    duration: (this.temp.duration * 86400).toString(),
                    frequency: (this.temp.frequency).toString(),
                    categore: parseInt(this.temp.categore),
                    department: parseInt(this.temp.department),
                }).then(response => {
                    this.getList();
                    this.dialogFormVisible = false;
                    this.$notify({
                        title: '成功',
                        message: '修改成功',
                        type: 'success',
                        duration: 1500
                    });
                }, err => {
                    this.$notify({
                        message: err.message,
                        type: 'error',
                        duration: 1500
                    });
                });
                this.dialogFormVisible = false;
            },
            resetTemp() {
                this.$refs['goodsDetailForm'] && this.$refs['goodsDetailForm'].resetFields();
                this.temp = {
                    goodsId: undefined,
                    img: '',
                    img_url: '',
                    description: '',
                    department: '',
                    frequency: 0,
                    duration: 0,
                    stock: 0,
                    name: '',
                    categore: '',
                    need_return: 0,
                };
            },
            beforeImgUpload(file) {
                const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png');
                const isLt2M = file.size / 1024 / 1024 <= .5;

                if (!isJPG) {
                    this.$message.error('上传图片只能是 JPG/PNG 格式!');
                    return false
                }
                if (!isLt2M) {
                    this.$message.error('上传图片大小不能超过 500KB!');
                    return false
                }

                let formData = new FormData();
                formData.append("UploadForm[file]", file, 'img.jpg');
                formData.append("upsign", this.$store.state.user.enumValues.upsign);
                return uploadImg(formData)
                    .then(resp => {
                        this.temp.img = resp.data.file_path;
                        this.temp.img_url = resp.data.action_path;
                        return new Promise
                    }, err => {
                        this.$notify({
                            message: err.message,
                            type: 'error',
                            duration: 1500
                        });
                    });
            },
        }
    }
</script>

<style lang="scss" scoped>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        .tip {
            display: inline-block;
            margin-left: 16px;
        }
    }

    .avatar-uploader .el-upload:hover {
        border-color: #20a0ff;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 170px;
        height: 128px;
        line-height: 128px;
        text-align: center;
        border: 1px solid #ccc;
    }

    .avatar {
        width: 170px;
        height: 128px;
        display: block;
    }
</style>