<template>
    <el-container style="height: 100%; border: 1px solid #eee">
        <el-aside width="280px">
            <el-menu style="height: 100%; text-align: left" :default-active="defaultActive" background-color="#545c64" text-color="#fff" router>
                <el-menu-item index="manager"><i class="el-icon-s-home"></i>首页</el-menu-item>
                <el-submenu index="1">
                    <template slot="title"><i class="el-icon-user"></i>用户管理</template>
                    <el-menu-item index="userList">用户列表</el-menu-item>
                </el-submenu>
                <el-submenu index="2">
                    <template slot="title"><i class="el-icon-menu"></i>文章管理</template>
                    <el-menu-item-group>
                        <el-menu-item index="articleList">文章列表</el-menu-item>
                        <el-menu-item index="articleAdd">文章添加</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-submenu index="3">
                    <template slot="title"><i class="el-icon-message"></i>公告管理</template>
                    <el-menu-item-group>
                        <el-menu-item index="plank">公告栏</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
            </el-menu>
        </el-aside>
        <el-main style="padding: 0; overflow: auto;">
            <keep-alive>
                <router-view></router-view>
            </keep-alive>
        </el-main>
    </el-container>
</template>
<script>
export default {
  data() {
    const item = {
      date: "2016-05-02",
      name: "王小虎",
      address: "上海市普陀区金沙江路 1518 弄",
    };
    return {
      tableData: Array(20).fill(item),
    };
  },
  computed: {
    defaultActive: function () {
      return this.$route.path.replace("/", "");
    },
  },
};
</script>
<style>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}

.fillcontain {
  height: 100%;
  width: 100%;
}
</style>
