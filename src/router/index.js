import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login.vue'
import Cate from '@/components/goods/Cate.vue'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/categories', component: Cate }
  ]
})
