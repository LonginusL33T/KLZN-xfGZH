<template>
    <div id="app">
        <router-view />
    </div>
</template>
<script>
import Global from '@/assets/js/global'
import { generateRoutes } from '@/router/menu'
import { saveCode, userInfo } from '@/axios/request'
export default {
    mounted() {
        let openId = Global.getQueryString('code'),
            user = Global.storage.get('userInfo');
        // 判断是否用户公众号授权后回调，是则保存回调code
        if (openId && user && !user.WXCode) {
            let params = {
                userId: user.id,
                openid: openId
            }
            Global.publicAxiosRequest(params, saveCode, (data, msg) => {
                // 重新保存用户信息
                user.WXCode = openId;
                Global.storage.set('userInfo', user);
                this.$router.push('/main');
            })
        } else {
            // 判断是否已经登录，已登录则跳过登录页面(免登录)
            if (user) {
                let params = {
                    AppCode: 'xiaofang'
                }
                Global.publicAxiosRequest(params, userInfo, (data, msg) => {
                    generateRoutes(this.$router);
                    Global.storage.set('userInfo', data);
                    this.$router.push('/main');
                })
            } else {
                Global.storage.clean();
                if (process.env.VUE_APP_API_URL == '/keli') {
                    location.href = `${location.origin}/#/`;
                } else {
                    location.href = `${Global.baseURL}/app/#/`;
                }
            }
        }
    }
}
</script>
<style lang="scss" scoped>
#app {
    height: 100%;
    color: #1b1b1b;
    font-size: 13px;
    font-family: 'STXihei', 华文细黑;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
</style>