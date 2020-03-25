<template>
  <div class="contain">
    <el-card shadow="always" class="card" body-style="width: 100%; text-align: center;">
      <el-image fit="cover" :src="icon" style="width: 260px; height: 150px"></el-image>
      <el-row style="width: 100%">
        <el-menu
          :default-active="activeIndex"
          class="menu"
          mode="horizontal"
          @select="handleSelect"
        >
          <el-menu-item index="code">免密码登录</el-menu-item>
          <el-menu-item index="pwd">密码登录</el-menu-item>
        </el-menu>
        <el-col>
          <!-- 免密码登录 -->
          <el-form v-show="activeIndex == 'code'" :rules="codeRules" ref="code" :model="code">
            <el-form-item prop="phone">
              <el-input prefix-icon="el-icon-user" placeholder="手机号" v-model="code.phone"></el-input>
            </el-form-item>
            <el-form-item prop="code">
              <el-input
                prefix-icon="el-icon-lock"
                placeholder="输入6位短信验证码"
                v-model.number="code.code"
              >
                <el-button
                  class="code_btn"
                  slot="suffix"
                  type="text"
                  v-show="show"
                  @click="sendCode"
                >获取验证码</el-button>
                <el-button class="code_btn" slot="suffix" type="text" v-show="!show">{{ count }}s</el-button>
              </el-input>
            </el-form-item>
            <el-form-item style="text-align: center">
              <el-button
                type="primary"
                :loading="loginLoading"
                @click="onSubmit('code')"
                native-type="submit"
              >登录/注册</el-button>
            </el-form-item>
            <span class="tip">未注册手机验证后自动登录</span>
          </el-form>
          <!-- 密码登录 -->
          <el-form v-show="activeIndex == 'pwd'" :rules="pwdRules" ref="pwd" :model="password">
            <el-form-item prop="username">
              <el-input prefix-icon="el-icon-user" placeholder="账号或手机号" v-model="password.username"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                prefix-icon="el-icon-lock"
                placeholder="密码"
                v-model="password.password"
                show-password
              ></el-input>
            </el-form-item>
            <el-form-item style="text-align: center">
              <el-button type="primary" @click="onSubmit('pwd')">登录</el-button>
              <el-button @click="activeIndex = 'code'">注册</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      code: {
        phone: "",
        code: "",
        sessionId: ""
      },
      password: {
        username: "",
        password: ""
      },
      icon: "https://image.warmcongee.top/sell/RyBleme.png",
      activeIndex: "code",
      loginLoading: false,
      show: true,
      count: "",
      timer: null,
      codeRules: {
        phone: [
          {
            required: true,
            pattern: /^1[34578]\d{9}$/,
            message: "请输入正确手机号"
          }
        ],
        code: [
          { required: true, message: "请输入验证码" },
          { type: "number", message: "验证码为数字" }
        ]
      },
      pwdRules: {
        username: [{ required: true, message: "请输入账号或手机号" }],
        password: [{ required: true, message: "请输入密码" }]
      }
    };
  },
  methods: {
    // 登录
    async onSubmit(type) {
      let data;
      if (type == "code") {
        data = this.code;
      } else {
        data = this.password;
        data.phone = this.password.username;
      }
      let res = await this.$Http.login(data);
      // 响应
      if (res.code == 0) {
        this.$message.success({
          message: "登录成功"
        });
        this.$store.commit("setSellerId", res.data);
        if (this.isLogin) {
          this.$router.push({ name: "Home" });
        }
      } else {
        this.$message.error({
          message: res.msg
        });
      }
    },
    // 发送验证码
    async sendCode() {
      let res = await this.$Http.sendCode({
        phone: this.code.phone
      });
      // 响应
      if (res.code == 0) {
        this.$message.success({
          message: "发送成功，请注意查收！"
        });
        this.code.sessionId = res.data;
      }
      const TIME_COUNT = 60;
      if (!this.timer) {
        this.count = TIME_COUNT;
        this.show = false;
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--;
          } else {
            this.show = true;
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000);
      }
    },
    // 导航切换
    handleSelect(key) {
      this.activeIndex = key;
    }
  },
  created() {
    if (this.isLogin) {
      this.$router.push({ name: "Home" });
    }
  },
  computed: {
    isLogin() {
      return this.$store.state.seller.sellerId == null ? false : true;
    }
  }
};
</script>

<style scoped>
.contain {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  box-sizing: border-box;
  /* background-color:coral; */
  /* background-image: url(https://image.warmcongee.top/sell/backgroundImage.jpg);
  background-repeat: no-repeat;
  background-size: 100%; */
}

.card {
  width: 30%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.menu {
  margin-bottom: 20px;
  border: none;
}

.code_btn {
  padding-left: 10px;
  padding-right: 10px;
}

.tip {
  font-size: 13px;
  line-height: 18px;
  color: #909399;
}
</style>
