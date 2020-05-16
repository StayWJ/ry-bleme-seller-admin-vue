<template>
  <div id="UserInfo">
    <el-dialog title="账户信息" :visible="dialogTableVisible" @close="close" width="70%" top="6vh">
      <el-form :model="userData">
        <el-form-item label="商家头像" :label-width="formLabelWidth">
          <el-upload
            class="avatar-uploader"
            action="/api/product/image"
            v-loading="loading"
            :data="data"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :on-error="handleAvatarError"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="image" :src="image" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <!-- 商家店名 + 商家手机 -->
        <el-row type="flex">
          <el-col :span="12">
            <el-form-item label="商家店名" :label-width="formLabelWidth">
              <el-input v-model="userData.sellerTitle" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商家手机" :label-width="formLabelWidth">
              <el-input v-model="userData.sellerPhone" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 起送价格 + 配送费 -->
        <el-row type="flex">
          <el-col :span="12">
            <el-form-item label="起送价格" :label-width="formLabelWidth">
              <el-input-number
                v-model="userData.sellerMinPrice"
                :min="0"
                :max="999"
                :precision="2"
                :step="1"
                label="商品价格"
                size="mini"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="配送费" :label-width="formLabelWidth">
              <el-input-number
                v-model="userData.sellerDeliveryPrice"
                :min="0"
                :max="999"
                :precision="2"
                :step="0.1"
                label="商品价格"
                size="mini"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 派送方式 + 派送时间 -->
        <el-row type="flex">
          <el-col :span="12">
            <el-form-item label="派送方式" :label-width="formLabelWidth">
              <el-input v-model="userData.sellerDelivery" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="派送时间" :label-width="formLabelWidth">
              <el-select v-model="userData.sellerDeliveryTime" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="商家地址" :label-width="formLabelWidth">
          <el-input v-model="userData.sellerAddress" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="营业时间" :label-width="formLabelWidth">
          <!-- <el-input v-model="userData.sellerOpenTime" autocomplete="off"></el-input> -->
          <el-time-picker
            is-range
            v-model="time"
            arrow-control
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
            value-format="HH:mm"
            format="HH:mm"
          ></el-time-picker>
        </el-form-item>
        <el-form-item label="商家公告" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 5}"
            v-model="userData.sellerBulletin"
            autocomplete="off"
          ></el-input>
        </el-form-item>
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
  props: ["dialogTableVisible"],
  name: "UserInfo",
  data() {
    return {
      userData: {
        detailId: "",
        sellerId: "",
        sellerTitle: "",
        sellerAvatar: "",
        sellerPhone: "",
        sellerBulletin: "",
        sellerMinPrice: 0,
        sellerDeliveryPrice: 0,
        sellerDelivery: "",
        sellerDeliveryTime: 0,
        sellerAddress: "",
        sellerOpenTime: ""
      },
      formLabelWidth: "120px",
      data: {
        newPath: ""
      },
      image: "",
      loading: false,
      time: ["00:00", "00:00"],
      options: [
        {
          value: 5,
          label: "5分钟"
        },
        {
          value: 10,
          label: "10分钟"
        },
        {
          value: 20,
          label: "20分钟"
        },
        {
          value: 30,
          label: "30分钟"
        },
        {
          value: 40,
          label: "40分钟"
        }
      ]
    };
  },
  methods: {
    async find() {
      let res = await this.$Http.find({ sellerId: this.sellerId }, true);
      this.userData = res.data;
      this.image = this.userData.sellerAvatar;
      let sellerOpenTime = this.userData.sellerOpenTime;
      this.time = sellerOpenTime.split('-');
    },
    // 关闭对话框
    async close() {
      if (this.data.newPath) {
        await this.$Http.delTemp(
          {
            newPath: this.data.newPath
          },
          true
        );
        this.data.newPath = "";
      }
      this.image = "";
      this.$parent.dialogTableVisible = false;
    },
    // 确定
    async save() {
      let userData = JSON.parse(JSON.stringify(this.userData));
      if (this.data.newPath) userData.sellerAvatar = this.data.newPath;
      let res = await this.$Http.updateSellerInfo(userData);
      console.log(res);
      // 响应
      if (res.code == 0) {
        this.$message.success({
          message: "更新成功"
        });
        this.data.newPath = "";
        // this.close();
      }
    },
    // 上传完成
    handleAvatarSuccess(res, file) {
      this.image = URL.createObjectURL(file.raw);
      this.data.newPath = res.data;
      this.loading = false;
      this.$message.success({
        message: "上传成功"
      });
    },
    // 上传失败
    handleAvatarError(res) {
      this.loading = false;
      this.$message.error({
        message: res.message
      });
    },
    // 上传检测
    beforeAvatarUpload(file) {
      this.loading = true;
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      if (!isJPG || !isLt2M) {
        this.loading = false;
      }
      return isJPG && isLt2M;
    }
  },
  created() {},
  computed: {
    sellerId() {
      return this.$store.state.seller.sellerId;
    }
  },
  watch: {
    dialogTableVisible: function() {
      if (this.dialogTableVisible) {
        this.find();
      }
    },
    time: function() {
        this.userData.sellerOpenTime = this.time[0] + "-" + this.time[1];
    }
  }
};
</script>

<style scoped>
#UserInfo >>> .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
#UserInfo >>> .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
#UserInfo >>> .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
#UserInfo >>> .avatar {
  width: 178px;
  height: 178px;
  display: flex;
  background-color: #ffffff;
  object-fit: contain;
}
</style>