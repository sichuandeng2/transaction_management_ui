import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Plan from '../views/Plan.vue'
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
    component: Plan
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
      },
      {
        path: '/user/userManagement',
        name: 'userManagement',
        component: UserManagement
      }
    ]

  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
