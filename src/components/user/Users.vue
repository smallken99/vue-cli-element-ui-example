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
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <!-- 刪改按鈕 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRole(scope.row)"
              ></el-button>
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
    <el-dialog title="新增用戶" :visible.sync="adddialogVisible" width="50%" @close="addFormClosed">
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
        <el-button type="primary" @click="addUser">確定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用戶的對話框 -->
    <el-dialog title="修改用戶" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="用戶名稱">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="電子郵箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手機號碼" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="editDialogVisible= false">取消</el-button>
        <el-button type="primary" @click="editUserInfo">確定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色的對話框 -->
    <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="50%" @close="setRoleDialogClosed">
      <div>
        <p>當前的用戶:{{userInfo.username}}</p>
        <p>當前的角色:{{userInfo.role_name}}</p>
        <p>
          分配新角色:
          <el-select v-model="selectedRoldId" placeholder="請選擇">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer">
        <el-button @click=" setRoleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveRoleInfo">確定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 驗證email的規則
    var checkEmail = (rule, value, cb) => {
      // 驗證email的正測表示式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        // 合法的email
        return cb()
      } else {
        cb(new Error('請輸入合法的電子email'))
      }
    }
    // 驗證手機號碼
    var checkMobile = (rule, value, cb) => {
      // 驗證手機號碼的正測表示式
      const regMobile = /^\d{10}$/
      if (regMobile.test(value)) {
        // 合法的手機號碼
        return cb()
      } else {
        cb(new Error('請輸入合法的手機號碼'))
      }
    }
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
          },
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '請輸入手機',
            trigger: 'blur'
          },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 控制修改用戶對話框的顯示
      editDialogVisible: false,
      // 保存修改對話框的欄位資訊
      editForm: {},
      // 修改表單的驗證規則
      editFormRules: {
        email: [
          {
            required: true,
            message: '請輸入EMAIL',
            trigger: 'blur'
          },
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '請輸入手機',
            trigger: 'blur'
          },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      setRoleDialogVisible : false,
      // 需要被分配角色的用戶
      userInfo: {},
      roleList:[],
      selectedRoldId:''
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
    },
    // 監聽關閉視窗事件 重置表單驗證訊息
    addFormClosed() {
      console.log('addFormClosed')
      this.$refs.addFormRef.resetFields()
    },
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        // 校驗成功 可以正式發起新增用戶請求
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error('新增用戶失敗')
        }
        this.$message.success('新增用戶成功')
        // 隱藏對話框
        this.adddialogVisible = false
        // 重新取得用戶清單
        this.getUserList()
      })
    },
    // 彈出修改對話框
    async showEditDialog(id) {
      console.log(id)
      const { data: res } = await this.$http.get(`user/${id}`)
      console.log(res)
      this.editForm = res
      this.editDialogVisible = true
    },
    // 監聽修改用戶關閉對話框
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用戶資料驗證並提交
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        console.log(valid)
        if (!valid) return
        // 發起修改用戶資訊的請求
        const { data: res } = await this.$http.put(
          'user/' + this.editForm.id,
          this.editForm
        )
        console.log(res)
        // 以下為了可以讓json-server可以更新資料成功,所以使用跟原本取得使用者列表不一樣的資料來源,
        // 也沒有去判斷meta.status的回應碼,以下只是為了讓更新可以成功的示範而已。
        if (res.id === this.editForm.id) {
          // 關閉對話視窗
          this.editDialogVisible = false
          // 重新詢用戶列表
          this.getUserList()
          // 訊息
          this.$message.success('修改用戶成功')
        } else {
          this.$message.error('修改用戶失敗')
        }
      })
    },
    // 刪除用戶
    removeUserById(id) {
      this.$confirm('是否永久刪除?', '提示', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning',
        callback: async action => {
          console.log(action) // cancel or confirm
          if(action === 'cancel'){
            return this.$message.info('已經取消刪除')
          }else{
            // 以下為了可以讓json-server可以刪除資料成功,所以使用跟原本取得使用者列表不一樣的資料來源,
            // 也沒有去判斷meta.status的回應碼,以下只是為了讓刪除可以成功的示範而已。
            const { data: res } = await this.$http.delete('user/' + id)
            console.log(res)
            if(Object.keys(res).length == 0){ // 判斷空物件表示已經刪除
               this.$message.success('確認刪除用戶')
            }else{
              this.$message.error('刪除用戶失敗')
            }
           
          }
        }
      });
      
      console.log(id)
    },
    // 分配角色
    async setRole(userInfo) {
      this.userInfo = userInfo
      // 猜取角色列表
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200)
        return this.$message.error('取得角色資料失敗')
      this.roleList = res.data
      console.log(res)

      this.setRoleDialogVisible = true
    },
    // 保存分配角色
    async saveRoleInfo() {
      if(!this.selectedRoldId)
        return this.$message.error('請選擇要分配的角色')      
      // 發起請求保存角色
      // 以下發起請求應該會失敗
      const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.selectedRoldId})
      if (res.meta.status !== 200)
        return this.$message.error('更新角色資料失敗')     
      this.$message.success('更新成功')
      this.getUserList()
      this.setRoleDialogVisible  = false
    },
    setRoleDialogClosed() {
      this.selectedRoldId = '' 
      this.userInfo = {}
    }
  }
}
</script>

<style lang="less" scoped>
</style>