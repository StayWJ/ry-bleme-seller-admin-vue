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
    return {
    };
  },
  methods: {
  },
  created() {
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
</style>
