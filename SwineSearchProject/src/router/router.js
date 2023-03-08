import { createRouter,createWebHashHistory } from 'vue-router'
import Home from "../components/Home.vue"
import User from "../components/User.vue"
import Login from "../components/Login.vue"
import Menu from "../components/Menu.vue";
import Data from "../components/Data.vue"


const routes = [
    {
        name: "Menu",
        path: '/menu',
        component: Menu,
        children:[
            {
                name: "Home",
                path: 'home',
                component: Home,
            },
            {
                name: "User",
                path: 'user',
                component: User,
            },
            {
                name: "Cds",
                path: 'data/cds',
                component: Data,
            },
            {
                name: "tenGenomesOrthoGroups",
                path: 'data/tenGenomesOrthoGroups',
                component: Data,
            },


        ]
    },
    {
        name: "Login",
        path: "/",
        component: Login
    }
];

const router = createRouter({
    // hash模式
    history: createWebHashHistory(),
    // routes: routes
    routes,
});

export default router




