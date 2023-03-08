<template>
  <div class="layout">
    <el-tabs type="border-card">

      <el-tab-pane label="用户登录">
        <el-form
            label-position="right"
            label-width="70px"
            style="max-width: 460px"
            class="loginForm">
          <el-form-item label="用户名：">
            <el-input v-model="commonUser.name"/>
          </el-form-item>
          <el-form-item label="密码：">
            <el-input type="password" v-model="commonUser.password"/>
          </el-form-item>
          <el-button
              v-if="commonUserLoginAgree"
              type="primary"
              class="loginBtn"
              @click="commonUserLogin">
            登录
          </el-button>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="管理员登录">
        <el-form
            label-position="right"
            label-width="70px"
            style="max-width: 460px"
            class="loginForm">
          <el-form-item label="用户名：">
            <el-input v-model="administrator.name"/>
          </el-form-item>
          <el-form-item label="密码：">
            <el-input type="password" v-model="administrator.password"/>
          </el-form-item>
          <el-button
              v-if="administratorLoginAgree"
              type="primary"
              class="loginBtn"
              @click="administratorLogin">
            登录
          </el-button>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="注册">
        <el-form
            label-position="right"
            label-width="70px"
            style="max-width: 460px"
            class="loginForm">
          <el-form-item label="用户名：">
            <el-input v-model="registerUser.name"/>
          </el-form-item>
          <el-form-item label="密码：">
            <el-input type="password" v-model="registerUser.password"/>
          </el-form-item>
          <el-form-item label="邮箱：">
            <el-input v-model="registerUser.mail"/>
          </el-form-item>
          <el-button
              v-if="registerAgree"
              type="primary"
              class="loginBtn"
              @click="register">
            注册
          </el-button>
        </el-form>
      </el-tab-pane>

    </el-tabs>
  </div>
</template>
<script>
import {computed, getCurrentInstance, reactive} from "vue";
import {ElMessageBox } from 'element-plus'
import axios from 'axios'

  export default {
    name: 'Login',
    setup(props,context) {

      const commonUser = reactive({
        name: "",
        password: "",
      });
      const administrator = reactive({
        name: "",
        password: "",
      });

      const registerUser = reactive({
        name: "",
        password: "",
        mail: "",
      });

      const commonUserLoginAgree = computed(() => {
        return commonUser.name !== "" && commonUser.password !== ""
      });

      const administratorLoginAgree = computed(() => {
        return administrator.name !== "" && administrator.password !== ""
      });

      const registerAgree = computed(() => {
        return registerUser.name !== "" && registerUser.password !== ""
      });

      // 仅可在setup()直接调动getCurrentInstance()函数
      const appConfig = getCurrentInstance().appContext.config;

      function commonUserLogin() {
        axios.post("http://122.205.95.110:10000/login/user", {
          name: commonUser.name,
          password: commonUser.password,
        }).then(response => {
          context.emit("getLoginState", true)
          // 获取登录令牌
          const token = response.data.data.token;
          // 浏览器本地化存储
          window.localStorage.setItem("Authorization", token);
          // 更新全局axios对象 携带token
          const commonRequest = axios.create({
            // baseURL: "http://localhost:10001/api",
            // baseURL: "http://122.205.95.110:10000",
            baseURL: "/api",
            timeout: 100000
          });
          commonRequest.interceptors.request.use(
              config => {
                // 在请求头中添加token
                config.headers.Authorization = token
                return config
              })
          // appConfig.globalProperties.commonRequest = commonRequest
          appConfig.globalProperties.$commonRequest = commonRequest
          location.reload()
        }).catch(function (error) {
          console.log(error)
          ElMessageBox.alert("登录失败");
          context.emit("getLoginState", false)
        });
      }

      function administratorLogin() {
        axios.post("http://122.205.95.110:10000/login/administrator", {
          name: administrator.name,
          password: administrator.password,
        }).then(response => {

          const token = response.data.data.token;
          window.localStorage.setItem("Authorization", token);

          const commonRequest = axios.create({
            baseURL: "http://localhost:5173/api",
            timeout: 100000
          })
          commonRequest.interceptors.request.use(config => {
            // 在请求头中添加token
            config.headers.Authorization = token
            return config
          })
          appConfig.globalProperties.commonRequest = commonRequest
        }).catch(function (error) {
          console.log(error);
        });
      }

      function register() {
        axios.post("http://122.205.95.110:10000/register/user", {
          name: registerUser.name,
          password: registerUser.password,
          mail: registerUser.mail,
        }).then(response => {
          console.log("请登录")
        }).catch(function (error) {
          console.log(error)
        });
      }

      return {
        commonUser,
        administrator,
        registerUser,
        commonUserLoginAgree,
        administratorLoginAgree,
        registerAgree,
        commonUserLogin,
        administratorLogin,
        register,
      };
    }
  }
</script>

<style scoped>
  .layout {
    position: absolute;
    left: calc(50% - 200px);
    top: 20%;
    width: 400px;
  }
  .loginBtn {
    width: 100px;
  }
  .loginForm {
    text-align: center;
  }
</style>
