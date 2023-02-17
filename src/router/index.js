import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import None from '../views/404.vue'
import Login from '../views/Login.vue'

const routes = [{
    name: '404',
    path: '*',
    component: None
}, {
    path: '/',
    name: 'Login',
    component: Login
}]

export const createRouter = () => new VueRouter({
    routes
})

const router = createRouter()

export default router