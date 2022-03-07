import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Plan from '../views/Plan.vue'
import ProjectManagement from '../views/ProjectManagement.vue'
import Material from '../views/material/Material.vue'
import MaterialPurchase from '../views/material/MaterialPurchase.vue'
import PurchaseMaterials from '../views/material/PurchaseMaterials.vue'
import AlreadyBought from '../views/material/AlreadyBought.vue'
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
        path:'/materialPurchase',
        name: 'MaterialPurchase',
        component: MaterialPurchase
      },
      {
        // 待购物质
        path:'/materialPurchase/purchaseMaterials',
        name: 'PurchaseMaterials',
        component: PurchaseMaterials
      },
      {
        // 已购物质
        path:'/materialPurchase/AlreadyBought',
        name: 'AlreadyBought',
        component: AlreadyBought
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
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
