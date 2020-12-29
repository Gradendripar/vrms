import Vue from "vue";
import VueRouter from "vue-router";

/* import NotPermission from "../components/401.vue"; */
import App from "@/views/Appointment/index.vue";
const Login = () => import("@/views/login/index.vue");
const Home = () => import("@/views/home/index.vue");
const Roles = () => import("@/views/roles/index.vue");
const User = () => import("@/views/user/index.vue");
const LoginLog = () => import("@/views/log/loginLog.vue");
const OperationLog = () => import("@/views/log/operationLog.vue");
const Welcome = () => import("@/views/home/welcome.vue");
const Part = () => import("@/views/department/index.vue");
const ChangePassword = () => import("@/views/changePassword/index.vue");
const Informtion = () => import("@/views/Information/index.vue");
const Inter = () => import("@/views/inter/index.vue");
const Visit = () => import("@/views/visiter/index.vue");
const Regisit = () => import("@/views/visiter/register.vue");
const Appointment = () => import("@/views/Appointment/check.vue");
const changeInformation = () =>
  import("@/views/Information/changeInformation.vue");
const changePassword = () => import("@/views/Information/changePassword.vue");
const Chart = () => import("@/views/Chart/index.vue");

Vue.use(VueRouter);

const routes = [
  {
    path: "",
    redirect: "/login"
  },
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/app",
    name: "app",
    component: App
  },
  {
    path: "/home",
    name: "home",
    redirect: "/welcome",
    component: Home,
    children: [
      {
        path: "/sysInform/role",
        name: "role",
        component: Roles
      },
      {
        path: "/sysVisitor/regist",
        name: "regisit",
        component: Regisit
      },
      {
        path: "/sysInform/user",
        name: "user",
        component: User
      },
      {
        path: "/sysVisitor/order",
        name: "appointment",
        component: Appointment
      },
      {
        path: "/statistics/getAll",
        name: "Chart",
        component: Chart
      },
      {
        path: "/sysInform/inter",
        name: "users",
        component: Inter
      },
      {
        path: "/sysInform/part",
        name: "part",
        component: Part
      },
      {
        path: "/sysVisitor/visitor",
        name: "visiter",
        component: Visit
      },
      {
        path: "/sysSystem/password",
        name: "password",
        component: ChangePassword
      },
      {
        path: "/sysSystem/inform",
        name: "information",
        component: Informtion,
        redirect: "/sysSystem/changeInformation",
        children: [
          {
            path: "/sysSystem/changePassword",
            name: "changePassword",
            component: changePassword
          },
          {
            path: "/sysSystem/changeInformation",
            name: "changeInformation",
            component: changeInformation
          }
        ]
      },
      {
        path: "/sysloginLog/loginLog",
        component: LoginLog
      },
      {
        path: "/sysoperateLog/operateLog",
        component: OperationLog
      },
      {
        path: "/welcome",
        component: Welcome
      }
    ]
  }
];

const router = new VueRouter({
  routes,
  mode: "hash",
  base: process.env.BASE_URL
});

// 导航守卫
// 使用 router.beforeEach 注册一个全局前置守卫，判断用户是否登陆
/* router.beforeEach((to, from, next) => {
  if (to.path === "/login" || to.path === "/app") {
    next();
  } else {
    let token = localStorage.getItem("Authorization");

    if (token === null || token === "") {
      next("/login") || next("/app");
    } else {
      next();
    }
  }
}); */

export default router;
