<template>
  <div id="order">
    <!-- 筛选条件 -->
    <Search @search="search" />

    <!-- 订单列表 -->
    <el-row>
      <el-col>
        <el-table
          ref="orderTable"
          v-loading="loading"
          :data="orderData"
          style="width: 100%;"
          stripe
        >
          <!-- 详情 -->
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-row class="table_expand_panel">
                <!-- 购物车信息 -->
                <el-col :span="9">
                  <el-table :data="props.row.orderDetailList">
                    <el-table-column prop="productIcon" label="图片" width="120">
                      <template slot-scope="scope">
                        <el-avatar
                          shape="square"
                          size="medium"
                          fit="contain"
                          :src="scope.row.productIcon"
                        ></el-avatar>
                      </template>
                    </el-table-column>
                    <el-table-column prop="productName" label="名称"></el-table-column>
                    <el-table-column prop="productPrice" label="单价" width="100">
                      <template slot-scope="scope">{{ scope.row.productPrice.toFixed(2) }}</template>
                    </el-table-column>
                    <el-table-column prop="productQuantity" label="数量" width="100"></el-table-column>
                  </el-table>
                </el-col>
                <!-- 订单其他信息 -->
                <el-col :span="12">
                  <el-row>
                    <el-col :span="12">
                      <el-form label-position="left" class="table_expand_form">
                        <el-form-item label="期望时间">
                          <span>{{ props.row.arrivalTime }}</span>
                        </el-form-item>
                        <el-form-item label="餐具数量">
                          <span>{{ props.row.tableWare }}</span>
                        </el-form-item>
                        <el-form-item label="更新时间">
                          <span>{{ props.row.updateTime }}</span>
                        </el-form-item>
                      </el-form>
                    </el-col>
                    <el-col :span="12">
                      <el-form label-position="left" class="table_expand_form">
                        <el-form-item label="订单评分">
                          <span>{{ props.row.score == 0? '未评分':props.row.score }}</span>
                        </el-form-item>
                        <el-form-item label="备注">
                          <span>{{ props.row.remark }}</span>
                        </el-form-item>
                      </el-form>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column prop="orderId" label="订单ID" width="180"></el-table-column>
          <el-table-column prop="buyerName" label="姓名" width="80"></el-table-column>
          <el-table-column prop="buyerPhone" label="手机号" width="120"></el-table-column>
          <el-table-column prop="buyerAddress" label="地址" width="180"></el-table-column>
          <el-table-column prop="orderAmount" label="金额" width="80">
            <template slot-scope="scope">{{ scope.row.orderAmount.toFixed(2) }}</template>
          </el-table-column>
          <el-table-column prop="orderStatus" label="订单状态" width="100">
            <template slot-scope="scope">
              <el-tag
                type="info"
                v-if="scope.row.orderStatus == 0 && scope.row.payStatus == 0 || scope.row.orderStatus == 4"
                disable-transitions
              >{{ getOrderStatus(scope.row.orderStatus, scope.row.payStatus) }}</el-tag>
              <el-tag
                type="success"
                v-else-if="scope.row.orderStatus == 3"
                disable-transitions
              >{{ getOrderStatus(scope.row.orderStatus, scope.row.payStatus) }}</el-tag>
              <el-tag
                type="primary"
                v-else
                disable-transitions
              >{{ getOrderStatus(scope.row.orderStatus, scope.row.payStatus) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="payStatus" label="支付状态" width="100">
            <template slot-scope="scope">
              <el-tag
                type="info"
                v-if="scope.row.payStatus == 0 && scope.row.orderStatus == 4"
                disable-transitions
              >未支付</el-tag>
              <el-tag type="danger" v-else-if="scope.row.payStatus == 0" disable-transitions>未支付</el-tag>
              <el-tag type="success" v-else-if="scope.row.payStatus == 1" disable-transitions>已支付</el-tag>
              <el-tag type="info" v-else-if="scope.row.payStatus == 2" disable-transitions>已退款</el-tag>
              <el-tag type="info" v-else disable-transitions>订单状态有误</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="160"></el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button
                size="mini"
                v-if="scope.row.orderStatus == 0 && scope.row.payStatus == 1"
                type="primary"
                @click="handleAccept(scope.$index, scope.row)"
              >接单</el-button>
              <el-button
                size="mini"
                v-if="scope.row.orderStatus == 1 && scope.row.payStatus == 1"
                type="primary"
                @click="handleDelivery(scope.$index, scope.row)"
              >派送</el-button>
              <el-button
                size="mini"
                v-if="scope.row.orderStatus == 2 && scope.row.payStatus == 1"
                type="primary"
                @click="handleFinish(scope.$index, scope.row)"
              >完成</el-button>
              <el-button
                size="mini"
                v-if="scope.row.orderStatus == 0 && scope.row.payStatus == 1"
                type="danger"
                @click="cancelConfirm(scope.$index, scope.row)"
              >取消</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!-- 分页 -->
    <el-row class="page_panel">
      <el-col>
        <el-pagination
          :page-size="10"
          :pager-count="11"
          layout="prev, pager, next"
          :total="total"
          @current-change="currentChange"
        ></el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import util from "@/util/util";
import Search from "./Order/Search";
export default {
  name: "Order",
  components: {
    Search
  },
  data() {
    return {
      condition: {},
      loading: false,
      total: 0,
      orderData: [],
      orderStatus: {
        NEW: { code: 0, message: "新订单" },
        RECEIPT: { code: 1, message: "已接单" },
        DELIVER: { code: 2, message: "开始派送" },
        FINISHED: { code: 3, message: "已完成" },
        CANCEL: { code: 4, message: "已取消" }
      },
      audio: false
    };
  },
  methods: {
    // 接单
    async handleAccept(index, row) {
      // 请求
      let res = await this.$Http.accept({
        sellerId: this.sellerId,
        orderId: row.orderId
      });
      // 响应
      if (res.code == 0) {
        row.orderStatus = this.orderStatus.RECEIPT.code;
        this.$message.success({ message: this.orderStatus.RECEIPT.message });
      }
    },

    // 派送
    async handleDelivery(index, row) {
      // 请求
      let res = await this.$Http.delivery({
        sellerId: this.sellerId,
        orderId: row.orderId
      });
      // 响应
      if (res.code == 0) {
        row.orderStatus = this.orderStatus.DELIVER.code;
        this.$message.success({ message: this.orderStatus.DELIVER.message });
      }
    },

    // 完成
    async handleFinish(index, row) {
      // 请求
      let res = await this.$Http.finish({
        sellerId: this.sellerId,
        orderId: row.orderId
      });
      // 响应
      if (res.code == 0) {
        row.orderStatus = this.orderStatus.FINISHED.code;
        this.$message.success({ message: this.orderStatus.FINISHED.message });
      }
    },

    // 取消提示
    cancelConfirm(index, row) {
      this.$confirm("是否取消订单?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.handleCancel(index, row);
        })
        .catch(() => {});
    },

    // 取消执行
    async handleCancel(index, row) {
      // 请求
      let res = await this.$Http.cancel({
        sellerId: this.sellerId,
        orderId: row.orderId
      });
      // 响应
      if (res.code == 0) {
        row.orderStatus = this.orderStatus.CANCEL.code;
        this.$message.success({ message: this.orderStatus.CANCEL.message });
        if (row.payStatus == 1) {
          setTimeout(function() {
            row.payStatus = 2;
          }, 1000);
        }
      }
    },

    // 当前页码改变
    currentChange(page) {
      this.getOrderList(page);
    },

    // 搜索
    search(e) {
      this.condition = e;
      this.getOrderList(1);
    },

    // 获取订单列表
    async getOrderList(page) {
      // 查询参数设置
      let params = this.condition;
      params.sellerId = this.sellerId;
      params.page = page;
      if(!params.sellerId) {
        this.$message.error({ message: "请先登陆账号！" });
        return;
      }
      // 请求
      let res = await this.$Http.getOrderList(params);
      // 响应
      if (res.code == 0) {
        this.total = res.data.total;
        this.orderData = res.data.list;
      }
    },

    // 新订单通知
    notifyNew() {
      this.$notify.success({
        title: "提示",
        message: "您有新的订单，请及时处理！",
        duration: 0
      });
      let audio = new Audio();
      audio.src =
        "https://image.warmcongee.top/sell/seller/tts/new_order_tts.mp3";
      audio.play();
    }
  },
  created() {
    this.condition.date = util.getToday();
    this.getOrderList(1);
    this.$root.$on("getNewOrder", () => {
      this.notifyNew();
      this.getOrderList(1);
    });
  },
  computed: {
    getOrderStatus() {
      return function(orderStatus, payStatus) {
        if (orderStatus == 4) {
          if (payStatus == 2) {
            return "已退款";
          } else if (payStatus == 1) {
            return "退款中";
          }
          {
            return "已取消";
          }
        }
        if (payStatus == 0) {
          return "待付款";
        } else if (payStatus == 1) {
          if (orderStatus == 0) {
            return "待接单";
          } else if (orderStatus == 1) {
            return "已接单";
          } else if (orderStatus == 2) {
            return "派送中";
          } else if (orderStatus == 3) {
            return "已完成";
          }
        } else {
          return "订单状态错误";
        }
      };
    },
    sellerId() {
      return this.$store.state.seller.sellerId;
    },
  }
};
</script>

<style>
#order {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
}

.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}

.table_expand_panel {
  display: flex;
  justify-content: space-between;
}

.table_expand_form {
  font-size: 0;
}

.table_expand_form label {
  width: 90px;
  color: #99a9bf;
}

.page_panel {
  margin: 20px 0;
}
</style>