import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login.vue'
import Cate from '@/components/goods/Cate.vue'
import Home from '@/components/Home.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/categories', component: Cate },
    { path: '/home', component: Home }
  ]
})
// 掛載路由守衛
router.beforeEach((to, from, next) => {
  // to 將要訪問的路徑
  // from 從哪個路徑跳轉過來
  // next 是一個函數,表示放行 
  //next() 放行   next('/login') 強制跳轉
  if (to.path === '/login') return next();
  // 取得 token
  const tokenStr = window.sessionStorage.getItem('token');
  console.log('token:' + tokenStr);
  if (!tokenStr) next('/login');
  if (tokenStr !== 'smallken') next('/login');
  next();

});

export default router;
