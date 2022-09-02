import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Vant from 'vant'
import 'vant/lib/index.css'

// 目标：封装网络请求
// 1. src/utils/request.js - 设置基地址，导出axios函数
// 2. src/api/Home,js - 请求方法 axios（{url，‘具体’}
// 3. src/api/index.js - 把Home.JS里函数引入过来统一导出
// 调用封装api方法
import { recommendMusicAPI } from '@/api'
async function fn() {
  const res = await recommendMusicAPI()
  console.log(res)
}
fn()
Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
