import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import elementplus from 'element-plus'
import axios from './lib/axios'
import ShowMessage from './lib/showMessage'
import 'default-passive-events'

// 引入css样式
import "element-plus/theme-chalk/index.css"

let app = createApp(App).use(store).use(router).use(elementplus).use(axios).use(ShowMessage);
app.mount('#app')

