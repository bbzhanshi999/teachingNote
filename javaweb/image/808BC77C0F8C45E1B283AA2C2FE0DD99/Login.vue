<template>
  <div class="login">
    <el-dialog
      title="注册用户"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-form
        :model="signUpForm"
        label-width="80px"
      >
        <el-form-item label="用户名">
          <el-input
            v-model="signUpForm.username"
            type="text"
          />
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model="signUpForm.password"
            type="password"
            show-password
          />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="signUp"
        >确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <img
      src="./../assets/logo.png"
      width="200"
      height="200"
    >
    <h1>{{ title }}</h1>
    <el-row>
      <el-col
        v-show="signFlag"
        :span="8"
        :offset="8"
      >
        <el-alert
          title="错误提示的文案"
          type="error"
        />
      </el-col>
    </el-row>
    <el-row>
      <el-col
        :span="8"
        :offset="8"
      >
        <el-input
          v-model="username"
          placeholder="请输入用户名"
          @focus="signFlag=false"
        >
          <template slot="prepend">
            用户名
          </template>
        </el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col
        :span="8"
        :offset="8"
      >
        <el-input
          v-model="password"
          placeholder="请输入密码"
          show-password
          :type="password"
          @focus="signFlag=false"
        >
          <template slot="prepend">
            密码
          </template>
        </el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col
        :span="4"
        :offset="8"
      >
        <el-button
          type="primary"
          @click="submit"
        >
          提交
        </el-button>
      </el-col>
      <el-col :span="4">
        <el-button
          type="success"
          @click="openSignUpDialog"
        >
          注册
        </el-button>
      </el-col>
    </el-row>
    <!-- <input
      v-model="username"
      type="text"
      name="username"
      placeholder="username"
    ><br>
    <input
      v-model="password"
      type="password"
      name="password"
      placeholder="password"
    ><br>
    <button @click="submit">
      提交
    </button>
    <button @click="haha">
      哈哈
    </button>-->
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      username: '',
      password: '',
      title: '人事管理系统',
      signFlag: false,
      dialogVisible: false,
      signUpForm: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    submit () {
      // todo 具体的提交逻辑，1.获取input框的数据 2，通过axios提交数据
      let username = this.username
      let password = this.password
      // 用axios发送post请求
      window.axios.post('/api/signIn', { username, password }).then(res => {
        // 1.跳转到index页面，通过路由跳转
        this.$router.push({ path: '/index/talent' })
      }).catch(() => {
        // 将signFlag设置为true
        this.signFlag = true
      })
    },
    openSignUpDialog () {
      this.dialogVisible = true
    },
    signUp () {
      this.dialogVisible = false // 关闭窗口
      window.axios.post('/api/signUp', this.signUpForm).then(res => {
        this.$message({
          message: '用户注册成功',
          type: 'success'
        })
      })
    }
  }
}
</script>

<style scoped>
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .login {
    margin-top: 8rem;
  }
  h1 {
    font-weight: normal;
  }

</style>
