<template>
  <div>
    <!-- 麵包屑導航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首頁</el-breadcrumb-item>
      <el-breadcrumb-item>權限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片區 -->
    <el-card>
      <!-- 新增角色的按鈕 -->
      <el-row>
        <el-col>
          <el-button type="primary">新增角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色清單 -->
      <el-table :data="roleList" border stripe>
        <!-- 展開列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom',i1===0? 'bdtop': '','vcenter']"
              v-for="(item1,i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 一級權限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightsById(item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二級與三級權限 -->
              <el-col :span="19">
                <el-row
                  :class="[i2===0? '': 'bdtop','vcenter']"
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                >
                  <!-- 二級權限 -->
                  <el-col :span="8">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightsById(item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三級權限 -->
                  <el-col :span="16">
                    <el-tag
                      type="warning"
                      v-for="(item3,i3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightsById(item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名稱"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="功能" width="300px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">編輯</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">刪除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog(scope.row)"
            >分配權限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配權限的對話框 -->
    <el-dialog title="分配權限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClosed">
      <!-- 樹狀元件       -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
      ></el-tree>

      <span slot="footer">
        <el-button @click=" setRightDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="setRightDialogVisible = false">確定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有角色列表資料
      roleList: [],
      // 控制分配權限對話框的顯示
      setRightDialogVisible: false,
      // 所有權限資料
      rightsList: [],
      // 樹狀元件的設定值
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 預設選中樹狀節點
      defKeys: []
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    // 取得所有角色的列表
    async getRoleList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200)
        return this.$message.error('取得角色資料失敗')
      this.roleList = res.data
      console.log(this.roleList)
    },
    // 刪除權限
    removeRightsById(id) {
      // 跳出確認視窗是否真的要刪除
      this.$confirm('是否真的要刪除這個權限?', '提示', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning',
        callback: action => {
          console.log(action)
          if (action === 'cancel') return this.$message.info('取消了刪除')
          // 發起刪除請求
          // 不實作了...
          this.$message.success('確認刪除')
        }
      })
    },
    // 開啟分配權限的對話框
    async showSetRightDialog(role) {
      // 取得權限列表資料
      const { data: res } = await this.$http.get('rights_tree')
      this.rightsList = res.data
      console.log(this.rightsList)
      this.getLeapKeys(role,this.defKeys)
      this.setRightDialogVisible = true
    },
    // 通過遞迴取得所有權限id
    getLeapKeys(node , arr) {
      if(!node.children){
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeapKeys(item,arr)
      });
    },
    // 監聽分配權限的關閉事件
    setRightDialogClosed() {
      this.defKeys = []
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>