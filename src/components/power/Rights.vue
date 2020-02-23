<template>
  <div>
    <!-- 麵包屑導航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首頁</el-breadcrumb-item>
      <el-breadcrumb-item>權限管理</el-breadcrumb-item>
      <el-breadcrumb-item>權限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片區 -->
    <el-card>
      <el-table :data="rightList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="權限名稱"></el-table-column>
        <el-table-column prop="path" label="路徑"></el-table-column>
        <el-table-column prop="level" label="權限等級">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一級</el-tag>
            <el-tag v-if="scope.row.level === '1'" type="success">二級</el-tag>
            <el-tag v-if="scope.row.level === '2'" type="warning">三級</el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column v-for="col in columns"
          :prop="col.id"
          :key="col.id"
          :label="col.label"
          :width="col.width">
        </el-table-column>-->
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有權限列表
      rightList: []
    }
  },
  created() {
    // 取得所有權限列表
    this.getRightsList()
  },
  methods: {
    async getRightsList() {
      const { data: res } = await this.$http.get('rights_list')
      console.log(res)
      if (res.meta.status !== 200)
        return this.$message.error('取得權限列表失敗')
      this.rightList = res.data
    }
  }
}
</script>


<style lang="less" scoped>
</style>