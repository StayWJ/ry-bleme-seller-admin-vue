<template>
  <div>
    <el-row class="main_panel">
      <el-col :span="22">
        <el-table :data="productData" style="width: 100%">
          <el-table-column prop="icon" label="商品图片" width="80">
            <template slot-scope="scope">
              <el-avatar shape="square" fit="contain" :src="scope.row.icon"></el-avatar>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="商品名称" width="120"></el-table-column>
          <el-table-column prop="price" label="价格" width="60">
            <template slot-scope="scope">{{ scope.row.price.toFixed(2) }}</template>
          </el-table-column>
          <el-table-column prop="stock" label="库存" width="60"></el-table-column>
          <el-table-column prop="description" label="描述" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="categoryType" label="类目" width="300">
            <template slot-scope="scope">
              <el-tag>{{categoryNameList[scope.row.categoryType]}}</el-tag>
              <el-tag v-if="scope.row.recommend" type="danger">推荐</el-tag>
              <el-tag v-if="scope.row.required">必选</el-tag>
              <el-tag v-if="scope.row.discount" type="success">折扣</el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="170">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" size="small">编辑</el-button>
              <el-button
                @click="ChangeStatus(scope.row, 'down')"
                v-if="scope.row.status"
                type="primary"
                plain
                size="small"
              >下架</el-button>
              <el-button
                @click="ChangeStatus(scope.row, 'up')"
                v-else
                type="primary"
                size="small"
              >上架</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-button type="danger" @click="showAdd" class="add_btn_panel" icon="el-icon-plus" circle></el-button>
    </el-row>
    <Good :dialogFormVisible="dialogFormVisible" :product="product" />
  </div>
</template>

<script>
import Good from "./Good";
export default {
  props: ["categoryType", "customList", "categoryNameList"],
  name: "Goods",
  components: {
    Good
  },
  data() {
    return {
      sellerId: 1,
      productData: [],
      dialogFormVisible: true,
      product: {
        id: "126",
        name: "葱花饼",
        price: 10,
        oldPrice: 8.0,
        stock: 92,
        description: "很好吃的饼",
        icon:
          "https://bkimg.cdn.bcebos.com/pic/a2cc7cd98d1001e9abacc65aba0e7bec55e797d7?x-bce-process=image/watermark,g_7,image_d2F0ZXIvYmFpa2UxNTA=,xp_5,yp_5",
        status: 0,
        categoryType: "",
        recommend: true,
        required: false,
        discount: true
      }
    };
  },
  methods: {
    // 获取商品列表
    async getProductList() {
      let res = await this.$Http.getCategoryProductList({
        sellerId: this.sellerId,
        categoryType: this.categoryType
      });
      // 响应
      if (res.code == 0) {
        this.productData = res.data;
      }
    },

    // 显示商品面板
    showProduct(product) {
      this.product = product;
      this.dialogFormVisible = true;
    },

    // 新增商品初始化
    showAdd() {
      this.showProduct({
        id: "",
        name: "",
        price: 0,
        oldPrice: 0,
        stock: 0,
        description: "",
        icon: "",
        status: 0,
        categoryType: "",
        recommend: false,
        required: false,
        discount: false
      });
    },

    // 编辑
    handleClick(row) {
      this.showProduct(row);
    },

    // 上下架
    ChangeStatus(row, type) {
      console.log(row, type);
    }
  },
  created() {
    this.getProductList();
  },
  watch: {
    categoryType: function() {
      this.getProductList();
      this.setCategoryName();
    }
  },
  computed: {}
};
</script>

<style scoped>
.main_panel {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}

.el-tag + .el-tag {
  margin-left: 10px;
}

.add_btn_panel {
  position: fixed;
  right: 4%;
  transform: translateY(60px);
  z-index: 99;
}
</style>
