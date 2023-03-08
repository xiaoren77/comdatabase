<template>
  <login v-if="!loginState" @getLoginState="getLoginState"></login>
  <router-view></router-view>
</template>
<script>
  import Login from './components/Login.vue'
  import Menu from './components/Menu.vue'
  import Home from './components/Home.vue'
  import User from './components/User.vue'
  import Data from './components/Data.vue'

  import {onMounted, ref} from "vue";
  import { useRouter } from 'vue-router'
  export default {
    name: 'App',
    components: {
      Login,
      Menu,
      Home,
      User,
      Data,
    },
    setup() {
      const router = useRouter()
      const loginState=ref(false)

      onMounted(()=>{
        // todo Authorization有效性测试
        if (window.localStorage.getItem("Authorization") !== null) {
          loginState.value = true
          router.push("/menu/home")
        }else{
          router.push("/")
        }
      })

      function getLoginState(state) {
        if (state) {
          loginState.value=true
          router.push("/menu")
        }
      }

      return {
        loginState,
        getLoginState,
      }
    },
  }
</script>

<style scoped>

</style>
