<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 標圖區 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt />
      </div>
      <div>
        <!-- 登入表單區 -->
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginFormRules"
          label-width="0px"
          class="login_form"
        >
          <!-- 用戶名 -->
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
          </el-form-item>
          <!-- 密碼 -->
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" prefix-icon="el-icon-unlock" type="password"></el-input>
          </el-form-item>
          <!-- 按鈕 -->
          <el-form-item class="btns">
            <el-button type="primary" @click="login">登入</el-button>
            <el-button type="info" @click="resetLoginForm">清除</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 登入表單的數據綁定物件
      loginForm: {
        username: 'smallken',
        password: 'xxxxxx'
      },
      // 表單驗證規則
      loginFormRules: {
        // 驗證用戶名
        username: [
          { required: true, message: '請輸入登入名稱', trigger: 'blur' },
          { min: 3, max: 10, message: '長度在 3 到 10 個字', trigger: 'blur' }
        ],
        // 驗證密碼
        password: [
          { required: true, message: '請輸入密碼', trigger: 'blur' },
          { min: 5, max: 15, message: '長度在 5 到 15 個字', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 清除按鈕
    resetLoginForm() {
      // console.log(this);
      this.$refs.loginFormRef.resetFields()
    },

    // 送出請求前的預驗證方法validate()
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        console.log(valid)
        if (!valid) return
        const { data: res } = await this.$http.get('login', this.loginForm)

        if (res.meta.status !== 200) {
          return this.$message.error('登入失敗!')
        } else {
          this.$message.success('你登入成功了!')
        }
        console.log(res)
        // 把token保存到 sessionStorage
        window.sessionStorage.setItem('token', res.data.token)
        // 跳轉到新瀏覽頁面
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .btns {
    display: flex;
    justify-content: flex-end;
  }
}
</style>