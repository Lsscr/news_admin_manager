import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import userList from "./page/userList.vue";
import manager from "./page/manager.vue";
import articleList from "./page/articleList.vue";
import articleAdd from "./page/articleAdd.vue";
import banner from "./page/banner.vue";
import login from "./page/login.vue";
import adminList from "./page/adminList.vue";
import admin from "./page/admin.vue";
import plank from "./page/plank.vue";
import talkList from "./page/talkList.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/login",
      name: "login",
      component: login,
    },
    {
      path: "/",
      name: "home",
      component: Home,
      children: [
        {
          path: "/manager",
          name: "manager",
          component: manager,
          meta: [],
        },
        {
          path: "/userList",
          name: "userList",
          component: userList,
          meta: ["用户管理", "用户列表"],
        },
        {
          path: "/articleList",
          name: "articleList",
          component: articleList,
          meta: ["文章管理", "文章列表"],
        },
        {
          path: "/articleAdd",
          name: "articleAdd",
          component: articleAdd,
          meta: ["文章管理", "新增文章"],
        },
        {
          path: "/plank",
          name: "plank",
          component: plank,
          meta: ["公告管理", "公告栏"],
        },
        {
          path: "/talkList",
          name: "talkList",
          component: talkList,
          meta: ["公告管理", "说说列表"],
        },
        {
          path: "/adminList",
          name: "adminList",
          component: adminList,
          meta: ["管理员", "人员列表"],
        },
        {
          path: "/admin",
          name: "admin",
          component: admin,
          meta: ["管理员", "管理员"],
        },
      ],
    },
  ],
});
