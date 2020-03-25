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
      this.websock = new WebSocket(
        "wss://www.warmcongee.top/websocket/" +
          this.$store.state.seller.sellerId
      );
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onclose = this.websocketclose;
    },
    websocketonopen: function() {
      console.log("WebSocket连接成功");
    },
    websocketonerror: function(e) {
      console.log("WebSocket连接发生错误");
    },
    websocketonmessage: function(e) {
      this.$root.$emit("getNewOrder");
      // console.log(e.data);
    },
    websocketclose: function(e) {
      // console.log(e);
    }
  },
  created() {
    if (this.isLogin) {
      this.initWebSocket();
    } else {
      this.$router.push({ name: "Login" });
    }
  },
  destroyed() {
    if (this.isLogin) {
      this.websocketclose();
    }
  },
  computed: {
    // 适配子路由索引
    getActiveIndex() {
      return this.isLogin? this.$route.matched[1].path : '';
    },
    isLogin() {
      return this.$store.state.seller.sellerId == null ? false : true;
    },
    sellerId() {
      return this.$store.state.seller.sellerId;
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
