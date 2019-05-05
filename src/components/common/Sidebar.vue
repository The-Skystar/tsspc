<template>
  <div class="sidebar">
    <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" unique-opened router>
      <!--background-color="#324157" text-color="#bfcbd9" active-text-color="#20a0ff"-->
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>待处理</span>
        </template>
          <el-tooltip effect="dark" :content="number1?`有${number1}条未接单`:``" placement="right">
            <el-menu-item index="1-1" route="/notReceive">待接单</el-menu-item>
          </el-tooltip>
          <el-tooltip effect="dark" :content="number2?`有${number2}条待取件`:``" placement="right">
            <el-menu-item index="1-2" route="/notProcessed">待取件</el-menu-item>
          </el-tooltip>
          <el-menu-item index="1-2" route="/notPay">待付款</el-menu-item>
      </el-submenu>
      <el-menu-item index="2" route="/transport">
        <i class="el-icon-menu"></i>
        <span slot="title">订单管理</span>
      </el-menu-item>
      <el-menu-item index="3" route="/pay">
        <i class="el-icon-circle-plus"></i>
        <span slot="title">财务统计</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
  import bus from '../common/bus'

  export default {
    data () {
      return {
        collapse: false,
        number1:'0',
        number2:'3',
      }
    },
    computed: {
      onRoutes () {
        return this.$route.path.replace('/', '')
      }
    },
    created () {
      // 通过 Event Bus 进行组件间通信，来折叠侧边栏
      bus.$on('collapse', msg => {
        this.collapse = msg
      })
      bus.$on('number1', msg => {
        this.number1 = msg
      })
      bus.$on('number2', msg => {
        this.number2 = msg
      })
      this.number1 = sessionStorage.getItem("number1")
      this.number2 = sessionStorage.getItem("number2")
    }
  }
</script>

<style scoped>
  .sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
  }

  .sidebar::-webkit-scrollbar {
    width: 0;
  }

  .sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
  }

  .sidebar > ul {
    height: 100%;
  }
  .item {
    margin-top: 10px;
    margin-right: 40px;
  }
</style>
