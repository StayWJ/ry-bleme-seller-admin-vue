<template>
  <div>
    <el-menu :default-active="getActiveIndex" class="el-menu-demo" router mode="horizontal">
      <el-menu-item index="/home/processingcenter">处理中心</el-menu-item>
      <el-menu-item index="/home/workbench">我的工作台</el-menu-item>
      <el-menu-item index="/home/product">商品管理</el-menu-item>
      <el-menu-item index="/home/order">订单管理</el-menu-item>
      <div class="user-panel" tabindex="0">
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            {{sellerName}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="userInfo">账号信息</el-dropdown-item>
            <el-dropdown-item divided command="signOut">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-menu>
    <transition name="el-fade-in-linear" mode="out-in">
      <router-view></router-view>
    </transition>
    <UserInfo :dialogTableVisible="dialogTableVisible" />
  </div>
</template>

<script>
import UserInfo from "./UserInfo"
export default {
  name: "Home",
  components: {
    UserInfo
  },
  data() {
    return {
      websock: null,
      dialogTableVisible: false,
    };
  },
  methods: {
    /** 拉菜单触发事件 */
    handleCommand(type) {
      switch (type) {
        case "userInfo":
          this.goToUserInfo();
          break;
        case "signOut":
          this.signOut();
          break;
        default:
      }
    },
    goToUserInfo() {
      this.dialogTableVisible = true;
    },
    signOut() {
      this.$confirm("是否退出登录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.websock.close();
          this.$store.commit("setSellerId", null);
          this.$store.commit("setSellerName", null);
          this.$message({
            type: "success",
            message: "退出成功!"
          });
          this.$router.push({ name: "Login" });
        })
        .catch(() => {});
    },
    initWebSocket: function() {
      this.websock && this.websock.close();
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
      console.log("WebSocket连接发生错误,重试一次");
      this.initWebSocket();
    },
    websocketonmessage: function(e) {
      this.$root.$emit("getNewOrder");
      // console.log(e.data);
    },
    websocketclose: function(e) {
      console.log("WebSocket关闭连接");
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
      return this.isLogin ? this.$route.matched[1].path : "";
    },
    isLogin() {
      return this.$store.state.seller.sellerId == null ? false : true;
    },
    sellerId() {
      return this.$store.state.seller.sellerId;
    },
    sellerName() {
      return this.$store.state.seller.sellerName;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.item {
  position: absolute;
}
.el-menu-demo {
  display: flex;
  position: relative;
}
.user-panel {
  display: flex;
  height: 100%;
  position: absolute;
  right: 20px;
  align-items: center;
}
</style>
