import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import PlanIndex from '../views/plan/PlanIndex.vue'
import PlanManage from '../views/plan/PlanManage.vue'
import MyPlan from '../views/plan/MyPlan.vue'
import OperatePlan from '../views/plan/OperatePlan.vue'
import ProjectManagement from '../views/ProjectManagement.vue'
import Material from '../views/material/Material.vue'
import MaterialPurchase from '../views/material/MaterialPurchase.vue'
import PurchaseMaterials from '../views/material/PurchaseMaterials.vue'
import AlreadyBought from '../views/material/AlreadyBought.vue'
import UserLayout from '../views/user/UserLayout.vue'
import Personal from '../views/user/Personal.vue'
import UserManagement from'../views/user/UserManagement.vue'
import RoleManagement from'../views/user/RoleManagement.vue'
const routes = [
  {
    path: '/web/',
    name: 'Home',
    component: Home
  },
  {
    path: '/web/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/web/materialPurchase',
    name: 'Buy',
    component: Material,
    children:[
      {
        // 发布待购
        path:'/web/materialPurchase/index',
        name: 'MaterialPurchase',
        component: MaterialPurchase,
        meta: {
          activeMenu: '/web/materialPurchase',
        }
      },
      {
        // 待购物质
        path:'/web/materialPurchase/purchaseMaterials',
        name: 'PurchaseMaterials',
        component: PurchaseMaterials,
        meta: {
          activeMenu: '/web/materialPurchase'
        }
      },
      {
        // 已购物质
        path:'/web/materialPurchase/AlreadyBought',
        name: 'AlreadyBought',
        component: AlreadyBought,
        meta: {
          activeMenu: '/web/materialPurchase'
        }
      },
    ]
  },
  {
    path: '/web/projectManagement',
    name: 'ProjectManagement',
    component: ProjectManagement
  },
  {
    path: '/web/plan',
    name: 'Plan',
    component: PlanIndex,
    children:[
      {
        path: '/web/plan/planManage',
        name: 'planManage',
        component: PlanManage,
        meta:{
          activeMenu: '/web/plan'
        }
      },
      {
        path: '/web/plan/myPlan',
        name: 'myPlan',
        component: MyPlan,
        meta:{
          activeMenu: '/web/plan'
        }
      },
      {
        path: '/web/plan/operatePlan',
        name: 'operatePlan',
        component: OperatePlan,
        meta:{
          activeMenu: '/web/plan'
        }
      },
    ]
  },
  {
    path: '/web/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/web/user',
    name: 'user',
    component: UserLayout,
    children:[
      {
        path: '/web/user/index',
        name: 'updateUser',
        component: Personal,
        meta:{
          activeMenu: '/web/user'
        }
      },
      {
        path: '/web/user/userManagement',
        name: 'userManagement',
        component: UserManagement,
        meta:{
          activeMenu: '/web/user'
        }
      },
      {
        path: '/web/user/roleManagement',
        name: 'roleManagement',
        component: RoleManagement,
        meta:{
          activeMenu: '/web/user'
        }
      },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
