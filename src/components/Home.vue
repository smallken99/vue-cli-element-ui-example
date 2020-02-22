<template>
  <el-container class="home_container">
    <!-- 頭部區 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt height="60px" />
        <span>電子商務管理系統</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 頁面主體區 -->
    <el-container>
      <!-- 側邊欄 -->
      <el-aside :width="isCollapse? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一級菜單 -->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <!-- 一級菜單模板區 -->
            <template slot="title">
              <!-- 圖示 -->
              <i :class="iconObj[item.id]"></i>
              <!-- 本文 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二級菜單 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <!-- 二級菜單模板區 -->
              <template slot="title">
                <!-- 圖示 -->
                <i class="el-icon-menu"></i>
                <!-- 本文 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主體區 -->
      <el-main>
        <!-- 路由佔位 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
 

<script>
export default {
  data() {
    return {
      // 左側功能清單
      menuList: [],
      iconObj: {
        '125': 'el-icon-s-custom',
        '103': 'el-icon-s-claim',
        '102': 'el-icon-s-goods',
        '101': 'el-icon-s-shop',
        '145': 'el-icon-pie-chart'
      },
      isCollapse: false,
      // 被點選的功能
      activePath: ''
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 取得左側所有功能清單
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
      console.log(res)
    },
    // 點擊按鈕切換清單折疊效果
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 保存點選功能項目
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home_container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 10px;
  padding-top: 10px;
  align-items: center;
  color: #fff;
  font-size: 24px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 10px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: 0px;
  }
}
.el-main {
  background-color: #eaedf1;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 14px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.1em;
  cursor: pointer;
}
</style>