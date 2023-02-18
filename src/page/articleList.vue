<template>
    <div class="fillcontain">
        <headTop></headTop>
        <div class="search-root">
            <el-form :model="ruleForm" label-width="110px" class="demo-formData" style="margin-top: 10px">
                <el-form-item label="关键字" prop="title">
                    <el-input v-model="keyWords" placeholder="请输入关键字" style='width: 600px' clearable>
                        <el-select v-model="ruleForm.keySelect" slot="prepend" placeholder="ruleForm.keySelect"
                            style="width: 130px;">
                            <el-option label="标题名称" value="1"></el-option>
                        </el-select>
                    </el-input>
                </el-form-item>
            </el-form>
            <el-form :model="ruleForm" :inline="true" label-width="110px" class="demo-formData" style="margin-top: 10px">
                <el-form-item label="标签">
                    <el-select v-model="ruleForm.selectTag" placeholder="ruleForm.selectTag">
                        <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="margin-left: 80px">
                    <el-button type="primary" style="width: 120px" @click="getJokes">待审核列表</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" style="width: 120px" @click="getUnPass">不通过列表</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" style="width: 120px" @click="getPass">通过列表</el-button>
                </el-form-item>
            </el-form>
            <div style="text-align: left;padding-left: 110px;">
                <el-button @click="dealSearchJokes()" type="primary" size="small">确定</el-button>
                <el-button @click="resetForm()" size="small">重置</el-button>
            </div>
        </div>
        <h1>{{ }}</h1>
        <div class="table_container">
            <el-table v-loading="tableLoading" :data="tableData" highlight-current-row>
                <el-table-column type='expand'>
                    <el-form slot-scope="props" label-position="left" inline class="demo-table-expand">
                        <el-form-item label="评论数">
                            <span>{{ props.row.articleCommentCount }}</span>
                        </el-form-item>
                        <el-form-item label="点赞数">
                            <span>{{ props.row.articleLikeCount }}</span>
                        </el-form-item>
                        <el-form-item label="标签">
                            <el-tag v-for='i in props.row.tags' size='small' type="success" style="margin-right: 10px">{{
                                JOKE_TAGS[i] }}</el-tag>
                        </el-form-item>
                        <el-form-item label="首页图片">
                            <el-image @click='showImg(props.$index, props.row)'
                                style="width: 120px; height: 120px; margin-top:10px;" class="avatar"
                                v-if="props.row.coverImg" :src="props.row.coverImg"></el-image>
                        </el-form-item>
                        <el-form-item label="文章地址">
                            <el-link href="http://www.baidu.com" target='_blank' type="primary">{{ props.row.title
                            }}</el-link>
                        </el-form-item>
                    </el-form>
                </el-table-column>
                <el-table-column type="index">
                </el-table-column>
                <el-table-column property="title" label="标题">
                </el-table-column>
                <el-table-column property="jokeUserId" width="100px" label="文章作者ID">
                </el-table-column>
                <el-table-column property="postTime" width="180px" label="发布时间" sortable>
                </el-table-column>
                <el-table-column property="jokeId" width="150px" label="文章ID">
                </el-table-column>
                <el-table-column property="city" label="操作">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.status == 1" size="mini"
                            @click='dealPass(scope.$index, scope.row)'>通过</el-button>
                        <el-button v-if="scope.row.status == 1" size="mini"
                            @click='dealUpPass(scope.$index, scope.row)'>不通过</el-button>
                        <el-button size="mini" @click='dealComment(scope.$index, scope.row)'>评论</el-button>
                        <el-button size="mini" @click='dealDelete(scope.$index, scope.row)' type="danger">
                            删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="Pagination" style="text-align: left;margin-top: 10px;">
                <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="currentPage" :page-size="row" layout="total, prev, pager, next" :total="count">
                </el-pagination>
            </div>
            <el-dialog title="预览" :visible.sync="dialogImgVisible" width="50%">
                <el-image style="width: 90%; height: auto; margin-top:10px;" class="avatar" v-if="selectTable.coverImg"
                    :src="selectTable.coverImg"></el-image>
            </el-dialog>
            <el-dialog title="提示" :visible.sync="dialogVisible" width="25%">
                <span>确定删除《{{ selectTable.title }}》这个文章吗？</span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="deleteJoke(selectIndex, selectTable.jokeId)">确 定</el-button>
                </span>
            </el-dialog>
            <el-dialog title="评论列表" :visible.sync="dialogCommentVisible" width="60%">
                <comment :jokeId="selectTable.jokeId" :isShowComment='dialogCommentVisible'></comment>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import headTop from '@/components/HeadTop'
import comment from '@/components/comment'
import { mapState } from 'vuex'

const JOKE_CATEGORY = { "1": "网络", "2": "自创", "3": "听说" };
const JOKE_TAGS = { "1": "要闻", "2": "财经", "3": "环球", "4": "娱乐", "5": "体育" };
export default {
    components: {
        headTop,
        comment
    },
    computed: {
        ...mapState([
            'adminId'
        ])
    },
    created() {
        this.getJokes();
    },
    data() {
        return {
            JOKE_TAGS: JOKE_TAGS,
            tableData: [],
            page: 1,
            row: 5,
            count: 0,
            currentPage: 1,
            dialogVisible: false,
            dialogImgVisible: false,
            dialogCommentVisible: false,
            selectTable: {},
            selectIndex: 1,
            pageChange: 1,
            tableLoading: false,
            options1: [{
                value: '0',
                label: '网络'
            }, {
                value: '1',
                label: '自创'
            }, {
                value: '2',
                label: '听说'
            }],
            options2: [{
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
            keyWords: '',
            ruleForm: {
                keySelect: '1',
                selectType: '1',
                selectTag: '1',
            },
        }
    },
    methods: {
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.page = val;
            if (this.pageChange == 1) {
                this.getJokes()
            }
            else if (this.pageChange == 2) {
                this.getUnPass()
            } else {
                this.getPass()
            }
        },
        getJokes() {
            if (this.pageChange != 1) {
                this.currentPage = 1
            }
            this.pageChange = 1
            this.artApi(`admin/articleList`)
        },
        showImg(index, row) {
            this.dialogImgVisible = true;
            this.selectTable = row;
        },
        dealComment(index, row) {
            this.dialogCommentVisible = true;
            this.selectTable = row;
            this.selectIndex = index;
        },
        dealDelete(index, row) {
            this.dialogVisible = true;
            this.selectTable = row;
            this.selectIndex = index;
        },
        deleteJoke(index, jokeId) {
            this.dialogVisible = false
            this.$axios.delete(`/admin/delete/article`, {
                params: {
                    jokeId: jokeId,
                    adminId: this.adminId
                }
            })
                .then((response) => {
                    const article = response.data;
                    if (article && article.code === '200') {
                        this.openSuccess('恭喜，删除成功!');
                        this.getJokes();
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        },

        resetForm() {
            this.ruleForm = {
                keySelect: '1',
                selectType: '-1',
                selectTag: '-1',
            };
            this.keyWords = '';
        },

        dealSearchJokes() {
            let params = {
                page: this.page,
                row: this.row,
                category: encodeURI(this.ruleForm.selectType),
                tags: encodeURI(this.ruleForm.selectTag)
            };
            if (this.ruleForm.keySelect === "1") {
                params.search = this.keyWords;
            }
            this.$axios.get(`admin/articleList`, {
                params
            })
                .then((response) => {
                    let joker = response.data;
                    if (joker.code === '200') {
                        joker = joker.data;
                        const data = joker.records;
                        this.count = joker.total;
                        this.tableData = [];
                        data.forEach(item => {
                            const tableData = {};
                            tableData.articleCommentCount = item.articleCommentCount;
                            tableData.articleLikeCount = item.articleLikeCount;
                            tableData.content = item.content;
                            tableData.contentHtml = item.contentHtml;
                            tableData.coverImg = item.coverImg;
                            tableData.jokeId = item.jokeId;
                            tableData.jokeUserIcon = item.jokeUserIcon;
                            tableData.jokeUserId = item.jokeUserId;
                            tableData.jokeUserNick = item.jokeUserNick;
                            tableData.postTime = item.postTime;
                            tableData.title = item.title;
                            tableData.status = item.status;
                            if (item.category) {
                                tableData.category = JOKE_CATEGORY[item.category];
                            } else {
                                tableData.category = JOKE_CATEGORY['0'];
                            }
                            if (item.tags) {
                                tableData.tags = JSON.parse(item.tags);
                            } else {
                                tableData.tags = ['0'];
                            }

                            this.tableData.push(tableData);
                        })
                        window.scrollTo(0, 0);
                    } else {
                        this.openToast(joker.msg);
                    }

                })
                .catch((error) => {
                    console.log(error);
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
        getUnPass() {
            if (this.pageChange != 2) {
                this.currentPage = 1
            }
            this.pageChange = 2
            this.artApi('/admin/articleListdny')
        },
        getPass() {
            if (this.pageChange != 3) {
                this.currentPage = 1
            }
            this.pageChange = 3
            this.artApi('/admin/articleListper')
        },
        dealPass(index, obj) {
            this.$axios.post('/admin/permit', undefined, {
                params: {
                    joke_id: obj.jokeId
                }
            })
                .then((response) => {
                    this.$message({
                        type: 'success',
                        message: '文章通过成功'
                    })
                    this.getJokes()
                })
        },
        dealUpPass(index, obj){
            this.$axios.post('/admin/deny', undefined, {
                params: {
                    joke_id: obj.jokeId
                }
            })
                .then((response) => {
                    this.$message({
                        type: 'success',
                        message: '操作成功'
                    })
                    this.getJokes()
                })
        },
        artApi(url) {
            this.tableLoading = true
            this.$axios.get(url, {
                params: {
                    pageNum: this.currentPage,
                    pageSize: this.row
                }
            })
                .then((response) => {
                    let joker = response.data;
                    if (joker.code === '200') {
                        joker = joker.data;
                        const data = joker.records;
                        this.count = joker.total;
                        this.tableData = [];
                        data.forEach(item => {
                            const tableData = {};
                            tableData.articleCommentCount = item.articleCommentCount;
                            tableData.articleLikeCount = item.articleLikeCount;
                            tableData.content = item.content;
                            tableData.contentHtml = item.contentHtml;
                            tableData.coverImg = item.coverImg;
                            tableData.jokeId = item.jokeId;
                            tableData.jokeUserIcon = item.jokeUserIcon;
                            tableData.jokeUserId = item.jokeUserId;
                            tableData.jokeUserNick = item.jokeUserNick;
                            tableData.postTime = item.postTime;
                            tableData.title = item.title;
                            tableData.status = item.status;
                            if (item.category) {
                                tableData.category = JOKE_CATEGORY[item.category];
                            } else {
                                tableData.category = JOKE_CATEGORY['0'];
                            }
                            if (item.tags) {
                                tableData.tags = JSON.parse(item.tags);
                            } else {
                                tableData.tags = ['0'];
                            }

                            this.tableData.push(tableData);
                        })
                        window.scrollTo(0, 0);
                    } else {
                        this.openToast(joker.msg);
                    }
                    this.tableLoading = false
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

}
</script>
<style>
.fillcontain {
    height: 100%;
    width: 100%;
}

.demo-table-expand {
    font-size: 0;
}

.demo-table-expand label {
    width: 90px;
    color: #99a9bf;
}

.demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
}


.input-with-select .el-input-group__prepend {
    background-color: #fff;
}

.search-root {
    padding: 20px;
    margin: 20px;
    border-radius: 5px;
    border: 0.5px solid #f0f0f0;
}
</style>