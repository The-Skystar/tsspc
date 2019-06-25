<template>
  <div class="wrapper">
    <v-head></v-head>
    <v-sidebar></v-sidebar>
    <div class="content-box" :class="{'content-collapse':collapse}">
      <v-tags></v-tags>
      <div class="content">
        <transition name="move" mode="out-in">
          <keep-alive :include="tagsList">
            <router-view></router-view>
          </keep-alive>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import vHead from './Header.vue'
import vSidebar from './Sidebar.vue'
import vTags from './Tags.vue'
import bus from './bus'

export default {
  data () {
    return {
      tagsList: [],
      collapse: false,
      user:null,
      message:'',
      receive:0,
    }
  },
  components: {
    vHead, vSidebar, vTags
  },
  created () {
    this.initWebSocket()
    bus.$on('collapse', msg => {
      this.collapse = msg
    })

    // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
    bus.$on('tags', msg => {
      let arr = []
      for (let i = 0, len = msg.length; i < len; i++) {
        msg[i].name && arr.push(msg[i].name)
      }
      this.tagsList = arr
    })
  },
  mounted (){
    console.log(sessionStorage.getItem("user"))
  },
  destroyed:function(){
    this.websocketclose()
  },
  methods:{
    initWebSocket: function () {
      // ws等同http，wss等同https,其中ip为后端应用主机，port为后端启动所占用的端口
      this.websock = new WebSocket('ws://127.0.0.1:8082/websocket/888')
      this.websock.onopen = this.websocketonopen
      this.websock.onerror = this.websocketonerror
      this.websock.onmessage = this.websocketonmessage
      this.websock.onclose = this.websocketclose
    },
    websocketonopen: function () {
      console.log('WebSocket连接成功')
    },
    websocketonerror: function (e) {
      console.log('WebSocket连接发生错误')
    },
    websocketonmessage: function (e) {
      // var da = JSON.parse(e.data)
      this.receive = this.receive+1
      this.$notify({
        title: '提示',
        message: '你有'+this.receive+'条订单未接单',
        duration: 0,
        position: 'bottom-right'
      });
      this.message = e.data
    },
    websocketclose: function (e) {
      // console.log('connection closed (' + e.code + ')')
    },
  }
}
</script>
