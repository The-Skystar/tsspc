import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/common/Home'
import dashboard from '../components/pages/Dashboard'
import notProcessed from '../components/pages/NotProcessed'
import login from '../components/pages/Login'
import notReceive from '../components/pages/NotReceive'
import notPay from '../components/pages/NotPay'

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
