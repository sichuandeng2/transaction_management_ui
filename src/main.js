import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import elementplus from 'element-plus'
// import axios from 'axios'
import axios from './lib/axios'
import vueAxios from 'vue-axios'

axios.default.baseURL = "http://localhost:5000/api";

// 引入css样式
import "element-plus/theme-chalk/index.css"

createApp(App).use(store).use(router).use(elementplus).use(vueAxios, axios).mount('#app')
