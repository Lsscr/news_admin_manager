<template>
    <div class="fillcontain edit-root">
        <headTop></headTop>
        <el-col :span="15" :offset="4">
            <header class="form-header">新增文章</header>
            <el-form label-width="110px" class="demo-formData" :model="ruleForm" :rules="rules" ref="ruleForm">
                <el-form-item label="文章标题" prop="title">
                    <el-input v-model="ruleForm.title" placeholder="请输入标题" style='width: 500px' clearable></el-input>
                </el-form-item>
                <el-form-item label="上传首页图片">
                    <el-input placeholder="请在这里粘贴图片地址" v-model="ruleForm.coverImg" style='width: 500px;margin-bottom: 10px'>
                    </el-input>
                    <div>
                        <el-image style="width: 120px; height: 120px" class="avatar" v-if="ruleForm.coverImg"
                            :src="ruleForm.coverImg">
                        </el-image>
                    </div>
                    <!--   <el-upload class="avatar-uploader" :action="baseUrl + '/v1/addimg/shop'" :show-file-list="false" :on-success="handleShopAvatarScucess" :before-upload="beforeAvatarUpload">
                                <el-image style="width: 120px; height: 120px" class="avatar" v-if="ruleForm.coverImg" :src="ruleForm.coverImg"></el-image>
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload> -->
                </el-form-item>
                <el-form-item label="选择标签" prop='tags'>
                    <el-checkbox-group v-model="ruleForm.tags">
                        <el-checkbox name='tags' label="1" border size="medium">要闻</el-checkbox>
                        <el-checkbox name='tags' label="2" border size="medium">财经</el-checkbox>
                        <el-checkbox name='tags' label="3" border size="medium">环球</el-checkbox>
                        <div style="margin-top: 10px">
                            <el-checkbox name='tags' label="4" border size="medium">娱乐</el-checkbox>
                            <el-checkbox name='tags' label="5" border size="medium">体育</el-checkbox>
                        </div>
                    </el-checkbox-group>
                </el-form-item>
                <div class="edit-area">
                    <div ref="editor" style="text-align:left"></div>
                </div>
                <el-form-item class='edit-btn'>
                    <el-button @click="submitForm('ruleForm')" type="primary">提交</el-button>
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </div>
</template>
<script>
import headTop from '@/components/HeadTop.vue'
import E from 'wangeditor'
import { baseUrl } from '@/config/env'
import { mapState } from 'vuex'
import { getStore } from '@/utils/utils.js'
import { USER_INFO_KEY } from '@/config/env'

export default {
    name: 'editor',
    components: {
        headTop,
    },
    computed: {
        ...mapState([
            'adminId'
        ])
    },
    created() {
        this.initUserInfo();
    },
    data() {
        return {
            editor: null,
            info: {},
            baseUrl,
            input: '',
            editorContent: '',
            editorText: '',
            options: [{
                value: '1',
                label: "要闻"
            }, {
                value: '2',
                label: "财经"
            }, {
                value: '3',
                label: "环球"
            }, {
                value: '4',
                label: "娱乐"

            }, {
                value: '5',
                label: "体育"
            }],
            value: '',
            ruleForm: {
                title: '',
                type: '',
                tags: [],
                coverImg: ''
            },
            rules: {
                title: [
                    { required: true, message: '请输入文章标题', trigger: 'blur' },
                    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                ],
                tags: [
                    { type: 'array', required: true, message: '请至少选择一个标签', trigger: 'change' }
                ]
            }
        }
    },
    methods: {
        initUserInfo() {
            let data = getStore(USER_INFO_KEY);
            if (!data) {
                this.$router.push('login');
                return;
            }
            this.info = data;
        },
        getEtContent() {
            return this.editorContent;
        },
        getEtText() {
            return this.editorText;
        },
        beforeAvatarUpload() { },
        handleShopAvatarScucess() { },
        resetForm(formName) {
            // this.$refs['formName'].resetFields();
            this.ruleForm = {
                title: '',
                type: '',
                tags: [],
                coverImg: '',
            };
            this.editor.txt.clear();
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.addJokes();
                } else {
                    this.openToast('请填写完整信息');
                    return false;
                }
            });
        },
        addJokes() {
            this.$axios.post(`/article/release`, {
                title: this.ruleForm.title,
                jokeUserId: this.info,
                content: this.getEtText(),
                contentHtml: this.getEtContent(),
                category: this.ruleForm.tags[0],
                tags: JSON.stringify(this.ruleForm.tags),
                coverImg: this.ruleForm.coverImg,
                status: 3,
            })
                .then((response) => {
                    const result = response.data;
                    if (result && result.code === '200') {
                        this.openSuccess('恭喜，发表成功!');
                        this.resetForm();
                    } else {
                        this.openToast('系统异常');
                    }
                })
                .catch((error) => {
                    console.log(error);
                    this.openToast('系统异常');
                });

        },
        openToast(msg) {
            this.$notify.error({
                title: '错误',
                message: msg
            });
        },
        openSuccess(msg) {
            this.$message({
                message: msg,
                type: 'success'
            });
        },
    },
    mounted() {
        this.editor = new E(this.$refs.editor)
        this.editor.customConfig.onchange = (html) => {
            this.editorContent = html
            this.editorText = this.editor.txt.text();
        }
        this.editor.create()
    }

}
</script>
<style>
.edit-root {
    text-align: center;
}

.edit-area {
    text-align: left;
}

.demo-formData {
    text-align: left;
}

.edit-btn {
    text-align: left;
    margin: 20px 0;
}

.form-header {
    margin: 20px auto;
    font-size: 20px;
}

.avatar-uploader .el-upload {
    width: 120px;
    height: 120px;
    line-height: 120px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
}
</style>