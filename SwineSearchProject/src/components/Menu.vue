<template>

  <el-container class="home-container">
    <el-header>
      <div>
        <span>棉花数据库后台管理系统</span>
      </div>
<!--      <el-slider v-model="rowsPerPage" :step="10" show-stops />-->
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside >
        <el-menu
            router
            active-text-color="#ffd04b"
            background-color="#001529"
            text-color="#999"
        >
          <el-menu-item index="/menu/home">
            <el-icon><IconMenu/></el-icon>
            <span>首页</span>
          </el-menu-item>
          <el-sub-menu >
            <template #title>
              <el-icon><Document/></el-icon>
              <span>数据</span>
            </template>

            <el-menu-item index="/menu/data/cds?class=cds" >
              <template #title>
                <el-icon><Folder /></el-icon>
                <span style="font-size: 8px">Cds</span>
              </template>
            </el-menu-item>

            <el-menu-item index="/menu/data/tenGenomesOrthoGroups?class=tenGenomesOrthoGroups" >
              <template #title>
                <el-icon><Folder /></el-icon>
                <span style="font-size: 8px">10GenomesOrthoGroups</span>
              </template>
            </el-menu-item>

          </el-sub-menu>
          <el-sub-menu>
            <template #title>
              <el-icon><Setting/></el-icon>
              <span>权限管理</span>
            </template>
            <el-menu-item index="/menu/user" >
              <template #title>
                <el-icon><Avatar /></el-icon>
                <span>用户列表</span>
              </template>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
import {
    Document,
    Menu as IconMenu,
    Setting,
    Avatar,
    Folder

} from '@element-plus/icons-vue';
import {ElMessage, ElMessageBox} from "element-plus";
import axios from "axios";
import {getCurrentInstance, ref} from "vue";

export default {
  name: "Menu",
  components: {
    Document,
    Setting,
    IconMenu,
    Avatar,
    Folder
  },
  setup() {
    const appConfig = getCurrentInstance().appContext.config;
    const rowsPerPage=ref()

    // 登出
    function logout(){
      ElMessageBox.confirm(
          '是否要退出后台管理系统',
          {
            confirmButtonText: '确定退出',
            cancelButtonText: '取消',
            type: 'warning',
          }
      ).then(() => {
        ElMessage({
          type: 'success',
          message: '成功退出',
        })
        window.localStorage.removeItem("Authorization")
        const commonRequest = axios.create({
          baseURL: "http://localhost:5173/api",
          timeout: 100000
        });
        appConfig.globalProperties.commonRequest=commonRequest
        // 刷新界面
        location.reload()
      }).catch(() => {
        ElMessage({
          type: 'info',
          message: '取消',
        })
      })
    }

    return {
      logout,
      rowsPerPage
    }
}
}
</script>

<style scoped lang="less">
  .home-container{
    height: 100%;
    }
    .el-header{
      background-color: #001529;
      display: flex;
      justify-content: space-between;
      padding-left: 0px;
      align-items:center;
      color:#fff;
      font-size: 20px;

      >div{
        display:flex;
      align-items:center;

      >span{
        margin-left: 20px;
      }
    }
  }

  .el-aside{
    background-color: #001529;
    width: 200px;
    height: 100vh;
  }

  .el-main{
    background-color: #EAEDF1;
  }


</style>