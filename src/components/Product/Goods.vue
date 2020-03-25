<template>
  <div>
    <el-row class="main_panel">
      <el-col :span="22">
        <el-table :data="productData" style="width: 100%">
          <el-table-column prop="icon" label="商品图片" width="80">
            <template slot-scope="scope">
              <!-- <el-avatar shape="square" fit="contain" :src="scope.row.icon"></el-avatar> -->
              <img :src="scope.row.icon" class="product_icon" />
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
                @click="ChangeStatus(scope.row, 'up')"
                v-if="scope.row.status == 1"
                type="primary"
                plain
                size="small"
              >上架</el-button>
              <el-button @click="ChangeStatus(scope.row, 'down')" v-else size="small">下架</el-button>
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
      productData: [],
      dialogFormVisible: false,
      product: {}
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
        sellerId: this.sellerId,
        icon: "",
        status: 0,
        categoryType: "",
        recommend: false,
        required: false,
        discount: false,
        newPath: ""
      });
    },

    // 编辑
    handleClick(row) {
      this.showProduct(row);
    },

    // 上下架
    async ChangeStatus(row, type) {
      if (type == "up") {
        row.status = 0;
      } else {
        row.status = 1;
      }
      let res = await this.$Http.saveProduct(row);
      // 响应
      if (res.code == 0) {
        this.$message.success({
          message: "更新成功"
        });
        this.close();
      }
    }
  },
  created() {
    this.getProductList();
  },
  watch: {
    categoryType: function() {
      this.getProductList();
    }
  },
  computed: {
    sellerId() {
      return this.$store.state.seller.sellerId;
    }
  }
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

.product_icon {
  object-fit: contain;
  width: 45px;
  height: 45px;
  border-radius: 3px;
}
</style>
