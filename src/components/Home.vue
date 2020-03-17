<template>
  <div>
    <el-menu :default-active="getActiveIndex" class="el-menu-demo" router mode="horizontal">
      <el-menu-item index="/home/processingcenter">处理中心</el-menu-item>
      <el-menu-item index="/home/workbench">我的工作台</el-menu-item>
      <el-menu-item index="/home/product">商品管理</el-menu-item>
      <el-menu-item index="/home/order">订单管理</el-menu-item>
    </el-menu>
    <transition name="el-fade-in-linear" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {};
  },
  methods: {
    initWebSocket: function() {
      // WebSocket与普通的请求所用协议有所不同，ws等同于http，wss等同于https
      this.websock = new WebSocket("wss://www.warmcongee.top/websocket/1");
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onclose = this.websocketclose;
    },
    websocketonopen: function() {
      // console.log("WebSocket连接成功");
    },
    websocketonerror: function(e) {
      // console.log("WebSocket连接发生错误");
    },
    websocketonmessage: function(e) {
      this.$notify.success({
        title: "提示",
        message: "您有新的订单，请及时处理！",
        duration: 0
      });
      let audio = new Audio();
      audio.src = "https://image.warmcongee.top/sell/seller/tts/new_order_tts.mp3";
      audio.play();
      this.$root.$emit("getNewOrder");
      // console.log(e.data);
    },
    websocketclose: function(e) {
      console.log(e);
    }
  },
  created() {
    this.initWebSocket();
  },
  destroyed() {
    this.websocketclose();
  },
  computed: {
    // 适配子路由索引
    getActiveIndex() {
      return this.$route.matched[1].path;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.item {
  position: absolute;
}
</style>
