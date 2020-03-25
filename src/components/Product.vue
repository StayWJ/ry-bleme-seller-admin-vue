<template>
  <div id="product">
    <el-row>
      <el-col :span="3">
        <el-menu :default-active="$route.path" class="el-menu-vertical-demo" unique-opened router>
          <el-submenu index="goods-group">
            <template slot="title">
              <i class="el-icon-goods"></i>
              <span>商品</span>
            </template>
            <el-submenu index="system">
              <template slot="title">系统类目</template>
              <el-menu-item index="/home/product/goods/recommend">推荐</el-menu-item>
              <el-menu-item index="/home/product/goods/required">必选</el-menu-item>
              <el-menu-item index="/home/product/goods/discount">折扣</el-menu-item>
            </el-submenu>
            <el-submenu index="custom">
              <template slot="title">自定义类目</template>
              <el-menu-item
                v-for="(item, index) in getCustomList"
                :key="index"
                :index="'/home/product/goods/' + item.categoryType"
              >{{ item.categoryName }}</el-menu-item>
            </el-submenu>
          </el-submenu>
          <el-menu-item index="/home/product/categorys">
            <i class="el-icon-menu"></i>
            <span slot="title">类目</span>
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="20">
        <transition name="el-fade-in-linear" mode="out-in">
          <router-view
            :customList="getCustomList"
            :categoryNameList="getCategoryNameList"
            @changeCategoryList="changeCategoryList"
          ></router-view>
        </transition>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { Message } from "element-ui";
export default {
  name: "Product",
  data() {
    return {
      categoryList: []
    };
  },
  methods: {
    // 更新类目列表
    changeCategoryList(categoryList) {
      this.categoryList = categoryList;
    },

    // 获取类目列表
    async getCategoryList() {
      if (this.categoryList.length == 0) {
        let res = await this.$Http.getCategoryList({
          sellerId: this.sellerId
        });
        // 响应
        if (res.code == 0) {
          this.categoryList = res.data;
        }
      }
    }
  },
  created() {
    this.getCategoryList();
  },
  computed: {
    getCustomList() {
      return this.categoryList.filter(item => item.isSystem == 0);
    },
    getCategoryNameList() {
      return Object.fromEntries(
        this.getCustomList.map(item => [item.categoryType, item.categoryName])
      );
    },
    sellerId() {
      return this.$store.state.seller.sellerId;
    },
  }
};
</script>

<style scoped>
.el-menu-vertical-demo {
  overflow: hidden;
}
</style>