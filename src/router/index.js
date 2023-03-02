import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

import Index from '../views/index.vue'
import Role from "@/views/system/Role.vue";
import Menu from "@/views/system/Menu.vue"
import User from "@/views/system/User.vue";

import axios from "../axios";
import store from "../store";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        children: [
            {
                path: '/index',
                name: 'Index',
                component: Index,
                meta: {
                    title: '首页',
                },
            },
            {
                path: '/userCenter',
                name: 'UserCenter',
                meta: {
                    title: '个人中心',
                },
                component: () => import('@/views/UserCenter.vue')
            },
        ],
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/Login.vue')
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to, from, next) => {

    let hasRoute = store.state.menu.hasRoutes

    let token = localStorage.getItem("token")

    if (to.path == '/login') {
        next()
    } else if (!token) {
        next({path: '/login'})
    } else if (!hasRoute) {
        axios.get("/system/menu/nav", {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(res => {

            // menuList
            store.commit("setMenuList", res.data.data.nav)
            // User Jurisdiction
            store.commit("setPermList", res.data.data.authoritys)


            let newRoutes = router.options.routes

            res.data.data.nav.forEach(menu => {
                if (menu.children) {
                    menu.children.forEach(e => {

                        let route = menuToRoute(e)

                        if (route) {
                            newRoutes[0].children.push(route)
                        }

                    })
                }
            })

            router.addRoutes(newRoutes)

            hasRoute = true
            store.commit("changeRouteStatus", hasRoute)
        })
    }

    next()
})


// navigation transition router
const menuToRoute = (menu) => {

    if (!menu.component) {
        return null
    }

    let route = {
        name: menu.name,
        path: menu.path,
        meta: {
            icon: menu.icon,
            title: menu.title
        }
    }

    route.component = () => import('@/views/' + menu.component + '.vue')
    return route
}

export default router
