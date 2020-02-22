<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首頁</el-breadcrumb-item>
      <el-breadcrumb-item>用戶管理</el-breadcrumb-item>
      <el-breadcrumb-item>用戶列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片區 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="請輸入內容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="adddialogVisible=true">+ 新增用戶</el-button>
        </el-col>
      </el-row>
      <!-- 用戶列表區 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="Email"></el-table-column>
        <el-table-column prop="mobile" label="電話"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="狀態">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 刪改按鈕 -->
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分頁區域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 新增用戶的對話框 -->
    <el-dialog title="新增用戶" :visible.sync="adddialogVisible" width="50%">
      <!-- 內容主體 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="用戶名稱" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密碼" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="EMAIL" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手機" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部區 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="adddialogVisible=false">取消</el-button>
        <el-button type="primary" @click="adddialogVisible=false">確定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 取得用戶列表的參數
      queryInfo: {
        query: '',
        // 當前頁數
        pagenum: 1,
        // 當前每頁顯示多少筆
        pagesize: 2
      },
      userList: [],
      total: 0,
      // 控制新增用戶對話框顥示
      adddialogVisible: false,
      // 新增用戶的表單資料
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 新增用戶的驗證表單規則
      addFormRules: {
        username: [
          {
            required: true,
            message: '請輸入用戶名稱',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '請用戶名長度在3到10字之間',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '請輸入密碼',
            trigger: 'blur'
          },
          {
            min: 5,
            max: 15,
            message: '請用密碼長度在5到15字之間',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: '請輸入EMAIL',
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '請輸入手機',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.userinfo
      })
      if (res.meta.status !== 200)
        return this.$message.error('取得用戶資料失敗!')
      this.userList = res.data.users
      this.total = res.data.total
      console.log(res)
    },
    // 監聽pageSize改變的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      // console.log(newSize)
      this.getUserList()
    },
    // 監聽頁碼值改變的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      // console.log(newPage)
      this.getUserList()
    },
    // 監聽switch狀態的改變
    async userStateChanged(userinfo) {
      // console.log(userinfo)
      // 這裡只是語法示範, 實際上會json-server後端操作不會更新成功
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        this.userinfo.mg_state = !this.userinfo.mg_state
        return this.$message.error('更新用戶狀態失敗!')
      } else {
        this.$message.success('更新用戶狀態成功!')
      }
      console.log(res)
    }
  }
}
</script>

<style lang="less" scoped>
</style>