<template>
  <div>
    <el-form :inline="true" label-width="70px">
      <el-form-item label="日期">
        <el-date-picker
          v-model="condition.date"
          type="date"
          :clearable="false"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          size="mini"
          class="date_picker"
        ></el-date-picker>
      </el-form-item>
      <!-- <el-form-item label="地址">
        <el-select v-model="address" clearable placeholder="请选择" size="mini" class="address_select">
          <el-option
            v-for="item in addressOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>-->
      <el-form-item label="关键字">
        <el-tag
          :key="tag.value"
          v-for="tag in tags"
          size="medium"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
        >{{tag.label}}</el-tag>
        <el-popover placement="bottom" width="400" v-model="popoverVisible">
          <el-input
            placeholder="请输入关键字"
            v-model="key"
            size="mini"
            style="width: 320px; margin-right: 20px;"
          >
            <el-select v-model="select" slot="prepend" size="mini" placeholder="请选择">
              <el-option
                v-for="item in selects"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-input>
          <el-button size="mini" type="primary" @click="addKey">确定</el-button>
          <el-button slot="reference" size="mini">点击指定</el-button>
        </el-popover>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" round size="mini" @click="search">搜索</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import util from "@/util/util";
export default {
  name: "Search",
  data() {
    return {
      popoverVisible: false,
      address: "",
      key: "",
      select: "orderId",
      selects: [
        {
          label: "订单号",
          value: "orderId"
        },
        {
          label: "姓名",
          value: "buyerName"
        },
        {
          label: "手机号",
          value: "buyerPhone"
        },
        {
          label: "地址",
          value: "buyerAddress"
        }
      ],
      tags: [],
      addressOptions: [
        {
          label: "1号楼",
          value: "1号楼"
        },
        {
          label: "2号楼",
          value: "2号楼"
        }
      ],
      condition: {
        date: "",
        orderId: "",
        buyerName: "",
        buyerPhone: "",
        buyerAddress: ""
      }
    };
  },
  methods: {
    init() {
      this.condition.date = util.getToday();
    },
    // 添加关键字
    addKey() {
      if (this.key != "") {
        this.selects.forEach(item => {
          if (this.select == item.value) {
            // 如果已存在该条件，先移除
            this.tags.forEach(element => {
              if(element.value == item.value){
                this.tags.pop(element);
              }
            });
            // 添加当前查询条件
            this.tags.push({
              label: item.label + ": " + this.key,
              value: item.value
            });
            this.condition[item.value] = this.key;
            // 重置输入框
            this.key = "";
          }
        });
      }
      this.popoverVisible = false;
    },
    // 删除关键字
    handleClose(tag) {
      this.tags.splice(this.tags.indexOf(tag), 1);
      this.condition[tag.value] = "";
    },
    // 搜索
    search() {
      this.$emit("search", this.condition);
    }
  },
  created() {
    this.init();
  }
};
</script>

<style scoped>
.date_picker {
  width: 150px;
}
.address_select {
  width: 100px;
}
.el-tag {
  margin-right: 10px;
}
.el-select {
  width: 100px;
}
</style>
