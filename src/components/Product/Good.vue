<template>
  <div id="good">
    <el-dialog title="商品信息" :visible.sync="dialogFormVisible" width="70%" top="6vh">
      <!-- 图片 -->
      <el-form :model="product" label-position="right" label-width="81px" size="medium">
        <el-row type="flex">
          <el-col :span="12">
            <el-form-item label="商品图片">
              <el-upload
                class="avatar-uploader"
                action="/upyun"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="product.icon" :src="product.icon" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 名称 + 类目 -->
        <el-row type="flex">
          <el-col :span="12">
            <el-form-item label="商品名称">
              <el-input
                style="width:52%"
                v-model="product.name"
                maxlength="10"
                show-word-limit
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类目">
              <el-select v-model="product.categoryType" placeholder="请选择所属类目">
                <el-option
                  v-for="item in $parent.customList"
                  :key="item.categoryType"
                  :label="item.categoryName"
                  :value="item.categoryType"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 价格 + 库存 -->
        <el-row type="flex">
          <el-col :span="12">
            <el-form-item label="价格">
              <el-input-number v-model="product.price" :min="0" :max="999" label="商品价格" size="mini"></el-input-number>
              <el-tag
                v-show="product.discount"
                type="info"
                style="margin-left: 10px;"
                size="medium"
              >原价：{{product.oldPrice}}</el-tag>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="库存">
              <el-input-number v-model="product.stock" :min="0" :max="99" label="商品库存" size="mini"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 状态 + 属性 -->
        <el-row type="flex">
          <el-col :span="12">
            <el-form-item label="状态">
              <el-switch v-model="productStatus" active-text="上架" inactive-text="下架"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="属性">
              <el-checkbox label="推荐" v-model="product.recommend"></el-checkbox>
              <el-checkbox label="必选" v-model="product.required"></el-checkbox>
              <el-checkbox label="折扣" v-model="product.discount"></el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 描述 -->
        <el-row type="flex">
          <el-col :span="24">
            <el-form-item label="描述">
              <el-input
                v-model="product.description"
                resize="horizontal"
                maxlength="50"
                show-word-limit
                clearable
                style="width:85%"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close" size="small">取 消</el-button>
        <el-button type="primary" @click="save" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ["dialogFormVisible", "product"],
  name: "Good",
  data() {
    return {
      sellerId: 1,
      productStatus: true
    };
  },
  methods: {
    // 关闭对话框
    close() {
      this.$parent.getProductList();
      this.$parent.dialogFormVisible = false;
    },
    // 确定
    save() {
      this.close();
    },
    // 上传完成
    handleAvatarSuccess(res, file) {
      this.product.icon = URL.createObjectURL(file.raw);
    },
    // 上传检测
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    }
  },
  created() {},
  computed: {},
  watch: {
    "product.discount": function() {
      if (this.product.discount) {
        this.product.oldPrice = this.product.price;
      }
    },
    "product.status": function() {
      this.productStatus = this.product.status == 0;
    },
    productStatus: function() {
      if (this.productStatus) {
        this.product.status = 0;
      } else {
        this.product.status = 1;
      }
    }
  }
};
</script>

<style scoped>
#good >>> .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
#good >>> .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
#good >>> .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
#good >>> .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
