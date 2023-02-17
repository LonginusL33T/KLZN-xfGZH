import Vue from 'vue'
import router from './router'
import store from './store'
// vant
import Vant from 'vant'
import 'vant/lib/index.css'
import 'amfe-flexible/index.js'
// v-charts
import VCharts from 'v-charts'
import App from './App.vue'
import '@/assets/css/custom.scss'

Vue.config.productionTip = false
Vue.use(Vant)
Vue.use(VCharts)

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')