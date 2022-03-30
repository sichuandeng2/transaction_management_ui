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
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/materialPurchase',
    name: 'Buy',
    component: Material,
    children:[
      {
        // 发布待购
        path:'/materialPurchase/index',
        name: 'MaterialPurchase',
        component: MaterialPurchase,
        meta: {
          activeMenu: '/materialPurchase',
        }
      },
      {
        // 待购物质
        path:'/materialPurchase/purchaseMaterials',
        name: 'PurchaseMaterials',
        component: PurchaseMaterials,
        meta: {
          activeMenu: '/materialPurchase'
        }
      },
      {
        // 已购物质
        path:'/materialPurchase/AlreadyBought',
        name: 'AlreadyBought',
        component: AlreadyBought,
        meta: {
          activeMenu: '/materialPurchase'
        }
      },
    ]
  },
  {
    path: '/projectManagement',
    name: 'ProjectManagement',
    component: ProjectManagement
  },
  {
    path: '/plan',
    name: 'Plan',
    component: PlanIndex,
    children:[
      {
        path: '/plan/planManage',
        name: 'planManage',
        component: PlanManage,
        meta:{
          activeMenu: '/plan'
        }
      },
      {
        path: '/plan/myPlan',
        name: 'myPlan',
        component: MyPlan,
        meta:{
          activeMenu: '/plan'
        }
      },
      {
        path: '/plan/operatePlan',
        name: 'operatePlan',
        component: OperatePlan,
        meta:{
          activeMenu: '/plan'
        }
      },
    ]
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/user',
    name: 'user',
    component: UserLayout,
    children:[
      {
        path: '/user/index',
        name: 'updateUser',
        component: Personal,
        meta:{
          activeMenu: '/user'
        }
      },
      {
        path: '/user/userManagement',
        name: 'userManagement',
        component: UserManagement,
        meta:{
          activeMenu: '/user'
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
