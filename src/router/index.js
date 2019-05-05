import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/common/Home'
import dashboard from '../components/pages/Dashboard'
import notProcessed from '../components/pages/NotProcessed'
import login from '../components/pages/Login'
import notReceive from '../components/pages/NotReceive'
import notPay from '../components/pages/NotPay'
import transport from '../components/pages/Transport'
import pay from '../components/pages/Pay'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      children: [{
        path: '/dashboard',
        name: 'dashboard',
        component: dashboard,
        meta: {title: '首页'}
        },
        {
          path: '/notProcessed',
          name: 'notProcessed',
          component: notProcessed,
          meta: {title: '待取件'}
        },
        {
          path: '/notReceive',
          name: 'notReceive',
          component: notReceive,
          meta: {title: '待接单'}
        },
        {
          path: '/notPay',
          name: 'notPay',
          component: notPay,
          meta: {title: '待付款'}
        },
        {
          path: '/transport',
          name: 'transport',
          component: transport,
          meta: {title: '订单管理'}
        },
        {
          path: '/pay',
          name: 'pay',
          component: pay,
          meta: {title: '财务统计'}
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: login
    }
  ]
})
