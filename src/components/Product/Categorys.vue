<template>
  <div>
    <el-row class="main_panel">
      <!-- 左侧操作栏 -->
      <el-col :span="4" class="opera_panel">
        <el-button @click="showAdd" size="mini">新增</el-button>
        <el-card>
          <div slot="header">
            <span>类目预览</span>
          </div>
          <div v-for="item in categoryList" :key="item.categoryId" class="item">
            <el-tag v-if="item.isSystem">{{item.categoryName}}</el-tag>
            <el-tag v-else type="success">{{item.categoryName}}</el-tag>
          </div>
        </el-card>
      </el-col>
      <!-- 右侧类目表 -->
      <el-col :span="15">
        <el-table :data="categoryList" style="width: 100%">
          <el-table-column prop="isSystem" label="类目类型" width="120">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.isSystem">系统-{{getCategoryText(scope.row)}}</el-tag>
              <el-tag v-else type="success">自定义</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="categoryName" label="类目名称">
            <template slot-scope="scope">
              <el-input
                v-if="editIndex == scope.$index"
                v-model="scope.row.categoryName"
                size="mini"
              ></el-input>
              <label v-else>{{scope.row.categoryName}}</label>
            </template>
          </el-table-column>
          <el-table-column prop="sort" label="排序参数">
            <template slot-scope="scope">
              <el-input
                v-if="editIndex == scope.$index && !scope.row.isSystem"
                v-model="scope.row.sort"
                size="mini"
              ></el-input>
              <label v-else>{{scope.row.isSystem? '无需设置':scope.row.sort}}</label>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="170">
            <template slot-scope="scope">
              <el-button
                @click="handleSave(scope.row, scope.$index)"
                v-if="editIndex == scope.$index"
                type="primary"
                size="small"
              >保存</el-button>
              <el-button @click="handleEdit(scope.ro, scope.$index)" v-else size="small">编辑</el-button>
              <el-button @click="handleCancel()" v-if="editIndex == scope.$index" size="small">取消</el-button>
              <el-popconfirm
                title="确定删除吗？"
                placement="top"
                @onConfirm="handleDelete(scope.row)"
                style="margin-left: 10px;"
              >
                <el-button
                  slot="reference"
                  v-if="!scope.row.isSystem && editIndex != scope.$index"
                  type="danger"
                  size="small"
                >删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!-- 类目操作框 -->
    <el-dialog title="类目" :visible.sync="centerDialogVisible" width="30%" center>
      <el-form :model="category" :rules="rules" ref="ruleForm" label-width="100" inline>
        <el-form-item label="类目名称" prop="categoryName">
          <el-input v-model="category.categoryName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序参数" prop="sort">
          <el-tooltip content="越小优先级越高" placement="right" effect="light">
            <el-input v-model.number="category.sort" autocomplete="off"></el-input>
          </el-tooltip>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
        <el-button @click="centerDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Categorys",
  data() {
    let checkSort = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("排序参数不能为空"));
      }
      // setTimeout(() => {
      if (!Number.isInteger(value)) {
        callback(new Error("请输入数字"));
      } else {
        if (value < 1) {
          callback(new Error("必须为正数"));
        } else {
          callback();
        }
      }
      // }, 500);
    };
    return {
      centerDialogVisible: false,
      categoryList: [],
      editIndex: -1,
      category: {},
      rules: {
        categoryName: [
          { required: true, message: "请输入类目名称", trigger: "blur" }
        ],
        sort: { required: true, validator: checkSort, trigger: "blur" }
      }
    };
  },
  methods: {
    // 显示新增面板
    showAdd() {
      this.category = {
        categoryId: "",
        sellerId: this.sellerId,
        categoryName: "",
        categoryType: "",
        isSystem: 0,
        isDelete: 0,
        sort: 1
      };
      this.centerDialogVisible = true;
    },

    // 新增
    async handleAdd(row) {
      let res = await this.$Http.addCategory(row);
      // 响应
      if (res.code == 0) {
        this.$message.success({
          message: "保存成功"
        });
      }
      this.centerDialogVisible = false;
      this.handleCancel();
    },

    // 保存
    async handleSave(row) {
      let res = await this.$Http.saveCategory(row);
      // 响应
      if (res.code == 0) {
        this.$message.success({
          message: "保存成功"
        });
      }
      this.handleCancel();
    },

    // 编辑
    handleEdit(row, index) {
      this.editIndex = index;
    },

    // 取消
    handleCancel() {
      this.getCategoryList();
      this.editIndex = -1;
    },

    // 删除
    async handleDelete(row) {
      let res = await this.$Http.deleteCategory({
        categoryId: row.categoryId
      });
      // 响应
      if (res.code == 0) {
        this.$message.success({
          message: "删除成功"
        });
      }
      this.handleCancel();
    },

    // 新增确认
    async submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.handleAdd(this.category);
        } else {
          return false;
        }
      });
    },

    // 获取类目列表
    async getCategoryList() {
      let res = await this.$Http.getCategoryList({
        sellerId: this.sellerId
      });
      // 响应
      if (res.code == 0) {
        this.categoryList = res.data;
        this.$emit("changeCategoryList", res.data);
      }
    }
  },
  created() {
    this.getCategoryList();
  },
  computed: {
    getCategoryText() {
      return function(row) {
        if (row.categoryType == "recommend") {
          return "推荐";
        } else if (row.categoryType == "required") {
          return "必选";
        } else if (row.categoryType == "discount") {
          return "折扣";
        }
      };
    },
    sellerId() {
      return this.$store.state.seller.sellerId;
    },
  }
};
</script>

<style scoped>
.main_panel {
  display: flex;
  padding: 20px 0 20px 20px;
}

.opera_panel {
  margin-right: 20px;
}

.opera_panel button {
  width: 100%;
  color: #409eff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.el-card__header {
  padding: 12px 20px;
}

.item {
  margin-bottom: 18px;
}
</style>
